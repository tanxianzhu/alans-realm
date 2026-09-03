const FEISHU_API = 'https://open.feishu.cn/open-apis';
const encoder = new TextEncoder();

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
});

const corsHeaders = (request, env) => {
  const origin = request.headers.get('origin');
  const allowed = String(env.QA_ALLOWED_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (!origin || !allowed.includes(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'Origin',
  };
};

const valueOf = (value) => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(valueOf).filter(Boolean).join(', ');
  if (value && typeof value === 'object' && 'text' in value) return valueOf(value.text);
  return '';
};

const cleanText = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
const normalizeName = (name) => cleanText(name, 80).toLocaleLowerCase();
const base64Url = (bytes) => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
const bytesFromBase64Url = (value) => {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
};

async function derivePasscode(passcode, salt, iterations) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(passcode), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, 256);
  return new Uint8Array(bits);
}

async function hashPasscode(passcode) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 210000;
  const digest = await derivePasscode(passcode, salt, iterations);
  return `pbkdf2$${iterations}$${base64Url(salt)}$${base64Url(digest)}`;
}

async function verifiesPasscode(passcode, stored) {
  const [scheme, iterationsText, saltText, digestText] = String(stored).split('$');
  const iterations = Number(iterationsText);
  if (scheme !== 'pbkdf2' || !Number.isInteger(iterations) || iterations < 100000 || !saltText || !digestText) return false;
  const expected = bytesFromBase64Url(digestText);
  const actual = await derivePasscode(passcode, bytesFromBase64Url(saltText), iterations);
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
  return difference === 0;
}

async function tenantToken(env) {
  const response = await fetch(`${FEISHU_API}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: env.FEISHU_APP_ID, app_secret: env.FEISHU_APP_SECRET }),
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0 || !payload.tenant_access_token) throw new Error('Authentication failed');
  return payload.tenant_access_token;
}

function tableUrl(env) {
  if (!env.FEISHU_APP_ID || !env.FEISHU_APP_SECRET || !env.FEISHU_BITABLE_APP_TOKEN || !env.FEISHU_BITABLE_TABLE_ID) {
    throw new Error('The letter service is not configured');
  }
  return `${FEISHU_API}/bitable/v1/apps/${env.FEISHU_BITABLE_APP_TOKEN}/tables/${env.FEISHU_BITABLE_TABLE_ID}/records`;
}

async function listRecords(env, token) {
  const response = await fetch(`${tableUrl(env)}?page_size=500`, { headers: { authorization: `Bearer ${token}` } });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) throw new Error('Could not read letters');
  return payload.data?.items || [];
}

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72) || 'letter';
const safeId = () => `q-${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;

async function createQuestion(request, env) {
  const input = await request.json().catch(() => null);
  const name = cleanText(input?.name, 80);
  const question = cleanText(input?.question, 1600);
  const group = cleanText(input?.group, 80);
  const visibility = input?.visibility === 'private' ? 'private' : input?.visibility === 'public' ? 'public' : '';
  const passcode = typeof input?.passcode === 'string' ? input.passcode : '';
  const note = cleanText(input?.note, 500);

  if (!name || question.length < 3 || !visibility || (visibility === 'private' && passcode.length < 6)) {
    return json({ ok: false, message: 'Please complete the letter, and use a six-character passcode for private letters.' }, 400);
  }

  const token = await tenantToken(env);
  const existing = await listRecords(env, token);
  const sortOrder = existing.reduce((highest, record) => Math.max(highest, Number(valueOf(record.fields?.sort_order)) || 0), 0) + 1;
  const questionId = safeId();
  const createdAt = new Date().toISOString();
  const fields = {
    question_id: questionId,
    slug: `${slugify(question)}-${questionId.slice(-4)}`,
    name,
    question,
    group,
    visibility,
    passcode_hash: visibility === 'private' ? await hashPasscode(passcode) : '',
    note,
    answer: '',
    status: 'pending',
    created_at: createdAt,
    answered_at: '',
    sort_order: sortOrder,
  };
  const response = await fetch(tableUrl(env), {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ fields }),
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) throw new Error('Could not save the letter');
  return json({ ok: true, question_id: questionId, visibility, status: 'pending', created_at: createdAt }, 201);
}

async function readPrivateLetters(request, env) {
  const input = await request.json().catch(() => null);
  const name = cleanText(input?.name, 80);
  const passcode = typeof input?.passcode === 'string' ? input.passcode : '';
  if (!name || !passcode) return json({ ok: false, message: 'Enter your name and passcode.' }, 400);

  const token = await tenantToken(env);
  const records = await listRecords(env, token);
  const matches = [];
  for (const record of records) {
    const fields = record.fields || {};
    if (valueOf(fields.visibility).toLowerCase() !== 'private') continue;
    if (normalizeName(valueOf(fields.name)) !== normalizeName(name)) continue;
    if (!await verifiesPasscode(passcode, valueOf(fields.passcode_hash))) continue;
    matches.push({
      question_id: valueOf(fields.question_id) || record.record_id,
      name: valueOf(fields.name),
      question: valueOf(fields.question),
      group: valueOf(fields.group),
      note: valueOf(fields.note),
      answer: valueOf(fields.answer),
      status: valueOf(fields.status),
      created_at: valueOf(fields.created_at),
      answered_at: valueOf(fields.answered_at),
    });
  }
  return json({ ok: true, letters: matches });
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method === 'GET' && new URL(request.url).pathname === '/health') return json({ ok: true }, 200, headers);
    if (request.method !== 'POST') return json({ ok: false, message: 'Not found.' }, 404, headers);
    try {
      const path = new URL(request.url).pathname;
      const response = path === '/api/questions'
        ? await createQuestion(request, env)
        : path === '/api/private-letters'
          ? await readPrivateLetters(request, env)
          : json({ ok: false, message: 'Not found.' }, 404);
      Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      return response;
    } catch {
      return json({ ok: false, message: 'The letter service is unavailable. Please try again shortly.' }, 503, headers);
    }
  },
};
