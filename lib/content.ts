import learning from "./content/learning.json";
export type Block = { heading: string; body: string; bullets?: string[] };
export type Lesson = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: Block[];
  sourceFiles?: string[];
};
export type Section = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};
export const sections = learning as Section[];
export const lessons = sections.flatMap((s) =>
  s.lessons.map((l) => ({ ...l, sectionId: s.id, sectionTitle: s.title })),
);
