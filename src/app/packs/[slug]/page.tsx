import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import PackImage from "@/components/packs/PackImage";
import { prisma } from "@/lib/prisma";
import { formatCurrency, truncate } from "@/lib/utils";
import { parseDeliverables } from "@/lib/validation";

export const dynamic = "force-dynamic";

const fallbackImage = "/paquetes/default.jpg";

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pack = await prisma.pack.findUnique({ where: { slug: params.slug } });
  if (!pack) {
    return {
      title: "Paquete no encontrado",
      description: "Este paquete no pudo ser encontrado."
    };
  }

  const tagline = pack.tagline?.trim();
  const description = tagline || truncate(pack.description, 155);
  const imagePath = pack.imagePath?.trim() || `/paquetes/${pack.slug}.jpg`;

  return {
    title: `${pack.name} | Black Gum`,
    description,
    openGraph: {
      title: `${pack.name} | Black Gum`,
      description,
      images: [imagePath, fallbackImage]
    }
  };
}

export default async function PackDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const pack = await prisma.pack.findUnique({ where: { slug: params.slug } });
  if (!pack) {
    notFound();
  }

  const deliverables = parseDeliverables(pack.deliverables);
  const imagePath = pack.imagePath?.trim() || `/paquetes/${pack.slug}.jpg`;
  const kindLabel = formatKindLabel(pack.kind);
  const description = pack.tagline?.trim() || truncate(pack.description, 155);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pack.name,
    description,
    image: [imagePath, fallbackImage],
    offers: {
      "@type": "Offer",
      price: pack.priceFrom,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-ember">
                {kindLabel}
              </p>
              <h1 className="text-4xl md:text-5xl font-display">{pack.name}</h1>
              <p className="text-ember text-lg">{pack.tagline}</p>
              <p className="text-fog text-lg max-w-2xl">{pack.description}</p>
              <div className="flex flex-wrap gap-4">
                <LinkButton href="/contact" variant="primary" size="lg">
                  Reservar una llamada
                </LinkButton>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled
                  className="cursor-not-allowed"
                >
                  Obtén este paquete
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10">
              <PackImage
                src={imagePath}
                fallbackSrc={fallbackImage}
                alt={`${pack.name} pack`}
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink/80 via-transparent to-ink/20" />
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" variant="dark">
        <Container maxWidth="xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Card variant="solid" padding="lg">
              <h2 className="font-display text-2xl">Entregables</h2>
              {deliverables.length === 0 ? (
                <p className="text-fog mt-4">
                  Los entregables se definirán durante la incorporación.
                </p>
              ) : (
                <ul className="mt-6 space-y-3 text-fog">
                  {deliverables.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-3">
                      <span className="text-ember">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card variant="gradient" padding="lg">
              <p className="text-sm uppercase tracking-[0.2em] text-ember">
                Desde
              </p>
              <p className="text-3xl font-display mt-3">
                {formatCurrency(pack.priceFrom)}
              </p>
              <p className="text-fog text-sm mt-4">
                ¿Necesitas un alcance personalizado? Adaptamos paquetes para cada cadencia de producción.
              </p>
              <LinkButton href="/contact" variant="primary" className="mt-6">
                Solicitar presupuesto
              </LinkButton>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-ember">
                FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-display">
                Questions before we start
              </h2>
              <p className="text-fog max-w-2xl mx-auto">
                Here's how we keep packs predictable, fast, and aligned with your
                brand.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card variant="minimal" padding="md">
                <h3 className="font-display text-lg">How fast can we start?</h3>
                <p className="text-fog text-sm mt-3">
                  We typically onboard within 1-2 weeks once scope and timing are
                  confirmed.
                </p>
              </Card>
              <Card variant="minimal" padding="md">
                <h3 className="font-display text-lg">Can we customize a pack?</h3>
                <p className="text-fog text-sm mt-3">
                  Absolutely. Each pack is a baseline that we tailor to your
                  production needs.
                </p>
              </Card>
              <Card variant="minimal" padding="md">
                <h3 className="font-display text-lg">What if I need more?</h3>
                <p className="text-fog text-sm mt-3">
                  We can scale up with add-ons, extra shoot days, or bespoke
                  deliverables.
                </p>
              </Card>
            </div>
            <div className="text-center">
              <Link href="/packs" className="text-sm uppercase tracking-[0.2em] text-ember">
                &larr; Back to packs
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

function formatKindLabel(value: string | null | undefined) {
  const normalized =
    value === "campaign" || value === "monthly" || value === "alacarte"
      ? value
      : "monthly";

  if (normalized === "campaign") return "Campaign Pack";
  if (normalized === "alacarte") return "A la carte";
  return "Monthly Social Pack";
}
