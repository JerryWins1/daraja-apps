/* The Daraja AI door — a Cloudflare Worker Jerry owns.
 *
 * WHY IT EXISTS. Every Daraja app can ask an AI something, and until now that
 * meant the person copying the question into ChatGPT and pasting the answer
 * back. Jerry, 13 Nov 2026: "Can't you pass answers back from Claude to the app
 * so we don't have to cut and paste?" This is the door that does it.
 *
 * WHAT TALKS TO IT. viaDaraja() in the shared house block, in every app. It POSTs
 *     { prompt, app, want:'text'|'json', code, file? }
 * where file, when the app sends one, is { media_type, data } — a base64 PDF or photo.
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
const DAILY_PER_HOUSEHOLD = 200;         /* asks per day per address. 18 Nov: 40 stopped the Dashboard halfway
                                            through a statement folder, and Jerry chose 200. At Haiku prices a
                                            statement is about a third of a cent, so a full 200 is roughly 60c. */
const MAX_PROMPT_CHARS = 24000;
const MAX_FILE_BYTES = 5 * 1024 * 1024;  /* the PDF a Dashboard statement arrives as, or a photographed receipt */
const MAX_TOKENS = 8000;            /* was 2000, which a month of statement lines ran past. See the thinking note below. */
const ALLOWED = ['https://jerrywins1.github.io'];

/* SEARCHING THE WEB. An app can ask the door to look something up rather than answer
 * from what the model already knows, by sending  web: true  alongside the prompt.
 * Family Money's "What is this?" is the first to want it.
 *
 * THIS IS OFF UNTIL JERRY SAYS A PRICE. Searching is the one thing in this door that
 * costs money per use rather than per token: $10 USD per 1,000 searches on the Claude
 * API, so a penny a search, on top of the tokens the results spend as input. Under
 * CLAUDE.md money waits for Jerry however long he is away, so the switch below ships
 * off, and  web: true  is simply ignored while it is — the app still gets an answer,
 * from the model's own knowledge, exactly as it does today. Nothing breaks when it is
 * turned on and nothing breaks while it is off.
 *
 * WHAT TURNS IT ON. One word: WEB_SEARCH_ON = true. The two numbers under it are what
 * the money actually depends on, so change them together with him, not alone.
 */
const WEB_SEARCH_ON = false;             /* the switch. Off until Jerry has chosen the cap. */
const WEB_MAX_USES = 2;                  /* searches allowed inside ONE ask. 2c worst case per ask. */
const DAILY_SEARCHES_PER_HOUSEHOLD = 20; /* searching asks per day per address. 20 x 2 = 40 searches = 40c a day
                                            worst case for one household, and that is the number to quote: the
                                            counter counts ASKS THAT MAY SEARCH, not searches performed, because
                                            the door cannot know in advance how many the model will run. Most
                                            asks run one or none. */
const WEB_MAX_ROUNDS = 3;                /* how many times the door will resume a paused search before giving up */

/* Direct, not dynamic filtering. Newer tool versions default to running the search from
   inside code execution so the model can filter results before they reach it, which saves
   input tokens — but it needs programmatic tool calling and the door runs with thinking
   disabled, so it is the wrong thing to lean on here. allowed_callers: ['direct'] keeps the
   search a plain server tool. The tokens it costs instead are Haiku tokens: five pages of
   results is about a tenth of a cent, against a penny for the search itself. */
