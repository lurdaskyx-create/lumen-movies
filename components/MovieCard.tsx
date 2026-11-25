import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/types";
import { formatRating, formatYear, imageUrl, mediaHref } from "@/lib/utils";
import { FilmIcon, StarIcon } from "./Icons";
import WatchlistButton from "./WatchlistButton";

export default function MovieCard({ item }: { item: MediaItem }) {
  const poster = imageUrl(item.posterPath, "w342");
  const year = formatYear(item.date);

  return (
    <div className="group relative">
      <Link
        href={mediaHref(item)}
        className="block rounded-xl focus-visible:outline-offset-4"
        aria-label={`${item.title}${year ? ` (${year})` : ""}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-ink-700 ring-1 ring-white/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-glow group-hover:ring-white/20">
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 45vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-zinc-500">
              <FilmIcon width={28} height={28} />
              <span className="text-xs">{item.title}</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold backdrop-blur">
            <StarIcon width={12} height={12} className="text-amber-400" />
            {formatRating(item.rating)}
          </span>
          {item.mediaType === "tv" && (
            <span className="absolute left-2 top-2 rounded-md bg-brand-violet/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              TV
            </span>
          )}
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="truncate text-sm font-medium text-zinc-100">{item.title}</h3>
          <p className="text-xs text-zinc-400">{year || "TBA"}</p>
        </div>
      </Link>
      <WatchlistButton item={item} className="absolute right-2 top-2 z-10" />
    </div>
  );
}
