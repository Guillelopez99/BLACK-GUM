import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PackImage from "@/components/packs/PackImage";
import { formatCurrency, truncate } from "@/lib/utils";

interface PackCardProps {
  pack: {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    description: string;
    priceFrom: number;
    imagePath?: string | null;
    deliverables: string[];
    kind?: string | null;
    isFeatured?: boolean | null;
  };
  priority?: boolean;
}

const fallbackImage = "/paquetes/default.jpg";

export default function PackCard({ pack, priority = false }: PackCardProps) {
  const imageSrc = pack.imagePath?.trim() || `/paquetes/${pack.slug}.jpg`;
  const description = truncate(pack.description, 120);
  const previewDeliverables = pack.deliverables.slice(0, 3);
  const kindBadge =
    pack.kind === "campaign"
      ? "Ideal para lanzamientos"
      : pack.kind === "monthly"
      ? "Siempre activo"
      : pack.kind === "alacarte"
      ? "Flexible"
      : null;
  const valueLine =
    pack.tagline?.trim() ||
    "Un sistema de producción premium para velocidad y consistencia.";

  return (
    <Link
      href={`/packs/${pack.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ember/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-3xl"
      aria-label={`Ver detalles del pack ${pack.name}`}
    >
      <Card
        variant="solid"
        padding="sm"
        className="h-full overflow-hidden transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-ember/20"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <PackImage
            src={imageSrc}
            fallbackSrc={fallbackImage}
            alt={`${pack.name} pack`}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
          
          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-10">
            {pack.isFeatured ? (
              <Badge variant="warning">Más popular</Badge>
            ) : null}
            {kindBadge ? <Badge variant="secondary">{kindBadge}</Badge> : null}
          </div>

          {/* CTA overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-ink shadow-lg">
              Ver Pack
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-bone group-hover:text-ember transition-colors duration-300">
              {pack.name}
            </h3>
            <p className="text-sm text-ember font-semibold mt-2 line-clamp-2">{valueLine}</p>
          </div>

          <p className="text-fog text-sm leading-relaxed">{description}</p>

          {/* Quick preview deliverables - more visual */}
          {previewDeliverables.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-fog/70">
                Incluye
              </p>
              <ul className="grid grid-cols-1 gap-2">
                {previewDeliverables.map((item, index) => (
                  <li 
                    key={`${pack.slug}-${index}`} 
                    className="flex items-start gap-2 text-xs text-fog/90 group/item"
                  >
                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-ember/60 group-hover/item:bg-ember transition-colors" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-end justify-between pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-fog/70 uppercase tracking-[0.1em]">
                Desde
              </p>
              <p className="text-2xl font-display font-bold text-ember mt-1 group-hover:text-bone transition-colors">
                {formatCurrency(pack.priceFrom)}
              </p>
            </div>
            <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ember/60 px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.25em] text-ember group-hover:border-ember group-hover:bg-ember/10 transition-all duration-300">
              <span>Detalles</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
