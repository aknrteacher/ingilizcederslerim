import { useCallback, useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import type { ColourThisVocabItem } from "@/data/colour-this-vocab";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";
import "@/styles/colour-this-game.css";

const COLOR_SOUNDS = "/sounds/colors";
const ALPHA_SOUNDS = "/sounds/thealphabet";

/* ─── types ─── */
type ColourZoneDef = { id: string; hintColorId: string };
type PictureZoneHint = { id: string; cx: number; cy: number; r: number };
type WordLayout = { logicalW: number; logicalH: number; fontSize: number; text: string };
type LetterBounds = { left: number; right: number; ch: string };
type ZoneSketchData = {
  flashPhase: number;
  targetX: number;
  targetY: number;
  pixels: number[];
  fillScores: number[];
};

export type ColourThisGameProps = {
  vocab: ColourThisVocabItem[];
  imageBasePath: string;
  /** Back link to the theme/unit games menu */
  gamesMenuHref: string;
  /** How picture targets are selected */
  interactionMode?: "hint-circles" | "full-region";
};

const MIN_PICTURE_ZONES = 2;
const MAX_PICTURE_ZONES = 5;

const PALETTE = [
  { id: "yellow", hex: "#fdd835", label: "yellow" },
  { id: "blue", hex: "#1e88e5", label: "blue" },
  { id: "red", hex: "#e53935", label: "red" },
  { id: "green", hex: "#43a047", label: "green" },
  { id: "purple", hex: "#8e24aa", label: "purple" },
  { id: "pink", hex: "#ec407a", label: "pink" },
  { id: "brown", hex: "#6d4c41", label: "brown" },
  { id: "orange", hex: "#fb8c00", label: "orange" },
  { id: "black", hex: "#212121", label: "black" },
  { id: "white", hex: "#fafafa", label: "white" },
  { id: "gray", hex: "#9e9e9e", label: "gray" },
] as const;

/* ─── sound helpers ─── */
function playAudioFile(src: string) {
  const a = new Audio(src);
  a.play().catch(() => {});
  return a;
}
function playColorWav(colorId: string) {
  return playAudioFile(`${COLOR_SOUNDS}/${colorId}.wav`);
}
function playLetterWav(ch: string) {
  const lower = ch.toLowerCase();
  if (lower >= "a" && lower <= "z") return playAudioFile(`${ALPHA_SOUNDS}/${lower}.wav`);
  return null;
}

let _audioCtx: AudioContext | null = null;
function ac() {
  if (!_audioCtx) _audioCtx = new AudioContext();
  return _audioCtx;
}
function playSuccessSound() {
  const ctx = ac();
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.13, now + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start(now + i * 0.1);
    o.stop(now + i * 0.1 + 0.35);
  });
}
function playWrongSound() {
  const ctx = ac();
  const now = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(380, now);
  o.frequency.linearRampToValueAtTime(240, now + 0.28);
  g.gain.setValueAtTime(0.1, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  o.connect(g).connect(ctx.destination);
  o.start(now);
  o.stop(now + 0.3);
}
function playFanfare() {
  const ctx = ac();
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.14, now + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.55);
    o.connect(g).connect(ctx.destination);
    o.start(now + i * 0.1);
    o.stop(now + i * 0.1 + 0.55);
  });
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const v = speechSynthesis.getVoices();
  return v.find((x) => x.lang.startsWith("en") && x.localService) || v.find((x) => x.lang.startsWith("en")) || null;
}
function speakWord(text: string, rate = 0.92) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = rate;
  const voice = pickEnglishVoice();
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

/* ─── colour helpers ─── */
function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const v = parseInt(n.length === 3 ? n.split("").map((c) => c + c).join("") : n, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function rgbDistSq(a: [number, number, number], b: [number, number, number]) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}
function nearestPaletteIndex(r: number, g: number, b: number) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < PALETTE.length; i++) {
    const [pr, pg, pb] = hexToRgb(PALETTE[i].hex);
    const d = rgbDistSq([r, g, b], [pr, pg, pb]);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}
function meanRgbForPixels(data: Uint8ClampedArray, pixels: number[]): [number, number, number] {
  let sr = 0, sg = 0, sb = 0;
  for (const p of pixels) { const o = p * 4; sr += data[o]; sg += data[o + 1]; sb += data[o + 2]; }
  const n = Math.max(1, pixels.length);
  return [sr / n, sg / n, sb / n];
}

/* ─── image analysis ─── */
type ColorComponent = { pixels: number[]; area: number; centroidX: number; centroidY: number };

function extractColorComponents(mask: Uint8Array, w: number, h: number, minArea: number): ColorComponent[] {
  const visited = new Uint8Array(w * h);
  const out: ColorComponent[] = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || visited[i]) continue;
    const stack: number[] = [i];
    const pixels: number[] = [];
    visited[i] = 1;
    while (stack.length) {
      const idx = stack.pop()!;
      pixels.push(idx);
      const x = idx % w, y = (idx / w) | 0;
      for (const n of [idx + 1, idx - 1, idx + w, idx - w]) {
        if (n < 0 || n >= w * h) continue;
        const nx = n % w;
        if (Math.abs(nx - x) > 1) continue;
        if (mask[n] && !visited[n]) { visited[n] = 1; stack.push(n); }
      }
    }
    if (pixels.length < minArea) continue;
    let sx = 0, sy = 0;
    for (const p of pixels) { sx += p % w; sy += (p / w) | 0; }
    out.push({ pixels, area: pixels.length, centroidX: sx / pixels.length, centroidY: sy / pixels.length });
  }
  return out.sort((a, b) => b.area - a.area);
}

function maskFromPixels(pixels: number[], w: number, h: number): Uint8Array {
  const m = new Uint8Array(w * h);
  for (const p of pixels) m[p] = 1;
  return m;
}

