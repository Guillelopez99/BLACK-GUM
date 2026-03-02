import { notFound } from "next/navigation";
import ServiceForm, { ServiceFormData } from "@/components/admin/ServiceForm";
import { prisma } from "@/lib/prisma";

export default async function EditServicePage({
  params
}: {
  params: { id: string };
}) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) {
    notFound();
  }

  const initialData: ServiceFormData = {
    name: service.name,
    slug: service.slug,
    description: service.description,
    priceFrom: service.priceFrom
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Editar servicio</h1>
        <p className="text-fog text-sm mt-1">Actualiza los detalles del servicio.</p>
      </div>
      <ServiceForm initialData={initialData} id={service.id} />
    </div>
  );
}
