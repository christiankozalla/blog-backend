import { readFile } from "node:fs/promises";
import { join } from "path";
import { getSession } from "./helpers.js";

const sessionName = import.meta.env.SESSION_NAME || process.env.SESSION_NAME ||
  "DEFAULT_SESSION";

export async function authenticationHandler(cookies: Record<string, string>[]) {
  // check if user has a cookie
  const cookie = cookies.find((cookie) =>
    Object.prototype.hasOwnProperty.call(
      cookie,
      sessionName,
    )
  );

  if (cookie) {
    const sessionData = await validateSession(
      cookie[sessionName],
    );
    return sessionData;
  } else {
    return { isValid: false, email: undefined };
  }
}

async function validateSession(
  cookie: string,
): Promise<{ isValid: boolean; email: string }> {
  const [email, token, expires] = decodeURIComponent(cookie).split(":::");
  const now = Date.now();
  if (now > Number(expires)) return { isValid: false, email };

  const sessions = await readFile(
    join(process.cwd(), "data", "cms", "sessions.txt"),
    { encoding: "utf8" },
  );

  const session = getSession(email, sessions);

  if (!session) return { isValid: false, email };

  return { isValid: session.split(":::")[1] === token, email };
}
