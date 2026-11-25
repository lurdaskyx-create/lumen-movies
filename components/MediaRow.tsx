"use client";

import Link from "next/link";
import { useRef } from "react";
import type { MediaItem } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  items: MediaItem[];
  /** Optional "See all" link */
  href?: string;
}

export default function MediaRow({ title, items, href }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="group/row py-4 sm:py-5" aria-label={title}>
      <div className="page-x mb-3 flex items-end justify-between gap-4">
        <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-medium text-zinc-400 transition hover:text-white">
            See all →
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={`Scroll ${title} left`}
          className="absolute left-2 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white opacity-0 ring-1 ring-white/20 backdrop-blur transition hover:bg-black/90 group-hover/row:opacity-100 md:grid"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={`Scroll ${title} right`}
          className="absolute right-2 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white opacity-0 ring-1 ring-white/20 backdrop-blur transition hover:bg-black/90 group-hover/row:opacity-100 md:grid"
        >
          <ChevronRightIcon />
        </button>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-3 pt-2 sm:gap-4 sm:px-6 lg:px-10"
        >
          {items.map((item) => (
            <div key={`${item.mediaType}-${item.id}`} className="w-[138px] shrink-0 snap-start sm:w-[160px] lg:w-[188px]">
              <MovieCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
