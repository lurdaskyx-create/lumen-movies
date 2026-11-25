import { notFound } from "next/navigation";
import MoviePlayer from "@/components/MoviePlayer";
import { getMovieSources } from "@/lib/video-sources";
import { getDetails, TMDBError } from "@/lib/tmdb";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: Props) {
  const { id: value } = await params;
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) notFound();

  let movie;

  try {
    movie = await getDetails("movie", id);
  } catch (error) {
    if (error instanceof TMDBError && error.status === 404) notFound();
    throw error;
  }

  const sources = getMovieSources(id);

  return (
    <main className="page-x min-h-screen pb-16 pt-28">
      <a
        href={`/movies/${id}`}
        className="mb-6 inline-flex text-sm text-zinc-400 hover:text-white"
      >
        ← Back to movie
      </a>

      <h1 className="mb-6 font-display text-2xl font-bold sm:text-3xl">
        {movie.title}
      </h1>

      <MoviePlayer title={movie.title} sources={sources} />
    </main>
  );
}
