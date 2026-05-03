/**
 * Catch That fixes for preschool (keeps spawnInterval / fallSpeed as authored).
 * Skips 0.3-greetings. Adds speakCatchThatTargetWord once per active round.
 *
 * Usage: node scripts/patch-preschool-catch-that.mjs
 */
import fs from "fs";
import path from "path";

const REPO = path.resolve(import.meta.dirname, "..");

function walkCatchThat(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkCatchThat(p, acc);
    else if (ent.name.endsWith("catch-that.tsx")) acc.push(p);
  }
  return acc;
}

function patch(content, relPath) {
  let c = content.replace(/\r\n/g, "\n");
  if (relPath.includes("0.3-greetings")) return content;
  if (!c.includes("pictureCardTimerRef")) return content;

  if (!c.includes("@/lib/catch-that-speech")) {
    c = c.replace(
      `import "@/styles/preschool-game-footer.css";`,
      `import "@/styles/preschool-game-footer.css";\nimport { speakCatchThatTargetWord } from "@/lib/catch-that-speech";`,
    );
  }

  c = c.replace(
    /\n  const \[showPictureCard, setShowPictureCard\] = useState\(false\);\n  const \[pictureCardTimer, setPictureCardTimer\] = useState\(0\);\n/,
    "\n",
  );

  if (!c.includes("basketPositionRef")) {
    c = c.replace(
      /(const \[basketPosition, setBasketPosition\] = useState\(50\);[^\n]*\n)/,
      "$1  const basketPositionRef = useRef(50);\n",
    );
  }

  if (!c.includes("playAreaRef")) {
    c = c.replace(
      /(const gameAreaRef = useRef<HTMLDivElement>\(null\);\n)/,
      "$1  const playAreaRef = useRef<HTMLDivElement>(null);\n",
    );
  }

  c = c.replace(/\n  const pictureCardTimerRef = useRef<NodeJS.Timeout \| null>\(null\);\n/, "\n");

  if (!c.includes("const setBasketPct = useCallback")) {
    c = c.replace(
      /(const fallSpeed = [^\n]+;\n)/,
      `$1\n  const setBasketPct = useCallback((pct: number) => {\n    const clamped = Math.max(10, Math.min(90, pct));\n    basketPositionRef.current = clamped;\n    setBasketPosition(clamped);\n  }, []);\n`,
    );
  }

  const hasFormatter =
    /const formatWordForSpeech = \(/.test(c) || /function formatWordForSpeech\(/.test(c);
  const announceText = hasFormatter
    ? "formatWordForSpeech(currentWord.word)"
    : "currentWord.word.toLowerCase()";

  const announceMarker = `speakCatchThatTargetWord(${announceText})`;
  if (!c.includes(announceMarker)) {
    const announceBlock =
      `useEffect(() => {\n    if (!gameStarted || gameOver || gameWon) return;\n    ${announceMarker};\n  }, [currentWord.word, gameStarted, gameOver, gameWon]);\n\n`;
    c = c.replace(/(\}, \[gameStarted, gameOver, gameWon\]\);\n\n  const revealTurkish)/, `}, [gameStarted, gameOver, gameWon]);\n\n  ${announceBlock}  const revealTurkish`);
  }

  c = c.replace(
    /\n    \/\/ Clear picture card timer if it exists\n    if \(pictureCardTimerRef\.current\) \{\n      clearInterval\(pictureCardTimerRef\.current\);\n      pictureCardTimerRef\.current = null;\n    \}\n    \n/g,
    "\n",
  );

  const fm = c.match(/setFalling(Words|Numbers|Colors)/);
  const fallingSetter = fm ? `setFalling${fm[1]}` : "setFallingWords";

  c = c.replace(
    /\n      setGameWon\(true\);\n      setShowPictureCard\(false\);\n      setPictureCardTimer\(0\);\n      confetti\(/g,
    `\n      setGameWon(true);\n      ${fallingSetter}([]);\n      setFallingPrizes([]);\n      confetti(`,
  );

  c = c.replace(/\n    setShowPictureCard\(false\);\n    setPictureCardTimer\(0\);\n/g, "\n");

  c = c.replace(/\n  const startPictureCardDisplay = useCallback\(\(\) => \{[\s\S]*?\n  \}, \[nextWord\]\);\n/, "\n");

  c = c.replace(/const comboBonus = combo >= 2 \? combo : 1;/g, "const comboBonus = Math.max(1, combo + 1);");

  c = c.replace(
    /\n      if \(!showPictureCard\) \{\n        setTimeout\(\(\) => \{\n          startPictureCardDisplay\(\);\n        \}, 800\);\n      \}/g,
    "\n      queueMicrotask(() => nextWord());",
  );

  c = c.replace(
    /\[combo, gameOver, gameWon, speakWord, startPictureCardDisplay, showPictureCard, currentWord\]/g,
    "[combo, gameOver, gameWon, speakWord, currentWord, nextWord]",
  );

  c = c.replace(
    /\n    if \(pictureCardTimerRef\.current\) \{\n      clearInterval\(pictureCardTimerRef\.current\);\n      pictureCardTimerRef\.current = null;\n    \}\n/g,
    "\n",
  );

  c = c.replace(/\n    setBasketPosition\(50\);\n/g, "\n    setBasketPct(50);\n");

  c = c.replace(/\n  \}, \[\]\);\n\n  const resetGame/g, "\n  }, [setBasketPct]);\n\n  const resetGame");

  c = c.replace(
    /\n  const resetGame = useCallback\(\(\) => \{\n    if \(pictureCardTimerRef\.current\) \{\n      clearInterval\(pictureCardTimerRef\.current\);\n      pictureCardTimerRef\.current = null;\n    \}\n    startGame\(\);\n  \}, \[startGame\]\);/g,
    "\n  const resetGame = useCallback(() => {\n    startGame();\n  }, [startGame]);",
  );

  c = c.replace(
    /if \(e\.key === 'ArrowLeft' \|\| e\.key === 'a' \|\| e\.key === 'A'\) \{\n        setBasketPosition\(prev => Math\.max\(10, prev - 5\)\);\n      \} else if \(e\.key === 'ArrowRight' \|\| e\.key === 'd' \|\| e\.key === 'D'\) \{\n        setBasketPosition\(prev => Math\.min\(90, prev \+ 5\)\);\n/g,
    "if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {\n        setBasketPct(basketPositionRef.current - 5);\n      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {\n        setBasketPct(basketPositionRef.current + 5);\n",
  );

  c = c.replace(/(\}, \[gameStarted, gameOver, gameWon\]\);\n\n  \/\/ Handle mouse\/touch)/, "}, [gameStarted, gameOver, gameWon, setBasketPct]);\n\n  // Handle mouse/touch");

  c = c.replace(
    /if \(!gameStarted \|\| gameOver \|\| gameWon \|\| !gameAreaRef\.current\) return;/,
    "if (!gameStarted || gameOver || gameWon || !playAreaRef.current) return;",
  );

  c = c.replace(/gameAreaRef\.current\?\.getBoundingClientRect\(\)/g, "playAreaRef.current?.getBoundingClientRect()");

  c = c.replace(
    /const percentage = \(\(clientX - rect\.left\) \/ rect\.width\) \* 100;\n      setBasketPosition\(Math\.max\(10, Math\.min\(90, percentage\)\)\);/g,
    "const percentage = ((clientX - rect.left) / rect.width) * 100;\n      setBasketPct(percentage);",
  );

  if (!c.includes("handleTouchStart")) {
    c = c.replace(
      /const handleTouchMove = \(e: TouchEvent\) => \{\n      e\.preventDefault\(\);\n      if \(e\.touches\[0\]\) handleMove\(e\.touches\[0\]\.clientX\);\n    \};/,
      `const handleTouchMove = (e: TouchEvent) => {\n      e.preventDefault();\n      if (e.touches[0]) handleMove(e.touches[0].clientX);\n    };\n    const handleTouchStart = (e: TouchEvent) => {\n      if (e.touches[0]) handleMove(e.touches[0].clientX);\n    };`,
    );
    c = c.replace(
      /const gameArea = gameAreaRef\.current;\n    gameArea\.addEventListener\('mousemove'/,
      "const playArea = playAreaRef.current;\n    playArea.addEventListener('mousemove'",
    );
    c = c.replace(/gameArea\.addEventListener\('touchmove'/g, "playArea.addEventListener('touchmove'");
    c = c.replace(/gameArea\.removeEventListener/g, "playArea.removeEventListener");
    c = c.replace(
      /playArea\.addEventListener\('mousemove', handleMouseMove\);\n    playArea\.addEventListener\('touchmove'/,
      "playArea.addEventListener('mousemove', handleMouseMove);\n    playArea.addEventListener('touchstart', handleTouchStart, { passive: true });\n    playArea.addEventListener('touchmove'",
    );
  }

  c = c.replace(/(\}, \[gameStarted, gameOver, gameWon\]\);\n\n  \/\/ Spawn)/, "}, [gameStarted, gameOver, gameWon, setBasketPct]);\n\n  // Spawn");

  c = c.replace(
    /const basketCatchWidth = 15[^\n]*\n            const basketLeft = basketPosition - basketCatchWidth;\n            const basketRight = basketPosition \+ basketCatchWidth;/g,
    `const bx = basketPositionRef.current;\n            const basketCatchWidth = 18;\n            const basketLeft = bx - basketCatchWidth;\n            const basketRight = bx + basketCatchWidth;`,
  );

  c = c.replace(/, basketPosition, (catchWord|catchNumber|catchColor)/g, ", $1");

  c = c.replace(/\{\/\* Picture Card Timer Display \*\/\}[\s\S]*?<\/AnimatePresence>\n\n/, "");

  c = c.replace(/ \+ \(showPictureCard \? '[^']+' : ''\)/g, "");

  c = c.replace(/\n              \{showPictureCard && \([\s\S]*?\)\}\s*\n/, "\n");

  c = c.replace(/\s*disabled=\{showPictureCard\}\s*\n/g, "\n");

  c = c.replace(
    /\{\/\* Game Play Area \*\/\}\n            <div className=\{'flex-1 relative overflow-hidden '/g,
    `{/* Game Play Area — basket uses this region only */}
            <div
              ref={playAreaRef}
              className={'flex-1 relative overflow-hidden touch-none '`,
  );

  c = c.replace(
    /\{gameStarted && !gameOver && !gameWon && \(\s*\n                <div className="absolute top-2[^"]*"[^>]*>[\s\S]*?<\/div>\s*\n              \)\}/,
    `{gameStarted && !gameOver && !gameWon && (\n                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-4 py-2 rounded-lg text-xs text-center shadow-md max-w-[95%]">\n                  Move inside this blue area (or use ← → keys) to slide the basket\n                </div>\n              )}`,
  );

  const fallPlural = fm ? `falling${fm[1]}` : "fallingWords";

  if (!c.includes("<AnimatePresence initial={false}>")) {
    c = c.replace(
      new RegExp(`\\{gameStarted && ${fallPlural}\\.map\\(\\(`),
      `{gameStarted && (\n                <AnimatePresence initial={false}>\n                  {${fallPlural}.map((`,
    );
    c = c.replace(
      new RegExp(`\\}\\)\\}\\s*\\n\\s*\\{\\/\\* Falling Prizes \\*\\/\\}`),
      `})}\n                </AnimatePresence>\n              )}\n\n              {/* Falling Prizes */}`,
    );
    c = c.replace(/\{gameStarted && fallingPrizes\.map\(\(prize\) => \{/, "{gameStarted && (\n                <AnimatePresence initial={false}>\n                  {fallingPrizes.map((prize) => {");
    c = c.replace(/\}\)\}\s*\n\s*\{\/\* Catcher/, "})}\n                </AnimatePresence>\n              )}\n\n              {/* Catcher");
    c = c.replace(/key=\{word\.id\}\n                    className=\{fullClassName\}/g, "key={word.id}\n                    layout={false}\n                    className={fullClassName}");
    c = c.replace(/key=\{number\.id\}\n                    className=\{fullClassName\}/g, "key={number.id}\n                    layout={false}\n                    className={fullClassName}");
    c = c.replace(/key=\{color\.id\}\n                    className=\{fullClassName\}/g, "key={color.id}\n                    layout={false}\n                    className={fullClassName}");
    c = c.replace(
      /exit=\{\{ opacity: 0, scale: 0 \}\}/g,
      'exit={{ opacity: 0, scale: 0.2, filter: "blur(10px)", rotate: -8, transition: { duration: 0.28 } }}',
    );
    c = c.replace(/key=\{prize\.id\}\n                    className=\{fullClassName\}/g, "key={prize.id}\n                    layout={false}\n                    className={fullClassName}");
    c = c.replace(
      /exit=\{\{ opacity: 0, scale: 0, rotate: 180 \}\}/g,
      'exit={{ opacity: 0, scale: 0.15, filter: "blur(8px)", rotate: 220, transition: { duration: 0.26 } }}',
    );
  }

  c = c.replace(
    /className=\{'absolute ' \+ \(isFullscreen \? 'bottom-8' : 'bottom-4'\) \+ ' z-10 transition-all duration-100 ease-linear'\}/,
    "className={'absolute ' + (isFullscreen ? 'bottom-8' : 'bottom-4') + ' z-10 pointer-events-none'}",
  );

  if (!c.includes("challengeFriends")) {
    const challengeBlock =
      "const challengeFriends = () => {\n" +
      "    const text = `Catch That — I'm at ${score} points. Think you can beat me? 👋`;\n" +
      "    if (navigator.share) {\n" +
      "      navigator.share({ title: \"Catch That — Challenge\", text, url: window.location.href }).catch((err: unknown) => {\n" +
      "        if (err instanceof Error && err.name === \"AbortError\") return;\n" +
      "        navigator.clipboard.writeText(text + \" \" + window.location.href);\n" +
      "      });\n" +
      "    } else {\n" +
      "      navigator.clipboard.writeText(text + \" \" + window.location.href);\n" +
      "    }\n" +
      "  };\n\n";
    c = c.replace(/(const shareGame = \(\) => \{)/, challengeBlock + "  $1");
  }

  c = c.replace(/<Button onClick=\{\(\) => \{\}\} variant="outline" className="footer-button">\s*\n\s*<Zap/g, `<Button onClick={challengeFriends} variant="outline" className="footer-button">\n                  <Zap`);

  c = c.replace(
    /<div className="text-sm space-y-1 border-t border-gray-200 pt-3">[\s\S]*?<\/div>\s*<\/div>\s*(?=<div className="flex flex-col gap-3">)/,
    `<div className="text-sm space-y-2 border-t border-gray-200 pt-3 text-left">\n                    <p className="text-gray-600">\n                      Total score counts streak bonuses on consecutive correct catches, plus falling bonuses or penalties you collected during play.\n                    </p>\n                    <div className="flex justify-between">\n                      <span className="text-gray-600">Words cleared</span>\n                      <span className="font-semibold text-green-600">{(gameWon ? totalWords : wordsCompleted)} / {totalWords}</span>\n                    </div>\n                    {hintsUsed > 0 && (\n                      <div className="flex justify-between">\n                        <span className="text-gray-600">Hints used (during play)</span>\n                        <span className="font-semibold text-orange-500">{hintsUsed} × −{hintPenalty} pts</span>\n                      </div>\n                    )}\n                  </div>\n                </div>\n\n                `,
  );

  return c;
}

for (const fp of walkCatchThat(path.join(REPO, "client/src/pages/preschool/games"))) {
  const before = fs.readFileSync(fp, "utf8");
  const after = patch(before, path.relative(REPO, fp));
  if (after !== before) {
    fs.writeFileSync(fp, after);
    console.log("patched", path.relative(REPO, fp));
  }
}
