/**
 * Draws the logo with Calligram's own geometry pipeline: a closed path turned into polylines,
 * then filled with hachure lines at lineHeight spacing. Those lines are exactly the ones
 * layoutTextInPath sets text along, so the mark is a picture of what the library does.
 *
 * Only the geometry half of the pipeline is used, so this needs no text measurement and no DOM.
 *
 *     npm run build:logo
 */
import {writeFileSync} from "node:fs";
import {hachureLines} from "hachure-fill";
import {pointsOnPath} from "points-on-path";
import {pathCircle} from "../src/index.js";

const SIZE = 64;
const CENTER = SIZE / 2;
const RADIUS = 26;
const LINE_HEIGHT = 7;
const COLOR = "#00adb5";

const path = pathCircle(CENTER, CENTER, RADIUS);
const lines = hachureLines(pointsOnPath(path), LINE_HEIGHT, 0);

const round = (n) => Math.round(n * 100) / 100;

// Inset the ends a touch so the strokes sit inside the ring rather than touching it, and drop
// the short chords near the poles, which would render as stray dots under a round linecap.
const strokes = lines
  .filter(([[x1], [x2]]) => x2 - x1 >= 8)
  .map(([[x1, y1], [x2, y2]]) => {
    const inset = 2;
    return `    <line x1="${round(x1 + inset)}" y1="${round(y1)}" x2="${round(x2 - inset)}" y2="${round(y2)}" />`;
  })
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <title>Calligram</title>
  <circle cx="${CENTER}" cy="${CENTER}" r="${RADIUS}" fill="none" stroke="${COLOR}" stroke-width="2.5" />
  <g stroke="${COLOR}" stroke-width="2.5" stroke-linecap="round">
${strokes}
  </g>
</svg>
`;

writeFileSync(new URL("../public/logo.svg", import.meta.url), svg);
console.log(`wrote public/logo.svg — ${lines.length} hachure lines`);
