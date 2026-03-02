import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-white/5 bg-gradient-to-b from-ink via-ink to-black mt-0">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ember font-semibold">
            Listos para empezar
          </p>
          <div className="flex flex-col items-center gap-6 md:gap-4 md:flex-row md:justify-between">
            <h2 className="text-3xl md:text-4xl font-display leading-[1.2]">
              Conecta con un productor hoy
            </h2>
          </div>
        </div>

        <div className="grid gap-12 md:gap-8 md:grid-cols-4 mb-12">
          <div className="md:col-span-1">
            <Image
              src="/brand/logo-white.png"
              alt="Black Gum Studio"
              width={180}
              height={78}
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm text-fog leading-relaxed">
              Un estudio de producción premium que crea contenido cinematográfico,
              gestiona inventario de alquileres y desarrolla soluciones creativas
              para marcas innovadoras.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold mb-4">
              Servicios
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/packs"
                  className="text-fog hover:text-bone transition-colors"
                >
                  Paquetes creativos
                </Link>
              </li>
              <li>
                <Link
                  href="/rentals"
                  className="text-fog hover:text-bone transition-colors"
                >
                  Alquiler de equipos
                </Link>
              </li>
              <li>
                <Link
                  href="/productions"
                  className="text-fog hover:text-bone transition-colors"
                >
                  Producciones
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-fog hover:text-bone transition-colors"
                >
                  Inicia un proyecto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold mb-4">
              Contenido
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-fog hover:text-bone transition-colors"
                >
                  Diario
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-fog hover:text-bone transition-colors"
                >
                  Portafolio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ember font-semibold mb-4">
              Contacto
            </p>
            <div className="space-y-3 text-sm">
              <p className="text-fog">
                <span className="block text-xs text-bone/80 mb-1">
                  Correo electrónico
                </span>
                <a
                  href="mailto:info@blackgumgroup.com"
                  className="hover:text-bone transition-colors"
                >
                  info@blackgumgroup.com
                </a>
              </p>
              <p className="text-fog">
                <span className="block text-xs text-bone/80 mb-1">
                  Madrid, España
                </span>
                <span>Remoto + Estudio</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-fog/70">
              © {currentYear} Black Gum Studio. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-xs text-fog/70">
              <a href="#" className="hover:text-bone transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-bone transition-colors">
                Términos
              </a>
              <div className="flex gap-4">
                <a href="#" className="hover:text-ember transition-colors" title="Instagram">
                  IG
                </a>
                <a href="#" className="hover:text-ember transition-colors" title="LinkedIn">
                  LI
                </a>
                <a href="#" className="hover:text-ember transition-colors" title="Vimeo">
                  VM
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
