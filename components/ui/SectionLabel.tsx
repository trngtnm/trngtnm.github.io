import { cn } from "@/lib/utils";

type SectionLabelProps = {
  label: string;
  className?: string;
};

export function SectionLabel({ label, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "mb-8 font-mono text-xs tracking-[0.2em] text-text-muted uppercase",
        className,
      )}
    >
      {label}
    </p>
  );
}
