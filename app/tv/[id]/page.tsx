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
  if (!id) return { title: "Series not found" };
  try {
    const show = await getDetails("tv", id);
    const image = imageUrl(show.backdropPath ?? show.posterPath, "w780");
    return {
      title: show.title,
      description: truncate(show.overview, 160),
      openGraph: { title: show.title, description: truncate(show.overview, 160), images: image ? [image] : [] },
    };
  } catch {
    return { title: "TV Series" };
  }
}

export default async function TVShowPage({ params }: Props) {
  const id = parseId((await params).id);
  if (!id) notFound();

  let show: MediaDetails;
  try {
    show = await getDetails("tv", id);
  } catch (error) {
    if (error instanceof TMDBError && error.status === 404) notFound();
    throw error;
  }

  return <MediaDetail details={show} />;
}
