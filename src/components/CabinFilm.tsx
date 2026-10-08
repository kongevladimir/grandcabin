"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Language } from "./useSiteLanguage";

const videoId = "6awBZOKkiw8";
type FilmPlayer = { playVideo(): void; pauseVideo(): void; mute(): void; destroy(): void };
type YouTubeApi = {
  Player: new (element: HTMLElement, options: {
    videoId: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady(event: { target: FilmPlayer }): void;
      onStateChange(event: { data: number }): void;
    };
  }) => FilmPlayer;
};
type FilmWindow = Window & { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YouTubeApi> | undefined;

function loadYouTubeApi() {
  const filmWindow = window as FilmWindow;
  if (filmWindow.YT?.Player) return Promise.resolve(filmWindow.YT);
  if (!apiPromise) {
    apiPromise = new Promise<YouTubeApi>((resolve, reject) => {
      const previousCallback = filmWindow.onYouTubeIframeAPIReady;
      filmWindow.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        if (filmWindow.YT) resolve(filmWindow.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => { apiPromise = undefined; reject(new Error("Film player unavailable")); };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

export function CabinFilm({ language, description }: { language: Language; description: string }) {
  const nb = language === "nb";
  const sentenceEnd = description.indexOf(". ");
  const statementLead = sentenceEnd === -1 ? description : description.slice(0, sentenceEnd + 1);
  const statementDetail = sentenceEnd === -1 ? "" : description.slice(sentenceEnd + 2);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<FilmPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let disposed = false;
    const container = host.current;
    loadYouTubeApi().then(api => {
      if (disposed || !container) return;
      const mount = document.createElement("div");
      container.appendChild(mount);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      player.current = new api.Player(mount, {
        videoId,
        playerVars: { autoplay: reducedMotion ? 0 : 1, mute: 1, controls: 0, loop: 1, playlist: videoId, playsinline: 1, rel: 0, disablekb: 1, origin: window.location.origin },
        events: {
          onReady: event => {
            if (disposed) return;
            const frame = container.querySelector("iframe");
            if (frame) { frame.title = "Grandcabin · Turufjell"; frame.tabIndex = -1; frame.setAttribute("aria-hidden", "true"); }
            event.target.mute();
            if (!reducedMotion) event.target.playVideo();
            setReady(true);
          },
          onStateChange: event => { if (!disposed) setPlaying(event.data === 1); },
        },
      });
    }).catch(() => { /* Keep the existing poster visible if the background player is blocked. */ });
    return () => { disposed = true; player.current?.destroy(); player.current = null; container?.replaceChildren(); };
  }, []);

  return <>
    <section className="retreat-cabin-video-hero" aria-labelledby="retreat-cabin-video-title">
      <Image className="retreat-cabin-video-poster" src="/images/living.avif" alt="" fill priority sizes="100vw" />
      <div className="retreat-cabin-video-frame" ref={host} />
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
        <button disabled={!ready} onClick={() => playing ? player.current?.pauseVideo() : player.current?.playVideo()} aria-label={nb ? (playing ? "Sett bakgrunnsvideo på pause" : "Spill bakgrunnsvideo") : (playing ? "Pause background video" : "Play background video")}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button>
      </div>
    </section>
  </>;
}
