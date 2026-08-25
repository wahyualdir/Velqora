"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Visit {
  user_email: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  visited_at: string;
}

interface MapViewProps {
  visits: Visit[];
}

export default function MapView({ visits }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map centered on Indonesia
    const map = L.map(mapRef.current, {
      center: [-2.5, 118],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark-themed tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
    }).addTo(map);

    // Attribution (small)
    L.control.attribution({ position: "bottomright", prefix: "" }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Add markers whenever visits change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each visit
    visits.forEach((v) => {
      if (!v.latitude || !v.longitude) return;

      const marker = L.circleMarker([v.latitude, v.longitude], {
        radius: 6,
        fillColor: "#818cf8",
        color: "#4f46e5",
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.7,
      }).addTo(map);

      const time = new Date(v.visited_at).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });

      marker.bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; line-height: 1.5; color: #1e293b;">
          <div style="font-weight: 600; margin-bottom: 2px;">${v.user_email}</div>
          <div style="color: #64748b;">${v.city}, ${v.region}</div>
          <div style="color: #64748b;">${v.country}</div>
          <div style="color: #94a3b8; font-size: 10px; margin-top: 4px;">${time}</div>
        </div>
      `);
    });

    // Fit bounds if there are visits
    if (visits.length > 0) {
      const validVisits = visits.filter((v) => v.latitude && v.longitude);
      if (validVisits.length > 0) {
        const bounds = L.latLngBounds(validVisits.map((v) => [v.latitude, v.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      }
    }
  }, [visits]);

  return (
    <div ref={mapRef} className="w-full h-full" style={{ minHeight: 400, background: "#0a0f1a" }} />
  );
}
