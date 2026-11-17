import { getChatGPTUser } from "../app/chatgpt-auth";
import { requireSameOrigin } from "./api";
import { ALLOW_GUEST_MOCK_TESTS } from "./settings";

const COOKIE_NAME = "poolside_guest";
export const GUEST_PREFIX = "guest:";
export const GUEST_LIFETIME_MS = 24 * 60 * 60 * 1000;

// The random HttpOnly cookie is the guest's private access token. It is never
// returned in JSON, URLs or browser storage. Account APIs still require sign-in.
export async function attemptAccess(
  request: Request,
  write = false,
  createGuest = false,
) {
  if (write) requireSameOrigin(request);
  const user = await getChatGPTUser();
  const cookies = (request.headers.get("cookie") || "").split(";");
  const raw = cookies
    .map((c) => c.trim())
    .filter((c) => c.startsWith(COOKIE_NAME + "="));
  const token = raw.length === 1 ? raw[0].slice(COOKIE_NAME.length + 1) : "";
  const valid = /^[a-f0-9]{64}$/.test(token);
  let guestId = ALLOW_GUEST_MOCK_TESTS && valid ? GUEST_PREFIX + token : null;
  let cookie: string | null = null;
  if (!user && !guestId && ALLOW_GUEST_MOCK_TESTS && createGuest) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const newToken = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    guestId = GUEST_PREFIX + newToken;
    cookie = `${COOKIE_NAME}=${newToken}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
  }
  const ownerIds = [user?.userId, guestId].filter((id): id is string => !!id);
  if (!ownerIds.length) throw new Error("Sign in to continue");
  return { userId: ownerIds[0], ownerIds, cookie };
}
