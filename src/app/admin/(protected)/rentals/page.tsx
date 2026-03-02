import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminRentalsPage() {
  const rentals = await prisma.rentalItem.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Alquileres</h1>
          <p className="text-fog text-sm mt-1">Gestiona el inventario de alquiler.</p>
        </div>
        <Link
          href="/admin/rentals/new"
          className="bg-gum text-bone px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em]"
        >
          Nuevo alquiler
        </Link>
      </div>
      {rentals.length === 0 ? (
        <p className="text-fog">Aún no hay alquileres.</p>
      ) : (
        <div className="space-y-3">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="border border-white/10 rounded-2xl p-4 bg-ink/70 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-display text-lg">{rental.name}</p>
                <p className="text-xs text-fog mt-1">
                  /{rental.slug} - {rental.category}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/rentals/${rental.id}`}
                  className="text-xs uppercase tracking-[0.2em] text-bone"
                >
                  Editar
                </Link>
                <DeleteButton endpoint={`/api/admin/rentals/${rental.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

