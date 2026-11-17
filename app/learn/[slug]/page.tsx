import { Learning } from "../../../components/learning";
import { lessons } from "../../../lib/content";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!lessons.some((l) => l.id === slug)) notFound();
  return <Learning slug={slug} />;
}
