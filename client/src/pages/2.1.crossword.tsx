import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, RefreshCw, HelpCircle, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

// Vocabulary from 2.1 (School Life)
const vocabulary = [
  { word: "HELLO", clue: "Merhaba" },
  { word: "GOODBYE", clue: "Hoşça kalın" },
  { word: "SCHOOL", clue: "Okul" },
  { word: "CLASSROOM", clue: "Sınıf" },
  { word: "LIBRARY", clue: "Kütüphane" },
  { word: "CANTEEN", clue: "Kafeterya" },
  { word: "GARDEN", clue: "Bahçe" },
  { word: "TEACHER", clue: "Öğretmen" },
  { word: "STUDENT", clue: "Öğrenci" },
  { word: "FRIEND", clue: "Arkadaş" },
  { word: "DAY", clue: "Gün" },
  { word: "WEEK", clue: "Hafta" },
  { word: "MONDAY", clue: "Pazartesi" },
  { word: "FRIDAY", clue: "Cuma" },
  { word: "SUNDAY", clue: "Pazar" },
  { word: "WHAT", clue: "Ne" },
  { word: "WHERE", clue: "Nerede" },
  { word: "WHO", clue: "Kim" },
  { word: "PENCIL", clue: "Kurşun kalem" },
  { word: "BOOK", clue: "Kitap" },
  { word: "DESK", clue: "Sıra" },
  { word: "DOOR", clue: "Kapı" },
  { word: "WINDOW", clue: "Pencere" }
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

export default function CrosswordGame() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Generate crossword
  const generateGrid = () => {
    // Reset
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, r) => 
      Array(GRID_SIZE).fill(null).map((_, c) => ({
        row: r, col: c, char: "", userChar: "", isBlack: true, partOfWords: []
      }))
    );
    
    // Shuffle and pick 15 words
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 15);
    
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
                 // Prioritize balanced placements if possible, but greedy is fine
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
    
    // Check completion
    const allCorrect = placedWords.every(pw => {
      // Logic to check every cell of every word
      // Simplified: Check if all non-black cells match
      return true; // We check below
    });
    
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
      <div className="min-h-screen bg-[#f0f4f8] p-4 font-sans">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" onClick={() => setLocation("/oyunlar")}>
                 <ArrowLeft className="h-6 w-6 text-slate-600" />
               </Button>
               <div>
                 <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                   <Trophy className="text-yellow-500 h-6 w-6" />
                   Word Cross
                 </h1>
                 <p className="text-slate-500 text-sm">2. Sınıf - Tema 1: Okul Hayatı</p>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               <Button onClick={generateGrid} variant="outline" className="gap-2">
                 <RefreshCw className="h-4 w-4" />
                 New Game
               </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Crossword Grid */}
            <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex justify-center overflow-auto">
              <div 
                className="grid gap-[2px] bg-slate-800 p-[2px] rounded-lg shadow-inner"
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(30px, 40px))` 
                }}
              >
                {grid.map((row, rIdx) => (
                  row.map((cell, cIdx) => (
                    <div 
                      key={`${rIdx}-${cIdx}`} 
                      className={`
                        relative aspect-square flex items-center justify-center
                        ${cell.isBlack ? "bg-slate-800" : "bg-white"}
                        ${!cell.isBlack && selectedWordId && cell.partOfWords.includes(selectedWordId) ? "bg-yellow-100" : ""}
                      `}
                    >
                      {!cell.isBlack && (
                        <>
                          {(cell.acrossNum || cell.downNum) && (
                            <span className="absolute top-[2px] left-[2px] text-[10px] font-bold text-slate-400 leading-none pointer-events-none">
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
                                // Find word belonging to this cell
                                if (cell.partOfWords.length > 0) setSelectedWordId(cell.partOfWords[0]);
                            }}
                            className={`
                                w-full h-full text-center text-lg font-bold uppercase bg-transparent border-none outline-none focus:bg-blue-50
                                ${cell.userChar === cell.char && isComplete ? "text-green-600" : "text-slate-800"}
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

            {/* Clues */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  Clues
                </h3>
                
                <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b pb-1">Across</h4>
                    <ul className="space-y-3">
                      {placedWords.filter(w => w.direction === "across").map(w => (
                        <li 
                           key={w.id} 
                           className={`
                             p-3 rounded-lg cursor-pointer transition-colors border
                             ${selectedWordId === w.id ? "bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200" : "hover:bg-slate-50 border-transparent"}
                           `}
                           onClick={() => setSelectedWordId(w.id)}
                        >
                          <div className="flex gap-3">
                            <span className="font-bold text-slate-900 bg-slate-100 w-6 h-6 flex items-center justify-center rounded text-sm">{w.number}</span>
                            <span className="text-slate-600 font-medium">{w.clue}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b pb-1">Down</h4>
                    <ul className="space-y-3">
                      {placedWords.filter(w => w.direction === "down").map(w => (
                        <li 
                           key={w.id} 
                           className={`
                             p-3 rounded-lg cursor-pointer transition-colors border
                             ${selectedWordId === w.id ? "bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200" : "hover:bg-slate-50 border-transparent"}
                           `}
                           onClick={() => setSelectedWordId(w.id)}
                        >
                          <div className="flex gap-3">
                            <span className="font-bold text-slate-900 bg-slate-100 w-6 h-6 flex items-center justify-center rounded text-sm">{w.number}</span>
                            <span className="text-slate-600 font-medium">{w.clue}</span>
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
        
        {/* Completion Modal */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Great Job! 🎉</h2>
                <p className="text-slate-600 mb-8">You solved the crossword puzzle!</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setLocation("/oyunlar")} variant="outline">
                    Back to Menu
                  </Button>
                  <Button onClick={generateGrid} className="bg-green-600 hover:bg-green-700">
                    Play Again
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}