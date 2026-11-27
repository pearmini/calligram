/**
 * jsdom has no Canvas 2D, and Pretext measures text through it: `getMeasureContext()` prefers
 * `OffscreenCanvas`, falls back to `document.createElement("canvas").getContext("2d")`, and
 * throws if neither works. Across all of Pretext, the only context members it ever touches are
 * `ctx.font` and `ctx.measureText(s).width`, so this is the whole surface it needs.
 *
 * The fixed metric — 8px per grapheme, the same one Charming used — is what keeps every snapshot
 * coordinate deterministic on any machine, instead of depending on installed fonts.
 */

// Pretext prefers OffscreenCanvas, so leaving it defined would bypass the stub entirely.
delete globalThis.OffscreenCanvas;

if (typeof HTMLCanvasElement !== "undefined") {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (type !== "2d") return original.apply(this, [type, ...rest]);
    return {
      font: "",
      measureText: (text) => ({width: Math.max(0, [...String(text)].length * 8)}),
    };
  };
}
