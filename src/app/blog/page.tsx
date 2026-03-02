import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Diario del Estudio | Perspectivas Creativas",
  description:
    "Notas, aprendizajes y análisis desde el estudio de Black Gum y su proceso creativo."
};

export const revalidate = 60;

export default async function BlogPage() {
  const now = new Date();
  const posts = await prisma.post.findMany({
    where: { publishedAt: { not: null, lte: now } },
    orderBy: { publishedAt: "desc" }
  });

  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="primary">Diario del estudio</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight text-bone">
              Perspectivas creativas y
              <span className="text-ember"> notas de producción</span>
            </h1>
            <p className="text-lg text-fog max-w-3xl mx-auto leading-relaxed">
              Análisis, aprendizajes y miradas detrás de cámaras sobre producción y colaboraciones creativas.
            </p>
          </div>
        </Container>
      </Section>

      <Section spacing="lg" variant="dark">
        <Container maxWidth="lg">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-fog mb-6">
                Aún no hay artículos publicados. Vuelve pronto para ver nuevas notas del estudio.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, idx) => {
                const publishedDate = post.publishedAt
                  ? new Intl.DateTimeFormat("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }).format(new Date(post.publishedAt))
                  : "Borrador";

                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <Card variant="solid" padding="lg" className="h-full group-hover:shadow-xl">
                      <div className="grid gap-6 md:grid-cols-[1fr_150px] items-start md:items-center">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="primary">{publishedDate}</Badge>
                          </div>
                          <h3 className="font-display text-2xl font-bold text-bone group-hover:text-ember transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-fog text-sm leading-relaxed">
                            {truncate(post.excerpt, 150)}
                          </p>
                        </div>

                        {idx === 0 && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src="/images/blog/blog-hero.png"
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {idx > 0 && (
                          <div className="text-right md:text-left">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ember/20 text-ember font-bold group-hover:bg-ember/40 transition-colors">
                              →
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
