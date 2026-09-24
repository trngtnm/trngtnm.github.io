"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type TransportContextValue = {
  isPlaying: boolean;
  isRecording: boolean;
  direction: 1 | -1;
  progress: number;
  setProgress: (value: number) => void;
  seekTo: (target: number, durationMs?: number) => void;
  play: () => void;
  stop: () => void;
  reverse: () => void;
  toggleRecord: () => void;
  isSeeking: () => boolean;
};

const TransportContext = createContext<TransportContextValue | null>(null);

export function TransportProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [progress, setProgressState] = useState(0);
  const progressRef = useRef(0);
  const seekFrame = useRef<number | null>(null);
  const seekingRef = useRef(false);

  const setProgress = useCallback((value: number) => {
    const wrapped = ((value % 1) + 1) % 1;
    progressRef.current = wrapped;
    setProgressState(wrapped);
  }, []);

  const seekTo = useCallback((target: number, durationMs = 450) => {
    const clamped = Math.min(1, Math.max(0, target));
    if (seekFrame.current !== null) {
      cancelAnimationFrame(seekFrame.current);
      seekFrame.current = null;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || durationMs <= 0) {
      progressRef.current = clamped;
      setProgressState(clamped);
      return;
    }

    seekingRef.current = true;
    const from = progressRef.current;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (clamped - from) * eased;
      progressRef.current = next;
      setProgressState(next);
      if (t < 1) {
        seekFrame.current = requestAnimationFrame(tick);
      } else {
        seekFrame.current = null;
        seekingRef.current = false;
      }
    };

    seekFrame.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
    setDirection(1);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reverse = useCallback(() => {
    setDirection(-1);
    setIsPlaying(true);
  }, []);

  const toggleRecord = useCallback(() => {
    setIsRecording((value) => !value);
  }, []);

  const isSeeking = useCallback(() => seekingRef.current, []);

  const value = useMemo(
    () => ({
      isPlaying,
      isRecording,
      direction,
      progress,
      setProgress,
      seekTo,
      play,
      stop,
      reverse,
      toggleRecord,
      isSeeking,
    }),
    [
      isPlaying,
      isRecording,
      direction,
      progress,
      setProgress,
      seekTo,
      play,
      stop,
      reverse,
      toggleRecord,
      isSeeking,
    ],
  );

  return (
    <TransportContext.Provider value={value}>
      {children}
    </TransportContext.Provider>
  );
}

export function useTransport() {
  const ctx = useContext(TransportContext);
  if (!ctx) {
    throw new Error("useTransport must be used within TransportProvider");
  }
  return ctx;
}
