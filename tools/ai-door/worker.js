/* The Daraja AI door — a Cloudflare Worker Jerry owns.
 *
 * WHY IT EXISTS. Every Daraja app can ask an AI something, and until now that
 * meant the person copying the question into ChatGPT and pasting the answer
 * back. Jerry, 13 Nov 2026: "Can't you pass answers back from Claude to the app
 * so we don't have to cut and paste?" This is the door that does it.
 *
 * WHAT TALKS TO IT. viaDaraja() in the shared house block, in 54 apps. It POSTs
 *     { prompt, app, want:'text'|'json', code }
 * and expects back { text: "..." } or { error: "..." }. Anything else and the
 * app quietly falls back to the person's own AI, which is what happens today.
 * So a broken door is not a broken app — it is just the old copy and paste.
 *
 * THE KEY IS NEVER IN THIS FILE. It lives in Cloudflare's own secret store as
 * ANTHROPIC_API_KEY. Put it there with `wrangler secret put ANTHROPIC_API_KEY`
 * or in the dashboard. Never in the repo, never in a chat — CLAUDE.md, Secrets.
 *
 * THE CAP IS PER HOUSEHOLD, NOT PER PHONE. The ask was a daily limit per phone.
 * The payload above carries no device id — `code` is the tester code and is
 * empty for every buyer — so the only identifier the door actually has is the
 * network address, which is one household, not one phone. Adding a device id
 * means changing the house block in all 54 apps, which is a sweep from Jerry's
 * Mac. A household cap also matches how the cost was quoted to him: about two
 * cents per family per month. Said plainly so nobody later reads "per phone"
 * here and believes it.
 */

const MODEL = 'claude-haiku-5-5';        /* $0.10 in / $0.50 out per million. Jerry chose the cheapest. */
const DAILY_PER_HOUSEHOLD = 40;          /* asks per day per address */
const MAX_PROMPT_CHARS = 24000;
const MAX_FILE_BYTES = 5 * 1024 * 1024;  /* the PDF a Dashboard statement arrives as */
const MAX_TOKENS = 2000;
const ALLOWED = ['https://jerrywins1.github.io'];

const cors = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin',
});

const say = (obj, status, origin) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const ok = ALLOWED.includes(origin);

    /* The browser asks permission before it will POST across origins. */
    if (request.method === 'OPTIONS') {
      return ok ? new Response(null, { status: 204, headers: cors(origin) })
                : new Response(null, { status: 403 });
    }
    if (!ok) return say({ error: 'not an allowed site' }, 403, ALLOWED[0]);
    if (request.method !== 'POST') return say({ error: 'POST only' }, 405, origin);
    if (!env.ANTHROPIC_API_KEY) return say({ error: 'the door has no key yet' }, 503, origin);

    let body;
    try { body = await request.json(); }
    catch { return say({ error: 'that was not JSON' }, 400, origin); }

    const prompt = String(body.prompt || '').trim();
    if (!prompt) return say({ error: 'nothing to ask' }, 400, origin);
    if (prompt.length > MAX_PROMPT_CHARS) return say({ error: 'that question is too long' }, 413, origin);

    /* The optional PDF, for an app that wants to read a statement in one tap. */
    let doc = null;
    if (body.file) {
      const f = body.file;
      if (f.media_type !== 'application/pdf') return say({ error: 'only a PDF can be sent' }, 415, origin);
      const data = String(f.data || '');
      if (!data) return say({ error: 'the file was empty' }, 400, origin);
      /* base64 is about four characters for every three bytes */
      if (data.length * 3 / 4 > MAX_FILE_BYTES) return say({ error: 'that file is too big — 5 MB is the limit' }, 413, origin);
      doc = { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } };
    }

    /* The daily cap. Counted per address, reset at midnight UTC by the key's own name. */
    const who = request.headers.get('CF-Connecting-IP') || 'unknown';
    const key = `d:${new Date().toISOString().slice(0, 10)}:${who}`;
    if (env.DOOR_COUNT) {
      const used = parseInt(await env.DOOR_COUNT.get(key) || '0', 10);
      if (used >= DAILY_PER_HOUSEHOLD) {
        return say({ error: 'that is all the asks for today — it starts again tomorrow' }, 429, origin);
      }
      /* Count before asking, so a burst cannot slip through while we wait. */
      await env.DOOR_COUNT.put(key, String(used + 1), { expirationTtl: 172800 });
    }

    /* want:'json' means the app will JSON.parse what comes back, so say so plainly. */
    const system = body.want === 'json'
      ? 'Reply with one JSON value and nothing else. No explanation, no code fence.'
      : 'Answer plainly and briefly, for someone reading on a phone.';

    const content = doc ? [doc, { type: 'text', text: prompt }] : prompt;

    let r, j;
    try {
      r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
          output_config: { effort: 'low' },   /* these are short everyday asks, not hard problems */
          messages: [{ role: 'user', content }],
        }),
      });
      j = await r.json();
    } catch {
      return say({ error: 'could not reach the assistant' }, 502, origin);
    }

    if (!r.ok) {
      /* Never pass the upstream message through — it can carry account detail. */
      return say({ error: r.status === 429 ? 'the assistant is busy — try again shortly' : 'the assistant said no' }, 502, origin);
    }
    /* A safety classifier can decline. Haiku has no server-side fallback, so the
       app falls back to the person's own AI, which is the old behaviour anyway. */
    if (j.stop_reason === 'refusal') return say({ error: 'the assistant declined that one' }, 422, origin);

    let text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    if (body.want === 'json') text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    if (!text) return say({ error: 'the assistant sent nothing back' }, 502, origin);

    return say({ text }, 200, origin);
  },
};
