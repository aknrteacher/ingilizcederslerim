import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const units = [];
for (let t = 2; t <= 6; t++) units.push({ id: `2.${t}`, rel: `src/pages/primary/grade2/theme${t}/games/2.${t}.color-sound.tsx` });
for (let u = 1; u <= 10; u++) {
  const id = u === 10 ? "3.10" : `3.${u}`;
  units.push({ id, rel: `src/pages/primary/grade3/unit${u}/games/${id}.color-sound.tsx` });
}
for (const u of [6, 7, 8, 9]) units.push({ id: `4.${u}`, rel: `src/pages/primary/grade4/unit${u}/games/4.${u}.color-sound.tsx` });

const template = (unitId, compName) => `import { ColourThisGame } from "@/components/games/ColourThisGame";
import { COLOUR_THIS_VOCAB, getColourThisGamesMenuHref, getColourThisImageBase } from "@/data/colour-this-vocab";

const UNIT_ID = "${unitId}" as const;

export default function ${compName}() {
  return (
    <ColourThisGame
      vocab={COLOUR_THIS_VOCAB[UNIT_ID]}
      imageBasePath={getColourThisImageBase(UNIT_ID)}
      gamesMenuHref={getColourThisGamesMenuHref(UNIT_ID)}
    />
  );
}
`;

function compName(id) {
  return "ColourThis" + id.replace(".", "_");
}

for (const { id, rel } of units) {
  if (id === "2.1") continue;
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, template(id, compName(id)), "utf8");
  console.log("wrote", rel);
}
