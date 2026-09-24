"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SelectedProjectContextValue = {
  selectedSlug: string | null;
  setSelectedSlug: (slug: string | null) => void;
};

const SelectedProjectContext =
  createContext<SelectedProjectContextValue | null>(null);

export function SelectedProjectProvider({ children }: { children: ReactNode }) {
  const [selectedSlug, setSelectedSlugState] = useState<string | null>(null);

  const setSelectedSlug = useCallback((slug: string | null) => {
    setSelectedSlugState(slug);
  }, []);

  const value = useMemo(
    () => ({ selectedSlug, setSelectedSlug }),
    [selectedSlug, setSelectedSlug],
  );

  return (
    <SelectedProjectContext.Provider value={value}>
      {children}
    </SelectedProjectContext.Provider>
  );
}

export function useSelectedProject() {
  const ctx = useContext(SelectedProjectContext);
  if (!ctx) {
    throw new Error(
      "useSelectedProject must be used within SelectedProjectProvider",
    );
  }
  return ctx;
}
