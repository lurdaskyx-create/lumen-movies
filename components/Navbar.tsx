"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon, MenuIcon, SearchIcon } from "./Icons";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useWatchlist } from "./WatchlistProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Series" },
  { href: "/watchlist", label: "Watchlist" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { items, ready } = useWatchlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile panels after navigating.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const solid = scrolled || menuOpen || searchOpen;
  const count = ready ? items.length : 0;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "border-b border-white/5 bg-ink-950/85 backdrop-blur-xl" : "bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <div className="page-x flex h-16 items-center gap-6 sm:h-[68px]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm font-medium transition",
                isActive(link.href) ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white",
              )}
            >
              {link.label}
              {link.href === "/watchlist" && count > 0 && (
                <span className="ml-1.5 rounded-full bg-brand-violet px-1.5 py-0.5 text-[10px] font-bold leading-none">{count}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-64 md:block lg:w-72">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((v) => !v);
              setMenuOpen(false);
            }}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            className="grid h-10 w-10 place-items-center rounded-full text-zinc-200 transition hover:bg-white/10"
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v);
              setSearchOpen(false);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative grid h-10 w-10 place-items-center rounded-full text-zinc-200 transition hover:bg-white/10"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
            {count > 0 && !menuOpen && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-violet" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="page-x pb-4 md:hidden animate-fade-in">
          <SearchBar autoFocus />
        </div>
      )}

      {menuOpen && (
        <nav aria-label="Mobile" className="page-x pb-4 md:hidden animate-fade-in">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition",
                    isActive(link.href) ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5",
                  )}
                >
                  {link.label}
                  {link.href === "/watchlist" && count > 0 && (
                    <span className="rounded-full bg-brand-violet px-2 py-0.5 text-xs font-bold">{count}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
