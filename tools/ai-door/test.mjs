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
let pass = 0, fail = 0, lastBody = null, bodies = [];
const ck = (n, ok, d) => { if (ok) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n + ': ' + d); } };

/* a fake Anthropic that replies with whatever the test sets; a FACTORY, never a reused Response */
let verifyCalls = [], verifyReply = { success: true, hostname: 'jerrywins1.github.io' };
function stubAnthropic(make) {
  globalThis.fetch = async (url, init) => {
    /* Cloudflare's siteverify, when the door is checking the proof. It is sent as form
       data, not JSON, so it is read back as form data — reading it as JSON here would
       have hidden a wrong field name, which is the only thing this check is for. */
    if (String(url).includes('/turnstile/v0/siteverify')) {
      const f = init.body;
      verifyCalls.push({
        secret: f.get('secret'), response: f.get('response'),
        remoteip: f.get('remoteip'), idempotency_key: f.get('idempotency_key'),
      });
      return new Response(JSON.stringify(verifyReply), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    lastBody = JSON.parse(init.body);
    bodies.push(lastBody);
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

/* ------------------------------------------------------------------ *
 * SEARCHING THE WEB
 *
 * The switch ships off, so the off-path is the one the door is really running
 * today and it gets tested as it stands. The on-path is tested against a copy
 * of worker.js with that one word flipped — which is also the guard that the
 * word has not been renamed, since the patch asserts it found exactly one.
 * ------------------------------------------------------------------ */

console.log('\n=== searching, while the switch is off ===');
stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'From memory.' }] } }));
{
  const e = env();
  const r = await call({ prompt: 'What is a Roth IRA?', web: true }, e);
  ck('web:true still gets an answer', r.status === 200 && r.j.text === 'From memory.', JSON.stringify(r.j));
  ck('no search tool is sent', !('tools' in lastBody), JSON.stringify(lastBody.tools));
  ck('the answer says it did not search', r.j.web === false, JSON.stringify(r.j.web));
  ck('and no search slot was spent', (await e.DOOR_COUNT.get('w:' + new Date().toISOString().slice(0, 10) + ':unknown')) === null, 'a search slot was spent');

  await call({ prompt: 'hello' });
  ck('a plain ask sends no tools either', !('tools' in lastBody), JSON.stringify(lastBody.tools));
}

/* worker.js with WEB_SEARCH_ON flipped, loaded as its own module */
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const SRC = new URL('./worker.js', import.meta.url);
const src = readFileSync(SRC, 'utf8');
const OFF = 'const WEB_SEARCH_ON = false;';
ck('the switch is still spelled the way the tests patch it', src.split(OFF).length - 1 === 1,
   'WEB_SEARCH_ON = false appears ' + (src.split(OFF).length - 1) + ' times in worker.js');
ck('the switch ships OFF', src.includes(OFF), 'worker.js does not ship with searching off');
const onPath = join(tmpdir(), 'daraja-door-web-on-' + process.pid + '.mjs');
writeFileSync(onPath, src.replace(OFF, 'const WEB_SEARCH_ON = true;'));
const on = (await import(pathToFileURL(onPath).href)).default;
const callOn = async (body, e = env(), o = ORIGIN, m = 'POST') => {
  const r = await on.fetch(req(body, o, m), e);
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, j, cors: r.headers.get('Access-Control-Allow-Origin') };
};

console.log('\n=== searching, switched on ===');
stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'It is a retirement account.' }] } }));
{
  const r = await callOn({ prompt: 'What is a Roth IRA?', web: true });
  ck('the ask is answered', r.status === 200 && /retirement/.test(r.j.text), JSON.stringify(r.j));
  ck('the answer says it searched', r.j.web === true, JSON.stringify(r.j.web));
  ck('one search tool is sent', Array.isArray(lastBody.tools) && lastBody.tools.length === 1, JSON.stringify(lastBody.tools));
  ck('it is web_search_20260318', lastBody.tools[0].type === 'web_search_20260318', lastBody.tools[0].type);
  ck('it is named web_search', lastBody.tools[0].name === 'web_search', lastBody.tools[0].name);
  ck('max_uses caps it at 2 searches an ask', lastBody.tools[0].max_uses === 2, String(lastBody.tools[0].max_uses));
  ck('it searches directly, not through code execution',
     JSON.stringify(lastBody.tools[0].allowed_callers) === '["direct"]', JSON.stringify(lastBody.tools[0].allowed_callers));
  ck('thinking is still disabled when searching', lastBody.thinking.type === 'disabled', JSON.stringify(lastBody.thinking));

  const r2 = await callOn({ prompt: 'What is a Roth IRA?' });
  ck('an ask that did not ask to search sends no tools', !('tools' in lastBody), JSON.stringify(lastBody.tools));
  ck('and its answer says so', r2.j.web === false, JSON.stringify(r2.j.web));
}

