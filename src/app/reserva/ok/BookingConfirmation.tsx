"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";

interface BookingInfo {
  id: string;
  status: string;
  productName: string;
  mode: string;
  startAt: string;
  endAt: string;
  priceTotalCents: number;
}

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Poll for booking status (webhook might not have fired yet)
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      try {
        // We need to find the booking by session_id. Use a lightweight endpoint.
        const res = await fetch(
          `/api/rentals/status-by-session?sessionId=${encodeURIComponent(sessionId)}`
        );
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
          if (data.status === "CONFIRMED" || data.status === "EXPIRED" || data.status === "CANCELLED") {
            setLoading(false);
            return;
          }
        }
      } catch {}

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000);
      } else {
        setLoading(false);
      }
    };

    poll();
  }, [sessionId]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", {
      timeZone: "Europe/Madrid",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="text-center space-y-8 py-12">
      <div className="space-y-4">
        <div className="text-6xl">✓</div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-bone">
          Pago recibido
        </h1>
        <p className="text-lg text-fog max-w-xl mx-auto">
          {loading
            ? "Estamos confirmando tu reserva…"
            : booking?.status === "CONFIRMED"
              ? "¡Tu reserva está confirmada!"
              : booking?.status === "EXPIRED"
                ? "La reserva ha expirado. Por favor, inténtalo de nuevo."
                : "Tu pago ha sido procesado. Recibirás un email de confirmación."}
        </p>
      </div>

      {booking && (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-left max-w-md mx-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-fog">Producto</span>
            <span className="text-bone font-semibold">{booking.productName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fog">Modo</span>
            <span className="text-bone">
              {booking.mode === "hourly" ? "Por horas" : "Por días"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fog">Inicio</span>
            <span className="text-bone">{formatDate(booking.startAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fog">Fin</span>
            <span className="text-bone">{formatDate(booking.endAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fog">Estado</span>
            <span
              className={`font-bold ${
                booking.status === "CONFIRMED"
                  ? "text-green-400"
                  : booking.status === "HOLD"
                    ? "text-ember"
                    : "text-gum"
              }`}
            >
              {booking.status === "CONFIRMED"
                ? "Confirmada"
                : booking.status === "HOLD"
                  ? "Pendiente"
                  : booking.status === "EXPIRED"
                    ? "Expirada"
                    : booking.status}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-white/10">
            <span className="text-fog">Total</span>
            <span className="text-ember font-bold">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(booking.priceTotalCents / 100)}
            </span>
          </div>
          {booking.id && (
            <p className="text-xs text-fog/50 pt-2">
              Ref: {booking.id.slice(0, 8)}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4">
        <LinkButton href="/rentals" variant="secondary" size="md">
          Volver a alquileres
        </LinkButton>
      </div>
    </div>
  );
}
