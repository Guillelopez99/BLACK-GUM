import Link from "next/link";

const links = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/packs", label: "Packs" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/rentals", label: "Alquileres" },
  { href: "/admin/portfolio", label: "Portafolio" },
  { href: "/admin/blog", label: "Blog" }
];

export default function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-fog">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="hover:text-bone">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