console.log('\n=== where the answer came from ===');
{
  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [
    { type: 'web_search_tool_result', tool_use_id: 'srvtoolu_1', content: [{ type: 'web_search_result', url: 'https://irs.gov/roth', title: 'IRS' }] },
    { type: 'text', text: 'It is a retirement account.', citations: [
      { type: 'web_search_result_location', url: 'https://irs.gov/roth', title: 'Roth IRAs | IRS' },
      { type: 'web_search_result_location', url: 'https://irs.gov/roth', title: 'Roth IRAs | IRS' },
      { type: 'web_search_result_location', url: 'https://ssa.gov/x', title: 'SSA' },
    ] },
  ] } }));
  const r = await callOn({ prompt: 'What is a Roth IRA?', web: true });
  ck('the sources come back with the answer', Array.isArray(r.j.sources) && r.j.sources.length === 2, JSON.stringify(r.j.sources));
  ck('the same page is not listed twice', r.j.sources.filter(x => x.url === 'https://irs.gov/roth').length === 1, JSON.stringify(r.j.sources));
  ck('each source has a title and a link', r.j.sources.every(x => x.url && x.title), JSON.stringify(r.j.sources));

  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [
    { type: 'text', text: 'Lots of places.', citations: Array.from({ length: 9 }, (_, i) => ({ url: 'https://e' + i + '.test/p', title: 'E' + i })) },
  ] } }));
  const many = await callOn({ prompt: 'x', web: true });
  ck('no more than five sources reach a phone', many.j.sources.length === 5, String(many.j.sources.length));

  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'From memory.' }] } }));
  const none = await callOn({ prompt: 'x', web: true });
  ck('an answer with no citations carries no sources key', !('sources' in none.j), JSON.stringify(none.j));
}

console.log('\n=== a search that pauses part way ===');
{
  let n = 0;
  stubAnthropic(() => {
    n++;
    return n === 1
      ? { status: 200, json: { stop_reason: 'pause_turn', content: [
          { type: 'server_tool_use', id: 'srvtoolu_9', name: 'web_search', input: { query: 'roth ira' } }] } }
      : { status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Finished it.' }] } };
  });
  bodies = [];
  const r = await callOn({ prompt: 'What is a Roth IRA?', web: true });
  ck('a paused turn is picked back up', r.status === 200 && r.j.text === 'Finished it.', r.status + ' ' + JSON.stringify(r.j));
  ck('it took two requests, not one', bodies.length === 2, String(bodies.length));
  ck("the second sends back the model's own half of the turn",
     bodies[1].messages.length === 2 && bodies[1].messages[1].role === 'assistant', JSON.stringify((bodies[1].messages || []).map(m => m.role)));
  ck('the question is still there underneath it', bodies[1].messages[0].role === 'user', JSON.stringify(bodies[1].messages[0].role));

  /* paused forever: the door must not hand over half a thought */
  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'pause_turn', content: [{ type: 'text', text: 'half a' }] } }));
  bodies = [];
  const stuck = await callOn({ prompt: 'x', web: true });
  ck('a search that never finishes is its own error', stuck.status === 502 && /took too long to look up/.test(stuck.j.error || ''), stuck.status + ' ' + JSON.stringify(stuck.j));
  ck('it gave up after four tries, not forever', bodies.length === 4, String(bodies.length));
}

