import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const service = await prisma.service.findUnique({ where: { slug: params.slug } });
  if (!service) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(service);
}