function splitPixelsVertically(pixels: number[], w: number, h: number): [number[], number[]] {
  let minX = w, maxX = 0;
  for (const p of pixels) { const x = p % w; minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  const mid = (minX + maxX) >> 1;
  const left: number[] = [], right: number[] = [];
  for (const p of pixels) { if ((p % w) <= mid) left.push(p); else right.push(p); }
  if (!left.length || !right.length) {
    const midY = h >> 1;
    const top: number[] = [], bot: number[] = [];
    for (const p of pixels) { if (((p / w) | 0) < midY) top.push(p); else bot.push(p); }
    return top.length && bot.length ? [top, bot] : [pixels.slice(0, pixels.length >> 1), pixels.slice(pixels.length >> 1)];
  }
  return [left, right];
}

function hintFromComponent(comp: ColorComponent, w: number, h: number, data: Uint8ClampedArray, hintPaletteIdx: number): PictureZoneHint {
  let sx = 0, sy = 0, n = 0;
  for (const p of comp.pixels) {
    const o = p * 4;
    if (nearestPaletteIndex(data[o], data[o + 1], data[o + 2]) === hintPaletteIdx) {
      sx += p % w; sy += (p / w) | 0; n++;
    }
  }
  const cx = (n > 0 ? sx / n : comp.centroidX) / w;
  const cy = (n > 0 ? sy / n : comp.centroidY) / h;
  const minDim = Math.min(w, h);
  const rPx = Math.sqrt(comp.area / Math.PI) * 0.18;
  const r = Math.min(0.08, Math.max(0.035, rPx / minDim));
  return { id: "", cx, cy, r };
}

function computeAutoZonesFromImage(data: Uint8ClampedArray, w: number, h: number) {
  const perLabel: Uint8Array[] = [];
  for (let i = 0; i < PALETTE.length; i++) perLabel.push(new Uint8Array(w * h));
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    perLabel[nearestPaletteIndex(data[o], data[o + 1], data[o + 2])][i] = 1;
  }
  const ACHROMATIC_IDS = new Set(["gray", "white", "black"]);
  const collectBlobs = (minA: number, chromaticOnly: boolean) => {
    const blobs: { pi: number; comp: ColorComponent; score: number }[] = [];
    for (let pi = 0; pi < PALETTE.length; pi++) {
      if (chromaticOnly && ACHROMATIC_IDS.has(PALETTE[pi].id)) continue;
      for (const comp of extractColorComponents(perLabel[pi], w, h, minA)) {
        const [mr, mg, mb] = meanRgbForPixels(data, comp.pixels);
        const [pr, pg, pb] = hexToRgb(PALETTE[pi].hex);
        const dist = Math.sqrt(rgbDistSq([mr, mg, mb], [pr, pg, pb]));
        const confidence = Math.max(0, 1 - dist / 200);
        if (confidence < 0.35) continue;
        const score = comp.area * confidence;
        blobs.push({ pi, comp, score });
      }
    }
    blobs.sort((a, b) => b.score - a.score);
    return blobs;
  };
  let minA = Math.max(200, Math.floor(w * h * 0.005));
  let all = collectBlobs(minA, true);
  if (all.length < MIN_PICTURE_ZONES) { minA = Math.max(80, Math.floor(w * h * 0.001)); all = collectBlobs(minA, true); }
  if (all.length < MIN_PICTURE_ZONES) { all = collectBlobs(Math.max(30, minA >> 1), false); }

  const usedColors = new Set<number>();
  let picked: typeof all = [];
  for (const b of all) {
    if (picked.length >= MAX_PICTURE_ZONES) break;
    if (usedColors.has(b.pi) && picked.length >= MIN_PICTURE_ZONES) continue;
    picked.push(b);
    usedColors.add(b.pi);
  }
  if (picked.length < MIN_PICTURE_ZONES) {
    for (const b of all) {
      if (picked.length >= MIN_PICTURE_ZONES) break;
      if (!picked.includes(b)) { picked.push(b); usedColors.add(b.pi); }
    }
  }
  if (picked.length < MIN_PICTURE_ZONES && all.length >= 1) {
    const [pa, pb] = splitPixelsVertically(all[0].comp.pixels, w, h);
    const mk = (pxs: number[]) => {
      let sx2 = 0, sy2 = 0;
      for (const p of pxs) { sx2 += p % w; sy2 += (p / w) | 0; }
      const n2 = Math.max(1, pxs.length);
      const [mr, mg, mb] = meanRgbForPixels(data, pxs);
      return { pi: nearestPaletteIndex(mr, mg, mb), comp: { pixels: pxs, area: pxs.length, centroidX: sx2 / n2, centroidY: sy2 / n2 }, score: pxs.length };
    };
    picked = [mk(pa), mk(pb)];
  }
  if (!picked.length) {
    const leftP: number[] = [], rightP: number[] = [];
    const midX = w >> 1;
    for (let i = 0; i < w * h; i++) { if ((i % w) < midX) leftP.push(i); else rightP.push(i); }
    const mk2 = (pxs: number[]) => {
      let sx3 = 0, sy3 = 0;
      for (const p of pxs) { sx3 += p % w; sy3 += (p / w) | 0; }
      const n3 = Math.max(1, pxs.length);
      return { pi: 0, comp: { pixels: pxs, area: pxs.length, centroidX: sx3 / n3, centroidY: sy3 / n3 }, score: pxs.length };
    };
    picked = [mk2(leftP), mk2(rightP)];
  }

  const masks: Record<string, Uint8Array> = {};
  const zonePixels: Record<string, number[]> = {};
  const hints: PictureZoneHint[] = [];
  const zoneDefs: ColourZoneDef[] = [];
  for (let zi = 0; zi < picked.length; zi++) {
    const { comp, pi: pickedPi } = picked[zi];
    const id = `z${zi}`;
    masks[id] = maskFromPixels(comp.pixels, w, h);
    zonePixels[id] = comp.pixels;
    const hint = hintFromComponent(comp, w, h, data, pickedPi);
    hint.id = id;
    hints.push(hint);
    zoneDefs.push({ id, hintColorId: PALETTE[pickedPi].id });
  }
  return { masks, zonePixels, hints, zoneDefs };
}

function findHintByProximity(
  x: number, y: number, w: number, h: number,
  hints: PictureZoneHint[],
  zoneFilled: Record<string, string>,
): string | null {
  let closest: string | null = null;
  let closestDist = Infinity;
  const minDim = Math.min(w, h);
  for (const hint of hints) {
    if (zoneFilled[hint.id]) continue;
    const cx = hint.cx * w, cy = hint.cy * h;
    const dist = Math.hypot(x - cx, y - cy);
    const hitR = Math.max(24, hint.r * minDim * 2);
    if (dist < hitR && dist < closestDist) { closestDist = dist; closest = hint.id; }
  }
  return closest;
}

/* ─── word outline utilities ─── */
const LINE_DARK = 95;
const WORD_FONT_FAMILY = `"Nunito", "Segoe UI", system-ui, sans-serif`;
const WORD_FONT_WEIGHT = "900";
const WORD_LOGICAL_HEIGHT = 120;
const WORD_STROKE_WIDTH = 3.25;

function isDarkLine(r: number, g: number, b: number) { return r + g + b < LINE_DARK * 3; }

function buildWordInteriorFillableMask(data: Uint8ClampedArray, w: number, h: number): Uint8Array {
  const passesLine = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    const i = (y * w + x) * 4;
    return !isDarkLine(data[i], data[i + 1], data[i + 2]);
  };
  const exterior = new Uint8Array(w * h);
  const queue: [number, number][] = [];
  const seed = (x: number, y: number) => { if (!passesLine(x, y)) return; const k = y * w + x; if (exterior[k]) return; exterior[k] = 1; queue.push([x, y]); };
  for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
  for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
  while (queue.length) {
    const [x, y] = queue.shift()!;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]] as [number, number][]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (!passesLine(nx, ny)) continue;
      const k = ny * w + nx;
      if (exterior[k]) continue;
      exterior[k] = 1; queue.push([nx, ny]);
    }
  }
  const fillable = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const i4 = i * 4;
    if (isDarkLine(data[i4], data[i4 + 1], data[i4 + 2])) continue;
    fillable[i] = exterior[i] ? 0 : 1;
  }
  return fillable;
}

function clampWordToBase(ctx: CanvasRenderingContext2D, w: number, h: number, fillable: Uint8Array, base: ImageData) {
  const id = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < w * h; i++) {
    if (fillable[i]) continue;
    const o = i * 4;
    id.data[o] = base.data[o]; id.data[o + 1] = base.data[o + 1]; id.data[o + 2] = base.data[o + 2]; id.data[o + 3] = base.data[o + 3];
  }
  ctx.putImageData(id, 0, 0);
}

function getLetterLogicalBounds(layout: WordLayout, ctx: CanvasRenderingContext2D): LetterBounds[] {
  ctx.font = `${WORD_FONT_WEIGHT} ${layout.fontSize}px ${WORD_FONT_FAMILY}`;
  const lower = layout.text;
  const totalW = ctx.measureText(lower).width;
  const startX = (layout.logicalW - totalW) / 2;
  const out: LetterBounds[] = [];
  let acc = startX;
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    const wch = ctx.measureText(ch).width;
    out.push({ left: acc, right: acc + wch, ch });
    acc += wch;
  }
  return out;
}

function maskHasAnyPixels(m: Uint8Array): boolean { for (let i = 0; i < m.length; i++) if (m[i]) return true; return false; }

