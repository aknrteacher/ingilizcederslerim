import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, RefreshCw, HelpCircle, Trophy, Maximize2, Minimize2, X, Share2, Zap } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/0.1.crossword.css";

// Vocabulary from 0.1 (Colours)
const vocabulary = [
  { word: "RED", clue: "Kırmızı", file: "red.png" },
  { word: "BLUE", clue: "Mavi", file: "blue.png" },
  { word: "YELLOW", clue: "Sarı", file: "yellow.png" },
  { word: "GREEN", clue: "Yeşil", file: "green.png" },
  { word: "ORANGE", clue: "Turuncu", file: "orange.png" },
  { word: "PURPLE", clue: "Mor", file: "purple.png" },
  { word: "PINK", clue: "Pembe", file: "pink.png" },
  { word: "BROWN", clue: "Kahverengi", file: "brown.png" },
  { word: "GRAY", clue: "Gri", file: "gray.png" },
  { word: "WHITE", clue: "Beyaz", file: "white.png" },
  { word: "BLACK", clue: "Siyah", file: "black.png" },
];

interface Cell {
  row: number;
  col: number;
  char: string;
  userChar: string;
  isBlack: boolean;
  acrossNum?: number;
  downNum?: number;
  partOfWords: string[]; // IDs of words this cell belongs to
}

interface PlacedWord {
  id: string;
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
  number: number;
}

const GRID_SIZE = 16;

