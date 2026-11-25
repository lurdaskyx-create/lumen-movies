"use client";

import { useCallback, useState } from "react";
import { PlayIcon } from "./Icons";
import TrailerModal from "./TrailerModal";

export default function TrailerButton({ videoKey, title }: { videoKey: string; title: string }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary">
        <PlayIcon width={18} height={18} />
        Watch Trailer
      </button>
      {open && <TrailerModal videoKey={videoKey} title={title} onClose={close} />}
    </>
  );
}
