import { cn } from "@/lib/utils";

type SignalIndicatorProps = {
  active?: boolean;
  className?: string;
};

export function SignalIndicator({
  active = false,
  className,
}: SignalIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-block size-2 rounded-full border transition-colors duration-150",
        active
          ? "border-accent bg-accent"
          : "border-text-muted bg-transparent",
        className,
      )}
      aria-hidden
    />
  );
}
