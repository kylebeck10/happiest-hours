"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MiniCard from "@/components/MiniCard";
import deals from "@/data/deals.json";
import { isLive } from "@/lib/isLive";

const PREVIEW_DEALS = deals.slice(0, 5);
const NEIGHBORHOODS = ["Silver Lake", "DTLA", "Hollywood", "Santa Monica", "Echo Park"];

export default function LandingPage() {
  const [entered, setEntered] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    setEntered(true);
    const compute = () => setLiveCount(deals.filter((d) => isLive(d)).length);
    compute();
    const interval = setInterval(compute, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF7EE",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background circles */}
      <div style={{ position: "absolute", top: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(224,122,58,0.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, left: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(212,83,126,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "10%", width: 180, height: 180, borderRadius: "50%", background: "rgba(29,158,117,0.03)", pointerEvents: "none" }} />

      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          animation: entered ? "fadeIn 0.5s ease" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, color: "#2A1E14" }}>
            Happiest
          </span>
          <span style={{ fontFamily: "var(--font-serif), serif", fontSize: 24, color: "#E07A3A", fontStyle: "italic" }}>
            Hours
          </span>
        </div>
        <button
          style={{
            fontSize: 13,
            fontWeight: 600,
            padding: "8px 20px",
            borderRadius: 20,
            border: "1.5px solid #E07A3A",
            background: "transparent",
            color: "#E07A3A",
            cursor: "pointer",
            transition: "all 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E07A3A";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#E07A3A";
          }}
        >
          Sign In
        </button>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            maxWidth: 920,
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Left — copy */}
          <div style={{ animation: entered ? "floatUp 0.6s ease 0.1s both" : "none" }}>
            {/* Neighborhood pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {NEIGHBORHOODS.map((hood, i) => (
                <span
                  key={hood}
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: "#FFFFFF",
                    border: "1px solid #F0DFC8",
                    color: "#8A7E72",
                    letterSpacing: 0.3,
                    animation: entered ? `floatUp 0.4s ease ${0.3 + i * 0.06}s both` : "none",
                  }}
                >
                  {hood}
                </span>
              ))}
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: 48,
                color: "#2A1E14",
                margin: "0 0 12px",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Go out more.
              <br />
              Spend less.
              <br />
              <span style={{ color: "#E07A3A", fontStyle: "italic" }}>Be happier.</span>
            </h1>

            <p style={{ fontSize: 16, color: "#8A7E72", margin: "0 0 28px", lineHeight: 1.6, maxWidth: 380 }}>
              Every happy hour deal in LA, all in one place. Find what&rsquo;s pouring near you right now.
            </p>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link
                href="/explore"
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  padding: "12px 28px",
                  borderRadius: 24,
                  border: "none",
                  background: "#E07A3A",
                  color: "#fff",
                  cursor: "pointer",
                  letterSpacing: 0.3,
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(224,122,58,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Explore Happy Hours →
              </Link>
              <span style={{ fontSize: 12, color: "#8A7E72" }}>No signup needed</span>
            </div>

            {/* Live counter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 24,
                animation: entered ? "floatUp 0.5s ease 0.6s both" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#1D9E75",
                    boxShadow: "0 0 8px #1D9E75",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: 12, color: "#1D9E75", fontWeight: 600 }}>
                  {liveCount} deals live right now
                </span>
              </div>
              <span style={{ fontSize: 12, color: "#8A7E72" }}>across LA</span>
            </div>
          </div>

          {/* Right — preview cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PREVIEW_DEALS.map((deal, i) => (
              <MiniCard key={deal.id} deal={deal} delay={0.3 + i * 0.1} />
            ))}

            <div
              style={{
                textAlign: "center",
                padding: "8px 0",
                animation: entered ? "floatUp 0.4s ease 0.9s both" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#E07A3A",
                  fontWeight: 500,
                  fontStyle: "italic",
                  fontFamily: "var(--font-serif), serif",
                }}
              >
                + {deals.length - 5} more deals across LA neighborhoods
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "14px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #F0DFC8",
          animation: entered ? "fadeIn 0.5s ease 0.8s both" : "none",
        }}
      >
        <span style={{ fontSize: 11, color: "#8A7E72" }}>© 2026 Happiest Hours · Los Angeles</span>
        <div style={{ display: "flex", gap: 16 }}>
          {[["Contact", "/contact"], ["Privacy", "/privacy"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: 11, color: "#8A7E72", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
