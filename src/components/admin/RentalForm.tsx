"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type RentalFormData = {
  name: string;
  slug: string;
  category: string;
  pricePerDay: number;
  weekendPrice: number | null;
  deposit: number;
  stock: number;
  isActive: boolean;
  specs: string;
};

const categories = ["camera", "lens", "audio", "lighting", "grip", "other"];
const categoryLabels: Record<string, string> = {
  camera: "Cámara",
  lens: "Lente",
  audio: "Audio",
  lighting: "Iluminación",
  grip: "Soportes",
  other: "Otro"
};

export default function RentalForm({
  initialData,
  id
}: {
  initialData?: RentalFormData;
  id?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "camera");
  const [pricePerDay, setPricePerDay] = useState(
    initialData?.pricePerDay?.toString() ?? ""
  );
  const [weekendPrice, setWeekendPrice] = useState(
    initialData?.weekendPrice?.toString() ?? ""
  );
  const [deposit, setDeposit] = useState(
    initialData?.deposit?.toString() ?? ""
  );
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? ""
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [specs, setSpecs] = useState(initialData?.specs ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      slug,
      category,
      pricePerDay: pricePerDay ? Number(pricePerDay) : 0,
      weekendPrice: weekendPrice === "" ? null : Number(weekendPrice),
      deposit: deposit ? Number(deposit) : 0,
      stock: stock ? Number(stock) : 0,
      isActive,
      specs
    };

    const response = await fetch(
      id ? `/api/admin/rentals/${id}` : "/api/admin/rentals",
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

    router.push("/admin/rentals");
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
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-fog">
          Categoría
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat] ?? cat}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm text-fog mt-6">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4"
          />
          Publicado
        </label>
      </div>
      <label className="block text-sm text-fog">
        Especificaciones
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3 min-h-[120px]"
          value={specs}
          onChange={(event) => setSpecs(event.target.value)}
          required
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-fog">
          Precio por día
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            type="number"
            min="0"
            value={pricePerDay}
            onChange={(event) => setPricePerDay(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm text-fog">
          Precio fin de semana (opcional)
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            type="number"
            min="0"
            value={weekendPrice}
            onChange={(event) => setWeekendPrice(event.target.value)}
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-fog">
          Depósito
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            type="number"
            min="0"
            value={deposit}
            onChange={(event) => setDeposit(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm text-fog">
          Stock
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            required
          />
        </label>
      </div>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <button
        type="submit"
        className="bg-gum text-bone px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em]"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar alquiler"}
      </button>
    </form>
  );
}
