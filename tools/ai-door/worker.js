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

/* WHO IS ALLOWED THROUGH THIS DOOR. Jerry, 24 Nov 2026, through the code-review chat:
 * "fix the AI door so strangers can't use it."
 *
 * THE HOLE. Until today the only gate was the Origin header above — and a header is
 * whatever the sender says it is. Any script, any curl, one line long, could set
 * Origin: https://jerrywins1.github.io and spend Jerry's Anthropic key all day. The
 * $20/month spend limit he put on the key was the only thing in the way, and a spend
 * limit is a bill, not a lock.
 *
 * THE FIX IS CLOUDFLARE TURNSTILE. An invisible widget on the page proves the request
 * came from a real browser on Jerry's own site, and the door checks that proof with
 * Cloudflare before it spends anything. A token is single use and expires in five
 * minutes, so a captured one is worth almost nothing.
 *
 * THE SITE KEY IS PUBLIC AND LIVES IN control/ai.json. THE SECRET IS NOT, and goes
 * where the Anthropic key goes — Cloudflare's own secret store, as TURNSTILE_SECRET,
 * put there by Jerry. Never in the repo, never in a chat. CLAUDE.md, Secrets.
 *
 * IT ENFORCES ONLY ONCE THE SECRET EXISTS, and that is the whole point of the rollout
 * order. The apps start SENDING tokens first; the door starts REQUIRING them the
 * moment Jerry sets TURNSTILE_SECRET. In between, every app keeps working. Without
 * that, whichever half shipped first would have broken the door for everyone.
 */
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_HOST = 'jerrywins1.github.io';   /* siteverify says where the token was made; it must be here */
const MAX_TOKEN_CHARS = 2048;

/* AND A CEILING OVER EVERYBODY, not just per household. The per-household cap below
 * stops one family running away with it; it does nothing about a hundred addresses.
 * 1,000 asks a day across everyone is far more than the house uses — a handful of
 * households at 200 each — and it is the number that keeps a bad day from becoming a
 * bill. Change it here. */
const DAILY_TOTAL = 1000;

/* A BRAKE ON BURSTS, and the honest note about what it does not do.
 *
 * The per-household cap reads the count and then writes it back, so fifty asks that
 * arrive at the same moment all read the same number and all go through — the review
 * reproduced it: fifty concurrent asks ended with a stored count of 1. The cap of 200
 * was never reached by a batch.
 *
 * DOOR_RATE is Cloudflare's own rate-limiting binding and it narrows that window a
 * lot: twenty asks per address per minute, counted by Cloudflare rather than by us.
 * It is OPTIONAL, like DOOR_COUNT, so the door still works before the binding exists.
 *
 * WHAT IT DOES NOT DO, said plainly so nobody reads this as solved: Cloudflare's own
 * documentation says these limits are enforced per location and are approximate, and
 * that a burst can let more than the configured number through. So the read-then-write
 * window is NARROWED, not closed. Closing it properly needs an atomic counter — a
 * Durable Object — which needs a binding and a migration on Jerry's deploy, so it is
 * written down as the next piece of work rather than half-done here. */
const RATE_PER_MINUTE = 20;

/* SEARCHING THE WEB. An app can ask the door to look something up rather than answer
 * from what the model already knows, by sending  web: true  alongside the prompt.
 * Family Money's "What is this?" is the first to want it.
 *
 * JERRY DECIDED ON 25 NOV THAT THIS STAYS OFF, AND IT IS NOT A PENDING DECISION.
 * He was offered three ceilings and a fourth answer, and chose the fourth: searching
 * never runs on his key. Anyone who wants a looked-up answer uses their own AI, which
 * every app already offers — and ChatGPT, Claude and the rest search the web themselves,
 * on that person's account. So this costs him nothing and loses almost nothing.
 *
 * DO NOT FLIP THE SWITCH BECAUSE THIS COMMENT ONCE SAID "until Jerry says a price".
 * It did, and the price was found and put to him: $10 USD per 1,000 searches on the
 * Claude API, a penny a search, plus the tokens the results spend as input. He first
 * said the limit should be the person's own choice rather than a system number, and
 * when it was pointed out that the person choosing is not the person paying, he chose
 * to keep it off his key entirely. Turning it on is a money decision and his alone. Searching is the one thing in this door that
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

    /* The brake first, because it is the cheapest thing here. */
    const who = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (env.DOOR_RATE) {
      try {
        const rl = await env.DOOR_RATE.limit({ key: who });
        if (rl && rl.success === false) return say({ error: 'too many at once — give it a moment' }, 429, origin);
      } catch { /* a binding that is not there yet must never take the door down */ }
    }

    /* Then the proof that this came from a Daraja app at all. Before the daily counters,
       so a forged ask cannot burn a real family's slots, and well before anything is spent. */
    if (env.TURNSTILE_SECRET) {
      const token = String(body.token || '');
      if (!token || token.length > MAX_TOKEN_CHARS) {
        return say({ error: 'this did not come from a Daraja app' }, 403, origin);
      }
      let tv;
      try {
        const form = new FormData();
        form.append('secret', env.TURNSTILE_SECRET);
        form.append('response', token);
        form.append('remoteip', who);
        /* a fresh key each time, so a retry of the SAME request is not read as a reused token */
        form.append('idempotency_key', crypto.randomUUID());
        const vr = await fetch(TURNSTILE_VERIFY, { method: 'POST', body: form });
        tv = await vr.json();
      } catch {
        /* Cloudflare unreachable. Fail CLOSED: an open door is the thing being fixed. */
        return say({ error: 'could not check that this came from a Daraja app — try again' }, 503, origin);
      }
      /* success alone is not enough: the token has to have been made on Jerry's own site. */
      if (!tv || tv.success !== true || tv.hostname !== TURNSTILE_HOST) {
        return say({ error: 'this did not come from a Daraja app' }, 403, origin);
      }
    }

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
    const day = new Date().toISOString().slice(0, 10);
    const key = `d:${day}:${who}`;
    const allKey = `t:${day}`;
    if (env.DOOR_COUNT) {
      const used = parseInt(await env.DOOR_COUNT.get(key) || '0', 10);
      if (used >= DAILY_PER_HOUSEHOLD) {
        return say({ error: 'that is all the asks for today — it starts again tomorrow' }, 429, origin);
      }
      /* and the ceiling over everybody. Its own wording, because it is not this family's
         fault and "you have used yours up" would be a lie. */
      const all = parseInt(await env.DOOR_COUNT.get(allKey) || '0', 10);
      if (all >= DAILY_TOTAL) {
        return say({ error: 'the assistant is resting for today — it starts again tomorrow' }, 429, origin);
      }
      /* Count before asking, so a burst cannot slip through while we wait. */
      await env.DOOR_COUNT.put(key, String(used + 1), { expirationTtl: 172800 });
      await env.DOOR_COUNT.put(allKey, String(all + 1), { expirationTtl: 172800 });
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
