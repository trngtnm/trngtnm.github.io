"use client";

import { GRID_COL } from "@/data/clipRanges";
import { animate } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type IntroRevealPhase = "columns" | "content" | "beam" | "done";

type IntroRevealValue = {
  phase: IntroRevealPhase;
  progress: number;
  columnCount: number;
};

const SWEEP_MS = 0.95;
const CONTENT_MS = 500;
const BEAM_MS = 450;

const IntroRevealContext = createContext<IntroRevealValue>({
  phase: "done",
  progress: 1,
  columnCount: 16,
});

export function useIntroReveal() {
  return useContext(IntroRevealContext);
}

export function IntroRevealProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroRevealPhase>("columns");
  const [progress, setProgress] = useState(0);
  const [columnCount, setColumnCount] = useState(16);

  useEffect(() => {
    const el = document.getElementById("intro-lane");
    if (!el) return;
    const update = () => {
      setColumnCount(Math.max(2, Math.floor(el.clientWidth / GRID_COL)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      setPhase("done");
      return;
    }

    const controls = animate(0, 1, {
      duration: SWEEP_MS,
      ease: "linear",
      onUpdate: setProgress,
      onComplete: () => setPhase("content"),
    });

    return () => controls.stop();
  }, []);

  useEffect(() => {
    if (phase !== "content") return;
    const timer = window.setTimeout(() => setPhase("beam"), CONTENT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "beam") return;
    const timer = window.setTimeout(() => setPhase("done"), BEAM_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <IntroRevealContext.Provider value={{ phase, progress, columnCount }}>
      {children}
    </IntroRevealContext.Provider>
  );
}
