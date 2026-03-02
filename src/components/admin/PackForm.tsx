"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type PackFormData = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  deliverables: string[];
  priceFrom: number;
  isFeatured: boolean;
  kind?: string | null;
  imagePath?: string | null;
};

export default function PackForm({
  initialData,
  id
}: {
  initialData?: PackFormData;
  id?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [tagline, setTagline] = useState(initialData?.tagline ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [priceFrom, setPriceFrom] = useState(
    initialData?.priceFrom?.toString() ?? ""
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured ?? false
  );
  const [kind, setKind] = useState(initialData?.kind ?? "");
  const [imagePath, setImagePath] = useState(initialData?.imagePath ?? "");
  const [imagePathTouched, setImagePathTouched] = useState(
    Boolean(initialData?.imagePath)
  );
  const [deliverables, setDeliverables] = useState<string[]>(
    initialData?.deliverables ?? []
  );
  const [deliverableInput, setDeliverableInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imagePathTouched && !imagePath.trim() && slug.trim()) {
      setImagePath(`/paquetes/${slug.trim()}.jpg`);
    }
  }, [imagePath, imagePathTouched, slug]);

  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextSlug = event.target.value;
    setSlug(nextSlug);

    if (!imagePathTouched) {
      const trimmed = nextSlug.trim();
      setImagePath(trimmed ? `/paquetes/${trimmed}.jpg` : "");
    }
  };

  const handleImagePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImagePath(event.target.value);
    setImagePathTouched(true);
  };

  const handleAddDeliverable = () => {
    const value = deliverableInput.trim();
    if (!value) return;
    setDeliverables((prev) => [...prev, value]);
    setDeliverableInput("");
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      slug,
      tagline,
      description,
      deliverables,
      priceFrom: priceFrom ? Number(priceFrom) : 0,
      isFeatured,
      kind: kind || null,
      imagePath: imagePath.trim() || null
    };

    const response = await fetch(id ? `/api/admin/packs/${id}` : "/api/admin/packs", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Error al guardar" }));
      setError(data.error || "Error al guardar");
      return;
    }

    router.push("/admin/packs");
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
            onChange={handleSlugChange}
            required
          />
        </label>
      </div>
      <label className="block text-sm text-fog">
        Subtítulo
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm text-fog">
        Descripción
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3 min-h-[140px]"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-fog">
          Tipo
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            value={kind}
            onChange={(event) => setKind(event.target.value)}
          >
            <option value="">Sin clasificar</option>
            <option value="campaign">campaign — Paquetes de campaña</option>
            <option value="monthly">monthly — Packs mensuales de redes</option>
            <option value="alacarte">alacarte — Servicios sueltos</option>
          </select>
        </label>
        <label className="block text-sm text-fog">
          Ruta de imagen
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            value={imagePath}
            onChange={handleImagePathChange}
            placeholder="/paquetes/<slug>.jpg"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
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
        <label className="flex items-center gap-3 text-sm text-fog mt-6">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
            className="h-4 w-4"
          />
          Pack destacado
        </label>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-fog">Entregables</p>
        <div className="flex flex-wrap gap-2">
          {deliverables.map((item, index) => (
            <button
              type="button"
              key={`${item}-${index}`}
              onClick={() => handleRemoveDeliverable(index)}
              className="text-xs uppercase tracking-[0.2em] border border-ember/50 text-ember px-3 py-1 rounded-full"
            >
              {item} x
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="flex-1 rounded-xl border border-white/10 bg-bone px-4 py-3"
            value={deliverableInput}
            onChange={(event) => setDeliverableInput(event.target.value)}
            placeholder="Añadir entregable"
          />
          <button
            type="button"
            onClick={handleAddDeliverable}
            className="border border-white/20 px-4 py-3 rounded-full text-xs uppercase tracking-[0.2em] text-bone"
          >
            Añadir
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <button
        type="submit"
        className="bg-gum text-bone px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em]"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar pack"}
      </button>
    </form>
  );
}
