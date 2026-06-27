"use client";

import { applyArtisticMapStyle, getMapStyleUrl } from "@/lib/artistic-map-style";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

type DetailMapProps = {
  latitude: number;
  longitude: number;
};

export function DetailMap({ latitude, longitude }: DetailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapStyleUrl(),
      center: [longitude, latitude],
      zoom: 15,
      interactive: false,
    });

    map.on("load", () => applyArtisticMapStyle(map));

    new mapboxgl.Marker({ color: "#1B5E3B" })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainer}
      className="h-48 w-full overflow-hidden rounded-2xl border-2 border-green-100 sm:h-64"
    />
  );
}
