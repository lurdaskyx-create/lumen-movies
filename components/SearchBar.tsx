"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { MediaItem } from "@/lib/types";
import { cn, formatYear, imageUrl, mediaHref } from "@/lib/utils";
import { SearchIcon } from "./Icons";

interface Props {
  autoFocus?: boolean;
  className?: string;
}

export default function SearchBar({ autoFocus = false, className }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Live suggestions (debounced). The request goes to our own /api/search route,
  // so the TMDB key never reaches the browser.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as { results: MediaItem[] };
        setResults(data.results ?? []);
        setActive(-1);
        setStatus("idle");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setStatus("error");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close the dropdown when clicking elsewhere.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (event.key === "Enter" && active >= 0 && results[active]) {
      event.preventDefault();
      setOpen(false);
      router.push(mediaHref(results[active]));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <form onSubmit={submit} role="search" className="relative">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" width={18} height={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          placeholder="Search movies & series"
          aria-label="Search movies and TV series"
          autoComplete="off"
          enterKeyHint="search"
          className="h-10 w-full rounded-full bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-zinc-400 ring-1 ring-inset ring-white/10 transition focus:bg-white/15 focus:outline-none focus:ring-white/30"
        />
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-12 z-50 min-w-[300px] overflow-hidden rounded-2xl bg-ink-800/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl animate-fade-in md:left-auto md:w-[380px]">
          {status === "loading" && results.length === 0 && <p className="px-4 py-4 text-sm text-zinc-400">Searching…</p>}
          {status === "error" && <p className="px-4 py-4 text-sm text-red-300">Search is unavailable right now. Try again in a moment.</p>}
          {status === "idle" && results.length === 0 && <p className="px-4 py-4 text-sm text-zinc-400">No matches for “{query.trim()}”.</p>}

          {results.length > 0 && (
            <ul>
              {results.map((item, i) => {
                const thumb = imageUrl(item.posterPath, "w92");
                return (
                  <li key={`${item.mediaType}-${item.id}`}>
                    <Link
                      href={mediaHref(item)}
                      onClick={() => setOpen(false)}
                      className={cn("flex items-center gap-3 px-3 py-2.5 transition hover:bg-white/10", i === active && "bg-white/10")}
                    >
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-ink-600">
                        {thumb && <Image src={thumb} alt="" fill sizes="40px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-zinc-400">
                          {item.mediaType === "tv" ? "TV Series" : "Movie"}
                          {formatYear(item.date) && ` · ${formatYear(item.date)}`}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setOpen(false)}
                  className="block border-t border-white/10 px-4 py-3 text-center text-sm font-medium text-brand-cyan transition hover:bg-white/5"
                >
                  See all results
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
