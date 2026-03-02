import { notFound } from "next/navigation";
import PackForm, { PackFormData } from "@/components/admin/PackForm";
import { prisma } from "@/lib/prisma";
import { parseDeliverables } from "@/lib/validation";

export default async function EditPackPage({
  params
}: {
  params: { id: string };
}) {
  const pack = await prisma.pack.findUnique({ where: { id: params.id } });
  if (!pack) {
    notFound();
  }

  const deliverables = parseDeliverables(pack.deliverables);

  const initialData: PackFormData = {
    name: pack.name,
    slug: pack.slug,
    tagline: pack.tagline,
    description: pack.description,
    deliverables,
    kind: pack.kind,
    imagePath: pack.imagePath,
    priceFrom: pack.priceFrom,
    isFeatured: pack.isFeatured
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Editar pack</h1>
        <p className="text-fog text-sm mt-1">Actualiza los detalles del pack.</p>
      </div>
      <PackForm initialData={initialData} id={pack.id} />
    </div>
  );
}


