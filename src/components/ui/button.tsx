import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        honey:
          "bg-honey text-ink shadow-[0_8px_0_0_color-mix(in_oklab,var(--color-den)_35%,transparent)] hover:bg-honey-2",
        forest:
          "bg-forest text-paper shadow-[0_8px_0_0_color-mix(in_oklab,var(--color-ink)_35%,transparent)] hover:bg-moss",
        paper:
          "bg-paper text-ink ring-1 ring-ink/10 hover:bg-paper-2",
        ghost: "bg-transparent text-ink hover:bg-ink/5",
        berry: "bg-berry text-paper hover:brightness-110",
        admin:
          "bg-admin-fg text-admin-bg hover:bg-white font-admin font-medium",
        adminLine:
          "bg-transparent text-admin-fg ring-1 ring-admin-line hover:bg-admin-raised font-admin font-medium",
      },
      size: {
        sm: "h-10 rounded-[14px] px-3 text-sm",
        md: "h-12 rounded-[18px] px-4 text-base",
        lg: "h-16 rounded-[22px] px-6 text-lg",
        xl: "min-h-20 rounded-[28px] px-7 py-5 text-xl leading-tight",
      },
    },
    defaultVariants: { variant: "honey", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