/**
 * Remove counter-spaces (enclosed holes inside e, a, o, d, etc.) but keep
 * disconnected parts that belong to the letter (dot of i/j).
 * A component is a counter-space if its bounding box is fully contained
 * within a larger component's bounding box.
 */
function removeCounterSpaces(mask: Uint8Array, w: number, h: number): Uint8Array {
  const visited = new Uint8Array(w * h);
  const comps: { pixels: number[]; minX: number; maxX: number; minY: number; maxY: number }[] = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || visited[i]) continue;
    const stack: number[] = [i];
    const pixels: number[] = [];
    let mnX = w, mxX = 0, mnY = h, mxY = 0;
    visited[i] = 1;
    while (stack.length) {
      const idx = stack.pop()!;
      pixels.push(idx);
      const x = idx % w, y = (idx / w) | 0;
      if (x < mnX) mnX = x; if (x > mxX) mxX = x;
      if (y < mnY) mnY = y; if (y > mxY) mxY = y;
      for (const n of [idx + 1, idx - 1, idx + w, idx - w]) {
        if (n < 0 || n >= w * h) continue;
        if (Math.abs((n % w) - x) > 1) continue;
        if (mask[n] && !visited[n]) { visited[n] = 1; stack.push(n); }
      }
    }
    comps.push({ pixels, minX: mnX, maxX: mxX, minY: mnY, maxY: mxY });
  }
  if (comps.length <= 1) return mask;
  comps.sort((a, b) => b.pixels.length - a.pixels.length);
  const result = new Uint8Array(w * h);
  for (let ci = 0; ci < comps.length; ci++) {
    const c = comps[ci];
    let isHole = false;
    for (let oi = 0; oi < ci; oi++) {
      const o = comps[oi];
      if (c.minX >= o.minX && c.maxX <= o.maxX && c.minY >= o.minY && c.maxY <= o.maxY) {
        isHole = true; break;
      }
    }
    if (!isHole) for (const p of c.pixels) result[p] = 1;
  }
  return result;
}

function buildLetterFillableMasks(fillable: Uint8Array, w: number, h: number, dpr: number, bounds: LetterBounds[]): Uint8Array[] {
  const masks = bounds.map(() => new Uint8Array(w * h));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const key = y * w + x;
      if (!fillable[key]) continue;
      const lx = x / dpr;
      for (let li = 0; li < bounds.length; li++) {
        if (bounds[li].ch === " ") continue;
        if (lx >= bounds[li].left && lx < bounds[li].right) { masks[li][key] = 1; break; }
      }
    }
  }
  return masks.map((m) => (maskHasAnyPixels(m) ? removeCounterSpaces(m, w, h) : m));
}

function areWordLettersFilled(bounds: LetterBounds[], masks: Uint8Array[], filled: Record<number, boolean>): boolean {
  let needed = 0;
  for (let i = 0; i < bounds.length; i++) {
    if (bounds[i].ch === " ") continue;
    if (!maskHasAnyPixels(masks[i])) continue;
    needed++;
    if (!filled[i]) return false;
  }
  return needed > 0;
}

