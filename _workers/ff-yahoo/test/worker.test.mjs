/* Tests for the ff-yahoo Worker.
   Run with:  node --test test/

   Yahoo itself is stubbed here. That is partly discipline and partly necessity: the
   machine this was written on cannot reach Yahoo at all. So these prove the parts
   that are ours — routing, CORS, the state check, the host pinning on the relay,
   and how token replies are shaped — and say nothing about whether Yahoo's live
   responses look the way we expect. That bit needs a real round trip. */

import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker.js";

const ENV = {
  YAHOO_CLIENT_ID: "test-client-id",
  YAHOO_CLIENT_SECRET: "test-client-secret",
  REDIRECT_URI: "https://ff-yahoo.example.workers.dev/callback",
  APP_RETURN_URL: "https://jerrywins1.github.io/daraja-apps/ff/",
  APP_ORIGIN: "https://jerrywins1.github.io"
};
const GOOD = "https://jerrywins1.github.io";

/* Swap in a fake Yahoo for one call, and record what we sent it. */
function stubFetch(handler) {
  const calls = [];
  const real = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init: init || {} });
    return handler(String(url), init || {});
  };
  return { calls, restore: () => { globalThis.fetch = real; } };
}

const req = (path, init) => new Request("https://ff-yahoo.example.workers.dev" + path, init);
const hit = (path, init) => worker.fetch(req(path, init), ENV);

/* ---------------------------- CORS ---------------------------- */

test("preflight from the app's origin is allowed", async () => {
  const res = await hit("/api/users;use_login=1", { method: "OPTIONS", headers: { Origin: GOOD } });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), GOOD);
  assert.match(res.headers.get("access-control-allow-headers"), /Authorization/);
});

test("an unknown origin is never echoed back", async () => {
  const res = await hit("/health", { headers: { Origin: "https://evil.example" } });
  assert.equal(res.headers.get("access-control-allow-origin"), null);
});

test("the allow-origin header is never a wildcard", async () => {
  const res = await hit("/health", { headers: { Origin: GOOD } });
  assert.notEqual(res.headers.get("access-control-allow-origin"), "*");
  assert.equal(res.headers.get("vary"), "Origin");
});

/* ---------------------------- /login ---------------------------- */

test("login refuses a missing or junk state", async () => {
  assert.equal((await hit("/login")).status, 400);
  assert.equal((await hit("/login?state=short")).status, 400);
  assert.equal((await hit("/login?state=" + "a".repeat(200))).status, 400);
  assert.equal((await hit("/login?state=has%20a%20space")).status, 400);
});

test("login sends the user to Yahoo with the right query", async () => {
  const res = await hit("/login?state=abcd1234efgh");
  assert.equal(res.status, 302);
  const to = new URL(res.headers.get("location"));
  assert.equal(to.origin + to.pathname, "https://api.login.yahoo.com/oauth2/request_auth");
  assert.equal(to.searchParams.get("client_id"), ENV.YAHOO_CLIENT_ID);
  assert.equal(to.searchParams.get("redirect_uri"), ENV.REDIRECT_URI);
  assert.equal(to.searchParams.get("response_type"), "code");
  assert.equal(to.searchParams.get("state"), "abcd1234efgh");
});

test("login takes no redirect parameter, so it cannot be an open redirect", async () => {
  const res = await hit("/login?state=abcd1234efgh&redirect_uri=https://evil.example");
  const to = new URL(res.headers.get("location"));
  assert.equal(to.searchParams.get("redirect_uri"), ENV.REDIRECT_URI);
});

/* ---------------------------- /callback ---------------------------- */

test("a user who declines lands back at the app with the reason", async () => {
  const res = await hit("/callback?error=access_denied");
  assert.equal(res.status, 302);
  const to = new URL(res.headers.get("location"));
  assert.equal(to.origin + to.pathname, ENV.APP_RETURN_URL.replace(/\/$/, "/"));
  assert.match(to.hash, /yh_error=access_denied/);
});

test("a callback with no code comes back as no_code", async () => {
  const to = new URL((await hit("/callback")).headers.get("location"));
  assert.match(to.hash, /yh_error=no_code/);
});

