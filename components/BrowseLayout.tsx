import type { MediaItem } from "@/lib/types";
import FilterPills, { type PillItem } from "./FilterPills";
import MediaGrid from "./MediaGrid";
import Pagination from "./Pagination";

interface Props {
  title: string;
  subtitle: string;
  categories: PillItem[];
  genres: PillItem[];
  items: MediaItem[];
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}

/** Shared layout for the /movies and /tv browse pages. */
export default function BrowseLayout({ title, subtitle, categories, genres, items, page, totalPages, hrefFor }: Props) {
  return (
    <div className="page-x pb-6 pt-28 sm:pt-32">
      <header className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-zinc-400">{subtitle}</p>
      </header>

      <div className="mb-8 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Category</p>
          <FilterPills items={categories} label="Categories" />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Genre</p>
          <FilterPills items={genres} label="Genres" />
        </div>
      </div>

      <MediaGrid items={items} emptyTitle="No titles found" emptyDescription="Try another category or genre." />
      <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
    </div>
  );
}
