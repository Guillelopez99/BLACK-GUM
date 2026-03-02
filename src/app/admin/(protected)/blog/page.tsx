import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display">Blog</h1>
          <p className="text-fog text-sm mt-1">Gestiona las entradas del blog.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-gum text-bone px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em]"
        >
          Nueva entrada
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-fog">Aún no hay entradas.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-white/10 rounded-2xl p-4 bg-ink/70 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-display text-lg">{post.title}</p>
                <p className="text-xs text-fog mt-1">
                  /{post.slug} - {post.publishedAt ? "Publicado" : "Borrador"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-xs uppercase tracking-[0.2em] text-bone"
                >
                  Editar
                </Link>
                <DeleteButton endpoint={`/api/admin/blog/${post.id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