test("a good code becomes tokens in the URL fragment, never the query", async () => {
  const stub = stubFetch(async () => new Response(JSON.stringify({
    access_token: "AT-123", refresh_token: "RT-456", expires_in: 3600
  }), { status: 200 }));
  try {
    const res = await hit("/callback?code=CODE-1&state=abcd1234efgh");
    assert.equal(res.status, 302);
    const to = new URL(res.headers.get("location"));

    // Tokens must be in the fragment. Browsers don't send fragments to servers,
    // so they stay out of every access log between here and the page.
    assert.equal(to.search, "");
    const frag = new URLSearchParams(to.hash.replace(/^#/, ""));
    assert.equal(frag.get("yh_at"), "AT-123");
    assert.equal(frag.get("yh_rt"), "RT-456");
    assert.equal(frag.get("state"), "abcd1234efgh");
    assert.ok(Number(frag.get("yh_exp")) > Math.floor(Date.now() / 1000));

    // And the exchange should have used Basic auth, with the secret in the header
    // rather than the body.
    const call = stub.calls[0];
    assert.equal(call.url, "https://api.login.yahoo.com/oauth2/get_token");
    assert.equal(call.init.headers.Authorization,
      "Basic " + Buffer.from("test-client-id:test-client-secret").toString("base64"));
    assert.match(call.init.body, /grant_type=authorization_code/);
    assert.match(call.init.body, /code=CODE-1/);
    assert.doesNotMatch(call.init.body, /client_secret/);
  } finally { stub.restore(); }
});

test("a rejected exchange sends the reason back, not a stack trace", async () => {
  const stub = stubFetch(async () => new Response(JSON.stringify({ error: "invalid_grant" }), { status: 400 }));
  try {
    const to = new URL((await hit("/callback?code=BAD&state=abcd1234efgh")).headers.get("location"));
    assert.match(to.hash, /yh_error=invalid_grant/);
  } finally { stub.restore(); }
});

test("a 200 with no access_token is still treated as a failure", async () => {
  const stub = stubFetch(async () => new Response(JSON.stringify({ hello: "world" }), { status: 200 }));
  try {
    const to = new URL((await hit("/callback?code=X&state=abcd1234efgh")).headers.get("location"));
    assert.match(to.hash, /yh_error=no_access_token/);
  } finally { stub.restore(); }
});

/* ---------------------------- /refresh ---------------------------- */

test("refresh is POST only and needs a token", async () => {
  assert.equal((await hit("/refresh", { headers: { Origin: GOOD } })).status, 405);
  const res = await hit("/refresh", {
    method: "POST", headers: { Origin: GOOD, "Content-Type": "application/json" }, body: "{}"
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "missing_refresh_token");
});

test("refresh returns a fresh pair and an absolute expiry", async () => {
  const stub = stubFetch(async () => new Response(JSON.stringify({
    access_token: "AT-new", refresh_token: "RT-new", expires_in: 3600
  }), { status: 200 }));
  try {
    const res = await hit("/refresh", {
      method: "POST", headers: { Origin: GOOD, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: "RT-old" })
    });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.access_token, "AT-new");
    assert.equal(body.refresh_token, "RT-new");
    assert.ok(body.expires_at > Math.floor(Date.now() / 1000));
  } finally { stub.restore(); }
});

test("when Yahoo doesn't rotate the refresh token, the old one is kept", async () => {
  const stub = stubFetch(async () => new Response(JSON.stringify({
    access_token: "AT-new", expires_in: 3600
  }), { status: 200 }));
  try {
    const res = await hit("/refresh", {
      method: "POST", headers: { Origin: GOOD, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: "RT-old" })
    });
    assert.equal((await res.json()).refresh_token, "RT-old");
  } finally { stub.restore(); }
});

/* ---------------------------- /api relay ---------------------------- */

test("the relay needs a bearer token", async () => {
  const res = await hit("/api/users;use_login=1/games", { headers: { Origin: GOOD } });
  assert.equal(res.status, 401);
  assert.equal((await res.json()).error, "missing_bearer");
});

