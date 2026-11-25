"use client";

import { useState } from "react";
import type { MovieSources, VideoQuality } from "@/lib/video-sources";

export default function MoviePlayer({
  title,
  sources,
}: {
  title: string;
  sources: MovieSources;
}) {
  const available = (["1080p", "720p"] as const).filter(
    (quality) => Boolean(sources[quality]),
  );

  const [quality, setQuality] = useState<VideoQuality>(
    available.includes("1080p") ? "1080p" : "720p",
  );

  const source = sources[quality];

  if (!source) {
    return (
      <div className="rounded-2xl bg-ink-800 p-8 text-center text-zinc-300">
        No authorised video source is available for this movie yet.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        <video
          key={source}
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          title={title}
        >
          <source src={source} />
          Your browser does not support HTML video playback.
        </video>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Quality:</span>
          {available.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuality(item)}
              aria-pressed={quality === item}
              className={
                quality === item
                  ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                  : "rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
              }
            >
              {item}
            </button>
          ))}
        </div>

        <a
          href={source}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          Download {quality}
        </a>
      </div>
    </section>
  );
}
