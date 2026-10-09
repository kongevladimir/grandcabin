"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Language } from "./useSiteLanguage";

export function CabinFilm({ language, description }: { language: Language; description: string }) {
  const nb = language === "nb";
  const sentenceEnd = description.indexOf(". ");
  const statementLead = sentenceEnd === -1 ? description : description.slice(0, sentenceEnd + 1);
  const statementDetail = sentenceEnd === -1 ? "" : description.slice(sentenceEnd + 2);
  const player = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = player.current;
    if (!video) return;
    video.muted = true;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void video.play().catch(() => { /* The play button remains available if autoplay is blocked. */ });
    }
    return () => video.pause();
  }, []);

  return <>
    <section className="retreat-cabin-video-hero" aria-labelledby="retreat-cabin-video-title">
      <Image className="retreat-cabin-video-poster" src="/images/living.avif" alt="" fill priority sizes="100vw" />
      <video
        className="retreat-cabin-local-video"
        ref={player}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => { setReady(false); setPlaying(false); }}
      >
        <source src="/videos/grandcabin-hero-hd.webm" type='video/webm; codecs="vp9,opus"' />
        <source src="/videos/grandcabin-hero.mp4" type="video/mp4" />
      </video>
      <div className="retreat-cabin-video-copy">
        <span className="retreat-cabin-welcome">{nb ? "Velkommen til Grandcabin på Turufjell | Norge" : "Welcome to Grandcabin at Turufjell | Norway"}</span>
        <h1 id="retreat-cabin-video-title">{nb ? "Tidløs" : "Timeless"} <em>{nb ? "eleganse" : "Elegance"}</em></h1>
        <p className="retreat-cabin-video-subtitle">{nb ? "Et eksklusivt fjellhjem på Turufjell" : "An exclusive mountain home at Turufjell"}<span>{nb ? "Ski inn, ski ut – en eksklusiv fjellopplevelse" : "Ski-in, ski-out — a refined mountain escape"}</span></p>
      </div>
      <div className="retreat-cabin-video-statement">
        <p className="retreat-cabin-statement-lead">{statementLead}</p>
        {statementDetail && <p className="retreat-cabin-statement-detail">{statementDetail}</p>}
      </div>
      <div className="retreat-cabin-video-bottom">
        <span>700 {nb ? "MOH" : "M ABOVE SEA LEVEL"} · TURUFJELL</span>
        <a href="#retreat-cabin-video-intro">{nb ? "OPPDAG GRANDCABIN" : "DISCOVER GRANDCABIN"}<span aria-hidden="true">↓</span></a>
        <button disabled={!ready} onClick={() => playing ? player.current?.pause() : player.current?.play().catch(() => setPlaying(false))} aria-label={nb ? (playing ? "Sett bakgrunnsvideo på pause" : "Spill bakgrunnsvideo") : (playing ? "Pause background video" : "Play background video")}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button>
      </div>
    </section>
  </>;
}
