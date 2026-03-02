"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ServiceFormData = {
  name: string;
  slug: string;
  description: string;
  priceFrom: number;
};

export default function ServiceForm({
  initialData,
  id
}: {
  initialData?: ServiceFormData;
  id?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [priceFrom, setPriceFrom] = useState(
    initialData?.priceFrom?.toString() ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      slug,
      description,
      priceFrom: priceFrom ? Number(priceFrom) : 0
    };

    const response = await fetch(
      id ? `/api/admin/services/${id}` : "/api/admin/services",
      {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Error al guardar" }));
      setError(data.error || "Error al guardar");
      return;
    }

    router.push("/admin/services");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-fog">
          Nombre
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm text-fog">
          Slug
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          />
        </label>
      </div>
      <label className="block text-sm text-fog">
        Descripción
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3 min-h-[140px]"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm text-fog">
        Precio desde
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
          type="number"
          min="0"
          value={priceFrom}
          onChange={(event) => setPriceFrom(event.target.value)}
          required
        />
      </label>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <button
        type="submit"
        className="bg-gum text-bone px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em]"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar servicio"}
      </button>
    </form>
  );
}
