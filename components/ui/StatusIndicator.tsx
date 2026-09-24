import { cn } from "@/lib/utils";

type StatusIndicatorProps = {
  label?: string;
  active?: boolean;
  className?: string;
};

export function StatusIndicator({
  label = "ONLINE",
  active = true,
  className,
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block size-1.5 rounded-full",
          active ? "bg-accent" : "bg-text-muted",
        )}
        aria-hidden
      />
      <span className={active ? "text-text-secondary" : "text-text-muted"}>
        {label}
      </span>
    </span>
  );
}
