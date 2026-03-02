import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Nuevo proyecto</h1>
        <p className="text-fog text-sm mt-1">Añade un nuevo proyecto al portafolio.</p>
      </div>
      <ProjectForm />
    </div>
  );
}

