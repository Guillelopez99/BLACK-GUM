import PackForm from "@/components/admin/PackForm";

export default function NewPackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Nuevo pack</h1>
        <p className="text-fog text-sm mt-1">Crea un nuevo pack creativo.</p>
      </div>
      <PackForm />
    </div>
  );
}

