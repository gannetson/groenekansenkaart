import type mapboxgl from "mapbox-gl";

/** Pastel green & blue palette aligned with site theme */
export const ARTISTIC_MAP_COLORS = {
  background: "#eef6eb",
  water: "#7ec8e3",
  waterDeep: "#4da6d9",
  park: "#a8d08d",
  grass: "#c8e6a0",
  wood: "#6b9b5a",
  sand: "#e8f0d8",
  building: "#e4ede1",
  buildingOutline: "#c5d9bc",
  road: "#ffffff",
  roadMinor: "#f5faf3",
  roadCasing: "#d4e8d0",
  washGreen: "rgba(168, 208, 141, 0.14)",
  washBlue: "rgba(126, 200, 227, 0.12)",
} as const;

export const DEFAULT_ARTISTIC_MAP_STYLE =
  "mapbox://styles/mapbox/light-v11";

export function getMapStyleUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || DEFAULT_ARTISTIC_MAP_STYLE
  );
}

function findLayerInsertBefore(map: mapboxgl.Map): string | undefined {
  const layers = map.getStyle()?.layers ?? [];
  const firstSymbol = layers.find((layer) => layer.type === "symbol");
  return firstSymbol?.id;
}

function safeSetPaint(
  map: mapboxgl.Map,
  layerId: string,
  property: string,
  value: unknown,
) {
  try {
    if (map.getLayer(layerId)) {
      const setPaint = map.setPaintProperty as (
        id: string,
        prop: string,
        val: unknown,
      ) => mapboxgl.Map;
      setPaint(layerId, property, value);
    }
  } catch {
    // Layer may not support this paint property in the active style
  }
}

function recolorBaseLayers(map: mapboxgl.Map) {
  const layers = map.getStyle()?.layers ?? [];

  for (const layer of layers) {
    const { id, type } = layer;

    if (type === "background") {
      safeSetPaint(map, id, "background-color", ARTISTIC_MAP_COLORS.background);
      continue;
    }

    if (type === "fill" && /water/i.test(id)) {
      safeSetPaint(map, id, "fill-color", ARTISTIC_MAP_COLORS.water);
      safeSetPaint(map, id, "fill-opacity", 0.92);
      continue;
    }

    if (
      type === "fill" &&
      /(park|green|grass|wood|forest|vegetation|landcover|national-park|pitch)/i.test(
        id,
      )
    ) {
      safeSetPaint(map, id, "fill-color", ARTISTIC_MAP_COLORS.park);
      safeSetPaint(map, id, "fill-opacity", 0.78);
      continue;
    }

    if (type === "fill" && /(sand|beach)/i.test(id)) {
      safeSetPaint(map, id, "fill-color", ARTISTIC_MAP_COLORS.sand);
      continue;
    }

    if (type === "fill" && /building/i.test(id)) {
      safeSetPaint(map, id, "fill-color", ARTISTIC_MAP_COLORS.building);
      safeSetPaint(map, id, "fill-opacity", 0.85);
      continue;
    }

    if (type === "line" && /waterway/i.test(id)) {
      safeSetPaint(map, id, "line-color", ARTISTIC_MAP_COLORS.waterDeep);
      safeSetPaint(map, id, "line-opacity", 0.75);
      continue;
    }

    if (type === "line" && /road.*(case|casing)/i.test(id)) {
      safeSetPaint(map, id, "line-color", ARTISTIC_MAP_COLORS.roadCasing);
      continue;
    }

    if (type === "line" && /(road|street|bridge|tunnel)/i.test(id)) {
      safeSetPaint(map, id, "line-color", ARTISTIC_MAP_COLORS.road);
      safeSetPaint(map, id, "line-opacity", 0.95);
    }
  }
}

function addGreenSpaceLayer(map: mapboxgl.Map, beforeId?: string) {
  if (map.getLayer("artistic-green-spaces")) return;

  const style = map.getStyle();
  const hasComposite = style?.sources && "composite" in style.sources;
  if (!hasComposite) return;

  try {
    map.addLayer(
      {
        id: "artistic-green-spaces",
        type: "fill",
        source: "composite",
        "source-layer": "landuse",
        filter: [
          "match",
          ["get", "class"],
          ["park", "grass", "wood", "scrub", "orchard", "vineyard"],
          true,
          false,
        ],
        paint: {
          "fill-color": [
            "match",
            ["get", "class"],
            "park",
            ARTISTIC_MAP_COLORS.park,
            "grass",
            ARTISTIC_MAP_COLORS.grass,
            "wood",
            ARTISTIC_MAP_COLORS.wood,
            ARTISTIC_MAP_COLORS.grass,
          ],
          "fill-opacity": 0.55,
        },
      },
      beforeId,
    );
  } catch {
    // Style may not expose landuse on composite
  }
}

function addWaterGlowLayer(map: mapboxgl.Map, beforeId?: string) {
  if (map.getLayer("artistic-water-glow")) return;

  const style = map.getStyle();
  const hasComposite = style?.sources && "composite" in style.sources;
  if (!hasComposite) return;

  try {
    map.addLayer(
      {
        id: "artistic-water-glow",
        type: "line",
        source: "composite",
        "source-layer": "water",
        paint: {
          "line-color": ARTISTIC_MAP_COLORS.waterDeep,
          "line-opacity": 0.35,
          "line-width": ["interpolate", ["linear"], ["zoom"], 10, 2, 14, 6],
          "line-blur": 2,
        },
      },
      beforeId,
    );
  } catch {
    // Water source-layer unavailable in this style
  }
}

function addAtmosphereWash(map: mapboxgl.Map, beforeId?: string) {
  if (map.getSource("artistic-wash")) return;

  map.addSource("artistic-wash", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-180, -85],
            [180, -85],
            [180, 85],
            [-180, 85],
            [-180, -85],
          ],
        ],
      },
    },
  });

  map.addLayer(
    {
      id: "artistic-wash",
      type: "fill",
      source: "artistic-wash",
      paint: {
        "fill-color": ARTISTIC_MAP_COLORS.washGreen,
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          0.22,
          14,
          0.1,
        ],
      },
    },
    beforeId,
  );
}

/** Apply green-blue illustrated styling and decorative overlay layers. */
export function applyArtisticMapStyle(map: mapboxgl.Map) {
  if (!map.isStyleLoaded()) return;

  recolorBaseLayers(map);

  const beforeId = findLayerInsertBefore(map);
  addGreenSpaceLayer(map, beforeId);
  addWaterGlowLayer(map, beforeId);
  addAtmosphereWash(map, beforeId);
}
