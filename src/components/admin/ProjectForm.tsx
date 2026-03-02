"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type ProjectFormData = {
  title: string;
  slug: string;
  type: string;
  summary: string;
  body: string;
  videoUrl: string | null;
};

const types = ["social", "videoclip", "shortfilm", "film", "corporate"];

export default function ProjectForm({
  initialData,
  id
}: {
  initialData?: ProjectFormData;
  id?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [type, setType] = useState(initialData?.type ?? "social");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      title,
      slug,
      type,
      summary,
      body,
      videoUrl: videoUrl || null
    };

    const response = await fetch(
      id ? `/api/admin/portfolio/${id}` : "/api/admin/portfolio",
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

    router.push("/admin/portfolio");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-fog">
          Título
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
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
        Tipo
        <select
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          {types.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-fog">
        Resumen
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3 min-h-[100px]"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm text-fog">
        Contenido
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3 min-h-[160px]"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm text-fog">
        URL de video (opcional)
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
          placeholder="https://player.vimeo.com/video/..."
        />
      </label>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <button
        type="submit"
        className="bg-gum text-bone px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em]"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar proyecto"}
      </button>
    </form>
  );
}
