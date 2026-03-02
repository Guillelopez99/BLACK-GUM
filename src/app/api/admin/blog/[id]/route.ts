import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin";
import { parsePublishedAt } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  const excerpt = String(body.excerpt || "").trim();
  const bodyText = String(body.body || "").trim();
  const publishedAt = parsePublishedAt(body.publishedAt);

  if (!title || !slug || !excerpt || !bodyText) {
    return NextResponse.json(
      { error: "Título, slug, extracto y contenido son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        body: bodyText,
        publishedAt
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo actualizar la entrada" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo eliminar la entrada" }, { status: 400 });
  }
}

