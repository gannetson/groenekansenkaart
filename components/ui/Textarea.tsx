import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
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
Textarea.displayName = "Textarea";
