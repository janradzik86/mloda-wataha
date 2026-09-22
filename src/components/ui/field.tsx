import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-ink-soft">
      {children}
    </label>
  );
}

export function TextField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[16px] border-0 bg-white/80 px-4 text-base text-ink shadow-[inset_0_0_0_1px_rgb(42_33_24/0.12)] outline-none placeholder:text-ink-soft/60 focus:shadow-[inset_0_0_0_2px_var(--color-moss)]",
        className,
      )}
      {...props}
    />
  );
}

export function AreaField({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[20px] border-0 bg-white/80 px-4 py-3 text-base text-ink shadow-[inset_0_0_0_1px_rgb(42_33_24/0.12)] outline-none placeholder:text-ink-soft/60 focus:shadow-[inset_0_0_0_2px_var(--color-moss)]",
        className,
      )}
      {...props}
    />
  );
}
