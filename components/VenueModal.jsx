"use client";

import { useEffect } from "react";
import LiveBadge from "./LiveBadge";
import TagBadge from "./TagBadge";
import { useIsLive } from "@/lib/useIsLive";

const PHOTO_GRADIENTS = [
  "linear-gradient(135deg, #F5D5C8 0%, #E8C4B0 50%, #D4A98A 100%)",
  "linear-gradient(135deg, #C8D8E8 0%, #B0C4D4 50%, #98B0C0 100%)",
  "linear-gradient(135deg, #D4E0C8 0%, #C0D0B0 50%, #A8BC98 100%)",
  "linear-gradient(135deg, #E8D4E0 0%, #D4C0D0 50%, #C0A8BC 100%)",
  "linear-gradient(135deg, #E8DCC8 0%, #D4C8B0 50%, #C0B498 100%)",
  "linear-gradient(135deg, #C8E0E8 0%, #B0D0D8 50%, #98BCC8 100%)",
];

export default function VenueModal({ venue, index, onClose }) {
  const live = useIsLive(venue);
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const gradient = PHOTO_GRADIENTS[index % PHOTO_GRADIENTS.length];

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42,30,20,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Modal card — stop clicks from closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(42,30,20,0.2)",
          animation: "floatUp 0.25s ease",
        }}
      >
        {/* Photo header */}
        <div
          style={{
            height: 200,
            background: gradient,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 56, filter: "saturate(0.8)" }}>{venue.img}</span>

          {live && (
            <div style={{ position: "absolute", top: 14, left: 14 }}>
              <LiveBadge />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#2A1E14",
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          {/* Vibe tag */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              background: "rgba(42,30,20,0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: 8,
              padding: "3px 10px",
            }}
          >
            <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>{venue.vibe}</span>
          </div>

          {venue.rating && (
            <div
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                background: "rgba(255,255,255,0.92)",
                borderRadius: 8,
                padding: "3px 10px",
              }}
            >
              <span style={{ fontSize: 12, color: "#E07A3A", fontWeight: 700 }}>
                {venue.rating} ★
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px" }}>
          {/* Name + category */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: 26,
                color: "#2A1E14",
                margin: 0,
                fontWeight: 400,
                lineHeight: 1.15,
                flex: 1,
                marginRight: 12,
              }}
            >
              {venue.name}
            </h2>
            <TagBadge type={venue.type} />
          </div>

          {/* Neighborhood */}
          <p style={{ fontSize: 13, color: "#8A7E72", margin: "0 0 16px" }}>
            {venue.neighborhoodName}
          </p>

          {/* Address (shown when available) */}
          {venue.address && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span style={{ fontSize: 13, color: "#8A7E72" }}>{venue.address}</span>
            </div>
          )}

          {/* Deal highlight */}
          <div
            style={{
              background: "rgba(224,122,58,0.06)",
              border: "1px solid rgba(224,122,58,0.15)",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "#E07A3A", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Happy Hour Deals
            </p>
            {/* dealDetails array if available, else fall back to deal string */}
            {venue.dealDetails ? (
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {venue.dealDetails.map((item, i) => (
                  <li key={i} style={{ fontSize: 13, color: "#C45E20", fontWeight: 600, padding: "2px 0" }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: 14, color: "#C45E20", fontWeight: 600, margin: 0 }}>
                {venue.deal}
              </p>
            )}
          </div>

          {/* Time + days */}
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span style={{ fontSize: 13, color: "#8A7E72" }}>{venue.time}</span>
            </div>
            {venue.days && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style={{ fontSize: 13, color: "#8A7E72" }}>{venue.days}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
