import { getDb } from "../../../db";
import { progress } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { json, identity, failure, readBody } from "../../../lib/api";
import { lessons } from "../../../lib/content";
export async function POST(request: Request) {
  try {
    const user = await identity(request, true);
    const data = (await readBody(request)) as {
      lessonId: string;
      completed: boolean;
    };
    if (
      !lessons.some((l) => l.id === data.lessonId) ||
      typeof data.completed !== "boolean"
    )
      throw new Error("Invalid lesson");
    const db = getDb();
    if (data.completed)
      await db
        .insert(progress)
        .values({
          userId: user.userId,
          lessonId: data.lessonId,
          completedAt: Date.now(),
        })
        .onConflictDoNothing();
    else
      await db
        .delete(progress)
        .where(
          and(
            eq(progress.userId, user.userId),
            eq(progress.lessonId, data.lessonId),
          ),
        );
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
