import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Correo y contraseña son obligatorios" },
      { status: 400 }
    );
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const session = await createSession(user.id);
  setSessionCookie(session.cookieValue, session.expiresAt);

  return NextResponse.json({ ok: true });
}

