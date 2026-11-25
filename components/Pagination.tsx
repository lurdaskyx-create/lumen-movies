import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}

function pageList(page: number, total: number): Array<number | "gap"> {
  const wanted = new Set<number>([1, total, page - 1, page, page + 1]);
  const sorted = Array.from(wanted)
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export default function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;

  const itemClass =
    "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium ring-1 ring-inset transition";

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(itemClass, "bg-white/5 ring-white/10 hover:bg-white/10")}>
          ← Prev
        </Link>
      ) : (
        <span className={cn(itemClass, "cursor-not-allowed text-zinc-600 ring-white/5")}>← Prev</span>
      )}

      {pageList(page, totalPages).map((entry, i) =>
        entry === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-zinc-500" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={hrefFor(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={cn(
              itemClass,
              entry === page ? "bg-white text-ink-950 ring-white" : "bg-white/5 ring-white/10 hover:bg-white/10",
            )}
          >
            {entry}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={cn(itemClass, "bg-white/5 ring-white/10 hover:bg-white/10")}>
          Next →
        </Link>
      ) : (
        <span className={cn(itemClass, "cursor-not-allowed text-zinc-600 ring-white/5")}>Next →</span>
      )}
    </nav>
  );
}
