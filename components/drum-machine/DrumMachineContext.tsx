"use client";

import {
  MAX_BPM,
  MIN_BPM,
  drumPresets,
  emptyPattern,
  pickDrumPreset,
  type DrumPattern,
  type DrumVoiceId,
} from "@/data/drumMachine";
import { DrumScheduler } from "@/lib/drumSynth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type DrumMachineContextValue = {
  isPlaying: boolean;
  step: number;
  bpm: number;
  pattern: DrumPattern;
  play: () => void;
  stop: () => void;
  toggleStep: (voice: DrumVoiceId, step: number) => void;
  setBpm: (bpm: number) => void;
};

const DrumMachineContext = createContext<DrumMachineContextValue | null>(null);

function clonePattern(pattern: DrumPattern): DrumPattern {
  const next = emptyPattern();
  for (const id of Object.keys(next) as DrumVoiceId[]) {
    const row = pattern[id];
    if (row) next[id] = [...row];
  }
  return next;
}

export function DrumMachineProvider({ children }: { children: ReactNode }) {
  const schedulerRef = useRef<DrumScheduler | null>(null);
  if (!schedulerRef.current) schedulerRef.current = new DrumScheduler();

  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [bpm, setBpmState] = useState(drumPresets[0]!.bpm);
  const [pattern, setPattern] = useState<DrumPattern>(() =>
    clonePattern(drumPresets[0]!.pattern),
  );

  useEffect(() => {
    const preset = pickDrumPreset();
    setBpmState(preset.bpm);
    setPattern(clonePattern(preset.pattern));
  }, []);

  useEffect(() => {
    const scheduler = schedulerRef.current!;
    scheduler.onStep(setStep);
    return () => {
      scheduler.stop();
    };
  }, []);

  useEffect(() => {
    schedulerRef.current?.setPattern(pattern);
  }, [pattern]);

  useEffect(() => {
    schedulerRef.current?.setBpm(bpm);
  }, [bpm]);

  const play = useCallback(() => {
    if (schedulerRef.current?.isPlaying) {
      setIsPlaying(true);
      return;
    }
    void schedulerRef.current?.play();
    setIsPlaying(true);
    setStep(0);
  }, []);

  const stop = useCallback(() => {
    schedulerRef.current?.stop();
    setIsPlaying(false);
    setStep(0);
  }, []);

  const toggleStep = useCallback((voice: DrumVoiceId, index: number) => {
    setPattern((current) => {
      const next = clonePattern(current);
      next[voice][index] = !next[voice][index];
      return next;
    });
  }, []);

  const setBpm = useCallback((value: number) => {
    const clamped = Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
    setBpmState(clamped);
  }, []);

  const value = useMemo(
    () => ({
      isPlaying,
      step,
      bpm,
      pattern,
      play,
      stop,
      toggleStep,
      setBpm,
    }),
    [isPlaying, step, bpm, pattern, play, stop, toggleStep, setBpm],
  );

  return (
    <DrumMachineContext.Provider value={value}>
      {children}
    </DrumMachineContext.Provider>
  );
}

export function useDrumMachine() {
  const ctx = useContext(DrumMachineContext);
  if (!ctx) {
    throw new Error("useDrumMachine must be used within DrumMachineProvider");
  }
  return ctx;
}
