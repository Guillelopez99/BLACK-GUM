import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const now = new Date();
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, publishedAt: { not: null, lte: now } }
  });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}
