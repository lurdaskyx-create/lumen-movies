import type { MediaItem } from "@/lib/types";
import { FilmIcon } from "./Icons";
import EmptyState from "./EmptyState";
import MovieCard from "./MovieCard";

interface Props {
  items: MediaItem[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function MediaGrid({
  items,
  emptyTitle = "Nothing to show yet",
  emptyDescription = "Try a different filter or come back later.",
}: Props) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={<FilmIcon width={28} height={28} />} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MovieCard key={`${item.mediaType}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
