import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import worker from './qa-worker.mjs';

function loadLocalEnvironment() {
  try {
    const contents = readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
    }
  } catch {
    // A deployment provides secrets through its environment instead.
  }
}

const bodyOf = (request) => new Promise((resolve, reject) => {
  const chunks = [];
  request.on('data', (chunk) => chunks.push(chunk));
  request.on('end', () => resolve(Buffer.concat(chunks)));
  request.on('error', reject);
});

loadLocalEnvironment();
// The Astro preview normally runs on this port. A deployment should provide its
// own explicit list through QA_ALLOWED_ORIGIN instead.
process.env.QA_ALLOWED_ORIGIN ||= 'http://127.0.0.1:4322';
const port = Number(process.env.QA_API_PORT || 8787);

createServer(async (incoming, outgoing) => {
  try {
    const body = ['GET', 'HEAD'].includes(incoming.method || '') ? undefined : await bodyOf(incoming);
    const request = new Request(`http://${incoming.headers.host || `127.0.0.1:${port}`}${incoming.url || '/'}`, {
      method: incoming.method,
      headers: incoming.headers,
      body,
    });
    const response = await worker.fetch(request, process.env);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
    outgoing.end(JSON.stringify({ ok: false, message: 'The local letter service could not start.' }));
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Q&A letter service ready at http://127.0.0.1:${port}`);
});
