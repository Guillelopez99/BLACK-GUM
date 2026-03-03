import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { formatCurrency, truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Servicios de Producción | Black Gum",
  description:
    "Servicios de producción de extremo a extremo: estrategia, rodaje y postproducción para marcas y creadores."
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="primary">Servicios profesionales</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight text-bone">
              Servicios de producción
              <span className="text-ember"> de extremo a extremo</span>
            </h1>
            <p className="text-lg text-fog max-w-3xl mx-auto leading-relaxed">
              Estrategia, producción y postproducción para marcas y creadores ambiciosos. De concepto a entrega.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" variant="dark">
        <Container maxWidth="xl">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-fog mb-6">
                Aún no hay servicios publicados. Escríbenos y te ayudamos a definir el alcance.
              </p>
              <LinkButton href="/contact" variant="primary">
                Consultar servicios
              </LinkButton>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`} className="group">
                  <Card variant="solid" padding="lg" className="h-full group-hover:shadow-2xl">
                    <div className="space-y-4">
                      <h3 className="font-display text-2xl font-bold text-bone group-hover:text-ember transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-fog text-sm leading-relaxed">
                        {truncate(service.description, 110)}
                      </p>
                      <div className="flex items-end justify-between pt-6 border-t border-white/10">
                        <div>
                          <p className="text-xs text-fog/70 uppercase tracking-[0.1em]">
                            Desde
                          </p>
                          <p className="text-2xl font-display font-bold text-bone mt-1">
                            {formatCurrency(service.priceFrom)}
                          </p>
                        </div>
                        <span className="text-ember text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">
                ¿Necesitas un servicio a medida?
              </h2>
              <p className="text-lg text-fog max-w-2xl mx-auto leading-relaxed">
                Adaptamos cada propuesta a tus necesidades creativas, operativas y de calendario.
              </p>
            </div>
            <LinkButton href="/contact" variant="primary" size="lg">
              Solicitar servicio personalizado
            </LinkButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}
