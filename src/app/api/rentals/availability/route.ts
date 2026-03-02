import { NextRequest, NextResponse } from "next/server";
import type { BookingMode } from "@/lib/booking";
import {
  resolveProduct,
  normalizeDates,
  validateDuration,
  findConflicts,
} from "@/lib/booking";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slugOrId = searchParams.get("slug") || searchParams.get("productId");
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const modeParam = searchParams.get("mode") as BookingMode | null;

    if (!slugOrId || !start || !end || !modeParam) {
      return NextResponse.json(
        { error: "Faltan parámetros: slug/productId, start, end, mode" },
        { status: 400 }
      );
    }

    if (!["hourly", "daily"].includes(modeParam)) {
      return NextResponse.json(
        { error: "mode debe ser 'hourly' o 'daily'" },
        { status: 400 }
      );
    }

    const product = await resolveProduct(slugOrId);
    if (!product || !product.active) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const mode = modeParam as BookingMode;
    const { startAt, endAt } = normalizeDates(mode, start, end);

    const durationError = validateDuration(mode, startAt, endAt);
    if (durationError) {
      return NextResponse.json({ error: durationError }, { status: 400 });
    }

    const conflicts = await findConflicts(product.id, startAt, endAt);

    return NextResponse.json({
      available: conflicts.length === 0,
      conflicts: conflicts.map((c) => ({
        id: c.id,
        startAt: c.startAt.toISOString(),
        endAt: c.endAt.toISOString(),
        status: c.status,
      })),
      normalizedStart: startAt.toISOString(),
      normalizedEnd: endAt.toISOString(),
    });
  } catch (err) {
    console.error("[availability]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
