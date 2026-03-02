"use client";

import { useEffect, useMemo, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

type TierId = "presencia" | "crecimiento" | "dominio";

type TierConfig = {
  id: TierId;
  name: string;
  displayPrice: string;
  basePrice: number;
  cta: string;
  forWho: string;
  includes: string[];
};

type AddOnConfig = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const MONTHLY_SOCIAL_CONFIG: {
  tiers: TierConfig[];
  addOns: AddOnConfig[];
  reelsExtraPrice: number;
} = {
  tiers: [
    {
      id: "presencia",
      name: "PRESENCIA",
      displayPrice: "desde 299€/mes",
      basePrice: 299,
      cta: "Empezar Presencia",
      forWho: "Para marcas que necesitan presencia constante con una red principal.",
      includes: [
        "1 red principal (IG o TikTok)",
        "8 piezas/mes: 6 posts/carruseles + 2 reels (o 8 estáticos)",
        "Calendario mensual + copies",
        "Programación",
        "1 ronda de cambios",
        "Informe mensual simple"
      ]
    },
    {
      id: "crecimiento",
      name: "CRECIMIENTO",
      displayPrice: "549€/mes",
      basePrice: 549,
      cta: "Quiero Crecimiento",
      forWho: "Para equipos que quieren acelerar alcance y formato de vídeo corto.",
      includes: [
        "Hasta 2 redes",
        "12-14 piezas/mes: 6 reels + 6 posts (+ stories derivadas)",
        "Guiones cortos (hooks) + subtítulos + portadas",
        "Optimización de perfil (bio, links, highlights)",
        "Informe + recomendaciones accionables"
      ]
    },
    {
      id: "dominio",
      name: "DOMINIO",
      displayPrice: "899€/mes",
      basePrice: 899,
      cta: "Activar Dominio",
      forWho: "Para marcas que necesitan volumen, testing y operación multi-canal.",
      includes: [
        "Hasta 3 redes",
        "16-20 piezas/mes: 8-12 reels + resto posts",
        "1 sesión de grabación mensual (o grabación remota con material del cliente)",
        "Gestión básica de comunidad (respuestas y moderación)",
        "Informe avanzado + tablero de ideas + pruebas de formatos"
      ]
    }
  ],
  addOns: [
    {
      id: "record-half",
      name: "Grabación (media jornada)",
      description: "Captura adicional optimizada para lote mensual.",
      price: 390
    },
    {
      id: "record-full",
      name: "Grabación (jornada completa)",
      description: "Cobertura completa para banco de contenido más amplio.",
      price: 690
    },
    {
      id: "ads",
      name: "Ads: gestión + creatividades",
      description: "Operativa mensual de anuncios y piezas de performance.",
      price: 320
    },
    {
      id: "script-advanced",
      name: "Guion avanzado / serie",
      description: "Diseño de narrativa por episodios con guion extendido.",
      price: 240
    },
    {
      id: "seo-rrss",
      name: "SEO para RRSS (keywords, alt text, optimización)",
      description: "Optimización de discoverability y metadatos sociales.",
      price: 120
    },
    {
      id: "google-business",
      name: "Reputación Google Business (reseñas)",
      description: "Sistema mensual de seguimiento y respuesta de reseñas.",
      price: 180
    },
    {
      id: "express",
      name: "Entrega express 48h",
      description: "Prioridad en entregables críticos de calendario.",
      price: 210
    },
    {
      id: "multilang",
      name: "Multi-idioma",
      description: "Adaptación de copies y subtítulos a idiomas extra.",
      price: 160
    }
  ],
  reelsExtraPrice: 65
};

const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0
});

