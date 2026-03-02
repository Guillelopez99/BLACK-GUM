import { notFound } from "next/navigation";
import RentalForm, { RentalFormData } from "@/components/admin/RentalForm";
import { prisma } from "@/lib/prisma";

export default async function EditRentalPage({
  params
}: {
  params: { id: string };
}) {
  const rental = await prisma.rentalItem.findUnique({
    where: { id: params.id }
  });
  if (!rental) {
    notFound();
  }

  const initialData: RentalFormData = {
    name: rental.name,
    slug: rental.slug,
    category: rental.category,
    pricePerDay: rental.pricePerDay,
    weekendPrice: rental.weekendPrice,
    deposit: rental.deposit,
    stock: rental.stock,
    isActive: rental.isActive,
    specs: rental.specs
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Editar alquiler</h1>
        <p className="text-fog text-sm mt-1">Actualiza los detalles del alquiler.</p>
      </div>
      <RentalForm initialData={initialData} id={rental.id} />
    </div>
  );
}
