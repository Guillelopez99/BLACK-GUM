import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin";
import { parseInteger, parseRentalCategory } from "@/lib/validation";

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
  const category = parseRentalCategory(body.category);
  const pricePerDay = parseInteger(body.pricePerDay, 0);
  const weekendPriceRaw = body.weekendPrice;
  const weekendPrice =
    weekendPriceRaw === null || weekendPriceRaw === ""
      ? null
      : parseInteger(weekendPriceRaw, 0);
  const deposit = parseInteger(body.deposit, 0);
  const stock = parseInteger(body.stock, 0);
  const isActive = Boolean(body.isActive);
  const specs = String(body.specs || "").trim();

  if (!name || !slug || !category || !specs) {
    return NextResponse.json(
      { error: "Nombre, slug, categoría y especificaciones son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const rental = await prisma.rentalItem.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        category,
        pricePerDay,
        weekendPrice,
        deposit,
        stock,
        isActive,
        specs
      }
    });

    return NextResponse.json(rental);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo actualizar el alquiler" }, { status: 400 });
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
    await prisma.rentalItem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo eliminar el alquiler" }, { status: 400 });
  }
}

