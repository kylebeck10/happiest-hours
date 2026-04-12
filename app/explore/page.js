"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import VenueCard from "@/components/VenueCard";
import VenueModal from "@/components/VenueModal";
import deals from "@/data/deals.json";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEAL_TYPES = ["All", "Wine", "Cocktails", "Beer", "Food"];
const TYPE_MAP = { Wine: "wine", Cocktails: "cocktail", Beer: "beer", Food: "food" };

// Collect unique vibes sorted alphabetically
const ALL_VIBES = [...new Set(deals.map((d) => d.vibe))].sort();

const TYPE_COLORS = {
  Wine:      { bg: "#FBEAF0", text: "#72243E", dot: "#D4537E" },
  Cocktails: { bg: "#E1F5EE", text: "#085041", dot: "#1D9E75" },
  Beer:      { bg: "#EEEDFE", text: "#3C3489", dot: "#534AB7" },
  Food:      { bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
};

function FilterPill({ label, isActive, onClick, activeColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "6px 14px",
        borderRadius: 20,
        cursor: "pointer",
        transition: "all 0.2s",
        border: `1.5px solid ${isActive ? (activeColor?.dot || "#E07A3A") : "#F0DFC8"}`,
        background: isActive ? (activeColor?.bg || "rgba(224,122,58,0.1)") : "white",
        color: isActive ? (activeColor?.text || "#C45E20") : "#8A7E72",
      }}
    >
      {label}
    </button>
  );
}

export default function ExplorePage() {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [hoveredVenue, setHoveredVenue] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const filtered = useMemo(() => {
    return deals.filter((v) => {
      if (selectedType !== "All" && v.type !== TYPE_MAP[selectedType]) return false;
      if (selectedVibe && v.vibe !== selectedVibe) return false;
      return true;
    });
  }, [selectedType, selectedVibe]);

  const filteredIds = useMemo(() => new Set(filtered.map((v) => v.id)), [filtered]);

  const hasActiveFilter = selectedType !== "All" || selectedVibe !== null;

  return (
    <div style={{ minHeight: "100vh", background: "#FFF7EE" }}>
      {selectedVenue && (
        <VenueModal
          venue={selectedVenue.venue}
          index={selectedVenue.index}
          onClose={() => setSelectedVenue(null)}
        />
      )}

      {/* Sticky Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 24px",
          borderBottom: "1px solid #F0DFC8",
          background: "rgba(255,247,238,0.85)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 22, color: "#2A1E14" }}>Happiest</span>
          <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 22, color: "#E07A3A", fontStyle: "italic" }}>Hours</span>
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/contact" style={{ fontSize: 13, color: "#8A7E72", textDecoration: "none" }}>Contact</Link>
          <Link href="/privacy" style={{ fontSize: 13, color: "#8A7E72", textDecoration: "none" }}>Privacy</Link>
        </nav>
      </header>

      <div style={{ padding: "20px 24px 0", maxWidth: 960, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: 30,
            color: "#2A1E14",
            margin: "0 0 16px",
            fontWeight: 400,
          }}
        >
          Find your happy hour
        </h1>

        {/* Map */}
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #F0DFC8",
            overflow: "hidden",
            position: "relative",
            height: 320,
          }}
        >
          <MapView
            venues={deals}
            hoveredVenue={hoveredVenue}
            onVenueHover={setHoveredVenue}
            filteredIds={filteredIds}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 24px 0" }}>
        {/* Row 1: Deal type */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#8A7E72", letterSpacing: 0.8, textTransform: "uppercase", marginRight: 2 }}>Type</span>
          {DEAL_TYPES.map((type) => (
            <FilterPill
              key={type}
              label={type}
              isActive={selectedType === type}
              onClick={() => setSelectedType(selectedType === type && type !== "All" ? "All" : type)}
              activeColor={type === "All" ? null : TYPE_COLORS[type]}
            />
          ))}
        </div>

        {/* Row 2: Vibe */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#8A7E72", letterSpacing: 0.8, textTransform: "uppercase", marginRight: 2 }}>Vibe</span>
          {ALL_VIBES.map((vibe) => (
            <FilterPill
              key={vibe}
              label={vibe}
              isActive={selectedVibe === vibe}
              onClick={() => setSelectedVibe(selectedVibe === vibe ? null : vibe)}
              activeColor={{ bg: "rgba(42,30,20,0.08)", text: "#2A1E14", dot: "#2A1E14" }}
            />
          ))}
        </div>

        {/* Result count + clear */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#8A7E72" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          {hasActiveFilter && (
            <button
              onClick={() => { setSelectedType("All"); setSelectedVibe(null); }}
              style={{
                fontSize: 11,
                color: "#E07A3A",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                padding: 0,
              }}
            >
              Clear filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Card grid */}
      <div style={{ padding: "0 24px 40px", maxWidth: 960, margin: "0 auto" }}>
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((venue, i) => (
              <div
                key={venue.id}
                style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}
                onMouseEnter={() => setHoveredVenue(venue.id)}
                onMouseLeave={() => setHoveredVenue(null)}
              >
                <VenueCard
                  venue={venue}
                  index={i}
                  highlighted={hoveredVenue === venue.id}
                  onClick={() => setSelectedVenue({ venue, index: i })}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              background: "white",
              borderRadius: 16,
              border: "1px solid #F0DFC8",
            }}
          >
            <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>🍹</span>
            <p style={{ fontSize: 15, color: "#2A1E14", margin: "0 0 4px", fontWeight: 500 }}>
              No deals here yet
            </p>
            <p style={{ fontSize: 13, color: "#8A7E72", margin: 0 }}>
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
