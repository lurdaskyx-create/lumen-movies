export type MediaType = "movie" | "tv";

export type MovieCategory = "popular" | "top_rated" | "now_playing" | "upcoming";
export type TVCategory = "popular" | "top_rated" | "on_the_air" | "airing_today";

/** A movie or TV show in the shape every card/grid/row in the site uses. */
export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  /** 0 - 10 */
  rating: number;
  voteCount: number;
  /** Release date (movies) or first air date (TV), as yyyy-mm-dd */
  date: string | null;
  genreIds: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Paginated<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MediaDetails extends MediaItem {
  tagline: string;
  /** Minutes (movie runtime, or typical episode length for TV) */
  runtime: number | null;
  genres: Genre[];
  status: string;
  language: string;
  trailerKey: string | null;
  cast: CastMember[];
  similar: MediaItem[];
  /** Directors for movies, creators for TV */
  directors: string[];
  seasons: number | null;
  episodes: number | null;
  homepage: string | null;
}

export interface HeroItem extends MediaItem {
  trailerKey: string | null;
  genreNames: string[];
}

/** What we keep in the visitor's browser for the watchlist. */
export interface WatchlistItem extends MediaItem {
  addedAt: number;
}
