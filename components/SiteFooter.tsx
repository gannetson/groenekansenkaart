import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer>
      <section
        id="inspiratie"
        className="border-t border-[var(--color-light)] bg-white px-4 py-12 sm:px-6"
      >
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            {
              title: "Ontdek groene plekken",
              text: "Verken initiatieven die Leiden vergroenen — van community-tuinen tot groene daken.",
            },
            {
              title: "Deel jouw idee",
              text: "Heb je een plan om jouw buurt groener te maken? Voeg het toe aan de kaart.",
            },
            {
              title: "Samen vergroenen",
              text: "De Groene Kansen Kaart verbindt bewoners, organisaties en de gemeente Leiden.",
            },
          ].map((box) => (
            <div
              key={box.title}
              className="rounded-[var(--radius)] border-2 border-[var(--color-light)] bg-[var(--color-bg)] p-6 shadow-[var(--shadow)]"
            >
              <h3 className="font-display text-lg font-bold text-[var(--color-primary)]">
                {box.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#1D2B1F]/80">{box.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div
        id="over"
        className="bg-[var(--color-primary)] px-4 py-8 text-white sm:px-6"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo size="sm" inverted />
          </div>
          <p className="text-center text-sm text-white/80 sm:text-right">
            Een initiatief van{" "}
            <span className="font-semibold text-white">Gemeente Leiden</span>
            <br />
            <span className="text-white/60">Vergroenen — samen maken we Leiden groener</span>
          </p>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-white/70 underline-offset-2 hover:text-white hover:underline"
          >
            Beheer
          </Link>
        </div>
      </div>
    </footer>
  );
}
