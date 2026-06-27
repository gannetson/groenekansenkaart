import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger" | "ghost" | "tertiary";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "rounded-[var(--radius)]",
          variant === "primary" &&
            "bg-[var(--color-primary)] text-white shadow-[var(--shadow)] hover:bg-[#164d31] active:scale-[0.98]",
          variant === "outline" &&
            "border-2 border-[var(--color-secondary)] bg-white text-[var(--color-secondary)] hover:bg-[var(--color-bg)] active:scale-[0.98]",
          variant === "danger" &&
            "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
          variant === "ghost" &&
            "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-light)]/30",
          variant === "tertiary" &&
            "bg-transparent text-[var(--color-primary)] underline-offset-2 hover:underline shadow-none",
          size === "sm" && "px-3.5 py-2 text-sm",
          size === "md" && "px-5 py-2.5 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
