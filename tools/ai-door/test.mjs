/* The Daraja AI door's tests. Run them with:  node tools/ai-door/test.mjs
 *
 * This file lives in the repo because the last set did not. They were written in a
 * scratchpad on 15 Nov, the scratchpad was cleared, and when the door started answering
 * "the assistant sent nothing back" on 18 Nov there was nothing to run.
 *
 * There is no network here and no key: the Anthropic API and Cloudflare's KV are both
 * faked, so these cost nothing and prove only the door's own logic. Whether the door
 * really answers is Jerry on a real device — a cloud chat is refused workers.dev.
 *
 * The fake upstream is a FACTORY, not a stored Response. A Response body can be read
 * once; reusing one across tests failed three of them on 15 Nov for no reason at all.
 */

import worker from './worker.js';

const ORIGIN = 'https://jerrywins1.github.io';
let pass = 0, fail = 0, lastBody = null;
const ck = (n, ok, d) => { if (ok) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n + ': ' + d); } };

/* a fake Anthropic that replies with whatever the test sets; a FACTORY, never a reused Response */
function stubAnthropic(make) {
  globalThis.fetch = async (url, init) => {
    lastBody = JSON.parse(init.body);
    const { status, json } = make();
    return new Response(JSON.stringify(json), { status, headers: { 'Content-Type': 'application/json' } });
  };
}
const kv = () => { const m = new Map();
  return { get: async k => m.get(k) ?? null, put: async (k, v) => { m.set(k, v); } }; };
const env = (over = {}) => ({ ANTHROPIC_API_KEY: 'sk-ant-test', DOOR_COUNT: kv(), ...over });
const req = (body, o = ORIGIN, method = 'POST') => new Request('https://door.test/', {
  method, headers: o ? { Origin: o, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
  body: method === 'POST' ? JSON.stringify(body) : undefined });
const call = async (body, e = env(), o = ORIGIN, m = 'POST') => {
  const r = await worker.fetch(req(body, o, m), e);
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, j, cors: r.headers.get('Access-Control-Allow-Origin') };
};
const PDF = Buffer.from('%PDF-1.4\n' + 'A'.repeat(1000)).toString('base64');
/* a photographed receipt: the bytes are never looked at, only the media_type */
const JPG = Buffer.from('\xff\xd8\xff\xe0' + 'A'.repeat(1000), 'binary').toString('base64');

console.log('\n=== the bug that was reported ===');
stubAnthropic(() => ({ status: 200, json: { stop_reason: 'max_tokens', content: [] } }));
{
  const r = await call({ prompt: 'Read this statement', file: { media_type: 'application/pdf', data: PDF } });
  ck('a cut-off reply no longer says "sent nothing back"', r.j.error !== 'the assistant sent nothing back', JSON.stringify(r.j));
  ck('it says what actually happened', /too much to read in one go/.test(r.j.error || ''), JSON.stringify(r.j));
}

console.log('\n=== what the door now asks for ===');
stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Three rows.' }] } }));
{
  const r = await call({ prompt: 'Read this statement', file: { media_type: 'application/pdf', data: PDF } });
  ck('a PDF still gets an answer', r.status === 200 && r.j.text === 'Three rows.', JSON.stringify(r.j));
  ck('thinking is sent as disabled', lastBody.thinking && lastBody.thinking.type === 'disabled', JSON.stringify(lastBody.thinking));
  ck('max_tokens is 8000', lastBody.max_tokens === 8000, String(lastBody.max_tokens));
  ck('effort stays low', lastBody.output_config.effort === 'low', JSON.stringify(lastBody.output_config));
  ck('the model is Haiku 5.5', lastBody.model === 'claude-haiku-5-5', lastBody.model);
  ck('the PDF goes first, then the text', Array.isArray(lastBody.messages[0].content)
      && lastBody.messages[0].content[0].type === 'document'
      && lastBody.messages[0].content[1].type === 'text', JSON.stringify(lastBody.messages[0].content.map(c=>c.type)));
  ck('no budget_tokens (removed on Haiku 5.5)', !('budget_tokens' in (lastBody.thinking||{})), JSON.stringify(lastBody.thinking));
}

