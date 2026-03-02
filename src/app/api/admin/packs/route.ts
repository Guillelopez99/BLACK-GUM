import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin";
import { parseInteger, parseStringArray } from "@/lib/validation";

const validPackKinds = new Set(["campaign", "monthly", "alacarte"]);

export async function POST(request: Request) {
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
  const tagline = String(body.tagline || "").trim();
  const description = String(body.description || "").trim();
  const priceFrom = parseInteger(body.priceFrom, 0);
  const isFeatured = Boolean(body.isFeatured);
  const deliverables = parseStringArray(body.deliverables);
  const kindValue = body.kind == null ? "" : String(body.kind).trim();
  const imagePathInput = body.imagePath == null ? "" : String(body.imagePath).trim();

  if (!name || !slug || !tagline || !description) {
    return NextResponse.json(
      { error: "Nombre, slug, subtítulo y descripción son obligatorios" },
      { status: 400 }
    );
  }

  if (priceFrom < 0) {
    return NextResponse.json({ error: "El precio debe ser positivo" }, { status: 400 });
  }

  if (kindValue && !validPackKinds.has(kindValue)) {
    return NextResponse.json(
      { error: "Tipo de pack inválido" },
      { status: 400 }
    );
  }

  const kind = kindValue || null;
  const imagePath = imagePathInput || `/paquetes/${slug}.jpg`;

  try {
    const pack = await prisma.pack.create({
      data: {
        name,
        slug,
        tagline,
        description,
        deliverables: JSON.stringify(deliverables),
        kind,
        imagePath,
        priceFrom,
        isFeatured
      }
    });

    return NextResponse.json(pack);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo crear el pack" }, { status: 400 });
  }
}

