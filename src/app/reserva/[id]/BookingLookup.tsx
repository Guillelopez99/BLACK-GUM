"use client";

import { useEffect, useState } from "react";
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

export default function BookingLookup({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/rentals/status?id=${encodeURIComponent(bookingId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Reserva no encontrada");
          return;
        }
        setBooking(await res.json());
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, [bookingId]);

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

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-fog text-lg">Cargando reserva…</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-16 space-y-6">
        <h1 className="text-3xl font-display font-bold text-bone">
          Reserva no encontrada
        </h1>
        <p className="text-fog">{error}</p>
        <LinkButton href="/rentals" variant="secondary" size="md">
          Volver a alquileres
        </LinkButton>
      </div>
    );
  }

  const statusLabel: Record<string, string> = {
    CONFIRMED: "Confirmada",
    HOLD: "Pendiente de pago",
    EXPIRED: "Expirada",
    CANCELLED: "Cancelada",
    BLOCKED: "Bloqueada",
  };

  const statusColor: Record<string, string> = {
    CONFIRMED: "text-green-400",
    HOLD: "text-ember",
    EXPIRED: "text-gum",
    CANCELLED: "text-gum",
    BLOCKED: "text-fog",
  };

  return (
    <div className="text-center space-y-8 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-bone">
          Estado de Reserva
        </h1>
        <p className="text-fog">Ref: {booking.id.slice(0, 8)}</p>
      </div>

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
          <span className={`font-bold ${statusColor[booking.status] || "text-fog"}`}>
            {statusLabel[booking.status] || booking.status}
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
      </div>

      <LinkButton href="/rentals" variant="secondary" size="md">
        Volver a alquileres
      </LinkButton>
    </div>
  );
}
