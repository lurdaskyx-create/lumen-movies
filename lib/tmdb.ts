/**
 * TMDB data layer. Runs on the SERVER only: the API credential is read from
 * process.env and is never sent to the browser.
 */
import type {
  CastMember,
  Genre,
  HeroItem,
  MediaDetails,
  MediaItem,
  MediaType,
  MovieCategory,
  Paginated,
  TVCategory,
} from "./types";

const API_BASE = "https://api.themoviedb.org/3";

export class TMDBError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "TMDBError";
    this.status = status;
  }
}

type Params = Record<string, string | number | undefined>;

/* ------------------------------ raw TMDB shapes ----------------------------- */

interface RawMedia {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: string;
}

interface RawPage {
  page: number;
  results: RawMedia[];
  total_pages: number;
  total_results: number;
}

interface RawVideo {
  key: string;
  site: string;
  type: string;
  official?: boolean;
}

interface RawDetails extends RawMedia {
  tagline?: string;
  runtime?: number | null;
  episode_run_time?: number[];
  genres?: Genre[];
  status?: string;
  original_language?: string;
  homepage?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: { id: number; name: string }[];
  videos?: { results: RawVideo[] };
  credits?: {
    cast?: { id: number; name: string; character?: string; profile_path?: string | null }[];
    crew?: { id: number; name: string; job?: string }[];
  };
  similar?: RawPage;
}

/* --------------------------------- fetching -------------------------------- */

function getCredential(): string {
  const value = (process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_KEY || "").trim();
  if (!value) {
    throw new TMDBError(
      "TMDB credentials are missing. Add TMDB_ACCESS_TOKEN (or TMDB_API_KEY) to your environment variables.",
      500,
    );
  }
  return value;
}

