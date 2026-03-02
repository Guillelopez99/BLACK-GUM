import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Nuevo servicio</h1>
        <p className="text-fog text-sm mt-1">Crea un nuevo servicio.</p>
      </div>
      <ServiceForm />
    </div>
  );
}

