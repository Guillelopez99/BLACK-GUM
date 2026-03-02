import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const pack = await prisma.pack.findUnique({ where: { slug: params.slug } });
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(pack);
}