export default function MonthlySocialPackagesSection() {
  const [selectedTier, setSelectedTier] = useState<TierId>("crecimiento");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [reelsExtra, setReelsExtra] = useState(0);
  const [showCompare, setShowCompare] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("monthly-social-packages");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const selectedTierConfig = useMemo(
    () => MONTHLY_SOCIAL_CONFIG.tiers.find((tier) => tier.id === selectedTier) ?? MONTHLY_SOCIAL_CONFIG.tiers[0],
    [selectedTier]
  );

  const addOnsSubtotal = useMemo(
    () =>
      MONTHLY_SOCIAL_CONFIG.addOns.reduce(
        (acc, addOn) => acc + (selectedAddOns[addOn.id] ? addOn.price : 0),
        0
      ),
    [selectedAddOns]
  );

  const reelsExtraSubtotal = reelsExtra * MONTHLY_SOCIAL_CONFIG.reelsExtraPrice;
  const total = selectedTierConfig.basePrice + addOnsSubtotal + reelsExtraSubtotal;
  const selectedAddOnsList = useMemo(
    () =>
      MONTHLY_SOCIAL_CONFIG.addOns
        .filter((addOn) => selectedAddOns[addOn.id])
        .map((addOn) => `${addOn.name} (+${euro.format(addOn.price)})`),
    [selectedAddOns]
  );
  const proposalSummary = useMemo(() => {
    const lines = [
      `Solicitud de propuesta mensual para ${selectedTierConfig.name}.`,
      "",
      `Base seleccionada: ${selectedTierConfig.name} (${selectedTierConfig.displayPrice})`,
      "Incluye:",
      ...selectedTierConfig.includes.map((item) => `- ${item}`),
      "",
      selectedAddOnsList.length > 0
        ? `Complementos: ${selectedAddOnsList.join(", ")}`
        : "Complementos: ninguno",
      `Reels extra: ${reelsExtra} (${euro.format(reelsExtraSubtotal)})`,
      `Total mensual estimado: ${euro.format(total)} + IVA`,
      "Permanencia orientativa: 3 meses (opcional)."
    ];

    return lines.join("\n");
  }, [selectedTierConfig, selectedAddOnsList, reelsExtra, reelsExtraSubtotal, total]);
  const proposalHref = useMemo(() => {
    const params = new URLSearchParams({
      projectType: `Propuesta mensual RRSS — ${selectedTierConfig.name}`,
      projectSummary: proposalSummary,
      budget: `${euro.format(total)}/mes + IVA`
    });

    return `/contact?${params.toString()}`;
  }, [selectedTierConfig, proposalSummary, total]);

  return (
    <section id="monthly-social-packages" className="relative overflow-hidden py-16 md:py-24 scroll-mt-20">
      <Container maxWidth="xl">
        <div className="monthly-packages-smoke" aria-hidden="true" />

        <div className="relative z-10 space-y-10">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-ember">Paquetes Mensuales RRSS</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">Sistemas mensuales listos para escalar</h2>
            <p className="mx-auto max-w-3xl text-fog">Tres niveles competitivos con diferencias claras en volumen, canales y soporte estratégico.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {MONTHLY_SOCIAL_CONFIG.tiers.map((tier, index) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`transition-all duration-700 ${
                    cardsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  } h-full cursor-pointer`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedTier(tier.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedTier(tier.id);
                    }
                  }}
                >
                  <Card
                    variant={isSelected ? "gradient" : "glass"}
                    padding="sm"
                    className={`h-full ${
                      isSelected ? "ring-1 ring-ember/60 shadow-2xl shadow-ember/10" : "hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex flex-col">
                      <p className="text-xs uppercase tracking-[0.24em] text-ember">Nivel {index + 1}</p>
                      <h3 className="mt-2 text-2xl font-display font-bold text-bone">{tier.name}</h3>
                      <p className="mt-1 text-xl font-display text-ember">{tier.displayPrice}</p>
                      <p className="mt-2 text-sm text-fog">{tier.forWho}</p>

                      <ul className="mt-3 space-y-1.5 text-sm text-fog">
                        {tier.includes.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-ember">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card variant="solid" padding="lg">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display text-bone">Calculadora mensual</h3>
                  <p className="mt-2 text-sm text-fog">Selecciona base + complementos para estimar tu cuota mensual real.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {MONTHLY_SOCIAL_CONFIG.tiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        selectedTier === tier.id
                          ? "border-ember bg-ember/15"
                          : "border-white/15 bg-white/[0.03] hover:border-ember/45"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-fog">{tier.name}</p>
                      <p className="mt-1 text-bone">{euro.format(tier.basePrice)}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {MONTHLY_SOCIAL_CONFIG.addOns.map((addOn) => (
                    <label key={addOn.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:border-ember/45">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-[#f1a93a]"
                        checked={Boolean(selectedAddOns[addOn.id])}
                        onChange={(event) =>
                          setSelectedAddOns((prev) => ({ ...prev, [addOn.id]: event.target.checked }))
                        }
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-bone">{addOn.name}</span>
                        <span className="block text-xs text-fog">{addOn.description}</span>
                      </span>
                      <span className="text-sm text-ember">+{euro.format(addOn.price)}</span>
                    </label>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <label htmlFor="reels-extra" className="block text-xs uppercase tracking-[0.16em] text-fog">
                    Reels extra
                  </label>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      id="reels-extra"
                      type="number"
                      min={0}
                      max={30}
                      value={reelsExtra}
                      onChange={(event) => setReelsExtra(Math.max(0, Number(event.target.value || 0)))}
                      className="w-24 rounded-lg border border-white/15 bg-ink/70 px-3 py-2 text-bone"
                    />
                    <p className="text-sm text-fog">{euro.format(MONTHLY_SOCIAL_CONFIG.reelsExtraPrice)} por reel</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="gradient" padding="lg" className="h-fit lg:sticky lg:top-24">
              <h4 className="text-xl font-display text-bone">Resumen</h4>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-fog">
                  <span>Base {selectedTierConfig.name}</span>
                  <span>{euro.format(selectedTierConfig.basePrice)}</span>
                </div>
                <div className="flex justify-between text-fog">
                  <span>Complementos</span>
                  <span>{euro.format(addOnsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-fog">
                  <span>Reels extra ({reelsExtra})</span>
                  <span>{euro.format(reelsExtraSubtotal)}</span>
                </div>
                <div className="border-t border-white/20 pt-3 text-base font-semibold text-bone flex justify-between">
                  <span>Total mensual</span>
                  <span className="text-ember">{euro.format(total)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-fog">* Precios + IVA. Permanencia: 3 meses (opcional).</p>
              <LinkButton href={proposalHref} variant="primary" className="mt-6 w-full justify-center">
                Solicitar propuesta mensual
              </LinkButton>
            </Card>
          </div>

          <Card variant="minimal" padding="md">
            <button
              type="button"
              onClick={() => setShowCompare((prev) => !prev)}
              className="flex w-full items-center justify-between text-left"
              aria-expanded={showCompare}
              aria-controls="monthly-compare"
            >
              <span className="text-sm uppercase tracking-[0.18em] text-ember">Ver diferencias</span>
              <span className="text-bone">{showCompare ? "-" : "+"}</span>
            </button>
            {showCompare && (
              <div id="monthly-compare" className="mt-4 grid gap-3 text-sm text-fog md:grid-cols-3">
                <div>
                  <p className="text-bone font-semibold">Presencia</p>
                  <p>1 red, calendario base y consistencia de publicación.</p>
                </div>
                <div>
                  <p className="text-bone font-semibold">Crecimiento</p>
                  <p>2 redes, enfoque en reels y optimización accionable.</p>
                </div>
                <div>
                  <p className="text-bone font-semibold">Dominio</p>
                  <p>3 redes, testing de formatos y soporte operativo mensual.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </section>
  );
}
