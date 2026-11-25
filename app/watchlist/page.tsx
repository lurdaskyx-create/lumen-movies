import type { Metadata } from "next";
import WatchlistView from "@/components/WatchlistView";

export const metadata: Metadata = {
  title: "My Watchlist",
  robots: { index: false },
};

export default function WatchlistPage() {
  return <WatchlistView />;
}