/* ─── sparkle drawing ─── */
function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#fff";
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
    const ma = a + Math.PI / 4;
    ctx.lineTo(Math.cos(ma) * size * 0.3, Math.sin(ma) * size * 0.3);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function clamp01(v: number): number {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function buildZoneSketchData(zonePixels: number[], w: number, h: number): ZoneSketchData | null {
  if (!zonePixels.length) return null;

  let minX = w, maxX = 0, minY = h, maxY = 0;
  let sx = 0, sy = 0;
  for (const p of zonePixels) {
    const x = p % w;
    const y = (p / w) | 0;
    sx += x;
    sy += y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const cx0 = sx / zonePixels.length;
  const cy0 = sy / zonePixels.length;

  const boxW = Math.max(8, maxX - minX + 1);
  const boxH = Math.max(8, maxY - minY + 1);
  const flashPhase = Math.random();

  // Fill order follows the dominant zone axis with tiny deterministic jitter.
  const horizontal = boxW >= boxH;
  const dirX = horizontal ? 1 : 0;
  const dirY = horizontal ? 0 : 1;
  let minProj = Infinity;
  let maxProj = -Infinity;
  const projs = new Array<number>(zonePixels.length);
  for (let i = 0; i < zonePixels.length; i++) {
    const p = zonePixels[i];
    const x = p % w;
    const y = (p / w) | 0;
    const proj = (x - cx0) * dirX + (y - cy0) * dirY;
    projs[i] = proj;
    if (proj < minProj) minProj = proj;
    if (proj > maxProj) maxProj = proj;
  }
  const span = Math.max(1e-4, maxProj - minProj);
  const fillScores = new Array<number>(zonePixels.length);
  for (let i = 0; i < zonePixels.length; i++) {
    const p = zonePixels[i];
    const x = p % w;
    const y = (p / w) | 0;
    // Stable pseudo-random jitter from pixel coordinates.
    const noise = ((((x * 73856093) ^ (y * 19349663)) >>> 0) % 997) / 997;
    const n = (projs[i] - minProj) / span;
    fillScores[i] = clamp01(n * 0.88 + noise * 0.12);
  }

  return { flashPhase, targetX: cx0, targetY: cy0, pixels: zonePixels, fillScores };
}

function drawSmallArrowClue(
  ctx: CanvasRenderingContext2D,
  targetX: number,
  targetY: number,
  imageCenterX: number,
  imageCenterY: number,
  color: string,
  t: number,
  phase: number,
  thick = false,
) {
  let dx = targetX - imageCenterX;
  let dy = targetY - imageCenterY;
  let dist = Math.hypot(dx, dy);
  if (dist < 1) {
    const a = phase * Math.PI * 2;
    dx = Math.cos(a);
    dy = Math.sin(a);
    dist = 1;
  }

  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const slide = thick ? 0 : Math.sin(t * 2.1) * 6;
  const baseX = targetX + ux * slide;
  const baseY = targetY + uy * slide;
  const tailX = baseX - ux * (thick ? 30 : 22);
  const tailY = baseY - uy * (thick ? 30 : 22);
  const tipX = baseX - ux * 3;
  const tipY = baseY - uy * 3;
  const headBackX = tipX - ux * (thick ? 10 : 7);
  const headBackY = tipY - uy * (thick ? 10 : 7);
  const wingX = px * (thick ? 8 : 6.5);
  const wingY = py * (thick ? 8 : 6.5);

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Draw a normal arrow: shaft plus V-shaped head, with an outline for contrast.
  ctx.strokeStyle = "#111";
  ctx.lineWidth = thick ? 10 : 7;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(tipX, tipY);
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(headBackX + wingX, headBackY + wingY);
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(headBackX - wingX, headBackY - wingY);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = thick ? 7 : 4.5;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(tipX, tipY);
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(headBackX + wingX, headBackY + wingY);
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(headBackX - wingX, headBackY - wingY);
  ctx.stroke();
  ctx.restore();
}

function shouldHideArrowMomentarily(t: number, phase: number): boolean {
  const cycleSec = 1.65;
  const cycle = Math.floor((t + phase * 3.7) / cycleSec);
  const local = ((t + phase * 3.7) % cycleSec) / cycleSec;
  const roll = (((cycle * 1103515245 + Math.floor(phase * 10000) * 12345) >>> 0) % 100) / 100;
  return roll < 0.34 && local > 0.12 && local < 0.28;
}

function drawTickClue(
  ctx: CanvasRenderingContext2D,
  targetX: number,
  targetY: number,
  color: string,
  progress: number,
) {
  const pop = Math.sin(clamp01(progress) * Math.PI);
  const size = 20 + pop * 6;
  const centerX = targetX;
  const centerY = targetY - 18;

  // Standard upright check mark: short downstroke, longer rising stroke.
  const x1 = centerX - size * 0.6;
  const y1 = centerY;
  const x2 = centerX - size * 0.18;
  const y2 = centerY + size * 0.42;
  const x3 = centerX + size * 0.72;
  const y3 = centerY - size * 0.55;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.stroke();
  ctx.restore();
}

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */
export function ColourThisGame({
  vocab,
  imageBasePath,
  gamesMenuHref,
  interactionMode = "hint-circles",
}: ColourThisGameProps) {
  const [, setLocation] = useLocation();
  const [index, setIndex] = useState(0);
  const item = vocab[index];
  const [colorId, setColorId] = useState<string>(PALETTE[0].id);
  const selected = PALETTE.find((c) => c.id === colorId) ?? PALETTE[0];

  const [zoneFilled, setZoneFilled] = useState<Record<string, string>>({});
  const [letterFilled, setLetterFilled] = useState<Record<number, boolean>>({});
  const [activeZoneDefs, setActiveZoneDefs] = useState<ColourZoneDef[]>([]);
  const [pictureLoadVersion, setPictureLoadVersion] = useState(0);
  const [pictureRevealed, setPictureRevealed] = useState(false);
  const [wordTargetColorId, setWordTargetColorId] = useState("");
  const [wordGlowCount, setWordGlowCount] = useState(2);
  const wordHintTriggerRef = useRef(0);
  const wordHintRafRef = useRef<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pictureGrayBaseRef = useRef<ImageData | null>(null);
  const pictureColorOriginalRef = useRef<ImageData | null>(null);
  const pictureZoneMasksRef = useRef<Record<string, Uint8Array>>({});
  const pictureZonePixelsRef = useRef<Record<string, number[]>>({});
  const pictureZoneSketchRef = useRef<Record<string, ZoneSketchData>>({});
  const pictureZoneFillAnimRef = useRef<Record<string, { startMs: number; durationMs: number }>>({});
  const pictureZoneHintsRef = useRef<PictureZoneHint[]>([]);
  const pictureZoneDoneRef = useRef(false);
  const pictureLoadGenRef = useRef(0);
  const revealRafRef = useRef<number | null>(null);
  const colorImgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const paintedBaseRef = useRef<HTMLCanvasElement | null>(null);
  const circlePulseRafRef = useRef<number | null>(null);

  const [hintFlashColorId, setHintFlashColorId] = useState("");
  const hintFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const useFullRegionTargets = interactionMode === "full-region";

  const zoneFilledRef = useRef(zoneFilled);
  zoneFilledRef.current = zoneFilled;
  const letterFilledRef = useRef(letterFilled);
  letterFilledRef.current = letterFilled;
  const activeZoneDefsRef = useRef(activeZoneDefs);
  activeZoneDefsRef.current = activeZoneDefs;
  const colorIdRef = useRef(colorId);
  colorIdRef.current = colorId;

  const wordWrapRef = useRef<HTMLDivElement>(null);
  const wordCanvasRef = useRef<HTMLCanvasElement>(null);
  const wordFillableRef = useRef<Uint8Array | null>(null);
  const wordBaseImageRef = useRef<ImageData | null>(null);
  const wordLayoutRef = useRef<WordLayout | null>(null);
  const wordOutlineDoneRef = useRef(false);
  const wordDprRef = useRef(1);
  const wordLetterBoundsRef = useRef<LetterBounds[] | null>(null);
  const wordLetterMasksRef = useRef<Uint8Array[] | null>(null);
  const wordLetterColorMapRef = useRef<Record<number, [number, number, number]>>({});

  const wordTargetPal = PALETTE.find((p) => p.id === wordTargetColorId);

  /* ── compute word target colour (one not used on the picture) ── */
  useEffect(() => {
    if (!activeZoneDefs.length) return;
    const usedIds = new Set(activeZoneDefs.map((z) => z.hintColorId));
    const chromatic = PALETTE.filter((p) => !["black", "white", "gray"].includes(p.id) && !usedIds.has(p.id));
    if (chromatic.length > 0) { setWordTargetColorId(chromatic[0].id); return; }
    const any = PALETTE.filter((p) => !usedIds.has(p.id));
    setWordTargetColorId(any.length > 0 ? any[0].id : PALETTE[0].id);
  }, [activeZoneDefs]);

  /* ── reveal animation (ref-based to avoid deps churn) ── */
  const startRevealAnimationRef = useRef<() => void>(() => {});
  startRevealAnimationRef.current = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const base = pictureGrayBaseRef.current;
    const orig = pictureColorOriginalRef.current;
    const masks = pictureZoneMasksRef.current;
    if (!canvas || !ctx || !base || !orig) return;
    const w = canvas.width, h = canvas.height;
    if (base.width !== w || base.height !== h || orig.width !== w || orig.height !== h) return;
    const loadIdAtStart = pictureLoadGenRef.current;
    const maxR = Math.hypot(w / 2, h / 2);
    const duration = 1300;
    const spkWord = item.speakWord;

    try {
      const zonesForReveal = activeZoneDefsRef.current;
      const snapshotId = new ImageData(new Uint8ClampedArray(base.data), w, h);
      for (const z of zonesForReveal) {
        const mask = masks[z.id];
        if (!mask) continue;
        for (let i = 0; i < w * h; i++) {
          if (!mask[i]) continue;
          const o = i * 4;
          snapshotId.data[o] = orig.data[o]; snapshotId.data[o + 1] = orig.data[o + 1];
          snapshotId.data[o + 2] = orig.data[o + 2]; snapshotId.data[o + 3] = orig.data[o + 3];
        }
      }

      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = w; tmpCanvas.height = h;
      tmpCanvas.getContext("2d")!.putImageData(new ImageData(new Uint8ClampedArray(orig.data), w, h), 0, 0);
      colorImgCanvasRef.current = tmpCanvas;

      const snapshotCanvas = document.createElement("canvas");
      snapshotCanvas.width = w; snapshotCanvas.height = h;
      snapshotCanvas.getContext("2d")!.putImageData(snapshotId, 0, 0);

      const sparkles = Array.from({ length: 35 }, () => ({
        angle: Math.random() * Math.PI * 2,
        rOff: (Math.random() - 0.5) * 50,
        size: 2 + Math.random() * 5,
        alpha: 0.5 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 30,
      }));

      const start = performance.now();
      revealRafRef.current = -1;

      const frame = (now: number) => {
        if (pictureLoadGenRef.current !== loadIdAtStart) { revealRafRef.current = null; return; }
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        ctx.drawImage(snapshotCanvas, 0, 0);
        const r = eased * maxR;
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(tmpCanvas, 0, 0);
        ctx.restore();
        for (const s of sparkles) {
          const sr = r + s.rOff;
          const sx = w / 2 + Math.cos(s.angle + t * 3) * sr + s.drift * t;
          const sy = h / 2 + Math.sin(s.angle + t * 3) * sr + s.drift * t;
          const sa = s.alpha * (1 - t * 0.8);
          if (sa > 0.02 && sx > -10 && sy > -10 && sx < w + 10 && sy < h + 10) drawSparkle(ctx, sx, sy, s.size * (0.5 + eased), sa);
        }
        if (t < 1) {
          revealRafRef.current = requestAnimationFrame(frame);
        } else {
          try { ctx.putImageData(new ImageData(new Uint8ClampedArray(orig.data), w, h), 0, 0); } catch { /* noop */ }
          revealRafRef.current = null;
          setPictureRevealed(true);
          setTimeout(() => speakWord(spkWord), 300);
        }
      };
      revealRafRef.current = requestAnimationFrame(frame);
    } catch {
      try { ctx.putImageData(new ImageData(new Uint8ClampedArray(orig.data), w, h), 0, 0); } catch { /* noop */ }
      revealRafRef.current = null;
      setPictureRevealed(true);
      setTimeout(() => speakWord(item.speakWord), 300);
    }
  };

  /* ── load picture ── */
  const loadPicture = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    const loadId = ++pictureLoadGenRef.current;
    img.onload = () => {
      if (loadId !== pictureLoadGenRef.current) return;
      const maxW = 720;
      const maxH = 400;
      const squareSide = 440;
      let cw = img.naturalWidth;
      let ch = img.naturalHeight;
      if (useFullRegionTargets) {
        cw = squareSide;
        ch = squareSide;
      } else {
        const scale = Math.min(maxW / cw, maxH / ch, 1);
        cw = Math.floor(cw * scale);
        ch = Math.floor(ch * scale);
      }
      canvas.width = cw; canvas.height = ch;
      const tmp = document.createElement("canvas");
      tmp.width = cw; tmp.height = ch;
      const tctx = tmp.getContext("2d");
      if (!tctx) return;
      if (useFullRegionTargets) {
        tctx.fillStyle = "#ffffff";
        tctx.fillRect(0, 0, cw, ch);
        const squareScale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
        const drawW = Math.floor(img.naturalWidth * squareScale);
        const drawH = Math.floor(img.naturalHeight * squareScale);
        const dx = Math.floor((cw - drawW) / 2);
        const dy = Math.floor((ch - drawH) / 2);
        tctx.drawImage(img, dx, dy, drawW, drawH);
      } else {
        tctx.drawImage(img, 0, 0, cw, ch);
      }
      const colorData = tctx.getImageData(0, 0, cw, ch);
      pictureColorOriginalRef.current = new ImageData(new Uint8ClampedArray(colorData.data), cw, ch);
      const { masks, zonePixels, hints, zoneDefs } = computeAutoZonesFromImage(colorData.data, cw, ch);
      pictureZoneMasksRef.current = masks;
      pictureZonePixelsRef.current = zonePixels;
      pictureZoneSketchRef.current = {};
      for (const z of zoneDefs) {
        const sk = buildZoneSketchData(zonePixels[z.id] ?? [], cw, ch);
        if (sk) pictureZoneSketchRef.current[z.id] = sk;
      }
      pictureZoneFillAnimRef.current = {};
      pictureZoneHintsRef.current = hints;
      setActiveZoneDefs(zoneDefs);
      tctx.filter = "grayscale(1) contrast(1.06)";
      if (useFullRegionTargets) {
        tctx.fillStyle = "#ffffff";
        tctx.fillRect(0, 0, cw, ch);
        const squareScale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
        const drawW = Math.floor(img.naturalWidth * squareScale);
        const drawH = Math.floor(img.naturalHeight * squareScale);
        const dx = Math.floor((cw - drawW) / 2);
        const dy = Math.floor((ch - drawH) / 2);
        tctx.drawImage(img, dx, dy, drawW, drawH);
      } else {
        tctx.clearRect(0, 0, cw, ch);
        tctx.drawImage(img, 0, 0, cw, ch);
      }
      tctx.filter = "none";
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(tmp, 0, 0);
      pictureGrayBaseRef.current = new ImageData(new Uint8ClampedArray(ctx.getImageData(0, 0, cw, ch).data), cw, ch);
      pictureZoneDoneRef.current = false;
      colorImgCanvasRef.current = null;
      paintedBaseRef.current = null;
      setPictureLoadVersion((v) => v + 1);
      setTimeout(() => speakWord(item.speakWord), 400);
    };
    img.src = `${imageBasePath}/${item.file}`;
  }, [item.file, item.speakWord, imageBasePath, useFullRegionTargets]);

  /* ── draw word outline ── */
  const drawWordOutline = useCallback(() => {
    if (wordHintRafRef.current !== null) { cancelAnimationFrame(wordHintRafRef.current); wordHintRafRef.current = null; }
    wordHintTriggerRef.current++;
    const wrap = wordWrapRef.current, canvas = wordCanvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const logicalW = Math.max(200, wrap.clientWidth);
    const logicalH = WORD_LOGICAL_HEIGHT;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(logicalW * dpr);
    canvas.height = Math.floor(logicalH * dpr);
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const lower = item.word.toLowerCase();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, logicalW, logicalH);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let fontSize = 72;
    for (; fontSize >= 24; fontSize -= 2) {
      ctx.font = `${WORD_FONT_WEIGHT} ${fontSize}px ${WORD_FONT_FAMILY}`;
      if (ctx.measureText(lower).width <= logicalW - 24) break;
    }
    ctx.strokeStyle = "#000";
    ctx.lineWidth = WORD_STROKE_WIDTH;
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.miterLimit = 2;
    ctx.strokeText(lower, logicalW / 2, logicalH / 2);
    const layout: WordLayout = { logicalW, logicalH, fontSize, text: lower };
    wordLayoutRef.current = layout;
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    wordFillableRef.current = buildWordInteriorFillableMask(id.data, canvas.width, canvas.height);
    wordBaseImageRef.current = new ImageData(new Uint8ClampedArray(id.data), canvas.width, canvas.height);
    ctx.putImageData(id, 0, 0);
    const bounds = getLetterLogicalBounds(layout, ctx);
    const lMasks = buildLetterFillableMasks(wordFillableRef.current, canvas.width, canvas.height, dpr, bounds);
    wordLetterMasksRef.current = lMasks;
    wordDprRef.current = dpr;
    wordLetterBoundsRef.current = bounds;
    wordOutlineDoneRef.current = false;

    /* re-apply any letters that were already colored (survives layout resize) */
    const colorMap = wordLetterColorMapRef.current;
    const coloredKeys = Object.keys(colorMap);
    if (coloredKeys.length > 0) {
      const cw = canvas.width, ch = canvas.height;
      const rid = ctx.getImageData(0, 0, cw, ch);
      for (const key of coloredKeys) {
        const li = Number(key);
        const rgb = colorMap[li];
        const m = lMasks[li];
        if (!m || !rgb) continue;
        for (let i = 0; i < cw * ch; i++) {
          if (!m[i]) continue;
          const o = i * 4;
          rid.data[o] = rgb[0]; rid.data[o + 1] = rgb[1]; rid.data[o + 2] = rgb[2]; rid.data[o + 3] = 255;
        }
      }
      ctx.putImageData(rid, 0, 0);
      clampWordToBase(ctx, cw, ch, wordFillableRef.current!, wordBaseImageRef.current!);
      const updatedId = ctx.getImageData(0, 0, cw, ch);
      wordBaseImageRef.current = new ImageData(new Uint8ClampedArray(updatedId.data), cw, ch);
    }
  }, [item.word]);

  /* ── effects ── */
  useEffect(() => { loadPicture(); }, [loadPicture]);

  useEffect(() => {
    setZoneFilled({}); setActiveZoneDefs([]); setLetterFilled({});
    setPictureRevealed(false); setWordTargetColorId("");
    pictureZoneDoneRef.current = false; wordOutlineDoneRef.current = false;
    pictureGrayBaseRef.current = null;
    pictureColorOriginalRef.current = null;
    pictureZoneMasksRef.current = {};
    pictureZonePixelsRef.current = {};
    pictureZoneSketchRef.current = {};
    pictureZoneFillAnimRef.current = {};
    pictureZoneHintsRef.current = [];
    colorImgCanvasRef.current = null;
    paintedBaseRef.current = null;
    if (circlePulseRafRef.current) { cancelAnimationFrame(circlePulseRafRef.current); circlePulseRafRef.current = null; }
    if (revealRafRef.current) { cancelAnimationFrame(revealRafRef.current); revealRafRef.current = null; }
    if (wordHintRafRef.current) { cancelAnimationFrame(wordHintRafRef.current); wordHintRafRef.current = null; }
    if (hintFlashTimerRef.current) { clearTimeout(hintFlashTimerRef.current); hintFlashTimerRef.current = null; }
    wordHintTriggerRef.current++;
    wordLetterColorMapRef.current = {};
    setHintFlashColorId("");
  }, [item.word, index]);

  useEffect(() => {
    drawWordOutline();
    const wrap = wordWrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => drawWordOutline());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [drawWordOutline]);

  const startWordHintAnim = useCallback((_iterations: number) => {
    if (wordHintRafRef.current !== null) { cancelAnimationFrame(wordHintRafRef.current); wordHintRafRef.current = null; }
    const canvas = wordCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    const base = wordBaseImageRef.current;
    const layout = wordLayoutRef.current;
    const masks = wordLetterMasksRef.current;
    const bounds = wordLetterBoundsRef.current;
    const pal = PALETTE.find((p) => p.id === wordTargetColorId);
    if (!canvas || !ctx || !base || !layout || !masks || !bounds || !pal) return;

    const trigger = ++wordHintTriggerRef.current;
    const periodMs = 3400;
    const tickDurationMs = 430;
    const start = performance.now();
    let tickStartMs: number | null = null;
    const [fr, fg, fb] = hexToRgb(pal.hex);
    const getWordArrowPoint = () => {
      // Word canvas has a persistent dpr transform — use logical coordinates here.
      const wordBounds = bounds.filter((b, i) => b.ch !== " " && masks[i] && maskHasAnyPixels(masks[i]));
      if (!wordBounds.length) return null;
      const firstLetterLeft = Math.min(...wordBounds.map((b) => b.left));
      const y = layout.logicalH * 0.5;
      const x = firstLetterLeft - 10;
      return { x, y, sourceX: x - 1 };
    };

    const frame = (now: number) => {
      if (wordHintTriggerRef.current !== trigger) return;
      const elapsed = now - start;
      const currentLetters = letterFilledRef.current;
      if (areWordLettersFilled(bounds, masks, currentLetters)) {
        if (tickStartMs === null) tickStartMs = now;
        const tickProgress = clamp01((now - tickStartMs) / tickDurationMs);
        const arrowPoint = getWordArrowPoint();
        try { ctx.putImageData(base, 0, 0); } catch { /* noop */ }
        if (arrowPoint) {
          // drawTickClue draws centered at (targetX, targetY - 18) — offset so center matches arrow.
          drawTickClue(ctx, arrowPoint.x, arrowPoint.y + 18, pal.hex, tickProgress);
        }
        if (tickProgress < 1) {
          wordHintRafRef.current = requestAnimationFrame(frame);
        } else {
          try { ctx.putImageData(base, 0, 0); } catch { /* noop */ }
          wordHintRafRef.current = null;
        }
        return;
      }
      const phase = (elapsed % periodMs) / periodMs;
      const previewProgress = phase < 0.78 ? phase / 0.78 : 1;
      const id = new ImageData(new Uint8ClampedArray(base.data), canvas.width, canvas.height);
      const clueAlpha = 0.58;
      let hasTarget = false;

      for (let li = 0; li < masks.length; li++) {
        const mask = masks[li];
        if (!mask || currentLetters[li] || bounds[li]?.ch === " ") continue;
        hasTarget = true;
        for (let p = 0; p < canvas.width * canvas.height; p++) {
          if (!mask[p]) continue;
          const x = p % canvas.width;
          const y = (p / canvas.width) | 0;
          const noise = ((((x * 73856093) ^ (y * 19349663)) >>> 0) % 997) / 997;
          const score = clamp01((x / Math.max(1, canvas.width - 1)) * 0.88 + noise * 0.12);
          if (score > previewProgress) continue;
          const o = p * 4;
          id.data[o] = Math.round(id.data[o] * (1 - clueAlpha) + fr * clueAlpha);
          id.data[o + 1] = Math.round(id.data[o + 1] * (1 - clueAlpha) + fg * clueAlpha);
          id.data[o + 2] = Math.round(id.data[o + 2] * (1 - clueAlpha) + fb * clueAlpha);
          id.data[o + 3] = 255;
        }
      }

      ctx.putImageData(id, 0, 0);
      if (hasTarget) {
        const arrowPoint = getWordArrowPoint();
        if (arrowPoint && !shouldHideArrowMomentarily(now / 1000, 0.61)) {
          drawSmallArrowClue(
            ctx,
            arrowPoint.x,
            arrowPoint.y,
            arrowPoint.sourceX,
            arrowPoint.y,
            pal.hex,
            now / 1000,
            0,
          );
        }
      }
      wordHintRafRef.current = requestAnimationFrame(frame);
    };
    wordHintRafRef.current = requestAnimationFrame(frame);
  }, [wordTargetColorId]);

  useEffect(() => {
    if (!wordTargetColorId) return;
    const t = setTimeout(() => startWordHintAnim(2), 600);
    return () => clearTimeout(t);
  }, [wordTargetColorId, startWordHintAnim]);

  useEffect(() => {
    if (!pictureRevealed) return;
    const t = setTimeout(() => startWordHintAnim(3), 400);
    return () => clearTimeout(t);
  }, [pictureRevealed, startWordHintAnim]);

  useEffect(() => {
    const loadVoices = () => speechSynthesis.getVoices();
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  /* ── paint base + animated circles ── */
  useEffect(() => {
    if (circlePulseRafRef.current) { cancelAnimationFrame(circlePulseRafRef.current); circlePulseRafRef.current = null; }

    const canvas = canvasRef.current;
    const base = pictureGrayBaseRef.current;
    const orig = pictureColorOriginalRef.current;
    if (!canvas || !base || !orig) return;
    const w = canvas.width, h = canvas.height;
    if (base.width !== w || base.height !== h) return;

    if (pictureRevealed) {
      const ctx = canvas.getContext("2d");
      if (ctx) try { ctx.putImageData(new ImageData(new Uint8ClampedArray(orig.data), w, h), 0, 0); } catch { /* noop */ }
      return;
    }
    if (revealRafRef.current) return;

    const zones = activeZoneDefs;
    const masks = pictureZoneMasksRef.current;
    const hints = pictureZoneHintsRef.current;
    const allDone = zones.length > 0 && zones.every((z) => zoneFilled[z.id]);

    if (!paintedBaseRef.current || paintedBaseRef.current.width !== w || paintedBaseRef.current.height !== h) {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      paintedBaseRef.current = c;
    }
    const baseCtx = paintedBaseRef.current.getContext("2d")!;
    try {
      const id = new ImageData(new Uint8ClampedArray(base.data), w, h);
      for (const z of zones) {
        if (!zoneFilled[z.id]) continue;
        const mask = masks[z.id]; if (!mask) continue;
        for (let i = 0; i < w * h; i++) {
          if (!mask[i]) continue;
          const o = i * 4;
          id.data[o] = orig.data[o]; id.data[o + 1] = orig.data[o + 1]; id.data[o + 2] = orig.data[o + 2]; id.data[o + 3] = orig.data[o + 3];
        }
      }
      baseCtx.putImageData(id, 0, 0);
    } catch { return; }

    if (allDone) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(paintedBaseRef.current, 0, 0);
      return;
    }

    if (!zones.length) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.drawImage(paintedBaseRef.current, 0, 0);
      return;
    }

    const minDim = Math.min(w, h);
    const frame = (now: number) => {
      const ctx = canvas.getContext("2d");
      const baseC = paintedBaseRef.current;
      if (!ctx || !baseC || revealRafRef.current) { circlePulseRafRef.current = null; return; }

      ctx.drawImage(baseC, 0, 0);

      const t = now / 1000;
      const pulse = Math.sin(t * 3.5);
      const curFilled = zoneFilledRef.current;

      let hasUnfilled = false;
      if (useFullRegionTargets) {
        const anims = pictureZoneFillAnimRef.current;
        const sketchMap = pictureZoneSketchRef.current;
        const composed = new ImageData(new Uint8ClampedArray(base.data), w, h);
        const completedZoneIds: string[] = [];
        const arrowClues: { x: number; y: number; color: string; phase: number; thick?: boolean }[] = [];
        const tickClues: { x: number; y: number; color: string; progress: number }[] = [];

        for (const zone of zones) {
          const zoneId = zone.id;
          const zoneAnim = anims[zoneId];
          const sketch = sketchMap[zoneId];
          if (curFilled[zoneId]) {
            const pixels = sketch?.pixels ?? pictureZonePixelsRef.current[zoneId] ?? [];
            for (const p of pixels) {
              const o = p * 4;
              composed.data[o] = orig.data[o];
              composed.data[o + 1] = orig.data[o + 1];
              composed.data[o + 2] = orig.data[o + 2];
              composed.data[o + 3] = orig.data[o + 3];
            }
            continue;
          }

          if (!sketch) {
            hasUnfilled = true;
            continue;
          }

          const pal = PALETTE.find((p) => p.id === zone.hintColorId);
          if (!pal || !sketch) continue;
          const [fr, fg, fb] = hexToRgb(pal.hex);

          if (zoneAnim) {
            const elapsed = now - zoneAnim.startMs;
            const progress = clamp01(elapsed / zoneAnim.durationMs);
            for (const p of sketch.pixels) {
              const o = p * 4;
              composed.data[o] = orig.data[o];
              composed.data[o + 1] = orig.data[o + 1];
              composed.data[o + 2] = orig.data[o + 2];
              composed.data[o + 3] = orig.data[o + 3];
            }
            if (progress < 1) {
              hasUnfilled = true;
              tickClues.push({ x: sketch.targetX, y: sketch.targetY, color: pal.hex, progress });
              continue;
            }
            completedZoneIds.push(zoneId);
            delete anims[zoneId];
            continue;
          }

          // Clue animation: solid color progressively fills the target, then repeats.
          const previewCycleSec = 3.4;
          const cycle = ((t + sketch.flashPhase * 0.25) % previewCycleSec) / previewCycleSec;
          const previewProgress = cycle < 0.78 ? cycle / 0.78 : 1;
          hasUnfilled = true;
          arrowClues.push({ x: sketch.targetX, y: sketch.targetY, color: pal.hex, phase: sketch.flashPhase });
          for (let i = 0; i < sketch.pixels.length; i++) {
            if (sketch.fillScores[i] > previewProgress) continue;
            const p = sketch.pixels[i];
            const o = p * 4;
            const clueAlpha = 0.58;
            composed.data[o] = Math.round(composed.data[o] * (1 - clueAlpha) + fr * clueAlpha);
            composed.data[o + 1] = Math.round(composed.data[o + 1] * (1 - clueAlpha) + fg * clueAlpha);
            composed.data[o + 2] = Math.round(composed.data[o + 2] * (1 - clueAlpha) + fb * clueAlpha);
            composed.data[o + 3] = 255;
          }
        }
        ctx.putImageData(composed, 0, 0);

        for (const arrow of arrowClues) {
          if (!arrow.thick && shouldHideArrowMomentarily(t, arrow.phase)) continue;
          drawSmallArrowClue(
            ctx,
            arrow.x,
            arrow.y,
            w / 2,
            h / 2,
            arrow.color,
            t,
            arrow.phase,
            arrow.thick,
          );
        }
        for (const tick of tickClues) {
          drawTickClue(
            ctx,
            tick.x,
            tick.y,
            tick.color,
            tick.progress,
          );
        }

        if (completedZoneIds.length) {
          const colorMap = Object.fromEntries(
            completedZoneIds.map((id) => {
              const z = zones.find((x) => x.id === id);
              const hex = PALETTE.find((p) => p.id === z?.hintColorId)?.hex ?? "#000";
              return [id, hex];
            }),
          );
          setZoneFilled((prev) => ({ ...prev, ...colorMap }));
        }
      } else {
        for (const hint of hints) {
          if (curFilled[hint.id]) continue;
          hasUnfilled = true;
          const z = zones.find((zon) => zon.id === hint.id);
          const pal = PALETTE.find((p) => p.id === z?.hintColorId);
          const hex = pal?.hex ?? "#888";
          const cx = hint.cx * w, cy = hint.cy * h;
          const baseRad = Math.max(13, hint.r * minDim);
          const rad = baseRad * (1 + 0.13 * pulse);

          ctx.globalAlpha = 0.82 + 0.14 * pulse;
          ctx.fillStyle = hex;
          ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();

          ctx.globalAlpha = 1;
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      if (hasUnfilled) {
        circlePulseRafRef.current = requestAnimationFrame(frame);
      } else {
        circlePulseRafRef.current = null;
      }
    };
    circlePulseRafRef.current = requestAnimationFrame(frame);

    return () => {
      if (circlePulseRafRef.current) { cancelAnimationFrame(circlePulseRafRef.current); circlePulseRafRef.current = null; }
    };
  }, [activeZoneDefs, zoneFilled, pictureLoadVersion, pictureRevealed, useFullRegionTargets]);

  /* ── all zones done → reveal animation ── */
  useEffect(() => {
    if (!activeZoneDefs.length) return;
    const all = activeZoneDefs.every((z) => zoneFilled[z.id]);
    if (all && !pictureZoneDoneRef.current) {
      pictureZoneDoneRef.current = true;
      if (circlePulseRafRef.current) { cancelAnimationFrame(circlePulseRafRef.current); circlePulseRafRef.current = null; }
      playFanfare();
      setTimeout(() => startRevealAnimationRef.current(), 60);
    }
  }, [zoneFilled, activeZoneDefs]);

  /* ── all letters done → speak word ── */
  useEffect(() => {
    const bounds = wordLetterBoundsRef.current;
    const masks = wordLetterMasksRef.current;
    if (!bounds || !masks) return;
    let need = 0;
    for (let i = 0; i < bounds.length; i++) {
      if (bounds[i].ch === " ") continue;
      if (!maskHasAnyPixels(masks[i])) continue;
      need++;
      if (!letterFilled[i]) return;
    }
    if (need === 0) return;
    if (!wordOutlineDoneRef.current) {
      wordOutlineDoneRef.current = true;
      playFanfare();
      setTimeout(() => speakWord(item.speakWord), 350);
    }
  }, [letterFilled, item.speakWord]);

  /* ── interaction: picture zone tap ── */
  const getPictureCoords = (cx: number, cy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
  };
  const runPictureZoneTap = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const zones = activeZoneDefsRef.current;
    const filled = zoneFilledRef.current;
    const hints = pictureZoneHintsRef.current;
    const currentColorId = colorIdRef.current;
    if (!canvas || !zones.length || pictureRevealed) return;
    if (!hints.length || !pictureGrayBaseRef.current) return;
    const { x, y } = getPictureCoords(clientX, clientY);
    const px = Math.max(0, Math.min(canvas.width - 1, Math.floor(x)));
    const py = Math.max(0, Math.min(canvas.height - 1, Math.floor(y)));
    const pixelIndex = py * canvas.width + px;

    let hitId: string | null = null;
    if (useFullRegionTargets) {
      for (const zone of zones) {
        if (filled[zone.id]) continue;
        const mask = pictureZoneMasksRef.current[zone.id];
        if (mask?.[pixelIndex]) {
          hitId = zone.id;
          break;
        }
      }
    } else {
      hitId = findHintByProximity(x, y, canvas.width, canvas.height, hints, filled);
    }

    if (!hitId) { playWrongSound(); return; }
    const zoneDef = zones.find((z) => z.id === hitId);
    if (!zoneDef || filled[hitId]) return;
    if (pictureZoneFillAnimRef.current[hitId]) return;
    if (currentColorId !== zoneDef.hintColorId) {
      playWrongSound();
      if (hintFlashTimerRef.current) clearTimeout(hintFlashTimerRef.current);
      setHintFlashColorId(zoneDef.hintColorId);
      hintFlashTimerRef.current = setTimeout(() => setHintFlashColorId(""), 1200);
      return;
    }
    playSuccessSound();
    pictureZoneFillAnimRef.current[hitId] = {
      startMs: performance.now(),
      durationMs: 360,
    };
    setPictureLoadVersion((v) => v + 1);
  };

  /* ── interaction: word letter tap ── */
  const getWordBitmapCoords = (cx: number, cy: number) => {
    const canvas = wordCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
  };
  const runWordLetterTap = (clientX: number, clientY: number) => {
    const canvas = wordCanvasRef.current, ctx = canvas?.getContext("2d");
    const fillable = wordFillableRef.current, base = wordBaseImageRef.current;
    const bounds = wordLetterBoundsRef.current, letterMasks = wordLetterMasksRef.current;
    const dpr = wordDprRef.current;
    if (!canvas || !ctx || !fillable || !base || !bounds || !letterMasks) return;
    const { x, y } = getWordBitmapCoords(clientX, clientY);
    const w = canvas.width, h = canvas.height;
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    if (base.width !== w || base.height !== h) return;
    const lx = x / dpr;
    let letterIdx = -1;
    for (let i = 0; i < bounds.length; i++) {
      if (bounds[i].ch === " ") continue;
      if (lx >= bounds[i].left && lx < bounds[i].right) { letterIdx = i; break; }
    }
    if (letterIdx < 0) return;
    if (!maskHasAnyPixels(letterMasks[letterIdx])) return;
    if (letterFilled[letterIdx]) return;
    if (wordTargetColorId && selected.id !== wordTargetColorId) { playWrongSound(); return; }
    if (wordHintRafRef.current !== null) { cancelAnimationFrame(wordHintRafRef.current); wordHintRafRef.current = null; }
    wordHintTriggerRef.current++;
    const targetPal = wordTargetColorId ? PALETTE.find((p) => p.id === wordTargetColorId) : selected;
    const [fr, fg, fb] = hexToRgb(targetPal?.hex ?? selected.hex);
    const id = new ImageData(new Uint8ClampedArray(base.data), w, h);
    const mask = letterMasks[letterIdx];
    for (let i = 0; i < w * h; i++) { if (!mask[i]) continue; const o = i * 4; id.data[o] = fr; id.data[o + 1] = fg; id.data[o + 2] = fb; id.data[o + 3] = 255; }
    ctx.putImageData(id, 0, 0);
    clampWordToBase(ctx, w, h, fillable, base);
    wordBaseImageRef.current = new ImageData(new Uint8ClampedArray(ctx.getImageData(0, 0, w, h).data), w, h);
    wordLetterColorMapRef.current[letterIdx] = [fr, fg, fb];
    const ch = bounds[letterIdx].ch;
    if (ch && ch !== " ") {
      playLetterWav(ch);
      setLetterFilled((prev) => {
        const next = { ...prev, [letterIdx]: true };
        letterFilledRef.current = next;
        return next;
      });
      setTimeout(() => startWordHintAnim(0), 0);
    }
  };

  /* ── pencil selection ── */
  const handlePencilClick = (id: string) => {
    setColorId(id);
    playColorWav(id);
  };

  /* ═══════ RENDER ═══════ */
  return (
    <Layout>
      <div id="color-sound-game-root" className="cs-root">
        <div className="cs-container max-w-4xl mx-auto">
          <PrimarySchoolGameHeader
            gameName="Colour This"
            description={
              useFullRegionTargets
                ? "Pick a pencil, tap the matching color area on the picture, then colour each letter."
                : "Pick a pencil, tap the matching circles on the picture, then colour each letter."
            }
            containerId="color-sound-game-root"
          />

          <div className="cs-body">
            {/* game row: picture + pencil sidebar */}
            <div className={`cs-game-row ${useFullRegionTargets ? "center-picture" : ""}`}>
              <div className={`cs-picture-wrap ${useFullRegionTargets ? "square" : ""}`}>
                <canvas
                  ref={canvasRef}
                  className={`cs-picture ${useFullRegionTargets ? "square" : ""}`}
                  onMouseDown={(e) => runPictureZoneTap(e.clientX, e.clientY)}
                  onTouchStart={(e) => { e.preventDefault(); runPictureZoneTap(e.touches[0].clientX, e.touches[0].clientY); }}
                />
              </div>
              <div className="cs-pencil-sidebar">
                <div className="cs-pencil-col">
                  {PALETTE.map((c) => {
                    const isActive = colorId === c.id;
                    const isLight = c.id === "white" || c.id === "yellow";
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`cs-pencil ${isActive ? "active" : ""} ${hintFlashColorId === c.id ? "hint-flash" : ""}`}
                        style={{ "--pencil-color": c.hex, "--pencil-glow": c.hex } as React.CSSProperties}
                        onClick={() => handlePencilClick(c.id)}
                        aria-label={c.label}
                      >
                        <div className="cs-pencil-tip" style={{ background: c.hex }} />
                        <div className="cs-pencil-wood" />
                        <div className={`cs-pencil-body ${isLight ? "cs-pencil-body--light" : ""}`} style={{ background: c.hex }} />
                        <div className="cs-pencil-ferrule" />
                      </button>
                    );
                  })}
                </div>
                <span className="cs-active-label">{selected.label}</span>
              </div>
            </div>

            {/* word instruction + canvas */}
            {wordTargetPal && (
              <p className="cs-word-instruction">
                Colour the word in{" "}
                <span className="cs-word-instruction-color" style={{ color: wordTargetPal.hex }}>
                  {wordTargetPal.label}
                </span>
                !
              </p>
            )}
            <div ref={wordWrapRef} className="cs-word-wrap">
              <canvas
                ref={wordCanvasRef}
                className="cs-word-canvas"
                onMouseDown={(e) => { e.stopPropagation(); runWordLetterTap(e.clientX, e.clientY); }}
                onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); runWordLetterTap(e.touches[0].clientX, e.touches[0].clientY); }}
              />
            </div>

            {/* nav */}
            <div className="cs-nav">
              <Button variant="outline" size="sm" onClick={() => setLocation(gamesMenuHref)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Games
              </Button>
              <span className="cs-counter">{index + 1} / {vocab.length}</span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={index <= 0} onClick={() => setIndex((n) => Math.max(0, n - 1))}>Prev</Button>
                <Button variant="secondary" size="sm" disabled={index >= vocab.length - 1} onClick={() => setIndex((n) => Math.min(vocab.length - 1, n + 1))}>Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