test("the relay forwards to Yahoo and forces JSON", async () => {
  const stub = stubFetch(async () => new Response('{"fantasy_content":{}}', { status: 200 }));
  try {
    const res = await hit("/api/league/nfl.l.12345/standings?week=7", {
      headers: { Origin: GOOD, Authorization: "Bearer AT-123" }
    });
    assert.equal(res.status, 200);
    const to = new URL(stub.calls[0].url);
    assert.equal(to.origin, "https://fantasysports.yahooapis.com");
    assert.equal(to.pathname, "/fantasy/v2/league/nfl.l.12345/standings");
    assert.equal(to.searchParams.get("format"), "json");
    assert.equal(to.searchParams.get("week"), "7");
    assert.equal(stub.calls[0].init.headers.Authorization, "Bearer AT-123");
    assert.equal(res.headers.get("cache-control"), "private, max-age=30");
  } finally { stub.restore(); }
});

test("private league data is never put in a shared cache", async () => {
  const stub = stubFetch(async () => new Response("{}", { status: 200 }));
  try {
    const res = await hit("/api/league/nfl.l.1/standings", {
      headers: { Origin: GOOD, Authorization: "Bearer AT" }
    });
    // "private" keeps it in the one browser that asked. Anything shared could hand
    // one manager's roster to another.
    assert.match(res.headers.get("cache-control"), /^private/);
  } finally { stub.restore(); }
});

test("the relay cannot be pointed at another host", async () => {
  const stub = stubFetch(async () => new Response("{}", { status: 200 }));
  try {
    for (const bad of [
      "/api/../../evil",
      "/api/%2e%2e%2f%2e%2e%2fevil",
      "/api/https://evil.example/steal"
    ]) {
      const res = await hit(bad, { headers: { Origin: GOOD, Authorization: "Bearer AT" } });
      if (res.status === 200) {
        // If it was allowed through at all, it must still have gone to Yahoo.
        assert.equal(new URL(stub.calls[stub.calls.length - 1].url).origin,
          "https://fantasysports.yahooapis.com", bad + " escaped the pinned host");
      }
    }
    for (const call of stub.calls) {
      assert.equal(new URL(call.url).origin, "https://fantasysports.yahooapis.com");
    }
  } finally { stub.restore(); }
});

test("an empty relay path is refused", async () => {
  const res = await hit("/api/", { headers: { Origin: GOOD, Authorization: "Bearer AT" } });
  assert.equal(res.status, 400);
});

test("the relay is read-only", async () => {
  const res = await hit("/api/league/nfl.l.1", {
    method: "POST", headers: { Origin: GOOD, Authorization: "Bearer AT" }
  });
  assert.equal(res.status, 405);
});

test("an expired token is named so the page knows to refresh and retry", async () => {
  const stub = stubFetch(async () => new Response("expired", { status: 401 }));
  try {
    const res = await hit("/api/league/nfl.l.1/standings", {
      headers: { Origin: GOOD, Authorization: "Bearer OLD" }
    });
    assert.equal(res.status, 401);
    assert.equal((await res.json()).error, "token_expired");
  } finally { stub.restore(); }
});

test("other Yahoo errors keep their status and leak nothing", async () => {
  const stub = stubFetch(async () => new Response("<html>secret innards</html>", { status: 503 }));
  try {
    const res = await hit("/api/league/nfl.l.1/standings", {
      headers: { Origin: GOOD, Authorization: "Bearer AT" }
    });
    assert.equal(res.status, 503);
    const body = await res.text();
    assert.equal(JSON.parse(body).error, "yahoo_http_503");
    assert.doesNotMatch(body, /secret innards/);
  } finally { stub.restore(); }
});

/* ---------------------------- misc ---------------------------- */

test("health answers, unknown paths 404", async () => {
  const ok = await hit("/health", { headers: { Origin: GOOD } });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).ok, true);
  assert.equal((await hit("/nope", { headers: { Origin: GOOD } })).status, 404);
});

test("a thrown error becomes a plain 500 with no internals", async () => {
  const stub = stubFetch(async () => { throw new Error("boom: test-client-secret"); });
  try {
    const res = await hit("/refresh", {
      method: "POST", headers: { Origin: GOOD, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: "RT" })
    });
    assert.equal(res.status, 500);
    const text = await res.text();
    assert.equal(JSON.parse(text).error, "worker_error");
    assert.doesNotMatch(text, /test-client-secret/);
  } finally { stub.restore(); }
});
