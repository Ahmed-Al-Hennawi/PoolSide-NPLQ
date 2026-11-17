import bank from "../../../lib/content/questions.json";
import { getDb } from "../../../db";
import { attempts } from "../../../db/schema";
import { json, failure, readBody } from "../../../lib/api";
import { attemptAccess, GUEST_PREFIX, GUEST_LIFETIME_MS } from "../../../lib/attempt-access";
import { and, like, lt } from "drizzle-orm";
import { shuffle, type Question } from "../../../lib/assessment";
export async function POST(request: Request) {
  try {
    const input = (await readBody(request)) as { mode?: unknown };
    const mode = typeof input?.mode === "string" ? input.mode : "";
    if (!["full", "quick", "safety", "rescue", "first-aid"].includes(mode))
      throw new Error("Invalid test mode");
    const user = await attemptAccess(request, true, true);
    const questions = bank as Question[];
    let selected: Question[];
    if (mode === "quick") selected = shuffle(questions).slice(0, 10);
    else if (mode === "full")
      selected = ["safety", "first-aid"].flatMap((id) =>
        shuffle(questions.filter((q) => q.sectionId === id)).slice(0, 24),
      );
    else
      selected = shuffle(questions.filter((q) => q.sectionId === mode)).slice(
        0,
        24,
      );
    if (!selected.length) throw new Error("Invalid question bank");
    const id = crypto.randomUUID();
    const startedAt = Date.now();
    const minutes =
      mode === "full"
        ? 72
        : mode === "quick"
          ? 12
          : mode === "rescue"
            ? 18
            : 36;
    const db = getDb();
    // Expired guest attempts are inaccessible and removed on the next start.
    await db.delete(attempts).where(and(
      like(attempts.userId, GUEST_PREFIX + "%"),
      lt(attempts.startedAt, startedAt - GUEST_LIFETIME_MS),
    ));
    await db
      .insert(attempts)
      .values({
        id,
        userId: user.userId,
        mode,
        questions: JSON.stringify(selected),
        startedAt,
        deadline: startedAt + minutes * 60000,
        total: selected.length,
      });
    const response = json({ id }, 201);
    if (user.cookie) response.headers.set("Set-Cookie", user.cookie);
    return response;
  } catch (e) {
    return failure(e);
  }
}
