import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
export const attempts = sqliteTable("attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  mode: text("mode").notNull(),
  questions: text("questions").notNull(),
  answers: text("answers").notNull().default("{}"),
  startedAt: integer("started_at").notNull(),
  deadline: integer("deadline").notNull(),
  submittedAt: integer("submitted_at"),
  score: integer("score"),
  total: integer("total").notNull(),
});
export const progress = sqliteTable(
  "progress",
  {
    userId: text("user_id").notNull(),
    lessonId: text("lesson_id").notNull(),
    completedAt: integer("completed_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);
