import { getSession } from "@/lib/auth";

export async function requireAdminApi() {
  const session = await getSession();
  if (!session) return null;
  return session.user;
}
