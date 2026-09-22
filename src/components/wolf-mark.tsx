import { cn } from "@/lib/utils";

export function WolfMark({ className, size = 64 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <circle cx="32" cy="32" r="30" fill="#1F4D38" />
      <circle cx="32" cy="32" r="30" stroke="#F4EFE4" strokeWidth="3" />
      <path d="M18 28 12 12l14 8 6-8 6 8 14-8-6 16" fill="#E8DFCC" />
      <path d="M22 30c0 10 4.5 18 10 18s10-8 10-18" fill="#F4EFE4" />
      <ellipse cx="32" cy="36" rx="7" ry="5.5" fill="#2A2118" />
      <circle cx="25" cy="31" r="2.2" fill="#2A2118" />
      <circle cx="39" cy="31" r="2.2" fill="#2A2118" />
      <circle cx="25.6" cy="30.4" r="0.7" fill="#F4EFE4" />
      <circle cx="39.6" cy="30.4" r="0.7" fill="#F4EFE4" />
      <path d="M28 41c2.2 2 5.8 2 8 0" stroke="#C4892A" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ForestBackdrop() {
  return (
    <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full" viewBox="0 0 800 160" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 160 0 90c40-10 70 8 110 4 50-6 70-40 120-38 40 2 55 28 100 26 60-3 80-44 140-40 55 4 70 36 120 34 40-2 60-24 110-18 30 4 55 18 100 10v92H0Z" fill="#1F4D38" opacity="0.9" />
      <path d="M0 160v-54c50 8 90-18 140-12 55 6 72 32 130 28 70-4 90-38 150-30 50 6 65 30 120 26 40-3 80-22 130-10 40 10 80 6 130 14v38H0Z" fill="#3D7A5A" />
      <ellipse cx="400" cy="148" rx="90" ry="18" fill="#6B4A32" opacity="0.35" />
    </svg>
  );
}
