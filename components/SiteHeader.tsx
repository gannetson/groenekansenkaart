import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Kaart" },
  { href: "/#inspiratie", label: "Inspiratie" },
  { href: "/#over", label: "Over" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-light)]/60 bg-white/95 shadow-[var(--shadow)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#1D2B1F]/80 transition hover:text-[var(--color-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/admin/login" className="shrink-0">
          <Button size="sm" className="gap-1.5">
            <span aria-hidden>+</span> Idee toevoegen
          </Button>
        </Link>
      </div>
    </header>
  );
}