console.log('\n=== what searching is allowed to cost ===');
{
  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] } }));
  const e = env();
  const today = new Date().toISOString().slice(0, 10);
  for (let i = 0; i < 20; i++) await callOn({ prompt: 'x', web: true }, e);
  ck('twenty searching asks a day are counted', (await e.DOOR_COUNT.get('w:' + today + ':unknown')) === '20',
     String(await e.DOOR_COUNT.get('w:' + today + ':unknown')));

  const r = await callOn({ prompt: 'x', web: true }, e);
  ck('the twenty-first is still answered', r.status === 200 && r.j.text === 'ok', r.status + ' ' + JSON.stringify(r.j));
  ck('but it does not search', r.j.web === false && !('tools' in lastBody), JSON.stringify({ web: r.j.web, tools: lastBody.tools }));

  const e2 = env();
  await callOn({ prompt: 'x' }, e2);
  ck('an ask that never wanted to search spends no search slot', (await e2.DOOR_COUNT.get('w:' + today + ':unknown')) === null, 'a slot was spent');
  ck('it still spends an ordinary slot', (await e2.DOOR_COUNT.get('d:' + today + ':unknown')) === '1', 'no ordinary slot was spent');

  const noKv = env({ DOOR_COUNT: undefined });
  const nk = await callOn({ prompt: 'x', web: true }, noKv);
  ck('with no counter bound it searches (cap simply off, as for asks)', nk.j.web === true, JSON.stringify(nk.j.web));
}

/* ------------------------------------------------------------------ *
 * STRANGERS
 *
 * Jerry, 24 Nov, through the code-review chat: "fix the AI door so strangers can't
 * use it." The Origin header was the only gate and a header is whatever the sender
 * says it is. These checks are about the two halves of that: that the door REQUIRES
 * proof once it has a secret to check it with, and that it requires NOTHING before
 * then — because the apps start sending tokens before Jerry sets the secret, and if
 * the door enforced early every app would have broken in between.
 * ------------------------------------------------------------------ */

console.log('\n=== before the secret is set, nothing changes ===');
stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] } }));
{
  verifyCalls = [];
  let r = await call({ prompt: 'hi' });
  ck('an ask with no token still works', r.status === 200 && r.j.text === 'ok', r.status + ' ' + JSON.stringify(r.j));
  ck('and nothing is checked with Cloudflare', verifyCalls.length === 0, JSON.stringify(verifyCalls));

  r = await call({ prompt: 'hi', token: 'whatever' });
  ck('an ask that sends one anyway still works', r.status === 200, String(r.status));
  ck('and that one is not checked either', verifyCalls.length === 0, JSON.stringify(verifyCalls));
}

console.log('\n=== once the secret is set, the door demands proof ===');
{
  const E = (over = {}) => env({ TURNSTILE_SECRET: 'ts-secret-test', ...over });
  verifyCalls = []; verifyReply = { success: true, hostname: 'jerrywins1.github.io' };

  let r = await call({ prompt: 'hi', token: 'tok-abc' }, E());
  ck('a good token gets an answer', r.status === 200 && r.j.text === 'ok', r.status + ' ' + JSON.stringify(r.j));
  ck('exactly one check with Cloudflare', verifyCalls.length === 1, String(verifyCalls.length));
  ck('the SECRET goes as `secret`', verifyCalls[0].secret === 'ts-secret-test', String(verifyCalls[0].secret));
  ck('the TOKEN goes as `response`, not `token`', verifyCalls[0].response === 'tok-abc', String(verifyCalls[0].response));
  ck('the address goes as `remoteip`', verifyCalls[0].remoteip === 'unknown', String(verifyCalls[0].remoteip));
  ck('each check carries its own idempotency_key',
     typeof verifyCalls[0].idempotency_key === 'string' && verifyCalls[0].idempotency_key.length >= 32,
     String(verifyCalls[0].idempotency_key));

  verifyCalls = [];
  r = await call({ prompt: 'hi' }, E());
  ck('NO token is refused', r.status === 403 && /did not come from a Daraja app/.test(r.j.error || ''), r.status + ' ' + JSON.stringify(r.j));
  ck('and a missing token is refused without troubling Cloudflare', verifyCalls.length === 0, String(verifyCalls.length));

  r = await call({ prompt: 'hi', token: 'x'.repeat(2049) }, E());
  ck('an absurdly long token is refused', r.status === 403, String(r.status));

  verifyReply = { success: false, 'error-codes': ['invalid-input-response'] };
  r = await call({ prompt: 'hi', token: 'forged' }, E());
  ck('a token Cloudflare rejects is refused', r.status === 403, r.status + ' ' + JSON.stringify(r.j));

  /* THE ONE THAT MATTERS MOST. A real token, made on somebody else's site with their own
     widget, verifies perfectly — success is true. The only thing that catches it is the
     hostname, which is why the door checks it and why this check exists. */
  verifyReply = { success: true, hostname: 'evil.example' };
  r = await call({ prompt: 'hi', token: 'real-but-elsewhere' }, E());
  ck('a REAL token from somebody else’s site is refused on the hostname',
     r.status === 403, r.status + ' ' + JSON.stringify(r.j));

  verifyReply = { success: true };
  r = await call({ prompt: 'hi', token: 'no-hostname' }, E());
  ck('a reply with no hostname at all is refused', r.status === 403, String(r.status));

  verifyReply = { success: true, hostname: 'jerrywins1.github.io' };
  const e = E();
  const today = new Date().toISOString().slice(0, 10);
  verifyCalls = [];
  r = await call({ prompt: 'hi', token: 'forged' }, e);
  ck('a refused ask costs the family nothing',
     (await e.DOOR_COUNT.get('d:' + today + ':unknown')) === '1', 'the good ask above should be the only one counted');
}

