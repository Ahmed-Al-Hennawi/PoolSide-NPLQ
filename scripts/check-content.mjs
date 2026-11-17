import fs from "node:fs";
import assert from "node:assert/strict";
const sections = JSON.parse(fs.readFileSync("lib/content/learning.json"));
const questions = JSON.parse(fs.readFileSync("lib/content/questions.json"));
const lessons = sections.flatMap((s) => s.lessons);
assert.equal(sections.length, 3);
assert.equal(lessons.length, 42);
assert.equal(questions.length, 60);
assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
for (const q of questions) {
  assert.equal(q.options.length, 4);
  assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4);
  assert.ok(q.explanation.length > 30);
  assert.ok(lessons.some((l) => l.id === q.lessonId));
  assert.ok(sections.some((s) => s.id === q.sectionId));
}
assert.deepEqual(
  Object.fromEntries(
    sections.map((s) => [
      s.id,
      questions.filter((q) => q.sectionId === s.id).length,
    ]),
  ),
  { safety: 24, rescue: 12, "first-aid": 24 },
);
for (const l of lessons) {
  assert.ok(l.blocks.length > 1);
  assert.ok(l.minutes > 0);
  assert.ok(l.blocks.every((b) => b.heading && b.body));
}
console.log(
  "Content verified: 42 lessons, 60 valid questions, all lesson links resolve.",
);
