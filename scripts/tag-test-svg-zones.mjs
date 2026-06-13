import { promises as fs } from "node:fs";
import path from "node:path";

const TARGET_DIR = path.resolve("client/public/images/primary/test");
const SVG_EXT = ".svg";

const PALETTE = [
  { id: "yellow", rgb: [253, 216, 53] },
  { id: "blue", rgb: [30, 136, 229] },
  { id: "red", rgb: [229, 57, 53] },
  { id: "green", rgb: [67, 160, 71] },
  { id: "purple", rgb: [142, 36, 170] },
  { id: "pink", rgb: [236, 64, 122] },
  { id: "brown", rgb: [109, 76, 65] },
  { id: "orange", rgb: [251, 140, 0] },
  { id: "black", rgb: [33, 33, 33] },
  { id: "white", rgb: [250, 250, 250] },
  { id: "gray", rgb: [158, 158, 158] },
];

function hexToRgb(hex) {
  const value = hex.replace("#", "").trim();
  if (value.length !== 3 && value.length !== 6) return null;
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const parsed = Number.parseInt(full, 16);
  if (Number.isNaN(parsed)) return null;
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

function rgbDistanceSq(a, b) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function nearestColorName(rgb) {
  let best = PALETTE[0].id;
  let bestDist = Number.POSITIVE_INFINITY;
  for (const swatch of PALETTE) {
    const dist = rgbDistanceSq(rgb, swatch.rgb);
    if (dist < bestDist) {
      bestDist = dist;
      best = swatch.id;
    }
  }
  return best;
}

function shouldSkip(fillValue) {
  if (!fillValue) return true;
  const normalized = fillValue.trim().toLowerCase();
  if (normalized === "none") return true;
  if (normalized === "transparent") return true;
  if (normalized === "url(#none)") return true;

  if (normalized === "white") return true;
  const rgb = hexToRgb(normalized);
  if (!rgb) return false;
  // Skip near-white backgrounds.
  if (rgb[0] > 242 && rgb[1] > 242 && rgb[2] > 242) return true;
  return false;
}

function tagSvgContent(svgText) {
  const counters = new Map();
  let taggedCount = 0;

  const output = svgText.replace(/<path\b([^>]*?)\/>/gi, (match, rawAttrs) => {
    const attrs = rawAttrs ?? "";
    if (/\sid="/i.test(attrs)) return match;

    const fillMatch = attrs.match(/\sfill="([^"]+)"/i);
    const fill = fillMatch?.[1];
    if (shouldSkip(fill)) return match;

    let color = "gray";
    const rgb = fill ? hexToRgb(fill.trim().toLowerCase()) : null;
    if (rgb) color = nearestColorName(rgb);

    const next = (counters.get(color) ?? 0) + 1;
    counters.set(color, next);

    const extra = ` id="zone-${color}-${next}" data-color="${color}" data-hint="true"`;
    taggedCount += 1;
    return `<path${extra}${attrs}/>`;
  });

  return { output, taggedCount };
}

async function run() {
  const entries = await fs.readdir(TARGET_DIR, { withFileTypes: true });
  const svgFiles = entries.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(SVG_EXT));
  if (!svgFiles.length) {
    console.log("No SVG files found.");
    return;
  }

  for (const file of svgFiles) {
    const fullPath = path.join(TARGET_DIR, file.name);
    const original = await fs.readFile(fullPath, "utf8");
    const { output, taggedCount } = tagSvgContent(original);
    if (taggedCount > 0 && output !== original) {
      await fs.writeFile(fullPath, output, "utf8");
    }
    console.log(`${file.name}: tagged ${taggedCount} path(s)`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

