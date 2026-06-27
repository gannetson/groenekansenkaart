"use client";

import { applyArtisticMapStyle, getMapStyleUrl } from "@/lib/artistic-map-style";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { geocodeAddress } from "@/lib/actions/projects";

type LocationPickerProps = {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  address?: string;
  onAddressChange?: (address: string) => void;
};

export function LocationPicker({
  latitude,
  longitude,
  onChange,
  address = "",
  onAddressChange,
}: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [geocodeQuery, setGeocodeQuery] = useState(address);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapStyleUrl(),
      center: [longitude || 4.497, latitude || 52.16],
      zoom: 14,
    });

    map.on("load", () => applyArtisticMapStyle(map));

    const marker = new mapboxgl.Marker({ draggable: true, color: "#1B5E3B" })
      .setLngLat([longitude || 4.497, latitude || 52.16])
      .addTo(map);

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      onChange(lngLat.lat, lngLat.lng);
    });

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      onChange(e.lngLat.lat, e.lngLat.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, onChange]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
    }
    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 500 });
  }, [latitude, longitude]);

  async function handleGeocode() {
    if (!geocodeQuery.trim()) return;
    setGeocoding(true);
    const result = await geocodeAddress(geocodeQuery);
    setGeocoding(false);
    if (result) {
      onChange(result.latitude, result.longitude);
      onAddressChange?.(result.placeName);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={geocodeQuery}
          onChange={(e) => setGeocodeQuery(e.target.value)}
          placeholder="Zoek adres in Leiden..."
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleGeocode())}
        />
        <Button type="button" onClick={handleGeocode} disabled={geocoding}>
          {geocoding ? "..." : "Zoek"}
        </Button>
      </div>
      <div
        ref={mapContainer}
        className="h-64 w-full overflow-hidden rounded-[var(--radius)] border-2 border-[var(--color-light)]"
      />
      <p className="text-xs text-[var(--color-secondary)]">
        Klik op de kaart of sleep de pin om de locatie te kiezen.
      </p>
    </div>
  );
}
