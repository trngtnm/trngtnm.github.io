import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "ghost" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-bg-primary hover:bg-accent-hover border border-transparent",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border border-transparent",
  outline:
    "bg-transparent text-text-primary border border-border hover:border-border-strong hover:bg-white/[0.03]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 font-mono text-xs tracking-wider uppercase transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
