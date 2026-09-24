type TimelineGridProps = {
  className?: string;
};

export function TimelineGrid({ className }: TimelineGridProps) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--border) 1px, transparent 1px)",
        backgroundSize: "48px 100%",
        opacity: 0.35,
      }}
    />
  );
}
