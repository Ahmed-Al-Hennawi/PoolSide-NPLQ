import { TestRunner } from "../../../components/test-runner";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <TestRunner id={(await params).id} />;
}
