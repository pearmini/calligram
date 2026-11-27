/**
 * Builders for the closed `d` strings layoutTextInPath fills. Each returns a plain string, so
 * you can pass it straight to a <path>, a Path2D, or anywhere else a `d` attribute goes.
 *
 * A path has to be closed to be filled: an open one encloses no area for the text to flow into.
 */

export function pathCircle(cx, cy, r) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r}`;
}

export function pathEllipse(cx, cy, rx, ry) {
  return `M ${cx} ${cy - ry} A ${rx} ${ry} 0 1 0 ${cx} ${cy + ry} A ${rx} ${ry} 0 1 0 ${cx} ${cy - ry}`;
}

export function pathRect(x, y, width, height) {
  return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
}

export function pathPolygon(points) {
  return `M ${points.map((p) => `${p[0]} ${p[1]}`).join(" L ")} Z`;
}
