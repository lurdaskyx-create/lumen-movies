import Image from "next/image";
import type { CastMember } from "@/lib/types";
import { imageUrl } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function CastList({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;

  return (
    <section className="py-4" aria-label="Top cast">
      <div className="page-x">
        <h2 className="mb-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">Top Cast</h2>
        <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {cast.map((person) => {
            const photo = imageUrl(person.profilePath, "w185");
            return (
              <li key={person.id} className="w-[104px] shrink-0 text-center sm:w-[120px]">
                <div className="relative mx-auto h-[104px] w-[104px] overflow-hidden rounded-full bg-ink-600 ring-1 ring-white/10 sm:h-[120px] sm:w-[120px]">
                  {photo ? (
                    <Image src={photo} alt="" fill sizes="120px" className="object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-xl font-semibold text-zinc-400">{initials(person.name)}</span>
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-medium">{person.name}</p>
                {person.character && <p className="truncate text-xs text-zinc-400">{person.character}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
