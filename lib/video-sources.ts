import "server-only";

export type VideoQuality = "720p" | "1080p";

export interface MovieSources {
  "720p"?: string;
  "1080p"?: string;
}

function getAllowedHosts(): Set<string> {
  return new Set(
    (process.env.LUMEN_VIDEO_HOSTS || "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getMovieSources(movieId: number): MovieSources {
  const raw = process.env.LUMEN_MOVIE_SOURCES;

  if (!raw) return {};

  try {
    const all = JSON.parse(raw) as Record<string, MovieSources>;
    const sources = all[String(movieId)];

    if (!sources || typeof sources !== "object") return {};

    const allowedHosts = getAllowedHosts();
    const result: MovieSources = {};

    for (const quality of ["720p", "1080p"] as const) {
      const value = sources[quality];
      if (!value) continue;

      try {
        const url = new URL(value);

        if (
          url.protocol === "https:" &&
          allowedHosts.has(url.hostname.toLowerCase())
        ) {
          result[quality] = url.toString();
        }
      } catch {
        continue;
      }
    }

    return result;
  } catch {
    return {};
  }
}
