import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUS, type BookingMode } from "@/lib/booking";
import { normalizeDates, validateDuration } from "@/lib/booking";

/**
 * Admin-only endpoint to create BLOCKED intervals for maintenance.
 * Protected with ADMIN_BLOCK_SECRET env var.
 */
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.ADMIN_BLOCK_SECRET;
    const authHeader = request.headers.get("authorization");

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, productId, start, end, mode: modeParam, notes } = body as {
      slug?: string;
      productId?: string;
      start: string;
      end: string;
      mode: string;
      notes?: string;
    };

    const slugOrId = slug || productId;
    if (!slugOrId || !start || !end || !modeParam) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios" },
        { status: 400 }
      );
    }

    // Resolve product
    let product = await prisma.product.findUnique({ where: { slug: slugOrId } });
    if (!product) {
      product = await prisma.product.findUnique({ where: { id: slugOrId } });
    }
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const mode = modeParam as BookingMode;
    const { startAt, endAt } = normalizeDates(mode, start, end);

    const durationError = validateDuration(mode, startAt, endAt);
    if (durationError) {
      return NextResponse.json({ error: durationError }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        productId: product.id,
        startAt,
        endAt,
        mode,
        status: BOOKING_STATUS.BLOCKED,
        priceTotalCents: 0,
        notes: notes ?? "Bloqueo administrativo",
      },
    });

    return NextResponse.json({ bookingId: booking.id, status: "BLOCKED" });
  } catch (err) {
    console.error("[block]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
