"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HeroItem } from "@/lib/types";
import { cn, formatRating, formatYear, imageUrl, mediaHref, truncate } from "@/lib/utils";
import { InfoIcon, PlayIcon, StarIcon } from "./Icons";
import TrailerModal from "./TrailerModal";
import WatchlistButton from "./WatchlistButton";

export default function HeroCarousel({ items }: { items: HeroItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const closeTrailer = useCallback(() => setTrailerOpen(false), []);

  const active = items[index];

  // Auto-advance every 9 seconds; pause while hovering or while the trailer is open.
  useEffect(() => {
    if (paused || trailerOpen || items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 9000);
    return () => clearInterval(timer);
  }, [paused, trailerOpen, items.length, index]);

  if (!active) return null;

  const year = formatYear(active.date);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured movies"
      className="relative h-[80svh] min-h-[540px] max-h-[880px] w-full overflow-hidden bg-ink-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((item, i) => {
        const src = imageUrl(item.backdropPath, "w1280");
        return (
          <div
            key={item.id}
            aria-hidden={i !== index}
            className={cn("absolute inset-0 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")}
          >
            {src && (
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                className="object-cover object-[50%_20%]"
              />
            )}
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/40 to-transparent" />

      <div className="page-x relative z-10 flex h-full flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
        <div key={active.id} className="max-w-2xl animate-slide-up">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-cyan ring-1 ring-white/10 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
            Trending #{index + 1} this week
          </p>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{active.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
              <StarIcon width={16} height={16} className="text-amber-400" />
              {formatRating(active.rating)}
            </span>
            {year && <span>{year}</span>}
            {active.genreNames.length > 0 && <span>{active.genreNames.join(" · ")}</span>}
          </div>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">{truncate(active.overview, 220)}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {active.trailerKey && (
              <button type="button" onClick={() => setTrailerOpen(true)} className="btn-primary">
                <PlayIcon width={18} height={18} />
                Watch Trailer
              </button>
            )}
            <Link href={mediaHref(active)} className="btn-secondary">
              <InfoIcon width={18} height={18} />
              More Info
            </Link>
            <WatchlistButton item={active} variant="button" />
          </div>
        </div>

        {items.length > 1 && (
          <div className="absolute bottom-6 right-4 flex items-center gap-2 sm:right-6 lg:right-10" role="tablist" aria-label="Choose featured movie">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${item.title}`}
                onClick={() => setIndex(i)}
                className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-8 bg-white" : "w-3 bg-white/35 hover:bg-white/60")}
              />
            ))}
          </div>
        )}
      </div>

      {trailerOpen && active.trailerKey && <TrailerModal videoKey={active.trailerKey} title={active.title} onClose={closeTrailer} />}
    </section>
  );
}
