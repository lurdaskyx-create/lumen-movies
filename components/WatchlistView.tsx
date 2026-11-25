"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState";
import { BookmarkIcon } from "./Icons";
import MediaGrid from "./MediaGrid";
import { GridSkeleton } from "./Skeletons";
import { useWatchlist } from "./WatchlistProvider";

type Filter = "all" | "movie" | "tv";

export default function WatchlistView() {
  const { items, ready, clear } = useWatchlist();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => items.filter((item) => filter === "all" || item.mediaType === filter), [items, filter]);

  const tabs: Array<{ key: Filter; label: string; count: number }> = [
    { key: "all", label: "All", count: items.length },
    { key: "movie", label: "Movies", count: items.filter((i) => i.mediaType === "movie").length },
    { key: "tv", label: "TV Series", count: items.filter((i) => i.mediaType === "tv").length },
  ];

  const onClear = () => {
    if (window.confirm("Remove everything from your watchlist?")) clear();
  };

  return (
    <div className="page-x pb-6 pt-28 sm:pt-32">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">My Watchlist</h1>
          <p className="mt-2 text-zinc-400">Saved on this device, so there is no account to create.</p>
        </div>
        {ready && items.length > 0 && (
          <button type="button" onClick={onClear} className="text-sm font-medium text-zinc-400 transition hover:text-red-300">
            Clear all
          </button>
        )}
      </header>

      {!ready ? (
        <GridSkeleton count={6} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          description="Tap the bookmark on any movie or series to save it here for later."
          icon={<BookmarkIcon width={28} height={28} />}
          action={{ href: "/movies", label: "Browse movies" }}
        />
      ) : (
        <>
          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter watchlist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={filter === tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn("pill", filter === tab.key ? "pill-active" : "pill-idle")}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-70">{tab.count}</span>
              </button>
            ))}
          </div>
          <MediaGrid items={filtered} emptyTitle="Nothing here" emptyDescription="You have no saved titles in this filter." />
        </>
      )}
    </div>
  );
}
