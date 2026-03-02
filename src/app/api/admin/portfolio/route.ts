import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin";
import { parseProjectType } from "@/lib/validation";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim();
  const type = parseProjectType(body.type);
  const summary = String(body.summary || "").trim();
  const bodyText = String(body.body || "").trim();
  const videoUrl = String(body.videoUrl || "").trim();

  if (!title || !slug || !type || !summary || !bodyText) {
    return NextResponse.json(
      { error: "Título, slug, tipo, resumen y contenido son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        type,
        summary,
        body: bodyText,
        videoUrl: videoUrl ? videoUrl : null
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo crear el proyecto" }, { status: 400 });
  }
}

