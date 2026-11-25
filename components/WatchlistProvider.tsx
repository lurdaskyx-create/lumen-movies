"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MediaItem, MediaType, WatchlistItem } from "@/lib/types";
import { truncate } from "@/lib/utils";

const STORAGE_KEY = "lumen:watchlist:v1";

interface WatchlistContextValue {
  items: WatchlistItem[];
  /** false until the saved list has been read from the browser */
  ready: boolean;
  has: (id: number, mediaType: MediaType) => boolean;
  toggle: (item: MediaItem) => void;
  clear: () => void;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

function isValid(entry: unknown): entry is WatchlistItem {
  if (!entry || typeof entry !== "object") return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === "number" &&
    (e.mediaType === "movie" || e.mediaType === "tv") &&
    typeof e.title === "string"
  );
}

function readStorage(): WatchlistItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValid) : [];
  } catch {
    return [];
  }
}

/** Keep only what the watchlist needs so localStorage stays small. */
function slim(item: MediaItem): WatchlistItem {
  return {
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    overview: truncate(item.overview, 180),
    posterPath: item.posterPath,
    backdropPath: item.backdropPath,
    rating: item.rating,
    voteCount: item.voteCount,
    date: item.date,
    genreIds: item.genreIds,
    addedAt: Date.now(),
  };
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load once after mount (localStorage does not exist on the server).
  useEffect(() => {
    setItems(readStorage());
    setReady(true);
  }, []);

  // Save whenever the list changes.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked - the list still works for this visit */
    }
  }, [items, ready]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback(
    (id: number, mediaType: MediaType) => items.some((i) => i.id === id && i.mediaType === mediaType),
    [items],
  );

  const toggle = useCallback((item: MediaItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id && i.mediaType === item.mediaType)
        ? prev.filter((i) => !(i.id === item.id && i.mediaType === item.mediaType))
        : [slim(item), ...prev],
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, ready, has, toggle, clear }), [items, ready, has, toggle, clear]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside <WatchlistProvider>");
  return ctx;
}