console.log('\n=== a photographed receipt (21 Nov) ===');
stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Menards, $41.37.' }] } }));
for (const mt of ['image/jpeg', 'image/png', 'image/webp']) {
  const r = await call({ prompt: 'Read this receipt', file: { media_type: mt, data: JPG } });
  ck(mt + ' gets an answer', r.status === 200 && r.j.text === 'Menards, $41.37.', r.status + ' ' + JSON.stringify(r.j));
  const c = lastBody.messages[0].content;
  ck(mt + ' is sent as an image block', Array.isArray(c) && c[0].type === 'image', JSON.stringify((c || []).map ? c.map(x => x.type) : c));
  ck(mt + " keeps its own media_type", c[0].source.media_type === mt, JSON.stringify(c[0].source.media_type));
  ck(mt + ' goes base64, picture first then the question', c[0].source.type === 'base64' && c[1].type === 'text', JSON.stringify(c.map(x => x.type)));
}
{
  /* the size check sits BEFORE the daily count, so a photo that is too big must not burn a slot */
  const e = env();
  let r = await call({ prompt: 'hi', file: { media_type: 'image/jpeg', data: 'A'.repeat(8 * 1024 * 1024) } }, e);
  ck('a photo over 5 MB is refused', r.status === 413, String(r.status));
  ck('and it did not cost a slot', (await e.DOOR_COUNT.get('d:' + new Date().toISOString().slice(0, 10) + ':unknown')) === null, 'a slot was spent');

  r = await call({ prompt: 'Read this receipt', file: { media_type: 'image/jpeg', data: JPG } }, e);
  ck('a photo that is read does cost a slot', (await e.DOOR_COUNT.get('d:' + new Date().toISOString().slice(0, 10) + ':unknown')) === '1', 'no slot was spent');
}

console.log('\n=== everything that must not break ===');
{
  /* re-stub: the photo group above left its own answer in place */
  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Three rows.' }] } }));
  let r = await call({ prompt: 'hello' });
  ck('a plain ask still works', r.status === 200 && r.j.text === 'Three rows.', JSON.stringify(r.j));
  ck('the prompt goes as a bare string when there is no file', typeof lastBody.messages[0].content === 'string', typeof lastBody.messages[0].content);

  r = await call({ prompt: 'hi' }, env(), 'https://evil.example');
  ck('a strange site is refused', r.status === 403, r.status + ' ' + JSON.stringify(r.j));

  r = await call({ prompt: 'hi' }, env(), ORIGIN, 'GET');
  ck('GET is refused', r.status === 405, String(r.status));

  r = await call({ prompt: 'hi' }, env({ ANTHROPIC_API_KEY: '' }));
  ck('no key is a clean error', r.status === 503, r.status + ' ' + JSON.stringify(r.j));

  r = await call({ prompt: '' });
  ck('an empty question is refused', r.status === 400, String(r.status));

  r = await call({ prompt: 'x'.repeat(24001) });
  ck('an over-long question is refused', r.status === 413, String(r.status));

  r = await call({ prompt: 'hi', file: { media_type: 'text/csv', data: PDF } });
  ck('a file that is neither PDF nor photo is refused', r.status === 415, String(r.status));

  r = await call({ prompt: 'hi', file: { media_type: 'image/heic', data: JPG } });
  ck('an iPhone HEIC is refused with its own wording', r.status === 415 && /JPEG, PNG or WebP/.test(r.j.error || ''), JSON.stringify(r.j));

  r = await call({ prompt: 'hi', file: { media_type: 'application/pdf', data: '' } });
  ck('an empty file is refused', r.status === 400, String(r.status));

  r = await call({ prompt: 'hi', file: { media_type: 'application/pdf', data: 'A'.repeat(8 * 1024 * 1024) } });
  ck('a file over 5 MB is refused', r.status === 413, String(r.status));

  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'refusal', content: [] } }));
  r = await call({ prompt: 'hi' });
  ck('a refusal is its own answer', r.status === 422, r.status + ' ' + JSON.stringify(r.j));

  stubAnthropic(() => ({ status: 429, json: { error: { message: 'secret account detail' } } }));
  r = await call({ prompt: 'hi' });
  ck('a busy upstream is reported plainly', r.status === 502 && /busy/.test(r.j.error), JSON.stringify(r.j));
  ck('upstream wording never leaks', !/secret account detail/.test(JSON.stringify(r.j)), JSON.stringify(r.j));

  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: '```json\n{"a":1}\n```' }] } }));
  r = await call({ prompt: 'hi', want: 'json' });
  ck('a code fence is stripped for want:json', r.j.text === '{"a":1}', JSON.stringify(r.j));

  const e = env();
  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] } }));
  for (let i = 0; i < 200; i++) await call({ prompt: 'hi' }, e);
  r = await call({ prompt: 'hi' }, e);
  ck('the 201st ask in a day is capped', r.status === 429, r.status + ' ' + JSON.stringify(r.j));

  const noKv = env({ DOOR_COUNT: undefined });
  r = await call({ prompt: 'hi' }, noKv);
  ck('with no KV bound it still answers (cap simply off)', r.status === 200, String(r.status));

  r = await call(null, env(), ORIGIN, 'OPTIONS');
  ck('the browser preflight is allowed', r.status === 204, String(r.status));
  ck('CORS names the one allowed site', r.cors === ORIGIN, String(r.cors));
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
