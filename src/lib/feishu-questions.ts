import {
  economicsQuestions,
  questionGroups,
  type EconomicsQuestion,
  type QuestionGroup,
} from '../data/economics-qa';

type FeishuRecord = {
  record_id: string;
  fields: Record<string, unknown>;
};

const textValue = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(', ');
  if (value && typeof value === 'object' && 'text' in value) return textValue((value as { text: unknown }).text);
  return '';
};

const groupIdFor = (name: string, groups: QuestionGroup[]) => {
  const existing = groups.find((group) => group.name === name);
  if (existing) return existing.id;
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || null;
};

async function tenantAccessToken(appId: string, appSecret: string) {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const payload = await response.json() as { code: number; tenant_access_token?: string };
  if (!response.ok || payload.code !== 0 || !payload.tenant_access_token) throw new Error('Feishu authentication failed');
  return payload.tenant_access_token;
}

export async function getPublicEconomicsQuestionData(): Promise<{
  questions: EconomicsQuestion[];
  groups: QuestionGroup[];
  source: 'feishu' | 'local';
}> {
  const appId = import.meta.env.FEISHU_APP_ID;
  const appSecret = import.meta.env.FEISHU_APP_SECRET;
  const appToken = import.meta.env.FEISHU_BITABLE_APP_TOKEN;
  const tableId = import.meta.env.FEISHU_BITABLE_TABLE_ID;

  // Static builds may run without local Feishu credentials. The curated local
  // questions keep the page usable, while production builds sync when .env is set.
  if (!appId || !appSecret || !appToken || !tableId) {
    return { questions: economicsQuestions, groups: questionGroups, source: 'local' };
  }

  try {
    const token = await tenantAccessToken(appId, appSecret);
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=500`,
      { headers: { authorization: `Bearer ${token}` } },
    );
    const payload = await response.json() as { code: number; data?: { items?: FeishuRecord[] } };
    if (!response.ok || payload.code !== 0) throw new Error('Feishu records request failed');

    const groups = [...questionGroups];
    const questions = (payload.data?.items ?? [])
      .filter((record) => textValue(record.fields.visibility).toLowerCase() === 'public')
      .filter((record) => textValue(record.fields.status).toLowerCase() !== 'hidden')
      .map((record) => {
        const groupName = textValue(record.fields.group);
        const groupId = groupName ? groupIdFor(groupName, groups) : null;
        if (groupName && groupId && !groups.some((group) => group.id === groupId)) {
          groups.push({ id: groupId, name: groupName });
        }
        return {
          id: textValue(record.fields.question_id) || record.record_id,
          asker: textValue(record.fields.name) || 'Anonymous',
          text: textValue(record.fields.question),
          groupId,
          sortOrder: Number(textValue(record.fields.sort_order)) || Number.MAX_SAFE_INTEGER,
        };
      })
      .filter((question) => question.text)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ sortOrder: _sortOrder, ...question }) => question);

    return { questions, groups, source: 'feishu' };
  } catch {
    return { questions: economicsQuestions, groups: questionGroups, source: 'local' };
  }
}