async function tmdb<T>(path: string, params: Params = {}, revalidate = 3600): Promise<T> {
  const credential = getCredential();
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = { accept: "application/json" };
  // A v4 "Read Access Token" is a JWT (starts with "eyJ"); a v3 key is a short hex string.
  if (credential.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${credential}`;
  } else {
    url.searchParams.set("api_key", credential);
  }

  const response = await fetch(url.toString(), { headers, next: { revalidate } });

  if (!response.ok) {
    if (response.status === 404) throw new TMDBError("Not found", 404);
    if (response.status === 401) {
      throw new TMDBError("TMDB rejected the credentials (401). Check TMDB_ACCESS_TOKEN / TMDB_API_KEY.", 401);
    }
    throw new TMDBError(`TMDB request failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}

/* ------------------------------- normalizers ------------------------------- */

function normalize(raw: RawMedia, fallback: MediaType): MediaItem {
  const mediaType: MediaType =
    raw.media_type === "tv" ? "tv" : raw.media_type === "movie" ? "movie" : fallback;
  return {
    id: raw.id,
    mediaType,
    title: raw.title ?? raw.name ?? "Untitled",
    overview: raw.overview ?? "",
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    rating: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    date: raw.release_date || raw.first_air_date || null,
    genreIds: raw.genre_ids ?? [],
  };
}

function normalizePage(data: RawPage, fallback: MediaType): Paginated<MediaItem> {
  return {
    results: (data.results ?? []).map((item) => normalize(item, fallback)),
    page: data.page,
    // TMDB refuses pages above 500.
    totalPages: Math.min(data.total_pages ?? 1, 500),
    totalResults: data.total_results ?? 0,
  };
}

function pickTrailerKey(videos: RawVideo[] = []): string | null {
  const rank = (v: RawVideo) => (v.type === "Trailer" ? 0 : v.type === "Teaser" ? 1 : 2) * 2 + (v.official ? 0 : 1);
  const sorted = videos.filter((v) => v.site === "YouTube").sort((a, b) => rank(a) - rank(b));
  return sorted[0]?.key ?? null;
}

/* --------------------------------- lists ---------------------------------- */

export async function getTrending(
  type: "all" | MediaType = "all",
  window: "day" | "week" = "week",
): Promise<Paginated<MediaItem>> {
  const data = await tmdb<RawPage>(`/trending/${type}/${window}`, {}, 1800);
  // "all" can include people; keep only movies and TV shows that have artwork.
  const filtered: RawPage = {
    ...data,
    results: (data.results ?? []).filter(
      (r) => r.media_type !== "person" && (r.poster_path || r.backdrop_path),
    ),
  };
  return normalizePage(filtered, type === "tv" ? "tv" : "movie");
}

export async function getMovies(category: MovieCategory, page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<RawPage>(`/movie/${category}`, { page }, 3600);
  return normalizePage(data, "movie");
}

export async function getTV(category: TVCategory, page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<RawPage>(`/tv/${category}`, { page }, 3600);
  return normalizePage(data, "tv");
}

export async function discover(
  type: MediaType,
  options: { genre?: number; page?: number; sortBy?: string } = {},
): Promise<Paginated<MediaItem>> {
  const { genre, page = 1, sortBy = "popularity.desc" } = options;
  const data = await tmdb<RawPage>(
    `/discover/${type}`,
    { page, sort_by: sortBy, include_adult: "false", with_genres: genre },
    3600,
  );
  return normalizePage(data, type);
}

export async function getGenres(type: MediaType): Promise<Genre[]> {
  const data = await tmdb<{ genres: Genre[] }>(`/genre/${type}/list`, {}, 86400);
  return data.genres ?? [];
}

export async function searchMulti(query: string, page = 1): Promise<Paginated<MediaItem>> {
  const data = await tmdb<RawPage>("/search/multi", { query, page, include_adult: "false" }, 600);
  const filtered: RawPage = {
    ...data,
    results: (data.results ?? []).filter((r) => r.media_type === "movie" || r.media_type === "tv"),
  };
  return normalizePage(filtered, "movie");
}

/* -------------------------------- trailers --------------------------------- */

export async function getTrailerKey(type: MediaType, id: number): Promise<string | null> {
  try {
    const data = await tmdb<{ results: RawVideo[] }>(
      `/${type}/${id}/videos`,
      { include_video_language: "en,null" },
      86400,
    );
    return pickTrailerKey(data.results);
  } catch {
    return null;
  }
}

/** Top trending movies with a backdrop, plus their trailers, for the home-page hero. */
export async function getHeroItems(genres: Genre[], count = 5): Promise<HeroItem[]> {
  const trending = await getTrending("movie", "week");
  const picks = trending.results.filter((m) => m.backdropPath && m.overview).slice(0, count);
  const genreName = new Map(genres.map((g) => [g.id, g.name]));
  return Promise.all(
    picks.map(async (item) => ({
      ...item,
      trailerKey: await getTrailerKey("movie", item.id),
      genreNames: item.genreIds
        .map((id) => genreName.get(id))
        .filter((name): name is string => Boolean(name))
        .slice(0, 3),
    })),
  );
}

/* --------------------------------- details --------------------------------- */

export async function getDetails(type: MediaType, id: number): Promise<MediaDetails> {
  const raw = await tmdb<RawDetails>(
    `/${type}/${id}`,
    { append_to_response: "videos,credits,similar", include_video_language: "en,null" },
    3600,
  );

  const base = normalize({ ...raw, genre_ids: raw.genres?.map((g) => g.id) ?? [] }, type);

  const cast: CastMember[] = (raw.credits?.cast ?? []).slice(0, 16).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character ?? "",
    profilePath: c.profile_path ?? null,
  }));

  const directors =
    type === "movie"
      ? Array.from(new Set((raw.credits?.crew ?? []).filter((c) => c.job === "Director").map((c) => c.name)))
      : (raw.created_by ?? []).map((c) => c.name);

  const similar = raw.similar
    ? normalizePage(raw.similar, type).results.filter((r) => r.posterPath).slice(0, 18)
    : [];

  return {
    ...base,
    tagline: raw.tagline ?? "",
    runtime: type === "movie" ? (raw.runtime ?? null) : (raw.episode_run_time?.[0] ?? null),
    genres: raw.genres ?? [],
    status: raw.status ?? "",
    language: raw.original_language ?? "",
    trailerKey: pickTrailerKey(raw.videos?.results),
    cast,
    similar,
    directors,
    seasons: raw.number_of_seasons ?? null,
    episodes: raw.number_of_episodes ?? null,
    homepage: raw.homepage || null,
  };
}
