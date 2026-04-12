import Link from "next/link";

export const metadata = {
  title: "Contact — Happiest Hours",
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFF7EE" }}>
      {/* Header */}
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
        <Link href="/explore" style={{ fontSize: 13, color: "#E07A3A", fontWeight: 600, textDecoration: "none" }}>
          Explore Deals →
        </Link>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "64px 24px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: 40,
            color: "#2A1E14",
            fontWeight: 400,
            margin: "0 0 12px",
            lineHeight: 1.1,
          }}
        >
          Get in touch
        </h1>
        <p style={{ fontSize: 16, color: "#8A7E72", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 420 }}>
          Have a venue to suggest, a deal that&rsquo;s out of date, or just want to say hi? We&rsquo;d love to hear from you.
        </p>

        {/* CTA card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F0DFC8",
            borderRadius: 16,
            padding: "28px 32px",
            width: "100%",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 18,
              color: "#2A1E14",
              margin: "0 0 6px",
              fontWeight: 400,
            }}
          >
            Email us
          </p>
          <p style={{ fontSize: 13, color: "#8A7E72", margin: "0 0 20px" }}>
            We typically respond within 1–2 business days.
          </p>
          <a
            href="mailto:hello@happiesthours.com"
            style={{
              display: "inline-block",
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: 20,
              background: "#E07A3A",
              color: "#fff",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            hello@happiesthours.com
          </a>
        </div>

        {/* Suggest a venue */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #F0DFC8",
            borderRadius: 16,
            padding: "28px 32px",
            width: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: 18,
              color: "#2A1E14",
              margin: "0 0 6px",
              fontWeight: 400,
            }}
          >
            Suggest a venue
          </p>
          <p style={{ fontSize: 13, color: "#8A7E72", margin: "0 0 20px", lineHeight: 1.6 }}>
            Know a great happy hour we&rsquo;re missing? Send us the venue name, neighborhood, deal details, and hours and we&rsquo;ll get it added.
          </p>
          <a
            href="mailto:hello@happiesthours.com?subject=Venue%20Suggestion"
            style={{
              display: "inline-block",
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 20,
              border: "1.5px solid #E07A3A",
              color: "#E07A3A",
              textDecoration: "none",
              background: "transparent",
            }}
          >
            Suggest a venue →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "14px 24px",
          borderTop: "1px solid #F0DFC8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "#8A7E72" }}>© 2026 Happiest Hours · Los Angeles</span>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/contact" style={{ fontSize: 11, color: "#8A7E72", textDecoration: "none" }}>Contact</Link>
          <Link href="/privacy" style={{ fontSize: 11, color: "#8A7E72", textDecoration: "none" }}>Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
