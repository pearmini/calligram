function px(n) {
  return typeof n === "number" ? `${n}px` : n;
}

/**
 * Builds the CSS `font` shorthand, in shorthand order. This is the string prepareText measures
 * with, so setting `context.font` or a CSS `font` property to it guarantees that what you draw
 * matches what was laid out.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
 */
export function cssFont({
  fontStyle = "normal",
  fontVariant = "normal",
  fontWeight = "normal",
  fontSize = 10,
  fontFamily = "sans-serif",
} = {}) {
  return `${fontStyle} ${fontVariant} ${fontWeight} ${px(fontSize)} ${fontFamily}`.replace(/\s+/g, " ").trim();
}
