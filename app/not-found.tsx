import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-center">
      <span className="text-6xl" aria-hidden>
        🌿
      </span>
      <h1 className="font-display mt-4 text-3xl font-bold text-[var(--color-primary)]">
        Pagina niet gevonden
      </h1>
      <p className="mt-2 text-[var(--color-secondary)]">
        Dit project of deze pagina bestaat niet.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-2.5 font-semibold text-white shadow-[var(--shadow)] hover:bg-[#164d31]"
      >
        Terug naar kaart
      </Link>
    </div>
  );
}
