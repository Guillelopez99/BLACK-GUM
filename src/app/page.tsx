import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Estudio Premium de Producción Creativa | Black Gum",
  description:
    "Black Gum es un estudio premium de producción en Madrid que crea campañas cinematográficas, gestiona alquiler de equipos y desarrolla soluciones creativas de alto impacto.",
  openGraph: {
    title: "Black Gum Studio | Producción y Servicios Creativos",
    description:
      "Estudio premium de producción para campañas cinematográficas y alquiler de equipos en Madrid.",
    type: "website"
  }
};

export const dynamic = "force-dynamic";

async function getLatestProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 3
    });
  } catch (error) {
    console.error("[home] Failed to load latest projects", {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return [];
  }
}

export default async function HomePage() {
  const latestProjects = await getLatestProjects();

  return (
    <div className="w-full home-main">
      {/* Hero Section */}
      <Section spacing="lg" className="relative overflow-hidden home-hero-surface">
        <Container maxWidth="xl">
          <div className="grid gap-12 md:gap-16 md:grid-cols-[1.3fr_0.7fr] items-center">
            {/* Hero Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="primary">Estudio Premium</Badge>
                <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] text-bone">
                  Producción cinematográfica para
                  <span className="text-ember"> marcas ambiciosas</span>
                </h1>
              </div>
              <p className="text-lg md:text-xl text-fog leading-relaxed max-w-xl">
                Producción, postproducción y automatización con IA para equipos de
                marketing, agencias y artistas que necesitan piezas memorables en
                tiempos reales.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <LinkButton href="/contact" variant="primary" size="lg">
                  Inicia un Proyecto
                </LinkButton>
                <LinkButton href="/packs?section=monthly" variant="secondary" size="lg">
                  Ver Paquetes Mensuales
                </LinkButton>
              </div>
            </div>

            {/* Hero Feature Card */}
            <Card variant="glass" padding="lg" className="backdrop-blur-xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-bone mb-2">
                    Qué Entregamos
                  </h3>
                  <p className="text-sm text-fog">
                    Soluciones creativas de principio a fin personalizadas para tu visión.
                  </p>
                </div>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm">
                    <span className="text-ember font-bold">•</span>
                    <span className="text-fog">
                      <strong className="text-bone">Producción:</strong> Campañas cinematográficas para marcas y artistas
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-ember font-bold">•</span>
                    <span className="text-fog">
                      <strong className="text-bone">Postproducción:</strong> Edición, color, sonido y diseño en movimiento
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-ember font-bold">•</span>
                    <span className="text-fog">
                      <strong className="text-bone">IA aplicada:</strong> Automatización de flujos y versiones
                      a escala
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <span className="text-ember font-bold">•</span>
                    <span className="text-fog">
                      <strong className="text-bone">Packs:</strong> Sistemas modulares para producción recurrente
                    </span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Three Pillars Section */}
      <Section spacing="lg" variant="gradient" className="py-16 md:py-24">
        <Container maxWidth="xl">
          <div className="mb-12">
            <SectionTitle
              title="El Enfoque Black Gum"
              subtitle="Tres pilares que definen cómo trabajamos con socios creativos."
              center={true}
            />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "/images/icons/script.png",
                title: "Guión",
                description:
                  "Dirección creativa estratégica alineada con la voz de tu marca, audiencia y objetivos ambiciosos."
              },
              {
                icon: "/images/icons/shoot.png",
                title: "Producción",
                description:
                  "Equipos profesionales equipados con equipos premium, entregando imágenes cinematográficas con precisión técnica."
              },
              {
                icon: "/images/icons/edit.png",
                title: "Edición",
                description:
                  "Postproducción experta elaborando la narrativa final: color, diseño de sonido, movimiento, narrativa."
              }
            ].map((pillar) => (
              <Card key={pillar.title} variant="solid" padding="lg" className="ring-1 ring-ember/30">
                <div className="space-y-4 text-center">
                  <div className="relative w-16 h-16 mx-auto">
                    <Image
                      src={pillar.icon}
                      alt={pillar.title}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-bone">
                    {pillar.title}
                  </h3>
                  <p className="text-fog text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* MODIFICADO: Process Section */}
      <Section spacing="md" variant="dark" className="home-process-surface">
        <Container maxWidth="xl">
          <div className="mb-12">
            <SectionTitle
              title="Cómo trabajamos"
              subtitle="Un proceso claro para avanzar rápido sin perder calidad."
              center={true}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Briefing",
                description: "Definimos objetivos, audiencias y referencias visuales."
              },
              {
                title: "Planificación",
                description: "Calendario, equipo y entregables cerrados en 48h."
              },
              {
                title: "Rodaje",
                description: "Producción con equipo senior y set optimizado."
              },
              {
                title: "Postproducción",
                description: "Edición, color y versiones finales listas para publicar."
              }
            ].map((step, index) => (
              <Card key={step.title} variant="glass" padding="lg">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-ember">
                    0{index + 1}
                  </p>
                  <h3 className="text-2xl font-display font-bold text-bone">
                    {step.title}
                  </h3>
                  <p className="text-fog text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Packs Section */}
      <Section spacing="lg" variant="gradient" className="home-packs-surface">
        <Container maxWidth="xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <SectionTitle
                title="Paquetes Creativos"
                subtitle="Sistemas de producción predefinidos diseñados para semanas de lanzamiento, sprints e historias siempre activas."
              />
            </div>
            <LinkButton href="/packs?section=monthly" variant="secondary">
              Ver Paquetes RRSS
            </LinkButton>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                id: "presencia",
                name: "PRESENCIA",
                price: "Desde 299€/mes",
                summary: "1 red principal y flujo constante de piezas mensuales.",
                points: ["8 piezas/mes", "Calendario + copies", "1 ronda de cambios"]
              },
              {
                id: "crecimiento",
                name: "CRECIMIENTO",
                price: "549€/mes",
                summary: "Para acelerar alcance con foco en vídeo corto.",
                points: ["Hasta 2 redes", "12-14 piezas/mes", "Optimización accionable"]
              },
              {
                id: "dominio",
                name: "DOMINIO",
                price: "899€/mes",
                summary: "Operación multi-canal para marcas con volumen.",
                points: ["Hasta 3 redes", "16-20 piezas/mes", "Testing de formatos"]
              }
            ].map((tier) => (
              <Link
                key={tier.id}
                href="/packs?section=monthly#monthly-social-packages"
                className="group"
              >
                <Card
                  variant="solid"
                  padding="lg"
                  className="h-full ring-1 ring-ember/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl"
                >
                  <div className="space-y-4">
                    <div>
                      <Badge variant="primary">Paquete RRSS</Badge>
                      <h3 className="text-2xl font-display font-bold text-bone mt-3">
                        {tier.name}
                      </h3>
                      <p className="text-sm text-ember font-semibold mt-2">{tier.price}</p>
                    </div>
                    <p className="text-fog text-sm leading-relaxed">{tier.summary}</p>
                    <ul className="space-y-1 text-sm text-fog">
                      {tier.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="text-ember">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-end pt-4 border-t border-white/10">
                      <span
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-ink/70 text-bone/90 shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-ember/55 group-hover:text-ember group-hover:shadow-[0_14px_30px_rgba(0,0,0,0.55),0_0_22px_rgba(241,169,58,0.16)]"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Recent Productions */}
      {latestProjects.length > 0 && (
        <Section spacing="lg" variant="dark" className="home-productions-surface">
          <Container maxWidth="xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <div>
                <SectionTitle
                  title="Producciones Recientes"
                  subtitle="Una selección curada de proyectos que hemos creado para marcas, artistas y estudios."
                />
              </div>
              <LinkButton href="/productions" variant="secondary">
                Portafolio Completo
              </LinkButton>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {latestProjects.map((project) => (
                <Link key={project.id} href={`/productions/${project.slug}`} className="group">
                  <Card variant="glass" padding="lg" className="h-full group-hover:bg-white/20">
                    <div className="space-y-4">
                      <Badge variant="success">{project.type}</Badge>
                      <h3 className="font-display text-2xl font-bold text-bone">
                        {project.title}
                      </h3>
                      <p className="text-fog text-sm leading-relaxed">
                        {project.summary}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA Section */}
      <Section spacing="lg" variant="dark" className="py-20 md:py-32 relative home-cta-surface">
        <Container maxWidth="lg">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-bone">
                ¿Listo para crear algo audaz?
              </h2>
              <p className="text-lg text-fog max-w-2xl mx-auto leading-relaxed">
                Hablemos sobre tu visión. Comparte tu cronograma, presupuesto y objetivos creativos, y responderemos dentro de dos días hábiles.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <LinkButton href="/contact" variant="primary" size="lg">
                Inicia un Proyecto
              </LinkButton>
              <a
                href="mailto:hello@blackgum.studio"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-medium uppercase tracking-[0.2em] border border-bone/40 text-bone hover:border-bone/70 hover:text-bone/90 transition-all"
              >
                Envíanos un Correo
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
