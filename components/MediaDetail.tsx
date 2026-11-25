import Image from "next/image";
import Link from "next/link";
import type { MediaDetails } from "@/lib/types";
import { formatDate, formatRating, formatRuntime, formatYear, imageUrl, languageName } from "@/lib/utils";
import CastList from "./CastList";
import { ExternalIcon, FilmIcon, StarIcon } from "./Icons";
import MediaRow from "./MediaRow";
import TrailerButton from "./TrailerButton";
import WatchlistButton from "./WatchlistButton";

export default function MediaDetail({ details }: { details: MediaDetails }) {
  const isMovie = details.mediaType === "movie";
  const backdrop = imageUrl(details.backdropPath, "w1280");
  const poster = imageUrl(details.posterPath, "w500");
  const browseBase = isMovie ? "/movies" : "/tv";
  const year = formatYear(details.date);
  const runtime = formatRuntime(details.runtime);

  const facts: Array<{ label: string; value: string }> = [];
  if (details.directors.length > 0) {
    facts.push({ label: isMovie ? "Director" : "Created by", value: details.directors.join(", ") });
  }
  facts.push({ label: isMovie ? "Release date" : "First aired", value: formatDate(details.date) });
  if (details.status) facts.push({ label: "Status", value: details.status });
  if (details.language) facts.push({ label: "Original language", value: languageName(details.language) });
  if (!isMovie && details.seasons) {
    facts.push({
      label: "Seasons",
      value: `${details.seasons}${details.episodes ? ` (${details.episodes} episodes)` : ""}`,
    });
  }

  return (
    <article>
      <header className="relative isolate overflow-hidden pb-10 pt-28 sm:pt-32">
        {backdrop && (
          <Image src={backdrop} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="-z-20 object-cover object-top opacity-40" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/80 to-transparent" />

        <div className="page-x grid gap-8 md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr] lg:gap-12">
          <div className="mx-auto w-[200px] md:mx-0 md:w-full">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-ink-700 shadow-2xl ring-1 ring-white/10">
              {poster ? (
                <Image src={poster} alt={`${details.title} poster`} fill sizes="(min-width: 1024px) 320px, 260px" loading="eager" className="object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-zinc-500">
                  <FilmIcon width={40} height={40} />
                </div>
              )}
            </div>
          </div>

          <div className="animate-slide-up">
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {details.title}
              {year && <span className="ml-3 text-2xl font-normal text-zinc-400 sm:text-3xl">({year})</span>}
            </h1>

            {details.tagline && <p className="mt-2 text-base italic text-zinc-400">{details.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                <StarIcon width={17} height={17} className="text-amber-400" />
                {formatRating(details.rating)}
                <span className="font-normal text-zinc-400">
                  /10{details.voteCount > 0 && ` · ${details.voteCount.toLocaleString("en-US")} votes`}
                </span>
              </span>
              {runtime && <span>{runtime}</span>}
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">{isMovie ? "Movie" : "TV Series"}</span>
            </div>

            {details.genres.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <li key={genre.id}>
                    <Link href={`${browseBase}?genre=${genre.id}`} className="pill pill-idle !py-1.5 !text-xs">
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isMovie && (
                <Link href={`/watch/${details.id}`} className="btn-primary">
                  Watch Full Movie
                </Link>
              )}
              {details.trailerKey ? (
                <TrailerButton videoKey={details.trailerKey} title={details.title} />
              ) : (
                <span className="rounded-full bg-white/5 px-5 py-2.5 text-sm text-zinc-400 ring-1 ring-inset ring-white/10">Trailer not available</span>
              )}
              <WatchlistButton item={details} variant="button" />
              {details.homepage && (
                <a href={details.homepage} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Official site
                  <ExternalIcon width={16} height={16} />
                </a>
              )}
            </div>

            <div className="mt-8 max-w-3xl">
              <h2 className="font-display text-xl font-semibold">Overview</h2>
              <p className="mt-2 leading-relaxed text-zinc-300">{details.overview || "No description is available yet."}</p>
            </div>

            <dl className="mt-8 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm text-zinc-200">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <CastList cast={details.cast} />
      <MediaRow title={isMovie ? "More Like This" : "Similar Series"} items={details.similar} />
    </article>
  );
}