export default function ColorsCrosswordGame() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [solvedWords, setSolvedWords] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setLocation] = useLocation();

  // Background collage images
  const collageImages = placedWords.map(pw => {
      const vocab = vocabulary.find(v => v.word === pw.word);
      return vocab?.file ? `/images/0.1/${vocab.file}` : null;
  }).filter(Boolean) as string[];

  const speakWord = (word: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.9;
    window.speechSynthesis?.speak(utterance);
  };

  const toggleFullscreen = () => {
    const element = document.getElementById("crossword-game");
    if (!element) return;

    if (!isFullscreen) {
      element.classList.add("fullscreen-active");
      setIsFullscreen(true);
    } else {
      element.classList.remove("fullscreen-active");
      setIsFullscreen(false);
    }
  };

  const shareGame = () => {
    const text = `I just solved the Colours Word Cross! Can you beat it? 🎨`;
    if (navigator.share) {
      navigator.share({
        title: "Word Cross - Colours",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `I challenge you to solve this Colours Word Cross puzzle! 🏆`;
    if (navigator.share) {
      navigator.share({
        title: "Word Cross Challenge",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  // Generate crossword
  const generateGrid = () => {
    // Reset
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, r) => 
      Array(GRID_SIZE).fill(null).map((_, c) => ({
        row: r, col: c, char: "", userChar: "", isBlack: true, partOfWords: []
      }))
    );
    
    // Shuffle and pick words (max 11 for colours)
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    
    const placed: PlacedWord[] = [];
    let wordNum = 1;

    // Place first word in middle
    const firstWord = shuffled[0];
    const startRow = Math.floor(GRID_SIZE / 2);
    const startCol = Math.floor((GRID_SIZE - firstWord.word.length) / 2);
    
    // Place first word (Across)
    for (let i = 0; i < firstWord.word.length; i++) {
      newGrid[startRow][startCol + i].char = firstWord.word[i];
      newGrid[startRow][startCol + i].isBlack = false;
      newGrid[startRow][startCol + i].partOfWords.push(firstWord.word);
    }
    
    placed.push({
      id: firstWord.word,
      word: firstWord.word,
      clue: firstWord.clue,
      row: startRow,
      col: startCol,
      direction: "across",
      number: wordNum++
    });
    newGrid[startRow][startCol].acrossNum = placed[0].number;

    // Try to place others
    for (let i = 1; i < shuffled.length; i++) {
      const currentWord = shuffled[i];
      let bestPlacement = null;

      // Try all cells in current word
      for (let charIdx = 0; charIdx < currentWord.word.length; charIdx++) {
        const char = currentWord.word[charIdx];
        
        // Find matches on grid
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newGrid[r][c].char === char) {
              // Potential intersection
              // Check Across
              if (canPlace(newGrid, currentWord.word, r, c - charIdx, "across")) {
                 bestPlacement = { r, c: c - charIdx, dir: "across" };
                 break;
              }
              // Check Down
              if (canPlace(newGrid, currentWord.word, r - charIdx, c, "down")) {
                 bestPlacement = { r: r - charIdx, c, dir: "down" };
                 break;
              }
            }
          }
          if (bestPlacement) break;
        }
        if (bestPlacement) break;
      }

      if (bestPlacement) {
        // Place it
        const { r, c, dir } = bestPlacement;
        const isAcross = dir === "across";
        
        // Add number if needed
        let num = 0;
        if (isAcross) {
          if (!newGrid[r][c].acrossNum && !newGrid[r][c].downNum) num = wordNum++;
          else num = newGrid[r][c].acrossNum || newGrid[r][c].downNum || wordNum++;
          if (!newGrid[r][c].acrossNum) newGrid[r][c].acrossNum = num;
        } else {
           if (!newGrid[r][c].acrossNum && !newGrid[r][c].downNum) num = wordNum++;
           else num = newGrid[r][c].acrossNum || newGrid[r][c].downNum || wordNum++;
           if (!newGrid[r][c].downNum) newGrid[r][c].downNum = num;
        }

        placed.push({
          id: currentWord.word,
          word: currentWord.word,
          clue: currentWord.clue,
          row: r,
          col: c,
          direction: dir as "across" | "down",
          number: num
        });

        for (let k = 0; k < currentWord.word.length; k++) {
          const rr = isAcross ? r : r + k;
          const cc = isAcross ? c + k : c;
          newGrid[rr][cc].char = currentWord.word[k];
          newGrid[rr][cc].isBlack = false;
          newGrid[rr][cc].partOfWords.push(currentWord.word);
        }
      }
    }

    setGrid(newGrid);
    setPlacedWords(placed.sort((a, b) => a.number - b.number));
    setStartTime(Date.now());
    setIsComplete(false);
    setSolvedWords(new Set());
  };

  // Check if word can be placed
  const canPlace = (g: Cell[][], word: string, r: number, c: number, dir: "across" | "down") => {
    if (r < 0 || c < 0) return false;
    if (dir === "across") {
      if (c + word.length > GRID_SIZE) return false;
      // Check boundaries (before/after)
      if (c > 0 && !g[r][c-1].isBlack) return false;
      if (c + word.length < GRID_SIZE && !g[r][c+word.length].isBlack) return false;

      for (let i = 0; i < word.length; i++) {
        const cell = g[r][c+i];
        if (!cell.isBlack && cell.char !== word[i]) return false; // Conflict
        // Check neighbors (above/below) unless it's an intersection
        if (cell.isBlack) {
          if (r > 0 && !g[r-1][c+i].isBlack) return false;
          if (r < GRID_SIZE-1 && !g[r+1][c+i].isBlack) return false;
        }
      }
    } else {
      if (r + word.length > GRID_SIZE) return false;
      // Check boundaries
      if (r > 0 && !g[r-1][c].isBlack) return false;
      if (r + word.length < GRID_SIZE && !g[r+word.length][c].isBlack) return false;

      for (let i = 0; i < word.length; i++) {
        const cell = g[r+i][c];
        if (!cell.isBlack && cell.char !== word[i]) return false;
        // Check neighbors (left/right)
        if (cell.isBlack) {
           if (c > 0 && !g[r+i][c-1].isBlack) return false;
           if (c < GRID_SIZE-1 && !g[r+i][c+1].isBlack) return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    generateGrid();
  }, []);

  const handleCellChange = (r: number, c: number, val: string) => {
    if (isComplete) return;
    const char = val.slice(-1).toUpperCase();
    const newGrid = [...grid];
    newGrid[r][c].userChar = char;
    setGrid(newGrid);
    
    // Check for newly solved words
    const newlySolved: string[] = [];
    placedWords.forEach(pw => {
        if (solvedWords.has(pw.id)) return;
        
        let isWordComplete = true;
        let isWordCorrect = true;
        
        for (let k = 0; k < pw.word.length; k++) {
             const rr = pw.direction === "across" ? pw.row : pw.row + k;
             const cc = pw.direction === "across" ? pw.col + k : pw.col;
             const cell = newGrid[rr][cc];
             
             if (!cell.userChar) {
                 isWordComplete = false;
                 break;
             }
             if (cell.userChar !== cell.char) {
                 isWordCorrect = false;
             }
        }
        
        if (isWordComplete && isWordCorrect) {
            newlySolved.push(pw.id);
        }
    });

    if (newlySolved.length > 0) {
        const newSolved = new Set(solvedWords);
        newlySolved.forEach(id => newSolved.add(id));
        setSolvedWords(newSolved);
        
        // Play sound
        const audio = new Audio("/sounds/bell.mp3");
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed", e));

        // Speak the word
        const wordText = vocabulary.find(v => v.word === newlySolved[0])?.word;
        if (wordText) speakWord(wordText);
    }
    
    let correctCount = 0;
    let totalCount = 0;
    let isAllCorrect = true;
    
    for(let i=0; i<GRID_SIZE; i++) {
      for(let j=0; j<GRID_SIZE; j++) {
        if (!grid[i][j].isBlack) {
           totalCount++;
           if (newGrid[i][j].userChar === grid[i][j].char) correctCount++;
           else isAllCorrect = false;
        }
      }
    }
    
    if (isAllCorrect && totalCount > 0) {
      setIsComplete(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF69B4", "#00BFFF"]
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
      // Simple navigation arrows
      if (e.key === "ArrowRight" && c < GRID_SIZE - 1 && !grid[r][c+1].isBlack) {
          document.getElementById(`cell-${r}-${c+1}`)?.focus();
      }
      if (e.key === "ArrowLeft" && c > 0 && !grid[r][c-1].isBlack) {
          document.getElementById(`cell-${r}-${c-1}`)?.focus();
      }
      if (e.key === "ArrowDown" && r < GRID_SIZE - 1 && !grid[r+1][c].isBlack) {
          document.getElementById(`cell-${r+1}-${c}`)?.focus();
      }
      if (e.key === "ArrowUp" && r > 0 && !grid[r-1][c].isBlack) {
          document.getElementById(`cell-${r-1}-${c}`)?.focus();
      }
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 font-sans relative overflow-hidden">
        {/* Global Background Collage */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-100">
           <div className="grid grid-cols-4 gap-4 p-4 transform -rotate-2 scale-105 h-full w-full opacity-100">
             {[...collageImages, ...collageImages, ...collageImages].map((src, i) => (
               <div key={`bg-${i}`} className="aspect-square bg-white/40 p-2 rounded-xl shadow-lg" style={{ animationDelay: `${i * 0.2}s` }}>
                 <img src={src} alt="" className="w-full h-full object-contain drop-shadow-md" />
               </div>
             ))}
           </div>
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50">
             <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" onClick={() => setLocation("/pre-school/games")}>
                 <ArrowLeft className="h-6 w-6 text-slate-700" />
               </Button>
               <div>
                 <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <Trophy className="text-yellow-500 h-5 w-5 drop-shadow-sm" />
                   Word Cross
                 </h1>
                 <p className="text-slate-600 text-xs font-medium">Pre-School & 1st Grade - Theme: Colours</p>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               <div className="hidden md:block">
                 <Button
                    onClick={toggleFullscreen}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white/50 hover:bg-white"
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative" id="crossword-game">
            
            {/* Fullscreen Background */}
            {isFullscreen && (
              <div className="absolute inset-0 z-[-1] overflow-hidden bg-slate-100">
                <div className="grid grid-cols-4 gap-4 p-4 transform -rotate-2 scale-105 h-full w-full opacity-100">
                  {[...collageImages, ...collageImages, ...collageImages].map((src, i) => (
                    <div key={`bg-fs-${i}`} className="aspect-square bg-white/40 p-2 rounded-xl shadow-lg" style={{ animationDelay: `${i * 0.2}s` }}>
                      <img src={src} alt="" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              </div>
            )}
            
            {/* Fullscreen Close Button */}
            {isFullscreen && (
               <Button 
                 onClick={toggleFullscreen} 
                 className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full h-10 w-10 p-0 shadow-lg border-2 border-white"
                 title="Exit Fullscreen"
               >
                 <X className="h-6 w-6" />
               </Button>
            )}

            {/* Crossword Grid */}
            <div id="crossword-grid-area" className="lg:col-span-8 flex flex-col gap-2">
              {/* Active Clue Banner */}
              <AnimatePresence>
                {selectedWordId && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-yellow-100/95 backdrop-blur-md border-l-4 border-yellow-500 p-3 rounded-r-xl shadow-lg z-30 mb-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-yellow-700 tracking-wider">
                          {placedWords.find(w => w.id === selectedWordId)?.direction}
                        </span>
                        <p className="text-lg font-bold text-slate-800">
                          {placedWords.find(w => w.id === selectedWordId)?.number}. {placedWords.find(w => w.id === selectedWordId)?.clue}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white/30 backdrop-blur-[2px] p-4 rounded-2xl shadow-xl border border-white/40 flex justify-center items-center relative h-full">
              <div 
                className={`grid gap-[3px] p-2 rounded-xl relative w-full ${isFullscreen ? 'max-w-[95vh]' : 'max-w-[85vh]'} aspect-square mx-auto`}
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` 
                }}
              >
                {grid.map((row, rIdx) => (
                  row.map((cell, cIdx) => (
                    <div 
                      key={`${rIdx}-${cIdx}`} 
                      className={`
                        relative w-full h-full flex items-center justify-center z-10 rounded-sm transition-all duration-200
                        ${cell.isBlack ? "bg-transparent" : "bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)] border border-slate-300"}
                        ${!cell.isBlack && selectedWordId && cell.partOfWords.includes(selectedWordId) ? "bg-yellow-100 ring-2 ring-yellow-400/50 border-yellow-400 z-20 scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)]" : ""}
                        ${!cell.isBlack && !cell.partOfWords.includes(selectedWordId || "") ? "hover:bg-white hover:scale-105 hover:shadow-[0_4px_8px_rgba(0,0,0,0.4)] hover:z-20 cursor-pointer hover:ring-1 hover:ring-blue-300" : ""}
                      `}
                      onClick={() => {
                        if (!cell.isBlack && cell.partOfWords.length > 0) {
                           setSelectedWordId(cell.partOfWords[0]);
                           document.getElementById(`cell-${rIdx}-${cIdx}`)?.focus();
                        }
                      }}
                    >
                      {!cell.isBlack && (
                        <>
                          {(cell.acrossNum || cell.downNum) && (
                            <span className="absolute top-[1px] left-[1px] text-[8px] sm:text-[10px] font-extrabold text-slate-500 leading-none pointer-events-none z-10 drop-shadow-sm">
                              {cell.acrossNum || cell.downNum}
                            </span>
                          )}
                          <input
                            id={`cell-${rIdx}-${cIdx}`}
                            type="text"
                            maxLength={1}
                            value={cell.userChar}
                            onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                            onFocus={() => {
                                if (cell.partOfWords.length > 0) setSelectedWordId(cell.partOfWords[0]);
                            }}
                            className={`
                                w-full h-full text-center text-sm sm:text-lg md:text-xl font-bold uppercase bg-transparent border-none outline-none focus:bg-blue-50/50 relative z-0 drop-shadow-sm p-0
                                ${
                                  cell.userChar === "" 
                                      ? "text-slate-800" 
                                      : cell.userChar === cell.char 
                                          ? "text-green-600 drop-shadow-[0_1px_0_rgba(255,255,255,1)]" 
                                          : "text-red-500"
                                }
                            `}
                            autoComplete="off"
                          />
                        </>
                      )}
                    </div>
                  ))
                ))}
              </div>
            </div>
            </div>

            {/* Clues */}
            <div id="crossword-clues-area" className="lg:col-span-4 space-y-4 h-full overflow-hidden">
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg border border-white/50 h-full flex flex-col">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2" title="İpuçları">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <span className="cursor-help border-b border-dotted border-slate-400">Clues</span>
                </h3>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div>
                      <h4 
                        className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b pb-1 sticky top-0 bg-transparent z-10 cursor-help" 
                        title="Soldan Sağa (Yatay)"
                      >
                        Across
                      </h4>
                      <ul className="space-y-3">
                        {placedWords.filter(w => w.direction === "across").map(w => (
                          <li 
                            key={w.id} 
                            className={`
                                p-3 rounded-lg cursor-pointer transition-all border-l-4 group
                                ${solvedWords.has(w.id) 
                                    ? "bg-green-50/80 border-green-500/50 opacity-60 hover:opacity-100" 
                                    : selectedWordId === w.id 
                                        ? "bg-yellow-50 border-yellow-500 shadow-md transform scale-102" 
                                        : "bg-slate-50 border-transparent hover:bg-white hover:shadow-sm hover:border-blue-300"}
                            `}
                            onClick={() => setSelectedWordId(w.id)}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`font-bold text-sm min-w-[1.2rem] ${solvedWords.has(w.id) ? "text-green-600" : "text-slate-500"}`}>
                                {w.number}.
                              </span>
                              <div className="flex-1">
                                <span className={`text-sm font-medium ${solvedWords.has(w.id) ? "text-green-700 line-through decoration-green-400/50" : "text-slate-700"}`}>
                                  {w.clue}
                                </span>
                              </div>
                              {solvedWords.has(w.id) && <Check className="h-4 w-4 text-green-500" />}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 
                        className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b pb-1 sticky top-0 bg-transparent z-10 cursor-help"
                        title="Yukarıdan Aşağıya (Dikey)"
                      >
                        Down
                      </h4>
                      <ul className="space-y-3">
                        {placedWords.filter(w => w.direction === "down").map(w => (
                          <li 
                            key={w.id} 
                            className={`
                                p-3 rounded-lg cursor-pointer transition-all border-l-4 group
                                ${solvedWords.has(w.id) 
                                    ? "bg-green-50/80 border-green-500/50 opacity-60 hover:opacity-100" 
                                    : selectedWordId === w.id 
                                        ? "bg-yellow-50 border-yellow-500 shadow-md transform scale-102" 
                                        : "bg-slate-50 border-transparent hover:bg-white hover:shadow-sm hover:border-blue-300"}
                            `}
                            onClick={() => setSelectedWordId(w.id)}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`font-bold text-sm min-w-[1.2rem] ${solvedWords.has(w.id) ? "text-green-600" : "text-slate-500"}`}>
                                {w.number}.
                              </span>
                              <div className="flex-1">
                                <span className={`text-sm font-medium ${solvedWords.has(w.id) ? "text-green-700 line-through decoration-green-400/50" : "text-slate-700"}`}>
                                  {w.clue}
                                </span>
                              </div>
                              {solvedWords.has(w.id) && <Check className="h-4 w-4 text-green-500" />}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="mt-6 flex flex-wrap justify-between items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-lg">
             <div className="flex gap-2">
               <Button onClick={shareGame} variant="outline" className="gap-2 bg-white hover:bg-blue-50 border-slate-200">
                  <Share2 className="h-4 w-4 text-blue-500" /> Share
               </Button>
               <Button onClick={challengeFriend} variant="outline" className="gap-2 bg-white hover:bg-purple-50 border-slate-200">
                  <Zap className="h-4 w-4 text-purple-500" /> Challenge
               </Button>
             </div>
             
             <div className="flex gap-2">
               <Button onClick={generateGrid} variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200">
                  <RefreshCw className="h-4 w-4 text-slate-500" /> New Game
               </Button>
               <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-800" onClick={() => setLocation("/pre-school/games")}>
                  Back
               </Button>
             </div>
          </div>

          {/* Completion Modal */}
          <AnimatePresence>
            {isComplete && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
                  
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-yellow-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
                    <Trophy className="h-24 w-24 text-yellow-500 mx-auto relative drop-shadow-md" />
                  </div>
                  
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Great Job!</h2>
                  <p className="text-slate-600 mb-8 text-lg">You solved the whole puzzle!</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Words</p>
                       <p className="text-2xl font-black text-blue-600">{vocabulary.length}</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Rating</p>
                       <p className="text-2xl font-black text-yellow-500">⭐⭐⭐</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button onClick={generateGrid} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200">
                      Play Again
                    </Button>
                    <Button onClick={() => setLocation("/pre-school/games")} variant="ghost" size="lg" className="w-full text-slate-600 hover:bg-slate-50 rounded-xl">
                      Back to Games
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
