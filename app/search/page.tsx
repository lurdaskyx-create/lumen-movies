import type { Metadata } from "next";
import EmptyState from "@/components/EmptyState";
import { SearchIcon } from "@/components/Icons";
import MediaGrid from "@/components/MediaGrid";
import Pagination from "@/components/Pagination";
import { searchMulti } from "@/lib/tmdb";
import { parsePage } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  return { title: query ? `Search: ${query}` : "Search", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim().slice(0, 100);
  const page = parsePage(sp.page);

  const data = query ? await searchMulti(query, page) : null;

  const hrefFor = (target: number) => `/search?q=${encodeURIComponent(query)}${target > 1 ? `&page=${target}` : ""}`;

  return (
    <div className="page-x pb-6 pt-28 sm:pt-32">
      <form key={query} action="/search" method="get" role="search" className="relative mx-auto mb-10 max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" width={20} height={20} />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search movies & TV series"
          aria-label="Search movies and TV series"
          autoComplete="off"
          enterKeyHint="search"
          className="h-14 w-full rounded-full bg-white/10 pl-12 pr-28 text-base text-white ring-1 ring-inset ring-white/10 placeholder:text-zinc-400 focus:bg-white/15 focus:outline-none focus:ring-white/30"
        />
        <button type="submit" className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 !py-2.5">
          Search
        </button>
      </form>

      {!data ? (
        <EmptyState
          title="Search for something great"
          description="Type a movie or TV series title to see matches, ratings and trailers."
          icon={<SearchIcon width={28} height={28} />}
        />
      ) : (
        <>
          <header className="mb-8">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Results for “{query}”</h1>
            <p className="mt-1 text-zinc-400">
              {data.totalResults.toLocaleString("en-US")} {data.totalResults === 1 ? "match" : "matches"} across movies and TV series
            </p>
          </header>

          <MediaGrid
            items={data.results}
            emptyTitle={`No results for “${query}”`}
            emptyDescription="Check the spelling or try a shorter title."
          />
          <Pagination page={data.page} totalPages={data.totalPages} hrefFor={hrefFor} />
        </>
      )}
    </div>
  );
}
