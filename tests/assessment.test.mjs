import { test } from "node:test";
import assert from "node:assert/strict";
import { grade, validateAnswers, publicQuestions } from "../lib/assessment.ts";
const q = [
  {
    id: "a",
    question: "A",
    options: ["a", "b", "c", "d"],
    correct: 1,
    explanation: "because",
    lessonId: "lesson",
    sectionId: "safety",
  },
  {
    id: "b",
    question: "B",
    options: ["a", "b", "c", "d"],
    correct: 2,
    explanation: "because",
    lessonId: "lesson",
    sectionId: "first-aid",
  },
];
test("unanswered and incorrect questions score zero; sections stay separate", () => {
  assert.deepEqual(grade(q, { a: 1 }), {
    score: 1,
    total: 2,
    sections: [
      { id: "safety", total: 1, score: 1 },
      { id: "first-aid", total: 1, score: 0 },
    ],
  });
  assert.equal(grade(q, { a: 0, b: 2 }).score, 1);
});
test("client questions contain no answer key or explanation", () => {
  const p = publicQuestions(q);
  assert.equal("correct" in p[0], false);
  assert.equal("explanation" in p[0], false);
  assert.equal(p[0].options.length, 4);
});
test("rejects foreign question IDs, non-integers and out-of-range indices", () => {
  for (const bad of [
    null,
    [],
    { x: 0 },
    { a: 4 },
    { a: -1 },
    { a: 1.5 },
    { a: "1" },
  ])
    assert.throws(() => validateAnswers(bad, q));
  assert.deepEqual(validateAnswers({ a: 1 }, q), { a: 1 });
});
