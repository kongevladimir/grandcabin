"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import type { FeatureCollection, Point } from "geojson";
import type { Language } from "@/components/useSiteLanguage";
import "maplibre-gl/dist/maplibre-gl.css";

// Kartverket's public place-name and address APIs provide these coordinates.
const destinations = [
  { name: "Hemsedal", lat: 60.8501, lon: 8.61638 },
  { name: "Geilo", lat: 60.53372, lon: 8.20897 },
  { name: "Nesbyen", lat: 60.56809, lon: 9.10276, priority: .2 },
  { name: "Norefjell", lat: 60.29722, lon: 9.4666 },
  { name: "Kongsberg", lat: 59.66347, lon: 9.64741 },
  { name: "Sandefjord", lat: 59.13133, lon: 10.22234 },
  { name: "Kristiansand", lat: 58.14615, lon: 7.99573 },
  { name: "Larvik", lat: 59.05328, lon: 10.03518 },
  { name: "Fredrikstad", lat: 59.21817, lon: 10.92976 },
  { name: "Gardermoen (OSL)", lat: 60.19395, lon: 11.09948, airport: true },
  { name: "Lillehammer", lat: 61.11514, lon: 10.46628 },
  { name: "Trysil", lat: 61.3162, lon: 12.25943 },
  { name: "Oslo", lat: 59.91273, lon: 10.74609, priority: .1 },
  { name: "Bergen", lat: 60.39323, lon: 5.3245 },
  { name: "Drammen", lat: 59.74389, lon: 10.20448 },
  { name: "Turufjell\nGrandcabin", lat: 60.46898363947388, lon: 9.500311105951718, cabin: true },
];

const places: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: destinations.map(({ name, lat, lon, cabin, airport, priority }) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lon, lat] },
    properties: {
      name, cabin: Boolean(cabin), airport: Boolean(airport), priority: cabin ? 0 : priority ?? 1,
      anchor: name === "Nesbyen" ? "bottom" : ["Geilo", "Norefjell", "Kongsberg", "Larvik"].includes(name) ? "right" : "left",
      offset: name === "Nesbyen" ? [0, -.8] : ["Geilo", "Norefjell", "Kongsberg", "Larvik"].includes(name) ? [-.75, 0] : [.75, 0],
    },
  })),
};

export function RegionalMap({ language }: { language: Language }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let disposed = false;
    let observer: ResizeObserver | undefined;

    async function initialise() {
      const { Map, NavigationControl, ScaleControl, setWorkerUrl } = await import("maplibre-gl");
      if (disposed || !container.current) return;
      setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      const map = new Map({
        container: container.current,
        style: "/maps/regional-style.json",
        center: [9, 59.8],
        zoom: 6,
        minZoom: 5,
        maxZoom: 14,
        renderWorldCopies: false,
        scrollZoom: false,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.touchZoomRotate.disableRotation();
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new ScaleControl({ maxWidth: 90, unit: "metric" }), "bottom-left");

      function overview() {
        map.fitBounds([[4.8, 57.85], [12.9, 61.65]], {
          padding: { top: 55, bottom: 55, left: 45, right: 45 },
          duration: 0,
        });
      }
      overview();
      observer = new ResizeObserver(() => { map.resize(); overview(); });
      observer.observe(container.current);

      map.on("load", () => {
        if (disposed) return;
        map.addSource("grandcabin-places", { type: "geojson", data: places });
        map.addLayer({
          id: "grandcabin-place-dots", type: "circle", source: "grandcabin-places",
          paint: {
            "circle-color": ["case", ["get", "cabin"], "#bd8e57", "#17202c"],
            "circle-radius": ["case", ["get", "cabin"], 7, 3.5],
            "circle-stroke-color": "#fff",
            "circle-stroke-width": ["case", ["get", "cabin"], 2, 1],
          },
        });
        map.addLayer({
          id: "grandcabin-place-names", type: "symbol", source: "grandcabin-places",
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Noto Sans Regular"],
            "text-size": ["case", ["get", "cabin"], 15, 12],
            "text-anchor": ["get", "anchor"],
            "text-offset": ["get", "offset"],
            "text-justify": "auto",
            "text-max-width": 12,
            "text-padding": 1,
            "text-allow-overlap": true,
            "symbol-sort-key": ["get", "priority"],
          },
          paint: { "text-color": "#17202c", "text-halo-color": "#f6f3eb", "text-halo-width": 2 },
        });
        map.addLayer({
          id: "grandcabin-airport", type: "symbol", source: "grandcabin-places",
          filter: ["==", ["get", "airport"], true],
          layout: { "icon-image": "airport_11", "icon-size": 1.4, "icon-offset": [18, -14], "icon-allow-overlap": true },
        });
        setStatus("ready");
      });
      map.on("error", event => {
        // A source/style failure needs a useful alternative; transient tile errors do not.
        if (!map.isStyleLoaded() && event.error.message.includes("regional-style")) setStatus("failed");
      });
    }
    initialise().catch(() => { if (!disposed) setStatus("failed"); });
    return () => {
      disposed = true;
      observer?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="retreat-regional-map" aria-label={language === "nb" ? "Veikart med Turufjell og andre reisemål" : "Road map showing Turufjell and other destinations"}>
      <div className="retreat-regional-map-canvas" ref={container} />
      {status !== "ready" && <div className="retreat-regional-map-status"><p>{language === "nb" ? status === "failed" ? "Kartet kunne ikke lastes." : "Laster kart …" : status === "failed" ? "The map could not load." : "Loading map …"}</p>{status === "failed" && <a href="https://www.google.com/maps/search/?api=1&query=%C3%98vre%20Turusvingen%207%20Fl%C3%A5" target="_blank" rel="noreferrer">{language === "nb" ? "ÅPNE KART" : "OPEN MAP"} ↗</a>}</div>}
    </div>
  );
}
