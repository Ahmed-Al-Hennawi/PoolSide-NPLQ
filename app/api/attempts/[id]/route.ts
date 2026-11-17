import { getDb } from "../../../../db";
import { attempts } from "../../../../db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { json, failure, readBody } from "../../../../lib/api";
import { attemptAccess, GUEST_PREFIX, GUEST_LIFETIME_MS } from "../../../../lib/attempt-access";
import {
  grade,
  publicQuestions,
  validateAnswers,
  type Question,
} from "../../../../lib/assessment";
async function owned(request: Request, id: string, write = false) {
  const user = await attemptAccess(request, write);
  const db = getDb();
  const [a] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, id), inArray(attempts.userId, user.ownerIds)));
  if (!a || (a.userId.startsWith(GUEST_PREFIX) && Date.now() - a.startedAt >= GUEST_LIFETIME_MS))
    throw new Error("Not found");
  return { a, db };
}
function view(a: typeof attempts.$inferSelect) {
  const questions = JSON.parse(a.questions) as Question[];
  const answers = JSON.parse(a.answers);
  return {
    ...a,
    userId: undefined,
    guest: a.userId.startsWith(GUEST_PREFIX),
    questions: a.submittedAt ? questions : publicQuestions(questions),
    answers,
    result: a.submittedAt ? grade(questions, answers) : null,
  };
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { a, db } = await owned(request, id);
    if (!a.submittedAt && Date.now() >= a.deadline) {
      const result = grade(JSON.parse(a.questions), JSON.parse(a.answers));
      await db
        .update(attempts)
        .set({ submittedAt: a.deadline, score: result.score })
        .where(and(eq(attempts.id, id), isNull(attempts.submittedAt)));
      const [latest] = await db
        .select()
        .from(attempts)
        .where(eq(attempts.id, id));
      return json(view(latest));
    }
    return json(view(a));
  } catch (e) {
    return failure(e);
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { a, db } = await owned(request, id, true);
    if (a.submittedAt) return json(view(a));
    const input = (await readBody(request)) as {
      answers?: unknown;
      submit?: unknown;
    };
    const questions = JSON.parse(a.questions) as Question[];
    const expired = Date.now() >= a.deadline;
    const answers = expired
      ? JSON.parse(a.answers)
      : validateAnswers(input.answers, questions);
    const submit = input.submit === true || expired;
    const result = grade(questions, answers);
    await db
      .update(attempts)
      .set({
        answers: JSON.stringify(answers),
        ...(submit
          ? {
              submittedAt: Math.min(Date.now(), a.deadline),
              score: result.score,
            }
          : {}),
      })
      .where(and(eq(attempts.id, id), isNull(attempts.submittedAt)));
    const [latest] = await db
      .select()
      .from(attempts)
      .where(eq(attempts.id, id));
    return json(view(latest));
  } catch (e) {
    return failure(e);
  }
}
