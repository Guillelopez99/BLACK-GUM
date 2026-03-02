"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  endpoint,
  label = "Eliminar"
}: {
  endpoint: string;
  label?: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar este elemento?");
    if (!confirmed) return;

    const response = await fetch(endpoint, { method: "DELETE" });
    if (!response.ok) {
      window.alert("No se pudo eliminar.");
      return;
    }

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-xs uppercase tracking-[0.2em] text-ember"
    >
      {label}
    </button>
  );
}
