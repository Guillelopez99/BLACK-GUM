"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type PostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  publishedAt: string | null;
};

export default function PostForm({
  initialData,
  id
}: {
  initialData?: PostFormData;
  id?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      title,
      slug,
      excerpt,
      body,
      publishedAt: publishedAt || null
    };

    const response = await fetch(id ? `/api/admin/blog/${id}` : "/api/admin/blog", {
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

    router.push("/admin/blog");
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
        Extracto
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3 min-h-[100px]"
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm text-fog">
        Contenido
        <textarea
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3 min-h-[180px]"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm text-fog">
        Publicado el (opcional)
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-bone px-4 py-3"
          type="datetime-local"
          value={publishedAt}
          onChange={(event) => setPublishedAt(event.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <button
        type="submit"
        className="bg-gum text-bone px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em]"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar entrada"}
      </button>
    </form>
  );
}
