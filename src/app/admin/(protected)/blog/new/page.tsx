import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display">Nueva entrada</h1>
        <p className="text-fog text-sm mt-1">Redacta una nueva entrada del blog.</p>
      </div>
      <PostForm />
    </div>
  );
}

