export default function LiveBadge({ small = false }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: small ? 3 : 4,
        background: "rgba(255,255,255,0.92)",
        borderRadius: 12,
        padding: small ? "2px 6px 2px 5px" : "3px 8px 3px 6px",
      }}
    >
      <div
        style={{
          width: small ? 5 : 6,
          height: small ? 5 : 6,
          borderRadius: "50%",
          background: "#1D9E75",
          boxShadow: "0 0 6px #1D9E75",
          animation: "pulse 2s infinite",
        }}
      />
      <span
        style={{
          fontSize: small ? 8 : 9,
          fontWeight: 600,
          color: "#1D9E75",
          letterSpacing: 0.3,
        }}
      >
        LIVE
      </span>
    </div>
  );
}
