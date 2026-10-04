import type { Language } from "@/components/useSiteLanguage";

// Representative coordinates from Kartverket's public place-name API:
// https://ws.geonorge.no/stedsnavn/v1/navn
const destinations = [
  { name: "Hemsedal", lat: 60.8501, lon: 8.61638, labelX: 280, labelY: 550 },
  { name: "Geilo", lat: 60.53372, lon: 8.20897, labelX: 292, labelY: 600 },
  { name: "Nesbyen", lat: 60.56809, lon: 9.10276, labelX: 320, labelY: 637 },
  { name: "Norefjell", lat: 60.29722, lon: 9.4666, labelX: 361, labelY: 675 },
  { name: "Kongsberg", lat: 59.66347, lon: 9.64741, labelX: 332, labelY: 714 },
  { name: "Sandefjord", lat: 59.13133, lon: 10.22234, labelX: 413, labelY: 782 },
  { name: "Kristiansand", lat: 58.14615, lon: 7.99573, labelX: 287, labelY: 847 },
  { name: "Larvik", lat: 59.05328, lon: 10.03518, labelX: 374, labelY: 751 },
  { name: "Fredrikstad", lat: 59.21817, lon: 10.92976, labelX: 521, labelY: 741 },
  { name: "Gardermoen (OSL)", lat: 60.19395, lon: 11.09948, labelX: 490, labelY: 671, airport: true },
  { name: "Lillehammer", lat: 61.11514, lon: 10.46628, labelX: 482, labelY: 514 },
  { name: "Trysil", lat: 61.3162, lon: 12.25943, labelX: 553, labelY: 490 },
];

export function RegionalMapPlaces({ language }: { language: Language }) {
  return (
    <svg className="retreat-regional-places" viewBox="0 0 1024 1024" role="img" aria-label={language === "nb" ? "Steder rundt Turufjell og Oslo lufthavn Gardermoen" : "Places around Turufjell and Oslo Airport Gardermoen"}>
      {destinations.map(({ name, lat, lon, labelX, labelY, airport }) => {
        // Match the existing zoom-6 Web Mercator tile grid (x=32, y=16).
        const x = lon / 360 * 16384;
        const y = (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * 16384 - 4096;
        const width = name.length * 6.4 + (airport ? 30 : 16);
        const lineX = Math.max(labelX + 8, Math.min(x, labelX + width - 8));
        return (
          <g key={name}>
            <line x1={x} y1={y} x2={lineX} y2={labelY + 11} />
            <circle cx={x} cy={y} r="3.5" />
            <rect x={labelX} y={labelY} width={width} height="22" rx="3" />
            <text x={labelX + 8} y={labelY + 15}>{name}{airport && <tspan aria-hidden="true"> ✈︎</tspan>}</text>
          </g>
        );
      })}
    </svg>
  );
}
