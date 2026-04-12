"use client";

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

export default function VenueCard({ venue, index, highlighted, onClick }) {
  const live = useIsLive(venue);

  return (
    <div
      onClick={onClick}
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        overflow: "hidden",
        border: highlighted ? "1.5px solid #E07A3A" : "1px solid #F0DFC8",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        transform: highlighted ? "translateY(-2px)" : undefined,
        boxShadow: highlighted ? "0 8px 24px rgba(42,30,20,0.1)" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!highlighted) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(42,30,20,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!highlighted) {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }
      }}
    >
      {/* Photo area */}
      <div
        style={{
          height: 100,
          background: PHOTO_GRADIENTS[index % PHOTO_GRADIENTS.length],
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 28, filter: "saturate(0.8)" }}>{venue.img}</span>

        {live && (
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <LiveBadge />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            background: "rgba(42,30,20,0.6)",
            backdropFilter: "blur(8px)",
            borderRadius: 8,
            padding: "2px 8px",
          }}
        >
          <span style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}>{venue.vibe}</span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <h3
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 16,
              color: "#2A1E14",
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.2,
              flex: 1,
              marginRight: 8,
            }}
          >
            {venue.name}
          </h3>
          <span style={{ fontSize: 11, color: "#E07A3A", fontWeight: 600, whiteSpace: "nowrap" }}>
            {venue.rating} ★
          </span>
        </div>

        <p style={{ fontSize: 10.5, color: "#8A7E72", margin: "0 0 8px", letterSpacing: 0.2 }}>
          {venue.neighborhoodName}
        </p>

        <div
          style={{
            background: "rgba(224,122,58,0.06)",
            borderRadius: 8,
            padding: "6px 8px",
            marginBottom: 8,
            border: "1px solid rgba(224,122,58,0.12)",
          }}
        >
          <p style={{ fontSize: 11.5, color: "#C45E20", margin: 0, fontWeight: 600 }}>
            {venue.deal}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span style={{ fontSize: 10.5, color: "#8A7E72" }}>{venue.time}</span>
          </div>
          <TagBadge type={venue.type} />
        </div>
      </div>
    </div>
  );
}
