/**
 * Saves the README figures and demo screenshots to img/, using the installed Chrome.
 *
 *     npm run dev            # in one terminal
 *     npm run screenshot     # in another
 *
 * Set PORT if the dev server is not on 5173, or CHROME to use a different browser.
 */
import {chromium} from "playwright-core";
import {mkdirSync} from "node:fs";
import {fileURLToPath} from "node:url";

const PORT = process.env.PORT ?? "5173";
const base = `http://localhost:${PORT}`;
const out = fileURLToPath(new URL("../img/", import.meta.url));

mkdirSync(out, {recursive: true});

const browser = await chromium.launch(
  process.env.CHROME ? {executablePath: process.env.CHROME, headless: true} : {channel: "chrome", headless: true},
);

// Figures are small and crisp at 2x; demo screenshots are full viewport, so 1x keeps the
// repository light while still being sharper than the width a README renders them at.
const figureContext = await browser.newContext({
  viewport: {width: 1280, height: 860},
  deviceScaleFactor: 2,
  permissions: ["camera"],
});

const demoContext = await browser.newContext({
  viewport: {width: 1280, height: 860},
  deviceScaleFactor: 1,
  permissions: ["camera"],
});

async function shoot(path, name, {selector, wait = 1200, setup, context = figureContext} = {}) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(`${base}${path}`, {waitUntil: "load"});
  await page.waitForTimeout(wait);
  if (setup) {
    await page.evaluate(setup);
    await page.waitForTimeout(600);
  }

  const target = selector ? page.locator(selector) : page;
  await target.screenshot({path: `${out}${name}.png`, ...(selector ? {} : {fullPage: false})});

  console.log(`  img/${name}.png${errors.length ? `  (page errors: ${errors.join(" | ")})` : ""}`);
  await page.close();
  return errors;
}

const problems = [];

console.log("figures:");
for (const id of ["layout", "line-height", "angle", "repeat", "star"]) {
  problems.push(...(await shoot("/script/examples.html", `figure-${id}`, {selector: `#${id}`, wait: 1500})));
}

console.log("demos:");
problems.push(
  ...(await shoot("/demo/yin-yang/", "demo-yin-yang", {
    wait: 2500,
    context: demoContext,
    // Freeze at phase 0, where k is 0.5 and the lobes form the familiar S-curve. Left running,
    // the animation is as likely to be caught with one lobe swallowing the whole circle.
    setup: () => {
      const slider = document.querySelector("#phase-offset");
      slider.value = 0;
      slider.dispatchEvent(new Event("input", {bubbles: true}));
    },
  })),
);
problems.push(...(await shoot("/demo/us-map-paper/", "demo-us-map-paper", {wait: 6000, context: demoContext})));
problems.push(...(await shoot("/demo/air-text/", "demo-air-text", {wait: 8000, context: demoContext})));

await browser.close();

if (problems.length) {
  console.log(`\n${problems.length} page error(s) reported above.`);
  process.exitCode = 1;
}
