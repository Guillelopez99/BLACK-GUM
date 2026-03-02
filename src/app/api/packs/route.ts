import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packs = await prisma.pack.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
  });
  return NextResponse.json(packs);
}
