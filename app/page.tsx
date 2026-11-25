import FilterPills from "@/components/FilterPills";
import HeroCarousel from "@/components/HeroCarousel";
import MediaRow from "@/components/MediaRow";
import { getGenres, getHeroItems, getMovies, getTrending, getTV } from "@/lib/tmdb";

// Rebuild this page in the background at most once an hour.
export const revalidate = 3600;

export default async function HomePage() {
  const genres = await getGenres("movie");

  const [hero, trending, nowPlaying, popular, topRated, upcoming, popularTV] = await Promise.all([
    getHeroItems(genres, 5),
    getTrending("all", "week"),
    getMovies("now_playing"),
    getMovies("popular"),
    getMovies("top_rated"),
    getMovies("upcoming"),
    getTV("popular"),
  ]);

  return (
    <>
      {hero.length > 0 ? <HeroCarousel items={hero} /> : <div className="h-20" />}

      <div className="-mt-6 relative z-10 pb-4">
        <section className="page-x py-3" aria-label="Browse by genre">
          <FilterPills
            label="Browse by genre"
            items={genres.map((genre) => ({ label: genre.name, href: `/movies?genre=${genre.id}` }))}
          />
        </section>

        <MediaRow title="Trending This Week" items={trending.results} />
        <MediaRow title="Now in Theaters" items={nowPlaying.results} href="/movies?category=now_playing" />
        <MediaRow title="Popular Movies" items={popular.results} href="/movies" />
        <MediaRow title="Popular TV Series" items={popularTV.results} href="/tv" />
        <MediaRow title="Top Rated" items={topRated.results} href="/movies?category=top_rated" />
        <MediaRow title="Coming Soon" items={upcoming.results} href="/movies?category=upcoming" />
      </div>
    </>
  );
}
