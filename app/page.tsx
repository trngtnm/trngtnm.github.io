import { AppShell } from "@/components/layout/AppShell";
import { Contact } from "@/components/sections/Contact";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default function HomePage() {
  return (
    <AppShell>
      <Projects />
      <Skills />
      <Contact />
    </AppShell>
  );
}
