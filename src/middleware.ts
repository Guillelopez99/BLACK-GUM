import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "bg_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) {
    return redirectToLogin(request);
  }

  const [token, signature] = cookie.split(".");
  if (!token || !signature) {
    return redirectToLogin(request);
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return redirectToLogin(request);
  }

  const valid = await verifySignature(token, signature, secret);
  if (!valid) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

async function verifySignature(
  token: string,
  signature: string,
  secret: string
) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(token)
  );
  const hex = bufferToHex(signed);
  return timingSafeEqual(hex, signature);
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
