import {describe, expect, test} from "vitest";
import {cssFont, pathCircle, pathEllipse, pathPolygon, pathRect} from "../src/index.js";

// A path has to be closed for layoutTextInPath to fill it: either an explicit Z, or a final
// point back at the start. These helpers exist to get that right, so that is what is asserted.
function isClosed(d) {
  if (d.trim().endsWith("Z")) return true;
  const points = d.match(/-?[\d.]+ -?[\d.]+(?= [A-Z]|$)/g) ?? [];
  const start = d.match(/^M (-?[\d.]+ -?[\d.]+)/)?.[1];
  return points.at(-1) === start;
}

describe("pathCircle", () => {
  test("starts at the top and closes back on itself", () => {
    const d = pathCircle(100, 100, 50);
    expect(d.startsWith("M 100 50")).toBe(true);
    expect(isClosed(d)).toBe(true);
  });

  test("draws two half arcs of the given radius", () => {
    expect(pathCircle(0, 0, 10)).toBe("M 0 -10 A 10 10 0 1 0 0 10 A 10 10 0 1 0 0 -10");
  });
});

describe("pathEllipse", () => {
  test("closes back on itself", () => {
    expect(isClosed(pathEllipse(100, 100, 80, 40))).toBe(true);
  });

  test("matches pathCircle when the radii are equal", () => {
    expect(pathEllipse(40, 60, 25, 25)).toBe(pathCircle(40, 60, 25));
  });

  test("differs from a circle when the radii differ", () => {
    expect(pathEllipse(40, 60, 50, 25)).not.toBe(pathCircle(40, 60, 50));
  });
});

describe("pathRect", () => {
  test("walks the four corners and closes", () => {
    expect(pathRect(10, 20, 100, 50)).toBe("M 10 20 L 110 20 L 110 70 L 10 70 Z");
  });
});

describe("pathPolygon", () => {
  test("joins the points and closes", () => {
    expect(
      pathPolygon([
        [0, 0],
        [10, 0],
        [5, 8],
      ]),
    ).toBe("M 0 0 L 10 0 L 5 8 Z");
  });

  test("a single point still produces a closed path", () => {
    expect(pathPolygon([[3, 4]])).toBe("M 3 4 Z");
  });
});

describe("cssFont", () => {
  test("emits the shorthand in order", () => {
    expect(
      cssFont({fontStyle: "italic", fontVariant: "normal", fontWeight: "700", fontSize: 14, fontFamily: "Inter"}),
    ).toBe("italic normal 700 14px Inter");
  });

  test("appends px to a numeric size but leaves a string alone", () => {
    expect(cssFont({fontSize: 18})).toContain("18px");
    expect(cssFont({fontSize: "18px"})).toContain("18px");
    expect(cssFont({fontSize: "2rem"})).toContain("2rem");
  });

  test("fills in defaults for a partial object, and for no argument at all", () => {
    expect(cssFont({fontFamily: "Inter"})).toBe("normal normal normal 10px Inter");
    expect(cssFont()).toBe("normal normal normal 10px sans-serif");
  });

  test("is the string prepareText measures with", async () => {
    await import("./measure.js");
    const {prepareText} = await import("../src/index.js");
    const options = {fontSize: 16, fontFamily: "Inter", fontStyle: "italic"};
    // prepareText copies its font fields onto the prepared value, so they can be fed back in.
    const prepared = prepareText("hello", options);
    expect(cssFont(prepared)).toBe(cssFont({...options, fontVariant: "normal", fontWeight: "normal"}));
  });
});
