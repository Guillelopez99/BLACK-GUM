import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUS } from "@/lib/booking";

/**
 * GET /api/rentals/status-by-session?sessionId=<stripeSessionId>
 * Used by the success page to poll booking status.
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "Se requiere sessionId" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { stripeSessionId: sessionId },
      include: { product: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    // Auto-expire if hold has passed
    if (
      booking.status === BOOKING_STATUS.HOLD &&
      booking.holdExpiresAt &&
      booking.holdExpiresAt < new Date()
    ) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: BOOKING_STATUS.EXPIRED },
      });
      return NextResponse.json({
        id: booking.id,
        status: "EXPIRED",
        productName: booking.product.name,
        mode: booking.mode,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString(),
        priceTotalCents: booking.priceTotalCents,
      });
    }

    return NextResponse.json({
      id: booking.id,
      status: booking.status,
      productName: booking.product.name,
      mode: booking.mode,
      startAt: booking.startAt.toISOString(),
      endAt: booking.endAt.toISOString(),
      priceTotalCents: booking.priceTotalCents,
    });
  } catch (err) {
    console.error("[status-by-session]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
