import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Servicios</h1>
          <p className="text-fog text-sm mt-1">Gestiona la oferta de servicios.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="bg-gum text-bone px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em]"
        >
          Nuevo servicio
        </Link>
      </div>
      {services.length === 0 ? (
        <p className="text-fog">Aún no hay servicios.</p>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="border border-white/10 rounded-2xl p-4 bg-ink/70 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-display text-lg">{service.name}</p>
                <p className="text-xs text-fog mt-1">/{service.slug}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/services/${service.id}`}
                  className="text-xs uppercase tracking-[0.2em] text-bone"
                >
                  Editar
                </Link>
                <DeleteButton endpoint={`/api/admin/services/${service.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

