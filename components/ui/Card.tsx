import { cn } from "@/lib/utils";
import { HTMLAttributes, LabelHTMLAttributes } from "react";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-[var(--color-light)]/80 bg-white p-6 shadow-[var(--shadow)]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-sm font-semibold text-[var(--color-primary)]",
        className,
      )}
      {...props}
    />
  );
}
