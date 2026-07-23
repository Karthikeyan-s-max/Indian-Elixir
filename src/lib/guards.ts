import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Ensures the current request comes from a logged-in ADMIN.
 * Returns the session on success, or null when unauthorized
 * (caller is responsible for returning the 401/403 response).
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}
