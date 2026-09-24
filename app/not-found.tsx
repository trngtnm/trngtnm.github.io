import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <AppShell>
      <div className="section-pad flex min-h-[60vh] flex-col items-start justify-center">
        <p className="font-mono text-xs tracking-[0.2em] text-text-muted uppercase">
          Error / 404
        </p>
        <h1 className="mt-4 text-3xl font-medium text-text-primary">
          Track not found
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          That project or page doesn&apos;t exist in this session.
        </p>
        <Link
          href="/#intro"
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 border border-transparent bg-accent px-4 py-2 font-mono text-xs tracking-wider text-bg-primary uppercase transition-colors duration-150 hover:bg-accent-hover"
        >
          Return to session
        </Link>
      </div>
    </AppShell>
  );
}
