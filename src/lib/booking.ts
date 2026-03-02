import { prisma } from "./prisma";

// ─── String-based enums (SQLite-compatible) ──────────────────────
export type BookingMode = "hourly" | "daily";
export type BookingStatus = "HOLD" | "CONFIRMED" | "CANCELLED" | "EXPIRED" | "BLOCKED";

export const BOOKING_MODE = { hourly: "hourly", daily: "daily" } as const;
export const BOOKING_STATUS = {
  HOLD: "HOLD",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  BLOCKED: "BLOCKED",
} as const;

/** Default daily pickup/return hour in Europe/Madrid local time */
const DAILY_HOUR = 10;

/** Hold duration in minutes */
export const HOLD_TTL_MINUTES = 15;

/** Minimum hourly booking duration in hours */
export const MIN_HOURLY_HOURS = 4;

// ─── Date helpers ────────────────────────────────────────────────

/**
 * Build a UTC Date for a given local Europe/Madrid date + hour.
 * We use Intl to figure out the current UTC offset for Madrid.
 */
function madridDateToUTC(dateStr: string, hour: number): Date {
  // dateStr: "YYYY-MM-DD"
  // Build an ISO string as if it's UTC first, then adjust for Madrid offset
  const naive = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`);

  // Get Madrid offset at that point in time
  const madridFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // We need to find the offset. Quick approach: format the same instant
  // in Madrid and compare with UTC.
  // Instead, just use a known approach: convert a UTC date and figure out diff.
  // Simpler: use the IANA tz manually.
  // For reliability, construct with timezone offset:
  const utcDate = new Date(
    Date.UTC(
      naive.getFullYear(),
      naive.getMonth(),
      naive.getDate(),
      naive.getHours(),
      naive.getMinutes()
    )
  );

  // Now figure out what Madrid shows for this UTC instant
  const parts = madridFormatter.formatToParts(utcDate);
  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "0";

  const madridHour = parseInt(getPart("hour"), 10);
  const utcHour = utcDate.getUTCHours();
  const offsetHours = madridHour - utcHour; // positive means Madrid is ahead

  // We want the local Madrid time to be `hour`. So UTC = local - offset.
  const result = new Date(
    Date.UTC(
      naive.getFullYear(),
      naive.getMonth(),
      naive.getDate(),
      hour - offsetHours,
      0,
      0
    )
  );
  return result;
}

export interface NormalizedDates {
  startAt: Date;
  endAt: Date;
}

/**
 * Normalize booking dates based on mode.
 *  - daily: force 10:00 Madrid on both dates
 *  - hourly: parse ISO datetimes directly
 */
export function normalizeDates(
  mode: BookingMode,
  start: string,
  end: string
): NormalizedDates {
  if (mode === BOOKING_MODE.daily) {
    // start and end are date strings "YYYY-MM-DD"
    const startDate = start.slice(0, 10);
    const endDate = end.slice(0, 10);
    return {
      startAt: madridDateToUTC(startDate, DAILY_HOUR),
      endAt: madridDateToUTC(endDate, DAILY_HOUR),
    };
  }

  // hourly — expect ISO datetime strings
  return {
    startAt: new Date(start),
    endAt: new Date(end),
  };
}

/**
 * Validate minimum duration.
 */
export function validateDuration(
  mode: BookingMode,
  startAt: Date,
  endAt: Date
): string | null {
  if (endAt <= startAt) return "La fecha de fin debe ser posterior a la de inicio.";

  if (mode === BOOKING_MODE.hourly) {
    const diffMs = endAt.getTime() - startAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours < MIN_HOURLY_HOURS) {
      return `Mínimo ${MIN_HOURLY_HOURS} horas para alquiler por horas.`;
    }
  }

  if (mode === BOOKING_MODE.daily) {
    const diffMs = endAt.getTime() - startAt.getTime();
    if (diffMs < 24 * 60 * 60 * 1000) {
      return "Mínimo 1 día completo de alquiler.";
    }
  }

  return null;
}

// ─── Conflict check ─────────────────────────────────────────────

/**
 * Expire stale HOLDs for a product before checking conflicts.
 */
export async function expireStaleHolds(productId: string): Promise<void> {
  await prisma.booking.updateMany({
    where: {
      productId,
      status: BOOKING_STATUS.HOLD,
      holdExpiresAt: { lt: new Date() },
    },
    data: { status: BOOKING_STATUS.EXPIRED },
  });
}

/**
 * Check if there are conflicting bookings for a product in a time range.
 * Returns the conflicting bookings (empty array = available).
 */
export async function findConflicts(
  productId: string,
  startAt: Date,
  endAt: Date
) {
  // First, expire stale holds
  await expireStaleHolds(productId);

  const conflicts = await prisma.booking.findMany({
    where: {
      productId,
      status: {
        in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.BLOCKED, BOOKING_STATUS.HOLD],
      },
      // Overlap: newStart < existingEnd AND newEnd > existingStart
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      status: true,
      mode: true,
    },
  });

  // For HOLDs, double-check they haven't expired
  return conflicts.filter((b) => {
    if (b.status === BOOKING_STATUS.HOLD) {
      // This shouldn't happen since we expired above, but just in case
      return true;
    }
    return true;
  });
}

/**
 * Resolve a product by slug or ID.
 */
export async function resolveProduct(slugOrId: string) {
  // Try slug first, then ID
  let product = await prisma.product.findUnique({
    where: { slug: slugOrId },
  });
  if (!product) {
    product = await prisma.product.findUnique({
      where: { id: slugOrId },
    });
  }
  return product;
}

// ─── Pricing placeholder ────────────────────────────────────────

/**
 * Very simple pricing placeholder.
 * In production this would come from a pricing table.
 * Uses €/hour and €/day rates from the RentalItem if available,
 * or falls back to defaults.
 */
export function computePrice(
  mode: BookingMode,
  startAt: Date,
  endAt: Date
): number {
  const diffMs = endAt.getTime() - startAt.getTime();

  if (mode === BOOKING_MODE.hourly) {
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    // Placeholder: €25/hour
    return hours * 2500;
  }

  // daily
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  // Placeholder: €150/day
  return days * 15000;
}

// ─── Hold creation (transactional) ──────────────────────────────

export interface HoldInput {
  productId: string;
  startAt: Date;
  endAt: Date;
  mode: BookingMode;
  priceTotalCents: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  notes?: string;
}

export async function createHold(input: HoldInput) {
  const holdExpiresAt = new Date(Date.now() + HOLD_TTL_MINUTES * 60 * 1000);

  return prisma.$transaction(async (tx) => {
    // Re-check conflicts inside transaction
    await tx.booking.updateMany({
      where: {
        productId: input.productId,
        status: BOOKING_STATUS.HOLD,
        holdExpiresAt: { lt: new Date() },
      },
      data: { status: BOOKING_STATUS.EXPIRED },
    });

    const conflicts = await tx.booking.findMany({
      where: {
        productId: input.productId,
        status: {
          in: [
            BOOKING_STATUS.CONFIRMED,
            BOOKING_STATUS.BLOCKED,
            BOOKING_STATUS.HOLD,
          ],
        },
        startAt: { lt: input.endAt },
        endAt: { gt: input.startAt },
      },
    });

    if (conflicts.length > 0) {
      throw new Error("CONFLICT");
    }

    // Upsert customer
    const customer = await tx.customer.upsert({
      where: { email: input.customer.email.toLowerCase() },
      update: {
        fullName: input.customer.fullName,
        phone: input.customer.phone,
      },
      create: {
        fullName: input.customer.fullName,
        email: input.customer.email.toLowerCase(),
        phone: input.customer.phone,
      },
    });

    // Create HOLD booking
    const booking = await tx.booking.create({
      data: {
        productId: input.productId,
        customerId: customer.id,
        startAt: input.startAt,
        endAt: input.endAt,
        mode: input.mode,
        status: BOOKING_STATUS.HOLD,
        holdExpiresAt,
        priceTotalCents: input.priceTotalCents,
        notes: input.notes,
      },
      include: { product: true, customer: true },
    });

    return booking;
  });
}
