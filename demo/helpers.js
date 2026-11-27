/**
 * Small helpers the demos need that Calligram itself does not export: it computes text layout
 * and leaves drawing to you. Copied from Charming, where they lived in the wider toolkit.
 */

function px(n) {
  return typeof n === "number" ? `${n}px` : n;
}

/** The CSS `font` shorthand, in shorthand order. */
export function cssFont({
  fontStyle = "normal",
  fontVariant = "normal",
  fontWeight = "normal",
  fontSize = 10,
  fontFamily = "sans-serif",
} = {}) {
  return `${fontStyle} ${fontVariant} ${fontWeight} ${px(fontSize)} ${fontFamily}`.replace(/\s+/g, " ").trim();
}

export function pathCircle(cx, cy, r) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r}`;
}

export function pathRect(x, y, width, height) {
  return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
}

export function pathPolygon(points) {
  return `M ${points.map((p) => `${p[0]} ${p[1]}`).join(" L ")} Z`;
}
