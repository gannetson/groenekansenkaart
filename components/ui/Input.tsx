import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-[var(--radius)] border-2 border-[var(--color-light)] bg-white px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-light)] focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-light)]/50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
