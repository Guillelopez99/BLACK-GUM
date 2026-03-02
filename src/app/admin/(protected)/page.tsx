import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [packCount, serviceCount, rentalCount, projectCount, postCount] =
    await Promise.all([
      prisma.pack.count(),
      prisma.service.count(),
      prisma.rentalItem.count(),
      prisma.project.count(),
      prisma.post.count()
    ]);

  const cards = [
    { label: "Packs", href: "/admin/packs", count: packCount },
    { label: "Servicios", href: "/admin/services", count: serviceCount },
    { label: "Alquileres", href: "/admin/rentals", count: rentalCount },
    { label: "Portafolio", href: "/admin/portfolio", count: projectCount },
    { label: "Blog", href: "/admin/blog", count: postCount }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display">Panel</h1>
        <p className="text-fog text-sm mt-2">
          Gestiona el contenido público del sitio de Black Gum.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-white/10 rounded-3xl p-6 bg-ink/70 hover:border-ember/60 transition"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-ember">
              {card.label}
            </p>
            <p className="text-3xl font-display mt-4">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

