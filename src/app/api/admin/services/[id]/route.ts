import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin";
import { parseInteger } from "@/lib/validation";

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

  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim();
  const description = String(body.description || "").trim();
  const priceFrom = parseInteger(body.priceFrom, 0);

  if (!name || !slug || !description) {
    return NextResponse.json(
      { error: "Nombre, slug y descripción son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        priceFrom
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo actualizar el servicio" }, { status: 400 });
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
    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo eliminar el servicio" }, { status: 400 });
  }
}

