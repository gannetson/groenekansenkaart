import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export function AdminHeader() {
  return (
    <header className="border-b border-[var(--color-light)]/60 bg-white shadow-[var(--shadow)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/admin" className="font-display text-lg font-bold text-[var(--color-primary)]">
          Beheer
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          >
            Naar kaart
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              Uitloggen
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
