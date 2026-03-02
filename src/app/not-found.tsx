import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center space-y-6">
      <p className="text-xs uppercase tracking-[0.3em] text-ember">404</p>
      <h1 className="text-4xl md:text-5xl font-display">Página no encontrada</h1>
      <p className="text-fog">
        La página que buscas no existe o se ha movido.
      </p>
      <Link
        href="/"
        className="inline-flex bg-gum text-bone px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
