import type { Metadata } from "next";
import BrowseLayout from "@/components/BrowseLayout";
import { discover, getGenres, getTV } from "@/lib/tmdb";
import type { TVCategory } from "@/lib/types";
import { parsePage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "TV Series",
  description: "Explore popular, top rated and currently airing TV series by category and genre.",
};

const CATEGORIES: Array<{ key: TVCategory; label: string; title: string; subtitle: string }> = [
  { key: "popular", label: "Popular", title: "Popular TV Series", subtitle: "The shows everyone is talking about." },
  { key: "airing_today", label: "Airing Today", title: "Airing Today", subtitle: "New episodes dropping today." },
  { key: "on_the_air", label: "On The Air", title: "Currently On Air", subtitle: "Series with episodes airing this week." },
  { key: "top_rated", label: "Top Rated", title: "Top Rated TV Series", subtitle: "The best-reviewed series of all time." },
];

interface Props {
  searchParams: Promise<{ category?: string; genre?: string; page?: string }>;
}

export default async function TVPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const category = CATEGORIES.find((c) => c.key === sp.category) ?? CATEGORIES[0];

  const genres = await getGenres("tv");
  const genre = genres.find((g) => g.id === Number.parseInt(sp.genre ?? "", 10));

  const data = genre ? await discover("tv", { genre: genre.id, page }) : await getTV(category.key, page);

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (genre) params.set("genre", String(genre.id));
    else if (category.key !== "popular") params.set("category", category.key);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/tv?${qs}` : "/tv";
  };

  return (
    <BrowseLayout
      title={genre ? `${genre.name} Series` : category.title}
      subtitle={genre ? `Popular ${genre.name.toLowerCase()} TV series.` : category.subtitle}
      categories={CATEGORIES.map((c) => ({
        label: c.label,
        href: c.key === "popular" ? "/tv" : `/tv?category=${c.key}`,
        active: !genre && c.key === category.key,
      }))}
      genres={genres.map((g) => ({ label: g.name, href: `/tv?genre=${g.id}`, active: g.id === genre?.id }))}
      items={data.results}
      page={data.page}
      totalPages={data.totalPages}
      hrefFor={hrefFor}
    />
  );
}
