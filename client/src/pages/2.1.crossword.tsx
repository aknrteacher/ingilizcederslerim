import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, RefreshCw, HelpCircle, Trophy, Maximize2, Minimize2, X, Share2, Zap } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/2.1.crossword.css";

// Vocabulary from 2.1 (School Life)
const vocabulary = [
  { word: "HELLO", clue: "Merhaba", file: "hello.png" },
  { word: "GOODBYE", clue: "Hoşça kalın", file: "goodbye.png" },
  { word: "SCHOOL", clue: "Okul", file: "school.png" },
  { word: "CLASSROOM", clue: "Sınıf", file: "classroom.png" },
  { word: "LIBRARY", clue: "Kütüphane", file: "library.png" },
  { word: "CANTEEN", clue: "Kafeterya", file: "canteen.png" },
  { word: "GARDEN", clue: "Bahçe", file: "garden.png" },
  { word: "TEACHER", clue: "Öğretmen", file: "teacher.png" },
  { word: "STUDENT", clue: "Öğrenci", file: "student.png" },
  { word: "FRIEND", clue: "Arkadaş", file: "friend.png" },
  { word: "DAY", clue: "Gün", file: "day.png" },
  { word: "WEEK", clue: "Hafta", file: "week.png" },
  { word: "MONDAY", clue: "Pazartesi", file: "Monday.png" },
  { word: "FRIDAY", clue: "Cuma", file: "Friday.png" },
  { word: "SUNDAY", clue: "Pazar", file: "Sunday.png" },
  { word: "WHAT", clue: "Ne", file: "what.png" },
  { word: "WHERE", clue: "Nerede", file: "where.png" },
  { word: "WHO", clue: "Kim", file: "who.png" },
  { word: "PENCIL", clue: "Kurşun kalem", file: "pencil.png" }, // Assuming pencil.png exists, otherwise placeholder
  { word: "BOOK", clue: "Kitap", file: "book.png" }, // Assuming book.png exists
  { word: "DESK", clue: "Sıra", file: "desk.png" }, // Assuming desk.png exists
  { word: "DOOR", clue: "Kapı", file: "door.png" }, // Assuming door.png exists
  { word: "WINDOW", clue: "Pencere", file: "window.png" } // Assuming window.png exists
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
  const [solvedWords, setSolvedWords] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setLocation] = useLocation();

  // Background collage images
  const collageImages = placedWords.map(pw => {
      const vocab = vocabulary.find(v => v.word === pw.word);
      return vocab?.file ? `/images/2.1/${vocab.file}` : null;
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
    const text = `I just solved the Word Cross puzzle! Can you beat it? 🧩`;
    if (navigator.share) {
      navigator.share({
        title: "Word Cross",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `I challenge you to solve this Word Cross puzzle! 🏆`;
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
        
        // Check if word is complete and correct
        let isWordComplete = true;
        let isWordCorrect = true;
        
        // We need to traverse the grid for this word
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
      <div className="min-h-screen p-4 font-sans relative overflow-hidden">
        {/* Global Background Collage - Blue Theme for Grade 2 */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-blue-50">
           <div className="grid grid-cols-4 gap-4 p-4 transform -rotate-2 scale-105 h-full w-full opacity-100">
             {/* Create a larger set of images for the background */}
             {[...collageImages, ...collageImages, ...collageImages].map((src, i) => (
               <div key={`bg-${i}`} className="aspect-square bg-white/40 p-2 rounded-xl shadow-lg" style={{ animationDelay: `${i * 0.2}s` }}>
                 <img src={src} alt="" className="w-full h-full object-contain drop-shadow-md" />
               </div>
             ))}
           </div>
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-sky-500/10"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50">
             <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" onClick={() => setLocation("/oyunlar")}>
                 <ArrowLeft className="h-6 w-6 text-slate-700" />
               </Button>
               <div>
                 <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <Trophy className="text-yellow-500 h-5 w-5 drop-shadow-sm" />
                   Word Cross
                 </h1>
                 <p className="text-slate-600 text-xs font-medium">Grade 2 - Theme 1: School Life</p>
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
            
            {/* Fullscreen Background - Blue Theme */}
            {isFullscreen && (
              <div className="absolute inset-0 z-[-1] overflow-hidden bg-blue-50">
                <div className="grid grid-cols-4 gap-4 p-4 transform -rotate-2 scale-105 h-full w-full opacity-100">
                  {[...collageImages, ...collageImages, ...collageImages].map((src, i) => (
                    <div key={`bg-fs-${i}`} className="aspect-square bg-white/40 p-2 rounded-xl shadow-lg" style={{ animationDelay: `${i * 0.2}s` }}>
                      <img src={src} alt="" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-sky-500/10"></div>
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
              {/* Active Clue Banner - Visible everywhere now */}
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

              {/* Main container with light blur */}
              <div className="bg-white/30 backdrop-blur-[2px] p-4 rounded-2xl shadow-xl border border-white/40 flex justify-center items-center relative h-full">
              <div 
                className={`grid gap-[3px] p-2 rounded-xl relative w-full ${isFullscreen ? 'max-w-[95vh]' : 'max-w-[85vh]'} aspect-square mx-auto`}
                style={{ 
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` 
                }}
              >
                {/* Removed inner collage since we have global background now */}

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
                                // Find word belonging to this cell
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
                              p-3 rounded-lg cursor-pointer transition-all border shadow-sm
                              ${selectedWordId === w.id ? "bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200 shadow-md scale-[1.02]" : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200"}
                              ${solvedWords.has(w.id) ? "opacity-60 bg-slate-50" : ""}
                            `}
                            onClick={() => setSelectedWordId(w.id)}
                          >
                            <div className="flex gap-3">
                              <span className={`font-bold w-6 h-6 flex items-center justify-center rounded text-sm ${solvedWords.has(w.id) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-900"}`}>
                                {solvedWords.has(w.id) ? <Check className="h-4 w-4" /> : w.number}
                              </span>
                              <span className={`font-medium ${solvedWords.has(w.id) ? "text-slate-400 line-through" : "text-slate-600"}`}>{w.clue}</span>
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
                              p-3 rounded-lg cursor-pointer transition-all border shadow-sm
                              ${selectedWordId === w.id ? "bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200 shadow-md scale-[1.02]" : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200"}
                              ${solvedWords.has(w.id) ? "opacity-60 bg-slate-50" : ""}
                            `}
                            onClick={() => setSelectedWordId(w.id)}
                          >
                            <div className="flex gap-3">
                              <span className={`font-bold w-6 h-6 flex items-center justify-center rounded text-sm ${solvedWords.has(w.id) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-900"}`}>
                                {solvedWords.has(w.id) ? <Check className="h-4 w-4" /> : w.number}
                              </span>
                              <span className={`font-medium ${solvedWords.has(w.id) ? "text-slate-400 line-through" : "text-slate-600"}`}>{w.clue}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div id="crossword-footer-area" className="lg:col-span-12 mt-2 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 relative z-30">
               <div className="flex flex-wrap justify-center gap-3">
                 <Button onClick={shareGame} variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                   <Share2 className="h-4 w-4" /> Share
                 </Button>
                 <Button onClick={challengeFriend} variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                   <Zap className="h-4 w-4" /> Challenge
                 </Button>
                 <Button onClick={generateGrid} variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700">
                   <RefreshCw className="h-4 w-4" /> New Game
                 </Button>
               </div>
               <Button variant="ghost" className="text-slate-500 hover:text-slate-800 gap-2" onClick={() => setLocation("/oyunlar")}>
                 <ArrowLeft className="h-4 w-4" /> Back
               </Button>
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