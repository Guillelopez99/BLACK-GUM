import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const posts = await prisma.post.findMany({
    where: { publishedAt: { not: null, lte: now } },
    orderBy: { publishedAt: "desc" }
  });
  return NextResponse.json(posts);
}
