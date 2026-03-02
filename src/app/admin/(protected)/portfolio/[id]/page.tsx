import { notFound } from "next/navigation";
import ProjectForm, { ProjectFormData } from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";

export default async function EditProjectPage({
  params
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id }
  });
  if (!project) {
    notFound();
  }

  const initialData: ProjectFormData = {
    title: project.title,
    slug: project.slug,
    type: project.type,
    summary: project.summary,
    body: project.body,
    videoUrl: project.videoUrl
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Editar proyecto</h1>
        <p className="text-fog text-sm mt-1">Actualiza los detalles del proyecto.</p>
      </div>
      <ProjectForm initialData={initialData} id={project.id} />
    </div>
  );
}
