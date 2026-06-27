import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  inverted = false,
}: {
  size?: "sm" | "md";
  inverted?: boolean;
}) {
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <Link href="/" className="group flex items-center gap-3">
      <div
        className={cn(
          `${dim} relative flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[var(--shadow)]`,
          inverted ? "bg-white/15" : "bg-[var(--color-light)]",
        )}
      >
        <span className="text-xl" aria-hidden>
          🏛️
        </span>
        <span
          className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-secondary)] text-xs"
          aria-hidden
        >
          🌿
        </span>
      </div>
      <div>
        <span
          className={cn(
            `font-display ${textSize} font-bold leading-tight`,
            inverted
              ? "text-white group-hover:text-[var(--color-light)]"
              : "text-[var(--color-primary)] group-hover:text-[var(--color-secondary)]",
          )}
        >
          Groene Kansen Kaart
        </span>
        <span
          className={cn(
            "block text-xs font-medium",
            inverted ? "text-white/70" : "text-[var(--color-secondary)]",
          )}
        >
          Leiden
        </span>
      </div>
    </Link>
  );
}
