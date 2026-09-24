type TrackIdentifierProps = {
  name: string;
  color: string;
  expanded: boolean;
  height?: number;
  onSelect: () => void;
};

export function TrackIdentifier({
  name,
  color,
  expanded,
  height,
  onSelect,
}: TrackIdentifierProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={expanded}
      className="flex h-full min-h-11 w-full bg-bg-secondary text-left transition-colors hover:bg-bg-panel"
      style={
        height
          ? {
              minHeight: `${height}px`,
              height: `${height}px`,
            }
          : undefined
      }
    >
      <span
        className="w-1.5 shrink-0 self-stretch"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="flex min-w-0 flex-1 items-center px-2.5 py-3">
        <span
          className="font-mono text-xs leading-tight font-semibold tracking-wider text-text-primary uppercase"
          style={{ color: expanded ? "var(--accent)" : undefined }}
        >
          {expanded ? `● ${name}` : name}
        </span>
      </span>
    </button>
  );
}
