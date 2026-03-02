import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Portafolio | Proyectos de Black Gum",
  description: "Una selección curada de videoclips, contenido social y campañas cinematográficas de Black Gum Studio."
};

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="primary">Nuestro trabajo</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight text-bone">
              Proyectos cinematográficos
              <span className="text-ember"> y campañas</span>
            </h1>
            <p className="text-lg text-fog max-w-3xl mx-auto leading-relaxed">
              Una curaduría de videoclips, campañas de marca y contenido social desarrollado por Black Gum.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" variant="dark">
        <Container maxWidth="xl">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-fog mb-6">
                Aún no hay proyectos publicados. Vuelve pronto para ver nuevos lanzamientos.
              </p>
              <LinkButton href="/contact" variant="primary">
                Consultar servicios
              </LinkButton>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, idx) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`} className="group">
                  <Card variant="glass" padding="lg" className="h-full group-hover:bg-white/15">
                    <div className="space-y-4">
                      {idx === 0 && (
                        <div className="relative rounded-lg overflow-hidden h-40 mb-4 border border-white/10">
                          <Image
                            src="/images/portfolio/portfolio-hero.png"
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <Badge variant="success">{project.type}</Badge>
                      <h3 className="font-display text-3xl font-bold text-bone group-hover:text-ember transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-fog text-sm leading-relaxed">
                        {project.summary}
                      </p>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-fog/70 uppercase tracking-[0.1em]">
                          Ver proyecto
                        </span>
                        <span className="text-ember text-lg opacity-0 group-hover:opacity-100 transition-opacity">
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
                ¿Te interesa colaborar?
              </h2>
              <p className="text-lg text-fog max-w-2xl mx-auto leading-relaxed">
                Trabajamos con marcas, artistas y agencias para llevar ideas a piezas cinematográficas.
              </p>
            </div>
            <LinkButton href="/contact" variant="primary" size="lg">
              Iniciar un proyecto
            </LinkButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}
