import type { Metadata } from "next";
import BrowseLayout from "@/components/BrowseLayout";
import { discover, getGenres, getMovies } from "@/lib/tmdb";
import type { MovieCategory } from "@/lib/types";
import { parsePage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse popular, top rated, now playing and upcoming movies by category and genre.",
};

const CATEGORIES: Array<{ key: MovieCategory; label: string; title: string; subtitle: string }> = [
  { key: "popular", label: "Popular", title: "Popular Movies", subtitle: "What everyone is watching right now." },
  { key: "now_playing", label: "Now Playing", title: "Now Playing in Theaters", subtitle: "Fresh releases on the big screen." },
  { key: "upcoming", label: "Upcoming", title: "Coming Soon", subtitle: "Movies arriving in the coming weeks." },
  { key: "top_rated", label: "Top Rated", title: "Top Rated Movies", subtitle: "The highest-rated films of all time." },
];

interface Props {
  searchParams: Promise<{ category?: string; genre?: string; page?: string }>;
}

export default async function MoviesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const category = CATEGORIES.find((c) => c.key === sp.category) ?? CATEGORIES[0];

  const genres = await getGenres("movie");
  const genre = genres.find((g) => g.id === Number.parseInt(sp.genre ?? "", 10));

  const data = genre ? await discover("movie", { genre: genre.id, page }) : await getMovies(category.key, page);

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (genre) params.set("genre", String(genre.id));
    else if (category.key !== "popular") params.set("category", category.key);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/movies?${qs}` : "/movies";
  };

  return (
    <BrowseLayout
      title={genre ? `${genre.name} Movies` : category.title}
      subtitle={genre ? `Popular ${genre.name.toLowerCase()} movies.` : category.subtitle}
      categories={CATEGORIES.map((c) => ({
        label: c.label,
        href: c.key === "popular" ? "/movies" : `/movies?category=${c.key}`,
        active: !genre && c.key === category.key,
      }))}
      genres={genres.map((g) => ({ label: g.name, href: `/movies?genre=${g.id}`, active: g.id === genre?.id }))}
      items={data.results}
      page={data.page}
      totalPages={data.totalPages}
      hrefFor={hrefFor}
    />
  );
}
