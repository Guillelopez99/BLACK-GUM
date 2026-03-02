"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import BookingModal from "@/components/rentals/BookingModal";

type ContentMode = "highlights" | "specs";
type CtaAction = "availability" | "quote";

interface RentalProduct {
  id: string;
  name: string;
  category: string;
  imageSrc: string;
  fallbackLabel: string;
  highlights: string[];
  specs: string[];
  prefillLabel: string;
}

const rentals: RentalProduct[] = [
  {
    id: "smallhd-cine-18",
    name: "SmallHD Cine 18",
    category: "Monitor 18\" / 4K / High-Bright",
    imageSrc: "/assets/rentals/smallhd-cine-18.png",
    fallbackLabel: "SmallHD",
    highlights: [
      "Video Village serio. En cualquier luz.",
      "18\" 4K high-bright para exterior e interior, color consistente y herramientas pro.",
      "12G-SDI y HDMI 2.0 para flujos modernos sin líos."
    ],
    specs: [
      "18\" UHD 4K (3840x2160)",
      "1100 nits (High-Bright)",
      "10-bit, 100% Rec.709",
      "4x 12G-SDI IN / 4x 12G-SDI OUT",
      "HDMI 2.0 IN/OUT",
      "PageOS: waveform, vectorscope, false color, focus assist, 3D LUTs"
    ],
    prefillLabel: "Alquiler — SmallHD Cine 18"
  },
  {
    id: "teradek-bolt-6-lt-750",
    name: "Teradek Bolt 6 LT 750",
    category: "Wireless Video / 6GHz / 750ft",
    imageSrc: "/assets/rentals/teradek-bolt-6-lt-750.png",
    fallbackLabel: "Teradek",
    highlights: [
      "Wireless sin sustos. Monitoriza donde quieras.",
      "Latencia prácticamente cero y más margen en entornos saturados con 6 GHz.",
      "Ideal para director, foco, steadicam, gimbal o video village."
    ],
    specs: [
      "Set TX + RX",
      "Alcance 750 ft (línea de visión)",
      "Zero-Delay (tiempo real)",
      "Bandas 6 GHz + 5 GHz (compatibilidad Bolt 4K)",
      "Hasta 4K30 por HDMI (según set)",
      "Hasta 6 RX por TX",
      "Bolt Manager App, AES-256 (según configuración)"
    ],
    prefillLabel: "Alquiler — Teradek Bolt 6 LT 750"
  }
];

const buildContactUrl = (productLabel: string, action: CtaAction) => {
  const params = new URLSearchParams({
    projectType: productLabel,
    projectSummary:
      action === "availability"
        ? `Consulta de disponibilidad para ${productLabel}.`
        : `Solicitud de presupuesto para ${productLabel}.`,
    budget: action === "quote" ? "Por definir" : ""
  });

  return `/contact?${params.toString()}`;
};

