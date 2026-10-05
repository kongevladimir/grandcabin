import { mkdirSync, writeFileSync } from "node:fs";

// OpenFreeMap Liberty is the base style; retain its source attribution.
const response = await fetch("https://tiles.openfreemap.org/styles/liberty");
if (!response.ok) throw new Error(`Map style request failed: ${response.status}`);
const style = await response.json();
style.name = "Grandcabin regional road map";
style.metadata = { ...style.metadata, "grandcabin:base-style": "https://tiles.openfreemap.org/styles/liberty" };
const places = ["Hemsedal", "Geilo", "Nesbyen", "Norefjell", "Kongsberg", "Sandefjord", "Kristiansand", "Larvik", "Fredrikstad", "Gardermoen", "Lillehammer", "Trysil", "Oslo", "Bergen", "Drammen"];

style.layers = style.layers.filter(layer => !/natural_earth|ferry|rail|one_way|label_state|poi_|building-3d/.test(layer.id));
for (const layer of style.layers) {
  const sourceLayer = layer["source-layer"];
  if (sourceLayer === "transportation" || sourceLayer === "transportation_name") {
    layer.filter = ["all", ...(layer.filter ? [layer.filter] : []), ["!=", ["get", "class"], "ferry"], ["!=", ["get", "subclass"], "ferry"]];
  }
  if (sourceLayer === "boundary") {
    layer.filter = ["all", ...(layer.filter ? [layer.filter] : []), ["!=", ["coalesce", ["get", "maritime"], 0], 1]];
  }
  if (sourceLayer === "place" && !layer.id.includes("country")) {
    layer.filter = ["all", ...(layer.filter ? [layer.filter] : []), ["!", ["in", ["get", "name"], ["literal", places]]]];
  }
  if (layer.id === "background") layer.paint["background-color"] = "#ede8de";
  if (layer.id === "water") layer.paint["fill-color"] = "#c9d9dc";
  if (layer.id === "landcover_wood" || layer.id === "landcover_grass") {
    layer.paint["fill-color"] = "#dbe0ce";
    layer.paint["fill-opacity"] = .45;
  }
  if (/^(road|bridge|tunnel)_(motorway|trunk_primary|secondary_tertiary)$/.test(layer.id)) {
    const major = !layer.id.endsWith("secondary_tertiary");
    layer.minzoom = 5;
    layer.paint["line-color"] = major ? "#ab8656" : "#aaa698";
    layer.paint["line-width"] = ["interpolate", ["linear"], ["zoom"], 5, major ? .8 : .4, 7, major ? 1.8 : .85, 12, major ? 4 : 2.5];
    layer.paint["line-opacity"] = 1;
  }
  if (layer.id === "highway-shield-non-us") layer.minzoom = 6;
}
delete style.sources.ne2_shaded;
mkdirSync("public/maps", { recursive: true });
writeFileSync("public/maps/regional-style.json", JSON.stringify(style, null, 2) + "\n");
