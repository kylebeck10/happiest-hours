import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Happiest Hours",
};

export default function PrivacyPage() {
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
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: 40,
            color: "#2A1E14",
            fontWeight: 400,
            margin: "0 0 8px",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: "#8A7E72", margin: "0 0 40px" }}>
          Last updated: April 2026
        </p>

        {[
          {
            title: "What we collect",
            body: "Happiest Hours does not require you to create an account or provide any personal information to use the app. We do not collect names, email addresses, or payment information.",
          },
          {
            title: "Analytics",
            body: "We may use anonymous, aggregate analytics (such as page view counts) to understand how people use the app and improve it. This data cannot be used to identify individual users.",
          },
          {
            title: "Local storage",
            body: "Some features (such as saved venues) use your browser's local storage to remember your preferences. This data stays on your device and is never sent to our servers.",
          },
          {
            title: "Third-party services",
            body: "The map is powered by OpenStreetMap and CARTO. Visiting the explore page may result in map tile requests being sent to their servers. See the OpenStreetMap Privacy Policy and CARTO Privacy Policy for details.",
          },
          {
            title: "Cookies",
            body: "We do not use tracking cookies or advertising cookies. Any cookies set are strictly necessary for the app to function.",
          },
          {
            title: "Changes",
            body: "We may update this policy as the app evolves. Any significant changes will be noted at the top of this page with a revised date.",
          },
          {
            title: "Contact",
            body: "Questions about privacy? Reach us via the Contact page.",
          },
        ].map(({ title, body }) => (
          <section key={title} style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: 20,
                color: "#2A1E14",
                fontWeight: 400,
                margin: "0 0 8px",
              }}
            >
              {title}
            </h2>
            <p style={{ fontSize: 15, color: "#8A7E72", lineHeight: 1.7, margin: 0 }}>
              {body}
            </p>
          </section>
        ))}
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
