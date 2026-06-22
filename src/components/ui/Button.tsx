import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "brand" | "surface" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  brand:
    "bg-[var(--brand)] text-[var(--brand-ink)] hover:brightness-110 shadow-[0_8px_24px_-8px_var(--brand)]",
  surface:
    "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:brightness-110",
  ghost: "text-[var(--text)] hover:bg-white/5",
  outline:
    "border border-[var(--border)] text-[var(--text)] hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "brand", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
        "transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
