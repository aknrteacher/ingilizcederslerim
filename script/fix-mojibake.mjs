/**
 * Fixes UTF-8 bytes misread as Windows-1252 in source files (Turkish, emoji, symbols).
 * Mapping from https://en.wikipedia.org/wiki/Windows-1252
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientSrc = path.join(__dirname, "..", "client", "src");

const MOJIBAKE_MARKERS = /[ÃÅÄâð]/;

/** Code point → single byte when text was UTF-8 misinterpreted as Windows-1252 */
const UNICODE_TO_WIN1252_BYTE = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

function charToByte(c) {
  if (UNICODE_TO_WIN1252_BYTE.has(c)) return UNICODE_TO_WIN1252_BYTE.get(c);
  if (c < 256) return c;
  return -1;
}

function fixMojibakeString(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const b = charToByte(str.charCodeAt(i));
    if (b < 0) return null;
    bytes.push(b);
  }
  try {
    const out = Buffer.from(bytes).toString("utf8");
    if (out.includes("\uFFFD")) return null;
    return out;
  } catch {
    return null;
  }
}

function shouldAttemptFix(str) {
  if (!str.length) return false;
  if (MOJIBAKE_MARKERS.test(str)) return true;
  if (str.includes("ðŸ") || str.includes("âœ")) return true;
  return false;
}

function fixQuoted(inner) {
  if (!shouldAttemptFix(inner)) return null;
  return fixMojibakeString(inner);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  content = content.replace(/"((?:[^"\\]|\\.)*)"/g, (match, inner) => {
    const fixed = fixQuoted(inner);
    if (fixed === null || fixed === inner) return match;
    return `"${fixed.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  });

  content = content.replace(/'((?:[^'\\]|\\.)*)'/g, (match, inner) => {
    const fixed = fixQuoted(inner);
    if (fixed === null || fixed === inner) return match;
    return `'${fixed.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  });

  content = content.replace(/`([^`\\]*(?:\\.[^`]*)*)`/g, (match, inner) => {
    if (inner.includes("${")) return match;
    const fixed = fixQuoted(inner);
    if (fixed === null || fixed === inner) return match;
    return `\`${fixed.replace(/\\/g, "\\\\").replace(/`/g, "\\`")}\``;
  });

  content = content
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t || t.includes("{") || t.includes("<")) return line;
      if (!shouldAttemptFix(t)) return line;
      const fixed = fixMojibakeString(t);
      if (fixed === null) return line;
      const indent = line.match(/^\s*/)[0];
      return indent + fixed;
    })
    .join("\n");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }
  return false;
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules") continue;
      walk(p, acc);
    } else if (/\.(tsx|ts)$/.test(name)) {
      acc.push(p);
    }
  }
  return acc;
}

const files = walk(clientSrc);
let changed = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  if (!shouldAttemptFix(raw)) continue;
  try {
    if (processFile(f)) {
      changed++;
      console.log("fixed:", path.relative(path.join(__dirname, ".."), f));
    }
  } catch (e) {
    console.error("error:", f, e);
  }
}
console.log(`Done. ${changed} files updated.`);
