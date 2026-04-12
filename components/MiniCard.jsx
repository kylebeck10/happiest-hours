"use client";

import { TAG_COLORS } from "./TagBadge";
import { useIsLive } from "@/lib/useIsLive";

export default function MiniCard({ deal, delay = 0 }) {
  const tc = TAG_COLORS[deal.type] || TAG_COLORS.wine;
  const live = useIsLive(deal);

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        padding: "10px 14px",
        border: "1px solid #F0DFC8",
        animation: `floatUp 0.6s ease ${delay}s both`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: tc.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: tc.dot,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 14,
              color: "#2A1E14",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {deal.name}
          </p>
          {live && (
            <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0, marginLeft: 8 }}>
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#1D9E75",
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ fontSize: 8, fontWeight: 600, color: "#1D9E75", letterSpacing: 0.5 }}>
                LIVE
              </span>
            </div>
          )}
        </div>
        <p style={{ fontSize: 11, color: "#8A7E72", margin: "1px 0 0" }}>
          {deal.neighborhoodName} · {deal.deal} · {deal.time}
        </p>
      </div>
    </div>
  );
}
