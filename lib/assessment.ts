export type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  lessonId: string;
  sectionId: string;
};
export function grade(questions: Question[], answers: Record<string, number>) {
  const score = questions.filter((q) => answers[q.id] === q.correct).length;
  const sections = [...new Set(questions.map((q) => q.sectionId))].map(
    (id) => ({
      id,
      total: questions.filter((q) => q.sectionId === id).length,
      score: questions.filter(
        (q) => q.sectionId === id && answers[q.id] === q.correct,
      ).length,
    }),
  );
  return { score, total: questions.length, sections };
}
export function publicQuestions(questions: Question[]) {
  return questions.map(({ correct, explanation, ...q }) => q);
}
export function validateAnswers(
  input: unknown,
  questions: Question[],
): Record<string, number> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid answers");
  const answers: Record<string, number> = {};
  for (const [id, v] of Object.entries(input)) {
    const q = questions.find((q) => q.id === id);
    if (
      !q ||
      !Number.isInteger(v) ||
      Number(v) < 0 ||
      Number(v) >= q.options.length
    )
      throw new Error("Invalid answer");
    answers[id] = Number(v);
  }
  return answers;
}
export function shuffle<T>(a: T[]) {
  const result = [...a];
  for (let i = result.length - 1; i > 0; i--) {
    const n = new Uint32Array(1);
    crypto.getRandomValues(n);
    const j = n[0] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
