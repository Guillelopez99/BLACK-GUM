import RentalForm from "@/components/admin/RentalForm";

export default function NewRentalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Nuevo alquiler</h1>
        <p className="text-fog text-sm mt-1">Crea un nuevo elemento de alquiler.</p>
      </div>
      <RentalForm />
    </div>
  );
}

