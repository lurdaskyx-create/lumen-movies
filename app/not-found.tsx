import EmptyState from "@/components/EmptyState";
import { FilmIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="pt-28">
      <EmptyState
        title="This page could not be found"
        description="The movie or page you are looking for may have moved or never existed."
        icon={<FilmIcon width={28} height={28} />}
        action={{ href: "/", label: "Back to home" }}
      />
    </div>
  );
}
