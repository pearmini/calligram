import * as d3 from "d3";

function px(n) {
  return typeof n === "number" ? `${n}px` : n;
}

// The same formula Charming's cm.pathCircle used, so the recorded `d` attributes stay identical.
export function pathCircle(cx, cy, r) {
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r}`;
}

export function renderPretext({
  texts,
  lines,
  width = 400,
  height = 400,
  fontSize = 16,
  fontFamily = "Inter",
  fontStyle = "normal",
  fontVariant = "normal",
  fontWeight = "normal",
  path,
}) {
  const svg = d3
    .create("svg")
    // Declaring xmlns makes each snapshot a standalone SVG document, saved as an .svg file.
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("overflow", "visible");

  svg.append("path").attr("d", path).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1);

  svg
    .selectAll("line")
    .data(lines)
    .join("line")
    .attr("x1", (line) => line[0][0])
    .attr("y1", (line) => line[0][1])
    .attr("x2", (line) => line[1][0])
    .attr("y2", (line) => line[1][1])
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  svg
    .selectAll("text")
    .data(texts)
    .join("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-size", px(fontSize))
    .attr("font-family", fontFamily)
    .attr("font-style", fontStyle)
    .attr("font-variant", fontVariant)
    .attr("font-weight", fontWeight)
    .attr("transform", (text) => `translate(${text.x}, ${text.y}) rotate(${text.angle})`)
    .text((text) => text.text);

  return svg.node();
}
