import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPortfolioPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Portafolio</h1>
          <p className="text-fog text-sm mt-1">Gestiona los proyectos del portafolio.</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="bg-gum text-bone px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em]"
        >
          Nuevo proyecto
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="text-fog">Aún no hay proyectos.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-white/10 rounded-2xl p-4 bg-ink/70 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-display text-lg">{project.title}</p>
                <p className="text-xs text-fog mt-1">
                  /{project.slug} - {project.type}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/portfolio/${project.id}`}
                  className="text-xs uppercase tracking-[0.2em] text-bone"
                >
                  Editar
                </Link>
                <DeleteButton endpoint={`/api/admin/portfolio/${project.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

