"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";

const navItems = [
  { href: "/packs", label: "Paquetes" },
  { href: "/rentals", label: "Alquileres" },
  { href: "/productions", label: "Producciones" },
  { href: "/diary", label: "Diario" }
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-ink/98 via-ink/95 to-ink/90 backdrop-blur-xl shadow-lg shadow-ink/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-3 md:py-3.5">
          <Link href="/" className="flex items-center">
            <Image
              src="/brand/logo-white.png"
              alt="Black Gum Studio"
              width={160}
              height={69}
              priority
              className="h-8 w-auto md:h-10"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium uppercase tracking-[0.15em] text-fog hover:text-bone transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <LinkButton href="/contact" variant="primary" size="sm">
              Contactar
            </LinkButton>
            <Link
              href="/admin/login"
              className="text-sm font-medium uppercase tracking-[0.15em] text-bone/60 hover:text-ember transition-colors duration-200 border-l border-white/10 pl-8"
            >
              Administrador
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
          >
            <div className={`w-6 h-0.5 bg-bone transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-6 h-0.5 bg-bone transition-all ${isOpen ? "opacity-0" : ""}`} />
            <div
              className={`w-6 h-0.5 bg-bone transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {isMounted && isOpen && (
          <nav className="md:hidden pb-5 space-y-3 border-t border-white/5 pt-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium uppercase tracking-[0.15em] text-fog hover:text-bone transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <LinkButton
              href="/contact"
              variant="primary"
              size="sm"
              className="w-full justify-center"
            >
              Contactar
            </LinkButton>
            <Link
              href="/admin/login"
              className="block text-sm font-medium uppercase tracking-[0.15em] text-bone/60 hover:text-ember transition-colors py-2 border-t border-white/10 pt-4"
              onClick={() => setIsOpen(false)}
            >
              Administrador
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
