import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import PremiumRentalCards from "@/components/rentals/PremiumRentalCards";

export const metadata: Metadata = {
  title: "Alquiler de Equipos | Equipo Profesional",
  description:
    "Alquileres premium de cámaras, lentes, audio, iluminación y accesorios para producciones profesionales."
};

export default async function RentalsPage() {
  return (
    <div className="w-full">
      <Section spacing="lg">
        <Container maxWidth="lg">
          <div className="text-center space-y-6 mb-12">
            <Badge variant="primary">Alquileres de Equipos</Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight text-bone">
              Equipo Profesional
              <span className="text-ember"> para Producciones</span>
            </h1>
            <p className="text-lg text-fog max-w-3xl mx-auto leading-relaxed">
              Equipos premium listos para rodar con configuración de monitorado y wireless.
            </p>
          </div>
        </Container>
      </Section>

      <Section
        spacing="lg"
        id="rentals-grid"
        variant="gradient_warm"
        className="home-rentals-surface"
      >
        <Container maxWidth="xl">
          <PremiumRentalCards />
        </Container>
      </Section>

      <Section spacing="lg" variant="dark">
        <Container maxWidth="lg">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">
                ¿No encuentras lo que necesitas?
              </h2>
              <p className="text-lg text-fog max-w-2xl mx-auto">
                Escríbenos con tu configuración ideal y te preparamos una propuesta de alquiler a medida.
              </p>
            </div>
            <LinkButton href="/contact" variant="primary" size="lg">
              Solicitar Alquiler Personalizado
            </LinkButton>
          </div>
        </Container>
      </Section>
    </div>
  );
}
