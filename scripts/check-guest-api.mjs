import assert from "node:assert/strict";
const base = process.env.POOLSIDE_TEST_URL || "http://127.0.0.1:8787";
async function request(path, { method = "GET", body, cookie, origin = base } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json", Origin: origin, ...(cookie ? { Cookie: cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { error: text }; }
  return { status: response.status, cookie: response.headers.get("set-cookie"), data };
}
const start = () => request("/api/attempts", { method: "POST", body: { mode: "quick" } });
if (process.env.POOLSIDE_EXPECT_GUEST_TESTS === "false") {
  assert.equal((await start()).status, 401);
  assert.equal((await request("/api/attempts", { method: "POST", body: { mode: "quick" }, cookie: "poolside_guest=" + "a".repeat(64) })).status, 401);
  console.log("Disabled guest access: new and existing guest cookies require sign-in.");
} else {
  const created = await start();
  assert.equal(created.status, 201);
  assert.match(created.cookie, /HttpOnly/);
  assert.match(created.cookie, /SameSite=Lax/);
  assert.match(created.cookie, /Max-Age=86400/);
  const cookie = created.cookie.split(";")[0];
  const path = "/api/attempts/" + created.data.id;
  const live = await request(path, { cookie });
  assert.equal(live.status, 200);
  assert.equal(live.data.guest, true);
  assert.equal(live.data.total, 10);
  assert.ok(!("userId" in live.data));
  assert.ok(live.data.questions.every((q) => !("correct" in q) && !("explanation" in q)));
  assert.equal((await request(path)).status, 401);
  const another = await start();
  assert.equal((await request(path, { cookie: another.cookie.split(";")[0] })).status, 404);
  assert.equal((await request(path, { method: "PATCH", cookie, origin: "https://untrusted.example", body: { answers: {} } })).status, 403);
  assert.equal((await request("/api/attempts", { method: "POST", origin: "https://untrusted.example", body: { mode: "quick" } })).status, 403);
  assert.equal((await request("/api/progress", { method: "POST", cookie, body: { lessonId: "adult-cpr", completed: true } })).status, 401);
  assert.equal((await request("/api/account", { method: "DELETE", cookie })).status, 401);
  assert.equal((await request("/api/account", { cookie })).data.user, null);
  const q = live.data.questions[0];
  assert.equal((await request(path, { method: "PATCH", cookie, body: { answers: { [q.id]: 9 } } })).status, 400);
  const answers = { [q.id]: 1 };
  assert.equal((await request(path, { method: "PATCH", cookie, body: { answers } })).status, 200);
  assert.equal((await request(path, { cookie })).data.answers[q.id], 1);
  const result = await request(path, { method: "PATCH", cookie, body: { answers, submit: true, score: 10 } });
  assert.equal(result.status, 200);
  assert.ok(result.data.submittedAt);
  assert.ok(result.data.score <= 1);
  assert.ok(result.data.questions.every((q) => Number.isInteger(q.correct) && q.explanation));
  assert.deepEqual((await request(path, { method: "PATCH", cookie, body: { answers: {}, submit: true } })).data.answers, answers);
  assert.ok((await request(path, { cookie })).data.submittedAt);
  console.log("Guest tests passed: start, resume, save, submit, reveal, cookie isolation, origin protection, account protection and immutable results.");
}