console.log('\n=== if Cloudflare cannot be reached, the door closes ===');
{
  /* An open door is the thing being fixed, so this fails CLOSED. The app falls back to
     the person's own AI, which is where it was before the door existed. */
  globalThis.fetch = async (url) => {
    if (String(url).includes('/turnstile/v0/siteverify')) throw new Error('network');
    return new Response(JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  const r = await call({ prompt: 'hi', token: 'tok' }, env({ TURNSTILE_SECRET: 'ts' }));
  ck('an unreachable Cloudflare does NOT wave the ask through', r.status !== 200, r.status + ' ' + JSON.stringify(r.j));
  ck('it says so plainly', r.status === 503 && /could not check/.test(r.j.error || ''), r.status + ' ' + JSON.stringify(r.j));
}

console.log('\n=== the ceiling over everybody ===');
{
  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] } }));
  const today = new Date().toISOString().slice(0, 10);
  /* one shared counter, many addresses: the per-household cap of 200 cannot catch this */
  const e = env();
  const from = (ip, body = { prompt: 'hi' }) => worker.fetch(new Request('https://door.test/', {
    method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: JSON.stringify(body) }), e);

  for (let h = 0; h < 10; h++) for (let i = 0; i < 100; i++) await from('10.0.0.' + h);
  ck('a thousand asks across ten addresses are all counted together',
     (await e.DOOR_COUNT.get('t:' + today)) === '1000', String(await e.DOOR_COUNT.get('t:' + today)));
  ck('each address is still well under its own cap of 200',
     (await e.DOOR_COUNT.get('d:' + today + ':10.0.0.0')) === '100', String(await e.DOOR_COUNT.get('d:' + today + ':10.0.0.0')));

  const r = await from('10.0.0.99');
  const j = await r.json();
  ck('the next ask, from a fresh address, is stopped by the ceiling', r.status === 429, r.status + ' ' + JSON.stringify(j));
  ck('and it does not blame that family', !/all the asks for today/.test(j.error || ''), JSON.stringify(j));
  ck('it says the assistant is resting', /resting for today/.test(j.error || ''), JSON.stringify(j));
}

console.log('\n=== the brake on bursts ===');
{
  stubAnthropic(() => ({ status: 200, json: { stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] } }));
  let asked = null;
  let r = await call({ prompt: 'hi' }, env({ DOOR_RATE: { limit: async (o) => { asked = o; return { success: true }; } } }));
  ck('with the brake bound, an ask still works', r.status === 200, String(r.status));
  ck('it is keyed on the address, not on everyone together', asked && asked.key === 'unknown', JSON.stringify(asked));

  r = await call({ prompt: 'hi' }, env({ DOOR_RATE: { limit: async () => ({ success: false }) } }));
  ck('a burst is stopped', r.status === 429 && /give it a moment/.test(r.j.error || ''), r.status + ' ' + JSON.stringify(r.j));

  const e = env({ DOOR_RATE: { limit: async () => ({ success: false }) } });
  await call({ prompt: 'hi' }, e);
  ck('a braked ask costs no slot',
     (await e.DOOR_COUNT.get('d:' + new Date().toISOString().slice(0, 10) + ':unknown')) === null, 'a slot was spent');

  r = await call({ prompt: 'hi' }, env({ DOOR_RATE: { limit: async () => { throw new Error('binding not there yet'); } } }));
  ck('a brake that throws must never take the door down', r.status === 200, r.status + ' ' + JSON.stringify(r.j));

  r = await call({ prompt: 'hi' }, env());
  ck('with no brake bound the door still answers', r.status === 200, String(r.status));
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
