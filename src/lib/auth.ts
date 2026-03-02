import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "bg_session";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function signToken(token: string) {
  return createHmac("sha256", getSessionSecret()).update(token).digest("hex");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getCookieToken() {
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  const [token, signature] = cookie.split(".");
  if (!token || !signature) return null;
  if (signToken(token) !== signature) return null;
  return token;
}

export async function getSession() {
  const token = getCookieToken();
  if (!token) return null;
  const tokenHash = hashToken(token);
  return prisma.adminSession.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() }
    },
    include: {
      user: true
    }
  });
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session.user;
}

export async function createSession(userId: string, maxAgeDays = 7) {
  const token = randomBytes(32).toString("hex");
  const signature = signToken(token);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000);

  await prisma.adminSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });

  return {
    cookieValue: `${token}.${signature}`,
    expiresAt
  };
}

export async function destroySession() {
  const token = getCookieToken();
  if (!token) return;
  await prisma.adminSession.deleteMany({
    where: {
      tokenHash: hashToken(token)
    }
  });
}

export function clearSessionCookie() {
  const store = cookies();
  store.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function setSessionCookie(value: string, expiresAt: Date) {
  const store = cookies();
  store.set({
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}
