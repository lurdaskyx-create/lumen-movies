"use client";

import type { MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "./Icons";
import { useWatchlist } from "./WatchlistProvider";

interface Props {
  item: MediaItem;
  /** "icon" = small round button for cards, "button" = labelled button */
  variant?: "icon" | "button";
  className?: string;
}

export default function WatchlistButton({ item, variant = "icon", className }: Props) {
  const { has, toggle } = useWatchlist();
  const saved = has(item.id, item.mediaType);
  const label = saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={() => toggle(item)}
        aria-pressed={saved}
        className={cn("btn-secondary", saved && "!bg-brand-violet/30 !ring-brand-violet/60", className)}
      >
        <BookmarkIcon filled={saved} width={18} height={18} />
        {saved ? "In Watchlist" : "Add to Watchlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(item)}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? "Remove from watchlist" : "Add to watchlist"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur transition duration-200 hover:bg-black/80 hover:scale-110 active:scale-95",
        saved && "!bg-brand-violet !ring-brand-violet",
        className,
      )}
    >
      <BookmarkIcon filled={saved} width={17} height={17} />
    </button>
  );
}