export default function PremiumRentalCards() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<Record<string, ContentMode>>({
    "smallhd-cine-18": "highlights",
    "teradek-bolt-6-lt-750": "highlights"
  });
  const [missingImage, setMissingImage] = useState<Record<string, boolean>>({});
  const [bookingTarget, setBookingTarget] = useState<{ slug: string; name: string } | null>(null);

  const activeTabClass = useMemo(
    () =>
      "border-ember/60 bg-ember/20 text-bone shadow-[0_10px_20px_rgba(241,169,58,0.18)]",
    []
  );

  const baseTabClass =
    "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-200";

  const handleCtaClick = (productLabel: string, action: CtaAction) => {
    router.push(buildContactUrl(productLabel, action));
  };

  return (
    <>
    <div className="grid gap-8 lg:grid-cols-2">
      {rentals.map((item) => {
        const selectedMode = activeMode[item.id] ?? "highlights";
        const highlightsPanelId = `${item.id}-highlights`;
        const specsPanelId = `${item.id}-specs`;
        const showFallback = missingImage[item.id];

        return (
          <Card
            key={item.id}
            variant="solid"
            padding="lg"
            className="rentals-card relative overflow-hidden border-white/15"
          >
            <div className="space-y-6">
              <div className="rentals-hero relative overflow-hidden rounded-xl border border-white/10">
                <div className="rentals-hero-smoke" aria-hidden="true" />
                <div className="rentals-hero-glint" aria-hidden="true" />

                {!showFallback ? (
                  <img
                    src={item.imageSrc}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="rentals-product-image"
                    onError={() =>
                      setMissingImage((prev) => ({ ...prev, [item.id]: true }))
                    }
                  />
                ) : (
                  <div className="rentals-placeholder" aria-label={`${item.name} placeholder`}>
                    <span className="rentals-placeholder-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
                        <path d="M8 17.5v2m8-2v2M8 4.5h8" />
                      </svg>
                    </span>
                    <span>{item.fallbackLabel}</span>
                  </div>
                )}

                <div className="rentals-ground-shadow" aria-hidden="true" />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">{item.category}</Badge>
                  <span className="text-xs uppercase tracking-[0.14em] text-fog/70">
                    Incluye: equipo + alimentación básica (según kit).
                  </span>
                </div>

                <h3 className="text-3xl font-display font-bold text-bone">{item.name}</h3>

                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div
                    className="flex w-full items-center gap-2"
                    role="tablist"
                    aria-label={`Contenido de ${item.name}`}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selectedMode === "highlights"}
                      aria-controls={highlightsPanelId}
                      id={`${item.id}-tab-highlights`}
                      className={`${baseTabClass} ${
                        selectedMode === "highlights"
                          ? activeTabClass
                          : "border-white/15 text-fog hover:border-ember/40 hover:text-bone"
                      }`}
                      onClick={() =>
                        setActiveMode((prev) => ({ ...prev, [item.id]: "highlights" }))
                      }
                    >
                      Highlights
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selectedMode === "specs"}
                      aria-controls={specsPanelId}
                      id={`${item.id}-tab-specs`}
                      className={`${baseTabClass} ${
                        selectedMode === "specs"
                          ? activeTabClass
                          : "border-white/15 text-fog hover:border-ember/40 hover:text-bone"
                      }`}
                      onClick={() =>
                        setActiveMode((prev) => ({ ...prev, [item.id]: "specs" }))
                      }
                    >
                      Specs
                    </button>
                  </div>

                  <div
                    id={highlightsPanelId}
                    role="tabpanel"
                    aria-labelledby={`${item.id}-tab-highlights`}
                    hidden={selectedMode !== "highlights"}
                    className="pt-4"
                  >
                    <ul className="space-y-2 text-sm text-fog">
                      {item.highlights.map((line) => (
                        <li key={line} className="flex gap-2 leading-relaxed">
                          <span className="text-ember" aria-hidden="true">&bull;</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    id={specsPanelId}
                    role="tabpanel"
                    aria-labelledby={`${item.id}-tab-specs`}
                    hidden={selectedMode !== "specs"}
                    className="pt-4"
                  >
                    <ul className="space-y-2 text-sm text-fog">
                      {item.specs.map((line) => (
                        <li key={line} className="flex gap-2 leading-relaxed">
                          <span className="text-ember" aria-hidden="true">&bull;</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid gap-2 rounded-xl border border-white/10 bg-ink/55 p-4 text-sm">
                  <p className="text-fog/80">Desde — €/día</p>
                  <p className="text-fog/80">Pack semana —€</p>
                </div>

                <p className="text-xs text-fog/75">
                  ¿Necesitas pack? Combina monitor + Teradek para un video village inalámbrico.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    className="btn-cinematic rentals-cta"
                    onClick={() => setBookingTarget({ slug: item.id, name: item.name })}
                  >
                    Reservar
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-cinematic rentals-cta"
                    onClick={() => handleCtaClick(item.prefillLabel, "quote")}
                  >
                    Pedir presupuesto
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>

    {bookingTarget && (
      <BookingModal
        productSlug={bookingTarget.slug}
        productName={bookingTarget.name}
        open={true}
        onClose={() => setBookingTarget(null)}
      />
    )}
    </>
  );
}
