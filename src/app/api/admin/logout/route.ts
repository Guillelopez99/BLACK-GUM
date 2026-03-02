import { NextResponse } from "next/server";
import { clearSessionCookie, destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}

