const TAG_COLORS = {
  wine: { bg: "#FBEAF0", text: "#72243E", dot: "#D4537E" },
  cocktail: { bg: "#E1F5EE", text: "#085041", dot: "#1D9E75" },
  beer: { bg: "#EEEDFE", text: "#3C3489", dot: "#534AB7" },
  food: { bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
};

const LABELS = {
  wine: "Wine",
  cocktail: "Cocktail",
  beer: "Beer",
  food: "Food",
};

export default function TagBadge({ type }) {
  const tc = TAG_COLORS[type] || TAG_COLORS.wine;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 10,
        background: tc.bg,
        color: tc.text,
      }}
    >
      {LABELS[type] || type}
    </span>
  );
}

export { TAG_COLORS };
