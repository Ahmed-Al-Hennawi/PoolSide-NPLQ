import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { attempts, progress } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { json, identity, failure } from "../../../lib/api";
export async function GET() {
  try {
    const user = await getChatGPTUser();
    if (!user) return json({ user: null, attempts: [], completed: [] });
    const db = getDb();
    const history = await db
      .select({
        id: attempts.id,
        mode: attempts.mode,
        startedAt: attempts.startedAt,
        submittedAt: attempts.submittedAt,
        score: attempts.score,
        total: attempts.total,
        deadline: attempts.deadline,
      })
      .from(attempts)
      .where(eq(attempts.userId, user.userId))
      .orderBy(desc(attempts.startedAt));
    const completed = await db
      .select()
      .from(progress)
      .where(eq(progress.userId, user.userId));
    return json({
      user: { name: user.fullName || "Lifeguard", email: user.email },
      attempts: history,
      completed: completed.map((x) => x.lessonId),
    });
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(request: Request) {
  try {
    const user = await identity(request, true);
    const db = getDb();
    await db.batch([
      db.delete(attempts).where(eq(attempts.userId, user.userId)),
      db.delete(progress).where(eq(progress.userId, user.userId)),
    ]);
    return json({ deleted: true });
  } catch (e) {
    return failure(e);
  }
}
