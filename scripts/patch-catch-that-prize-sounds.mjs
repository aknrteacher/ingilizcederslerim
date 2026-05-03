/**
 * Adds shared prize SFX to all Catch That games:
 * - extra-heart / extra-time → playCatchThatPositiveRewardSound (bell)
 * - bomb / minus-time → playCatchThatNegativeRewardSound (error / wrong fallback)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pagesDir = path.join(root, "client", "src", "pages");

const SOUND_IMPORT =
  'import { playCatchThatPositiveRewardSound, playCatchThatNegativeRewardSound } from "@/lib/catch-that-sounds";\n';

const RE_BOMB = new RegExp(
  [
    "        setCombo\\(0\\);\\n",
    "(?:        \\/\\/ Play short error sound when bomb is caught\\n        )?",
    "        const bombAudio = new Audio\\(\"/sounds/error\\.mp3\"\\);\\n",
    "        bombAudio\\.volume = 0\\.7;\\n",
    "        bombAudio\\.play\\(\\)\\.catch\\(\\(err\\) => \\{\\n",
    '          console\\.error\\("Error sound failed, trying wrong\\.mp3:", err\\);\\n',
    "          const fallbackAudio = new Audio\\(\"/sounds/wrong\\.mp3\"\\);\\n",
    "          fallbackAudio\\.volume = 0\\.7;\\n",
    "          fallbackAudio\\.play\\(\\)\\.catch\\(\\(\\) => \\{\\}\\);\\n",
    "        \\}\\);",
  ].join(""),
  "g"
);

const RE_MINUS = new RegExp(
  [
    "        setCombo\\(0\\);\\n",
    "(?:        \\/\\/ Play short error sound when minus-time prize is caught\\n        )?",
    "        const minusAudio = new Audio\\(\"/sounds/error\\.mp3\"\\);\\n",
    "        minusAudio\\.volume = 0\\.7;\\n",
    "        minusAudio\\.play\\(\\)\\.catch\\(\\(err\\) => \\{\\n",
    '          console\\.error\\("Error sound failed, trying wrong\\.mp3:", err\\);\\n',
    "          const fallbackAudio = new Audio\\(\"/sounds/wrong\\.mp3\"\\);\\n",
    "          fallbackAudio\\.volume = 0\\.7;\\n",
    "          fallbackAudio\\.play\\(\\)\\.catch\\(\\(\\) => \\{\\}\\);\\n",
    "        \\}\\);",
  ].join(""),
  "g"
);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, out);
    else if (name.isFile() && p.includes("catch-that") && p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

function addImport(src) {
  if (src.includes("catch-that-sounds")) return src;
  const m = src.match(/import \{ speakCatchThatTargetWord \} from "@\/lib\/catch-that-speech";\r?\n/);
  if (m) return src.replace(m[0], m[0] + SOUND_IMPORT);
  const m2 = src.match(/import "@\/styles\/[^"]*-game-footer\.css";\r?\n/);
  if (!m2) throw new Error("No import anchor (footer css) found");
  return src.replace(m2[0], m2[0] + SOUND_IMPORT);
}

function patch(rawSrc) {
  const src = rawSrc.replace(/\r\n/g, "\n");
  if (!src.includes("const catchPrize = useCallback")) return null;
  if (!src.includes("case 'extra-heart':")) return null;

  let c = src;

  c = addImport(c);

  if (!c.includes("playCatchThatPositiveRewardSound();")) {
    c = c.replace(
      /case 'extra-heart':\n        setLives\(prev => Math\.min\(10, prev \+ 1\)\); \/\/ Max 10 lives\n/,
      "case 'extra-heart':\n        playCatchThatPositiveRewardSound();\n        setLives(prev => Math.min(10, prev + 1)); // Max 10 lives\n"
    );
    c = c.replace(
      /case 'extra-heart':\n        setLives\(prev => Math\.min\(10, prev \+ 1\)\);\n/,
      "case 'extra-heart':\n        playCatchThatPositiveRewardSound();\n        setLives(prev => Math.min(10, prev + 1));\n"
    );

    c = c.replace(
      /case 'extra-time':\n        \/\/ Add bonus points as "extra time" reward\n        setScore/,
      'case \'extra-time\':\n        playCatchThatPositiveRewardSound();\n        // Add bonus points as "extra time" reward\n        setScore'
    );
    c = c.replace(
      /case 'extra-time':\n        setScore\(prev => prev \+ 20\);\n/,
      "case 'extra-time':\n        playCatchThatPositiveRewardSound();\n        setScore(prev => prev + 20);\n"
    );
  }

  c = c.replace(RE_BOMB, "        setCombo(0);\n        playCatchThatNegativeRewardSound();");
  c = c.replace(RE_MINUS, "        setCombo(0);\n        playCatchThatNegativeRewardSound();");

  return c;
}

const files = walk(pagesDir);
let n = 0;
for (const f of files) {
  const before = fs.readFileSync(f, "utf8");
  const after = patch(before);
  if (after && after !== before) {
    fs.writeFileSync(f, after);
    console.log("patched", path.relative(root, f));
    n++;
  }
}
console.log(`done, ${n} files updated`);
