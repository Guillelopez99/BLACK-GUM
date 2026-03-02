import { notFound } from "next/navigation";
import PostForm, { PostFormData } from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";

export default async function EditPostPage({
  params
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) {
    notFound();
  }

  const initialData: PostFormData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    publishedAt: post.publishedAt
      ? post.publishedAt.toISOString().slice(0, 16)
      : null
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Editar entrada</h1>
        <p className="text-fog text-sm mt-1">Actualiza el contenido del blog.</p>
      </div>
      <PostForm initialData={initialData} id={post.id} />
    </div>
  );
}
