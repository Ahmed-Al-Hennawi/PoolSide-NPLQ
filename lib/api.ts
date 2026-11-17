import { getChatGPTUser } from "../app/chatgpt-auth";
export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function identity(request: Request, write = false) {
  if (write) requireSameOrigin(request);
  const user = await getChatGPTUser();
  if (!user) throw new Error("Sign in to continue");
  return user;
}
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) throw new Error("Forbidden");
}
export function failure(e: unknown) {
  const message = e instanceof Error ? e.message : "Request failed";
  const status =
    message === "Sign in to continue"
      ? 401
      : message === "Forbidden"
        ? 403
        : message === "Not found"
          ? 404
          : message.startsWith("Invalid")
            ? 400
            : 500;
  return json(
    {
      error:
        status === 500
          ? "Unable to save right now. Please try again."
          : message,
    },
    status,
  );
}

export async function readBody(
  request: Request,
): Promise<Record<string, unknown>> {
  if (Number(request.headers.get("content-length") || 0) > 20000)
    throw new Error("Invalid request size");
  let value: unknown;
  try {
    const body = await request.text();
    if (body.length > 20000) throw new Error();
    value = JSON.parse(body);
  } catch {
    throw new Error("Invalid JSON body");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid request body");
  return value as Record<string, unknown>;
}
