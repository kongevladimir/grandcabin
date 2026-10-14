"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function GalleryOriginal({ photo, alt, nb, openFullImage = false }: {
  photo: { original: string; preview: string; originalParts?: string[]; originalMime?: string; originalSha256?: string };
  alt: string;
  nb: boolean;
  openFullImage?: boolean;
}) {
  const [source, setSource] = useState(photo.originalParts?.length ? photo.preview : photo.original);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(photo.originalParts?.length ? "loading" : "ready");

  useEffect(() => {
    if (!photo.originalParts?.length) return;
    const controller = new AbortController();
    let objectUrl: string | undefined;
    async function load() {
      try {
        const pieces = await Promise.all(photo.originalParts!.map(async url => {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error("Photo could not load");
          return response.arrayBuffer();
        }));
        if (controller.signal.aborted) return;
        const blob = new Blob(pieces, { type: photo.originalMime });
        objectUrl = URL.createObjectURL(blob);
        setSource(objectUrl);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }
    void load();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  return <>
    {openFullImage && status === "ready" ? <a className="retreat-original-photo-link" href={source} target="_blank" rel="noreferrer" aria-label={nb ? "Åpne bildet i originalstørrelse" : "Open photo at original size"}><Image src={source} alt={alt} fill unoptimized sizes="100vw" /><span aria-hidden="true">↗</span></a> : <Image src={source} alt={alt} fill unoptimized sizes="100vw" />}
    {status !== "ready" && <p className="retreat-gallery-loading" role="status">{status === "error" ? (nb ? "Originalbildet kunne ikke lastes. Lukk og prøv igjen." : "The original photo could not load. Close and try again.") : (nb ? "Laster bildet i full kvalitet …" : "Loading the full-quality photo …")}</p>}
  </>;
}
