import assert from "node:assert/strict";
const expectGuests = process.env.POOLSIDE_EXPECT_GUEST_TESTS !== "false";
const base = "http://127.0.0.1:8787";
const user = "qa-" + crypto.randomUUID();
const headers = {
  "oai-authenticated-user-id": user,
  "oai-authenticated-user-email": "qa@example.test",
  "Content-Type": "application/json",
  Origin: base,
};
async function request(
  path,
  { method = "GET", body, identity = true, extra = {} } = {},
) {
  const r = await fetch(base + path, {
    method,
    headers: {
      ...(identity
        ? headers
        : { "Content-Type": "application/json", Origin: base }),
      ...extra,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const d = await r.json();
  return { status: r.status, data: d };
}
try {
  assert.equal(
    (await request("/api/account", { identity: false })).data.user,
    null,
  );
  assert.equal(
    (
      await request("/api/attempts", {
        method: "POST",
        body: { mode: "quick" },
        identity: false,
      })
    ).status,
    expectGuests ? 201 : 401,
  );
  assert.equal(
    (
      await request("/api/attempts", {
        method: "POST",
        body: { mode: "quick" },
        extra: { Origin: "https://untrusted.example" },
      })
    ).status,
    403,
  );
  assert.equal(
    (await request("/api/attempts", { method: "POST", body: null })).status,
    400,
  );
  const created = await request("/api/attempts", {
    method: "POST",
    body: { mode: "full" },
  });
  assert.equal(created.status, 201);
  const path = "/api/attempts/" + created.data.id;
  const live = await request(path);
  assert.equal(live.data.total, 48);
  assert.equal(live.data.deadline - live.data.startedAt, 72 * 60000);
  assert.ok(
    live.data.questions.every(
      (q) => !("correct" in q) && !("explanation" in q),
    ),
  );
  assert.equal(
    (
      await request(path, {
        extra: { "oai-authenticated-user-id": "another-user" },
      })
    ).status,
    404,
  );
  const q = live.data.questions[0];
  assert.equal(
    (await request(path, { method: "PATCH", body: { answers: { [q.id]: 5 } } }))
      .status,
    400,
  );
  assert.equal(
    (await request(path, { method: "PATCH", body: { answers: { [q.id]: 1 } } }))
      .status,
    200,
  );
  assert.equal((await request(path)).data.answers[q.id], 1);
  const result = await request(path, {
    method: "PATCH",
    body: { answers: { [q.id]: 1 }, submit: true, score: 48 },
  });
  assert.ok(result.data.submittedAt);
  assert.ok(result.data.score <= 1);
  assert.equal(result.data.result.sections.length, 2);
  assert.ok(result.data.questions.every((q) => Number.isInteger(q.correct)));
  const repeated = await request(path, {
    method: "PATCH",
    body: { answers: {}, submit: true },
  });
  assert.equal(repeated.data.score, result.data.score);
  assert.equal(repeated.data.answers[q.id], 1);
  assert.equal(
    (
      await request("/api/progress", {
        method: "POST",
        body: { lessonId: "adult-cpr", completed: true },
      })
    ).status,
    200,
  );
  assert.ok(
    (await request("/api/account")).data.completed.includes("adult-cpr"),
  );
  assert.equal(
    (
      await request("/api/progress", {
        method: "POST",
        body: { lessonId: "does-not-exist", completed: true },
      })
    ).status,
    400,
  );
  console.log(
    "API checks passed: authentication, origin protection, ownership, validation, hidden keys, persistence, grading, immutable submissions, progress.",
  );
} finally {
  const deleted = await request("/api/account", { method: "DELETE" });
  assert.equal(deleted.status, 200);
  const clean = await request("/api/account");
  assert.equal(clean.data.attempts.length, 0);
  assert.equal(clean.data.completed.length, 0);
  console.log("Disposable QA account data deletion verified.");
}
