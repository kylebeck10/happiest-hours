"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TAG_COLORS } from "./TagBadge";

function createPinIcon(type, live) {
  const tc = TAG_COLORS[type] || TAG_COLORS.wine;
  const liveDot = live
    ? `<div style="position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:50%;background:#1D9E75;border:1.5px solid white;animation:pulse 2s infinite;"></div>`
    : "";
  const svg = `<svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="${tc.dot}"/>
    <circle cx="12" cy="11" r="5" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: `<div style="position:relative;display:inline-block;">${svg}${liveDot}</div>`,
    className: "",
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
  });
}

function createTooltipContent(venue) {
  return `<div style="font-family:'DM Sans',sans-serif;min-width:180px;">
    <p style="font-family:'Instrument Serif',serif;font-size:14px;color:#2A1E14;margin:0 0 2px;">${venue.name}</p>
    <p style="font-size:10px;color:#8A7E72;margin:0 0 4px;">
      ${venue.neighborhoodName} · ${venue.time}${venue.live ? ' · <span style="color:#1D9E75;font-weight:600;">Live</span>' : ""}
    </p>
    <p style="font-size:11px;color:#C45E20;margin:0;font-weight:600;">${venue.deal}</p>
  </div>`;
}

export default function MapView({ venues, hoveredVenue, onVenueHover, filteredIds }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [34.052, -118.3],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '© <a href="https://openstreetmap.org">OSM</a> © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Venue markers
    venues.forEach((venue) => {
      const marker = L.marker([venue.lat, venue.lng], {
        icon: createPinIcon(venue.type, venue.live),
      }).addTo(map);

      marker.bindTooltip(createTooltipContent(venue), {
        direction: "top",
        offset: [0, -34],
        className: "venue-tooltip",
      });

      marker.on("mouseover", () => {
        onVenueHover(venue.id);
        marker.openTooltip();
      });
      marker.on("mouseout", () => {
        onVenueHover(null);
        marker.closeTooltip();
      });

      markersRef.current[venue.id] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker opacity on filter change
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (el) {
        el.style.opacity = filteredIds.has(id) ? "1" : "0.15";
        el.style.pointerEvents = filteredIds.has(id) ? "auto" : "none";
        el.style.transition = "opacity 0.3s";
      }
    });
  }, [filteredIds]);

  // Highlight hovered marker — apply scale to inner div, NOT el (el has Leaflet's translate3d)
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const inner = el?.querySelector("div");
      if (inner) {
        inner.style.transform = hoveredVenue === id ? "scale(1.2)" : "scale(1)";
        inner.style.filter =
          hoveredVenue === id ? "drop-shadow(0 2px 6px rgba(42,30,20,0.25))" : "";
        inner.style.transition = "transform 0.15s, filter 0.15s";
      }
    });
  }, [hoveredVenue]);

  return (
    <>
      <style>{`
        .venue-tooltip { background: white !important; border: 1px solid #F0DFC8 !important; border-radius: 10px !important; padding: 8px 12px !important; box-shadow: 0 4px 16px rgba(42,30,20,0.12) !important; }
        .venue-tooltip::before { border-top-color: #F0DFC8 !important; }
        .leaflet-container { background: #F7F7F7 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
