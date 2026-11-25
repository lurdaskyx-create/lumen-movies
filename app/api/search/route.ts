import { NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

/**
 * Live search suggestions. The browser calls this route; this route calls TMDB
 * with the secret key, so the key never leaves the server.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await searchMulti(query);
    return NextResponse.json(
      { results: data.results.slice(0, 6) },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch {
    return NextResponse.json({ results: [], error: "Search is unavailable right now." }, { status: 502 });
  }
}
