import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-ink-900/60">
      <div className="page-x flex flex-col gap-8 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-zinc-400">{SITE_TAGLINE}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-300">
          <Link href="/movies" className="hover:text-white">Movies</Link>
          <Link href="/tv" className="hover:text-white">TV Series</Link>
          <Link href="/watchlist" className="hover:text-white">Watchlist</Link>
          <Link href="/search" className="hover:text-white">Search</Link>
        </nav>
      </div>

      <div className="border-t border-white/5">
        <div className="page-x flex flex-col gap-2 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Movie and TV data provided by{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline-offset-2 hover:underline">
              TMDB
            </a>
            .
          </p>
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
