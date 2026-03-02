import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPacksPage() {
  const packs = await prisma.pack.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Packs</h1>
          <p className="text-fog text-sm mt-1">Gestiona los packs creativos.</p>
        </div>
        <Link
          href="/admin/packs/new"
          className="bg-gum text-bone px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em]"
        >
          Nuevo pack
        </Link>
      </div>
      {packs.length === 0 ? (
        <p className="text-fog">Aún no hay packs.</p>
      ) : (
        <div className="space-y-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="border border-white/10 rounded-2xl p-4 bg-ink/70 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-display text-lg">{pack.name}</p>
                <p className="text-xs text-fog mt-1">/{pack.slug}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/packs/${pack.id}`}
                  className="text-xs uppercase tracking-[0.2em] text-bone"
                >
                  Editar
                </Link>
                <DeleteButton endpoint={`/api/admin/packs/${pack.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

