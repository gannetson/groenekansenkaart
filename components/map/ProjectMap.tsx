"use client";

import { ProjectWithImages } from "@/lib/actions/projects";
import { createProjectMarkerElement } from "@/components/map/createProjectMarkerElement";
import { ProjectPopup } from "@/components/map/ProjectPopup";
import { ProjectSidebar } from "@/components/map/ProjectSidebar";
import { applyArtisticMapStyle, getMapStyleUrl } from "@/lib/artistic-map-style";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const LEIDEN_CENTER: [number, number] = [4.497, 52.16];
const DEFAULT_ZOOM = 13.2;
const MAP_VIEW = { pitch: 30, bearing: -10 } as const;

function getProjectsBounds(projects: ProjectWithImages[]): mapboxgl.LngLatBounds | null {
  const withCoords = projects.filter(
    (p) => Number.isFinite(p.longitude) && Number.isFinite(p.latitude),
  );
  if (withCoords.length === 0) return null;

  const bounds = new mapboxgl.LngLatBounds();
  withCoords.forEach((p) => bounds.extend([p.longitude, p.latitude]));
  return bounds;
}

function fitMapToProjects(map: mapboxgl.Map, projects: ProjectWithImages[]) {
  const withCoords = projects.filter(
    (p) => Number.isFinite(p.longitude) && Number.isFinite(p.latitude),
  );
  if (withCoords.length === 0) return;

  if (withCoords.length === 1) {
    const [project] = withCoords;
    map.jumpTo({
      center: [project.longitude, project.latitude],
      zoom: 14,
      ...MAP_VIEW,
    });
    return;
  }

  const bounds = getProjectsBounds(projects);
  if (!bounds) return;

  map.fitBounds(bounds, {
    padding: 56,
    maxZoom: 14,
    duration: 0,
    ...MAP_VIEW,
  });
}

type ProjectMapProps = {
  projects: ProjectWithImages[];
};

export function ProjectMap({ projects }: ProjectMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const initialBoundsFitRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [mobileSheet, setMobileSheet] = useState<ProjectWithImages | null>(null);

  const updateMarkerSelection = useCallback((selectedProjectId: string | null) => {
    markersRef.current.forEach((marker) => {
      const el = marker.getElement();
      const isSelected =
        selectedProjectId !== null && el.dataset.projectId === selectedProjectId;
      el.classList.toggle("project-marker--selected", isSelected);
    });
  }, []);

  const openPopup = useCallback((map: mapboxgl.Map, project: ProjectWithImages) => {
    setSelectedId(project.id);
    updateMarkerSelection(project.id);

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      setMobileSheet(project);
      map.flyTo({
        center: [project.longitude, project.latitude],
        zoom: 14.5,
        duration: 800,
      });
      return;
    }

    setMobileSheet(null);

    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(
      <ProjectPopup project={project} onClose={() => popupRef.current?.remove()} />,
    );

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: true,
      offset: 28,
      className: "project-popup",
      maxWidth: "none",
    })
      .setLngLat([project.longitude, project.latitude])
      .setDOMContent(container)
      .addTo(map);

    popup.on("close", () => {
      setSelectedId(null);
      updateMarkerSelection(null);
      root.unmount();
      popupRef.current = null;
    });

    popupRef.current = popup;

    map.flyTo({
      center: [project.longitude, project.latitude],
      zoom: 14.5,
      duration: 800,
    });
  }, [updateMarkerSelection]);

  // Initialise map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
      return;
    }

    mapboxgl.accessToken = token;

    const style = getMapStyleUrl();

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center: LEIDEN_CENTER,
      zoom: DEFAULT_ZOOM,
      ...MAP_VIEW,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      applyArtisticMapStyle(map);
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Sync markers when map is ready or projects change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    projects.forEach((project) => {
      const el = createProjectMarkerElement(project.title);
      el.dataset.projectId = project.id;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        openPopup(map, project);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([project.longitude, project.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (!initialBoundsFitRef.current) {
      fitMapToProjects(map, projects);
      initialBoundsFitRef.current = true;
    }
  }, [projects, openPopup, mapReady]);

  const handleSidebarSelect = (project: ProjectWithImages) => {
    const map = mapRef.current;
    if (map) {
      openPopup(map, project);
    }
  };

  return (
    <div className="relative flex h-full min-h-[480px] flex-col gap-3 lg:flex-row lg:gap-4">
      <div className="hidden h-full shrink-0 lg:block lg:w-[32%] lg:max-w-[280px]">
        <ProjectSidebar
          projects={projects}
          selectedId={selectedId}
          onSelect={handleSidebarSelect}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      <div className="panel-card relative min-h-[480px] flex-1">
        <div ref={mapContainer} className="map-artistic h-full min-h-[480px] w-full" />

        {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)] p-8 text-center">
            <p className="text-[var(--color-primary)]">
              Stel <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in om de kaart te tonen.
            </p>
          </div>
        )}

        {mobileSheet && (
          <div className="fixed inset-x-0 bottom-0 z-50 p-4 lg:hidden">
            <div className="relative">
              <button
                onClick={() => {
                  setMobileSheet(null);
                  setSelectedId(null);
                  updateMarkerSelection(null);
                }}
                className="absolute -top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-lg"
                aria-label="Sluiten"
              >
                ×
              </button>
              <ProjectPopup
                project={mobileSheet}
                onClose={() => setMobileSheet(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
