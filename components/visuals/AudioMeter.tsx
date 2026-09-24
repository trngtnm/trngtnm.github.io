import { cn } from "@/lib/utils";

type AudioMeterProps = {
  levels?: number[];
  className?: string;
};

/** Decorative meter bars — not connected to audio. */
export function AudioMeter({
  levels = [0.35, 0.55, 0.4, 0.7, 0.45, 0.6, 0.3],
  className,
}: AudioMeterProps) {
  return (
    <div
      className={cn("flex h-8 items-end gap-1", className)}
      aria-hidden
    >
      {levels.map((level, index) => (
        <span
          key={index}
          className="w-1 bg-accent/50"
          style={{ height: `${Math.max(12, level * 100)}%` }}
        />
      ))}
    </div>
  );
}
