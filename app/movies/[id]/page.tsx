import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MediaDetail from "@/components/MediaDetail";
import { getDetails, TMDBError } from "@/lib/tmdb";
import type { MediaDetails } from "@/lib/types";
import { imageUrl, truncate } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

function parseId(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseId((await params).id);
  if (!id) return { title: "Movie not found" };
  try {
    const movie = await getDetails("movie", id);
    const image = imageUrl(movie.backdropPath ?? movie.posterPath, "w780");
    return {
      title: movie.title,
      description: truncate(movie.overview, 160),
      openGraph: { title: movie.title, description: truncate(movie.overview, 160), images: image ? [image] : [] },
    };
  } catch {
    return { title: "Movie" };
  }
}

export default async function MoviePage({ params }: Props) {
  const id = parseId((await params).id);
  if (!id) notFound();

  let movie: MediaDetails;
  try {
    movie = await getDetails("movie", id);
  } catch (error) {
    if (error instanceof TMDBError && error.status === 404) notFound();
    throw error;
  }

  return <MediaDetail details={movie} />;
}
