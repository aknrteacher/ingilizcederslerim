import fs from "fs";
import path from "path";

const REPO = path.resolve(import.meta.dirname, "..");

const targets = [
  "client/src/pages/preschool/games/0.5-ourbody/0.5-ourbody.catch-that.tsx",
  "client/src/pages/preschool/games/0.6-ourclassroom/0.6-ourclassroom.catch-that.tsx",
  "client/src/pages/preschool/games/0.7-things/0.7-things.catch-that.tsx",
  "client/src/pages/preschool/games/0.8-people/0.8-people.catch-that.tsx",
  "client/src/pages/preschool/games/0.9-animals/0.9-animals.catch-that.tsx",
  "client/src/pages/preschool/games/0.10-aroundus/0.10-aroundus.catch-that.tsx",
  "client/src/pages/preschool/games/0.11-food/0.11-food.catch-that.tsx",
];

const playOld =
  /<div className=\{'flex-1 relative overflow-hidden ' \+ \(isFullscreen \? 'min-h-\[600px\]' : 'min-h-\[500px\]'\) \+ ' rounded-xl bg-gradient-to-b from-sky-200 to-blue-100 border-4 border-blue-200'\}>/;

const playNew = `<div
              ref={playAreaRef}
              className={'flex-1 relative overflow-hidden touch-none ' + (isFullscreen ? 'min-h-[600px]' : 'min-h-[500px]') + ' rounded-xl bg-gradient-to-b from-sky-200 to-blue-100 border-4 border-blue-200'}>`;

const wordsGap =
  /\}\)\}\s*\n\s*\{gameStarted && \(\s*\n\s*<AnimatePresence initial=\{false\}>\s*\n\s*\{fallingPrizes\.map/;

const wordsFixed = `})}
                </AnimatePresence>
              )}

              {gameStarted && (
                <AnimatePresence initial={false}>
                  {fallingPrizes.map`;

const prizesGap =
  /\}\)\}\s*\n\s*\{gameStarted && \(\s*\n\s*<div\s*\n\s*ref=\{basketRef\}/;

const prizesFixed = `})}
                </AnimatePresence>
              )}

              {gameStarted && (
                <div
                  ref={basketRef}`;

for (const rel of targets) {
  const fp = path.join(REPO, rel);
  let c = fs.readFileSync(fp, "utf8");
  const before = c;
  c = c.replace(playOld, playNew);
  c = c.replace(wordsGap, wordsFixed);
  c = c.replace(prizesGap, prizesFixed);
  if (c !== before) {
    fs.writeFileSync(fp, c);
    console.log("fixed jsx", rel);
  }
}
