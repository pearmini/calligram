<img src="./public/logo.svg" width="72" height="72" alt="" align="right" />

# Calligram

A **calligram** is text arranged so that it forms a shape. This is a small library for making
them: it flows a string into a **closed** shape described by an SVG
[`d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d) path, on top of
[Pretext](https://github.com/chenglou/pretext). Pure-arithmetic measurement and line breaking
keep it fast — there is no DOM layout and no reflow.

Calligram computes positions and leaves drawing to you, so it works with SVG, Canvas, plain DOM,
or anything else that can place a string at a point and angle.

## Installation

```sh
npm install calligram
```

## Usage

Call [`layoutTextInPath`](#layouttextinpathoptions) with a string and a **closed** path. It
returns `texts` (fragments with positions and angles), `lines` (the hachure segments the text was
laid along, useful for debugging), and the font fields and `path` you passed in.

```js
import {layoutTextInPath} from "calligram";

// Any closed `d` string works. This one is a circle.
const path = "M 160 10 A 150 150 0 1 0 160 310 A 150 150 0 1 0 160 10";

const layout = layoutTextInPath({
  text: "Hello, Calligram! I love generative art!",
  path,
  fontSize: 12,
  fontFamily: "Inter",
});
```

Then draw `layout.texts`. Each item has `text`, `x`, `y` and `angle` (in degrees).

### Rendering with SVG

Bind `texts` to `<text>` nodes and use `transform` for position and rotation. With
[d3](https://d3js.org/):

```js
import * as d3 from "d3";

const svg = d3.create("svg").attr("width", 320).attr("height", 320).attr("viewBox", "0 0 320 320");

svg
  .selectAll("text")
  .data(layout.texts)
  .join("text")
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "central")
  .attr("font-size", `${layout.fontSize}px`)
  .attr("font-family", layout.fontFamily)
  .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${d.angle})`)
  .text((d) => d.text);

document.body.append(svg.node());
```

### Rendering with Canvas

Apply the transform to the context before drawing each fragment.

```js
const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 300;

const context = canvas.getContext("2d");
context.fillStyle = "#222";
context.font = `${layout.fontSize}px ${layout.fontFamily}`;
context.textAlign = "center";
context.textBaseline = "middle";

for (const t of layout.texts) {
  context.save();
  context.translate(t.x, t.y);
  context.rotate((t.angle * Math.PI) / 180);
  context.fillText(t.text, 0, 0);
  context.restore();
}
```

## Options

### Setting line height

Pass **`lineHeight`** to change the spacing between lines. The default is `fontSize * 1.5`.

```js
const layout = layoutTextInPath({
  // ...
  lineHeight: 30,
});
```

### Rotating the text

Pass **`angle`** (in degrees) to rotate the direction the fill lines run, which changes how the
text follows the shape.

```js
const layout = layoutTextInPath({
  // ...
  angle: 25,
});
```

### Disabling repetition

By default, when the text runs out the cursor resets and layout continues, cycling until the
shape is full. Set **`repeat`** to `false` to stop instead — useful when you have enough text to
fill the shape once.

```js
const layout = layoutTextInPath({
  // ...
  repeat: false,
});
```

### Preparing explicitly

By default `layoutTextInPath` prepares your string from the given font options and memoizes that
work by text and font settings. As long as those stay the same, you can call it again with a new
`path` (or other options) without remeasuring the string.

If you would rather avoid that machinery — or you want to reuse one prepared value yourself —
call [`prepareText`](#preparetexttext-options) and pass the result as **`prepared`**.

```js
import {layoutTextInPath, prepareText} from "calligram";

const prepared = prepareText(longText, {fontSize: 14, fontFamily: "Inter"});

const layout = layoutTextInPath({text: longText, prepared, path});
```

## How it works

First the path is turned into polylines with
[`points-on-path`](https://github.com/pshihn/points-on-path). Then
[`hachure-fill`](https://github.com/pshihn/hachure-fill) generates parallel line segments inside
the shape at `lineHeight` spacing, optionally rotated by `angle`. Finally, along each segment,
Pretext's `layoutNextLine` fills the available width with text from the prepared string.

That is the whole idea, and it is about sixty lines of code — see
[`src/layoutTextInPath.js`](./src/layoutTextInPath.js). Suggestions and feedback are welcome.

## API

### layoutTextInPath(options)

Computes text positions with the specified options.

- **text** — source string (required).
- **path** — closed SVG path `d` (required).
- **fontSize** — default `16`.
- **fontFamily** — default `"Inter"`.
- **fontStyle** — default `"normal"`.
- **fontVariant** — default `"normal"`.
- **fontWeight** — default `"normal"`.
- **prepared** — optional prepared object from `prepareText`.
- **lineHeight** — spacing between lines; default `fontSize * 1.5`.
- **angle** — rotation of the fill lines in degrees; default `0`.
- **repeat** — whether to loop the text to fill the shape; default `true`.

Returns an object with:

- **texts** — the fragments to draw, each with `text`, `x`, `y`, `angle` and `lineHeight`.
- **lines** — the hachure segments, as `[[x1, y1], [x2, y2]]`.
- **path** — the input `d` string.
- **fontSize**, **fontFamily**, **fontStyle**, **fontVariant**, **fontWeight** — the effective
  values used for the layout.

### prepareText(text, options)

Builds a Pretext **prepared** value with the specified options.

- **fontSize** — default `16`.
- **fontFamily** — default `"Inter"`.
- **fontStyle** — default `"normal"`.
- **fontVariant** — default `"normal"`.
- **fontWeight** — default `"normal"`.
- Any extra keys are forwarded to Pretext's `prepareWithSegments`.

The return value includes Pretext's fields plus the five font fields, for convenience.

```js
const prepared = prepareText("Measure me", {fontSize: 16, fontFamily: "Inter"});
```

### clearTextCache()

Clears Calligram's memoized `prepareText` cache and Pretext's global `clearCache()`. Call it in
long-running apps or tests if you need to free memory or reset measurement state.

```js
clearTextCache();
```

## Demos

Three demos live in [`demo/`](./demo). Run them with:

```sh
npm install
npm run dev
```

- **[U.S. Map Paper](./demo/us-map-paper)** — an interactive U.S. map with notes flowed into each
  state.
- **[Yin Yang](./demo/yin-yang)** — an animated yin–yang symbol, each half filled with its own
  description.
- **[Air Text](./demo/air-text)** — a screen of text you interact with using your body, via your
  webcam.

## Development

```sh
npm install
npm test            # unit tests, snapshots, lint and format
npm run dev         # the demos, plus the test cases at /test/
npm run test:watch  # tests in watch mode
npm run test:update # re-record the SVG snapshots
```

Snapshots are standalone `.svg` documents in [`test/output`](./test/output), so you can open any
of them in a browser to see what a case renders.

Text measurement goes through a canvas, which jsdom does not provide, so the tests install a
fixed metric of 8px per grapheme (see [`test/measure.js`](./test/measure.js)). That is what keeps
the recorded coordinates identical on every machine, instead of depending on installed fonts.

## Credits

Calligram started life inside [Charming](https://github.com/charming-art/charming), where it was
documented as Charming Text, and is extracted here as a standalone library.

## License

[MIT](./License)