const WEB_TOOL = {
  type: 'web_search_20260318',
  name: 'web_search',
  max_uses: WEB_MAX_USES,
  allowed_callers: ['direct'],
};

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

    /* The optional file: a PDF to read a statement in one tap, or a photo to read a receipt.
       21 Nov 2026: Jerry photographed a Menards receipt in Business Manager and Tesseract, the
       reader that runs on the phone, garbled the thermal print. Reading the picture is what the
       AI is actually good at, so the door takes one. The three image types below are the ones
       the Messages API accepts as base64 alongside PDF. HEIC is NOT one of them — an iPhone
       photo handed straight from a file picker can arrive as image/heic, so the sending app
       draws it to a canvas and exports a JPEG first; the error below says so plainly rather
       than leaving someone staring at "only a PDF can be sent" over a photograph. */
    const FILE_TYPES = {
      'application/pdf': 'document',
      'image/jpeg': 'image',
      'image/png': 'image',
      'image/webp': 'image',
    };
    let doc = null;
    if (body.file) {
      const f = body.file;
      const mt = String(f.media_type || '');
      const kind = FILE_TYPES[mt];
      if (!kind) {
        return say({ error: /^image\//.test(mt)
          ? 'that kind of photo cannot be read — send a JPEG, PNG or WebP'
          : 'only a PDF or a photo can be sent' }, 415, origin);
      }
      const data = String(f.data || '');
      if (!data) return say({ error: 'the file was empty' }, 400, origin);
      /* base64 is about four characters for every three bytes */
      if (data.length * 3 / 4 > MAX_FILE_BYTES) return say({ error: 'that file is too big — 5 MB is the limit' }, 413, origin);
      doc = { type: kind, source: { type: 'base64', media_type: mt, data } };
    }

    /* The daily cap. Counted per address, reset at midnight UTC by the key's own name. */
    const who = request.headers.get('CF-Connecting-IP') || 'unknown';
    const day = new Date().toISOString().slice(0, 10);
    const key = `d:${day}:${who}`;
    if (env.DOOR_COUNT) {
      const used = parseInt(await env.DOOR_COUNT.get(key) || '0', 10);
      if (used >= DAILY_PER_HOUSEHOLD) {
        return say({ error: 'that is all the asks for today — it starts again tomorrow' }, 429, origin);
      }
      /* Count before asking, so a burst cannot slip through while we wait. */
      await env.DOOR_COUNT.put(key, String(used + 1), { expirationTtl: 172800 });
    }

    /* Should this one search? An ask that cannot search is not refused — it is answered
       the old way, because an error here would send the app back to the person's own AI,
       and an answer without a lookup is better than no answer at all. */
    let web = false;
    if (body.web === true && WEB_SEARCH_ON) {
      if (!env.DOOR_COUNT) {
        web = true;                      /* no counter bound: the cap is simply off, as the daily cap is */
      } else {
        const wkey = `w:${day}:${who}`;
        const usedWeb = parseInt(await env.DOOR_COUNT.get(wkey) || '0', 10);
        if (usedWeb < DAILY_SEARCHES_PER_HOUSEHOLD) {
          web = true;
          await env.DOOR_COUNT.put(wkey, String(usedWeb + 1), { expirationTtl: 172800 });
        }
      }
    }

    /* want:'json' means the app will JSON.parse what comes back, so say so plainly. */
    const system = body.want === 'json'
      ? 'Reply with one JSON value and nothing else. No explanation, no code fence.'
      : 'Answer plainly and briefly, for someone reading on a phone.';

    const content = doc ? [doc, { type: 'text', text: prompt }] : prompt;

    let r, j;
    const msgs = [{ role: 'user', content }];
    let rounds = 0;
    try {
      while (true) {
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
          /* 18 Nov 2026: thinking OFF, and this is the line that fixed the PDFs.
             Haiku 5.5 runs ADAPTIVE THINKING BY DEFAULT when no thinking field is sent, and the
             thinking is drawn from max_tokens. On a dense scanned bank statement it used the whole
             2000-token budget before writing a word, so the reply came back with
             stop_reason 'max_tokens' and NO text block at all, and the door answered
             "the assistant sent nothing back". The Family Money Dashboard hit it on a Community
             Trust statement. Disabled is accepted on Haiku 5.5 at effort high or below, and the
             door sits at low. These asks are transcription and plain answers, not reasoning, so
             there is nothing for thinking to buy here — it only ate the budget.
             If a future model refuses type 'disabled', raise the effort question before deleting
             this: silently dropping it brings the empty answers straight back. */
          thinking: { type: 'disabled' },
          ...(web ? { tools: [WEB_TOOL] } : {}),
          messages: msgs,
        }),
      });
      j = await r.json();
      /* A turn that searches can come back paused part way through: the search has run,
         the model has not finished. Send its own half of the turn straight back and it
         carries on. Without this the door would hand the app a half answer. */
      if (r.ok && j && j.stop_reason === 'pause_turn' && ++rounds <= WEB_MAX_ROUNDS) {
        msgs.push({ role: 'assistant', content: j.content });
        continue;
      }
      break;
      }
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

    /* Out of rounds and still mid-search. Say so rather than hand over half a thought. */
    if (j.stop_reason === 'pause_turn') {
      return say({ error: 'that one took too long to look up — try asking again' }, 502, origin);
    }

    /* Its own answer, so the next person does not have to guess the way we did. If this ever
       fires, the reply really was cut off mid-thought: raise MAX_TOKENS or send less at a time. */
    if (j.stop_reason === 'max_tokens') {
      return say({ error: 'that was too much to read in one go — try a smaller piece' }, 502, origin);
    }

    let text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    if (body.want === 'json') text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    if (!text) return say({ error: 'the assistant sent nothing back' }, 502, origin);

    /* WHERE IT CAME FROM, AND WHY THIS IS NOT OPTIONAL. Anthropic's own terms for the search
       tool: when the answer is shown to a person as it came back, the sources have to be shown
       with it. So the door hands them up, and an app that turns searching on shows them. Five
       is plenty on a phone. */
    const out = { text, web };
    const seen = [];
    for (const b of (j.content || [])) {
      for (const c of (b.citations || [])) {
        if (c && c.url && !seen.some(x => x.url === c.url)) seen.push({ url: c.url, title: c.title || c.url });
      }
    }
    if (seen.length) out.sources = seen.slice(0, 5);

    return say(out, 200, origin);
  },
};
