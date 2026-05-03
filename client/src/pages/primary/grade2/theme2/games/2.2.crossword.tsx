import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, RefreshCw, HelpCircle, Trophy, Maximize2, Minimize2, X, Share2, Zap, Star } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import "@/styles/2.1.crossword.css";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";
import { speakCrosswordAnswer } from "@/lib/crosswordSpeak";

// Vocabulary from 2.2 (Classroom Life) - convert multi-word to single word for crossword
const vocabulary = [
  { word: "COLOUR", clue: "Renk", file: "colour.png" },
  { word: "YELLOW", clue: "Sarı", file: "yellow.png" },
  { word: "BLUE", clue: "Mavi", file: "blue.png" },
  { word: "RED", clue: "Kırmızı", file: "red.png" },
  { word: "GREEN", clue: "Yeşil", file: "green.png" },
  { word: "PURPLE", clue: "Mor", file: "purple.png" },
  { word: "PINK", clue: "Pembe", file: "pink.png" },
  { word: "BROWN", clue: "Kahverengi", file: "brown.png" },
  { word: "ORANGE", clue: "Turuncu", file: "orange.png" },
  { word: "BLACK", clue: "Siyah", file: "black.png" },
  { word: "WHITE", clue: "Beyaz", file: "white.png" },
  { word: "WATCH", clue: "İzle", file: "watch.png" },
  { word: "LISTEN", clue: "Dinle", file: "listen.png" },
  { word: "WRITE", clue: "Yaz", file: "write.png" },
  { word: "RAISE", clue: "Kaldır", file: "raise.png" },
  { word: "HAND", clue: "El", file: "hand.png" },
  { word: "OPEN", clue: "Aç", file: "open.png" },
  { word: "CLOSE", clue: "Kapat", file: "close.png" },
  { word: "REPEAT", clue: "Tekrarla", file: "repeat.png" },
  { word: "STANDUP", clue: "Ayağa kalk", file: "stand_up.png" },
  { word: "SITDOWN", clue: "Otur", file: "sit_down.png" },
  { word: "HURRYUP", clue: "Acele et", file: "hurry_up.png" },
  { word: "BEQUIET", clue: "Sessiz ol", file: "be_quiet.png" },
  { word: "LOOK", clue: "Bak", file: "look.png" },
  { word: "COME", clue: "Gel", file: "come.png" },
  { word: "GO", clue: "Git", file: "go.png" },
  { word: "POINT", clue: "Göster", file: "point.png" },
  { word: "MATCH", clue: "Eşleştir", file: "match.png" },
  { word: "TABLE", clue: "Masa", file: "table.png" },
  { word: "PENCIL", clue: "Kalem", file: "pencil.png" },
  { word: "PENCILCASE", clue: "Kalem kutusu", file: "pencil_case.png" },
  { word: "BOOK", clue: "Kitap", file: "book.png" },
  { word: "BOOKSHELF", clue: "Kitaplık", file: "bookshelf.png" },
  { word: "BAG", clue: "Çanta", file: "bag.png" },
  { word: "NOTEBOOK", clue: "Defter", file: "notebook.png" },
  { word: "ERASER", clue: "Silgi", file: "eraser.png" },
  { word: "SHARPENER", clue: "Açacak", file: "sharpener.png" },
  { word: "CRAYON", clue: "Pastel boya", file: "crayon.png" },
  { word: "BOARD", clue: "Tahta", file: "board.png" },
  { word: "WINDOW", clue: "Pencere", file: "window.png" },
  { word: "DESK", clue: "Sıra", file: "desk.png" },
  { word: "DOOR", clue: "Kapı", file: "door.png" },
  { word: "CHAIR", clue: "Sandalye", file: "chair.png" },
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

export default function CrosswordGame2_2() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [solvedWords, setSolvedWords] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setLocation] = useLocation();
  
  // Drag state for crossword grid
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Handle drag for crossword grid
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking on the container background or holding a modifier key
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.closest('input');
    const isCell = target.closest('[id^="cell-"]');
    
    // Allow dragging if:
    // 1. Clicking on container background (not on cells/inputs)
    // 2. Holding spacebar or middle mouse button
    if (!isInput && !isCell) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
      e.preventDefault();
    } else if (e.button === 1 || e.ctrlKey || e.metaKey) {
      // Middle mouse button or Ctrl/Cmd for drag
      setIsDragging(true);
      setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
      e.preventDefault();
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      setDragOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };
  
  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.closest('input');
      
      // Only start drag if not on input
      if (!isInput) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - dragOffset.x, y: touch.clientY - dragOffset.y });
      }
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };
  
  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };
  
  // Reset drag position
  const resetDragPosition = () => {
    setDragOffset({ x: 0, y: 0 });
  };
  
  // Global mouse move handler for dragging outside container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDragOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.classList.add('dragging-crossword');
    }
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.classList.remove('dragging-crossword');
    };
  }, [isDragging, dragStart]);

  // Background collage images
  const collageImages = placedWords.map(pw => {
      const vocab = vocabulary.find(v => v.word === pw.word);
              return vocab?.file ? `/images/primary/2.2/${vocab.file}` : null;
  }).filter(Boolean) as string[];

  const shareGame = () => {
    const text = `I just solved the Classroom Life Word Cross! Can you beat it? 🧩`;
    if (navigator.share) {
      navigator.share({
        title: "Word Cross - Classroom Life",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `I challenge you to solve this Classroom Life Word Cross puzzle! 🏆`;
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
    
    // Shuffle and pick words
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

        // Speak the word (use natural phrase from image filename when multi-word)
        const solvedEntry = vocabulary.find(v => v.word === newlySolved[0]);
        if (solvedEntry) speakCrosswordAnswer(solvedEntry.word, solvedEntry.file);
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
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#10b981"]
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
      <div className="crossword-game-wrapper primary-school-game" id="crossword-game-wrapper">
        <div className="crossword-game-container">
          <>
            {/* Background Collage - Scattered Picture Cards */}
            <div className="crossword-background-collage">
              {[...collageImages, ...collageImages, ...collageImages].slice(0, 24).map((src, i) => {
                // Create random positions and rotations for scattered effect
                const rotation = (i % 7 - 3) * 8 + Math.random() * 10 - 5; // -25 to 25 degrees
                const xPos = (i % 6) * 16 + Math.random() * 8; // Spread across width
                const yPos = Math.floor(i / 6) * 18 + Math.random() * 8; // Spread across height
                const scale = 0.7 + (i % 3) * 0.15; // Vary sizes slightly
                
                return (
                  <div 
                    key={`bg-${i}`} 
                    className="collage-card"
                    style={{ 
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                      transform: `rotate(${rotation}deg) scale(${scale})`,
                      animationDelay: `${i * 0.15}s`,
                      zIndex: Math.floor(i / 8)
                    }}
                  >
                    <div className="collage-card-inner">
                      <img src={src} alt="" />
                    </div>
                  </div>
                );
              })}
              <div className="collage-overlay"></div>
            </div>

            <PrimarySchoolGameHeader 
              gameName="Word Cross"
              description="2nd Grade - Theme 2: Classroom Life"
              containerId="crossword-game-wrapper"
              icon="🧩"
            />
            
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap mb-4 relative z-10">
              <div className="bg-blue-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-blue-700 text-sm sm:text-base">{score}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-green-100 px-2 sm:px-3 py-1 rounded-lg">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span className="font-bold text-green-700 text-sm sm:text-base">{solvedWords.size} / {placedWords.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4 relative flex-1 min-h-0 overflow-hidden" id="crossword-game">
              {/* Crossword Grid - Left Larger Area */}
              <div id="crossword-grid-area" className="flex flex-col gap-3 relative z-10 min-h-0">
                {/* Active Clue Banner */}
                <AnimatePresence>
                  {selectedWordId && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-blue-100/95 backdrop-blur-md border-l-4 border-blue-500 p-3 rounded-r-xl shadow-lg z-30 flex-shrink-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">
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

                {/* Crossword Grid */}
                <div 
                  ref={gridContainerRef}
                  className="bg-white/60 backdrop-blur-md p-2 sm:p-4 rounded-2xl shadow-xl border-2 border-blue-300 flex justify-center items-center relative flex-1 min-h-0 overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onDoubleClick={resetDragPosition}
                  title="Drag to pan the crossword puzzle. Double-click to reset position."
                >
                  <div 
                    className={`grid gap-[3px] p-1 sm:p-2 rounded-xl relative w-full crossword-grid-container ${isFullscreen ? 'max-w-[min(50vh,50vw)] max-h-[min(50vh,50vw)]' : 'max-w-[min(45vh,60vw)] max-h-[min(45vh,60vw)]'} aspect-square mx-auto flex-shrink-0 select-none`}
                    style={{ 
                      gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                  >
                    {grid.map((row, rIdx) => (
                      row.map((cell, cIdx) => (
                        <div 
                          key={`${rIdx}-${cIdx}`} 
                          className={`
                            relative w-full h-full flex items-center justify-center z-10 rounded-sm transition-all duration-200
                            ${cell.isBlack ? "bg-transparent" : "bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)] border border-slate-300"}
                            ${!cell.isBlack && selectedWordId && cell.partOfWords.includes(selectedWordId) ? "bg-blue-100 ring-2 ring-blue-400/50 border-blue-400 z-20 scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.5)]" : ""}
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

              {/* Clues - Right Smaller Area */}
              <div id="crossword-clues-area" className="min-h-0 overflow-hidden flex flex-col relative z-10">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border-2 border-blue-300 flex-1 min-h-0 flex flex-col">
                  <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2 flex-shrink-0" title="İpuçları">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    <span className="cursor-help border-b border-dotted border-slate-400">Clues</span>
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                    <div className="space-y-4">
                      <div>
                        <h4 
                          className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2 border-b pb-1 sticky top-0 bg-white z-10 cursor-help" 
                          title="Soldan Sağa (Yatay)"
                        >
                          Across
                        </h4>
                        <ul className="space-y-2">
                          {placedWords.filter(w => w.direction === "across" && !solvedWords.has(w.id)).map(w => (
                            <li 
                              key={w.id} 
                              className={`
                                  p-2.5 rounded-lg cursor-pointer transition-all border-l-4 group
                                  ${selectedWordId === w.id 
                                      ? "bg-blue-50 border-blue-500 shadow-md" 
                                      : "bg-slate-50 border-transparent hover:bg-white hover:shadow-sm hover:border-blue-300"}
                              `}
                              onClick={() => setSelectedWordId(w.id)}
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-sm min-w-[1.25rem] text-slate-500">
                                  {w.number}.
                                </span>
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-slate-700">
                                    {w.clue}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 
                          className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2 border-b pb-1 sticky top-0 bg-white z-10 cursor-help"
                          title="Yukarıdan Aşağıya (Dikey)"
                        >
                          Down
                        </h4>
                        <ul className="space-y-2">
                          {placedWords.filter(w => w.direction === "down" && !solvedWords.has(w.id)).map(w => (
                            <li 
                              key={w.id} 
                              className={`
                                  p-2.5 rounded-lg cursor-pointer transition-all border-l-4 group
                                  ${selectedWordId === w.id 
                                      ? "bg-blue-50 border-blue-500 shadow-md" 
                                      : "bg-slate-50 border-transparent hover:bg-white hover:shadow-sm hover:border-blue-300"}
                              `}
                              onClick={() => setSelectedWordId(w.id)}
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-sm min-w-[1.25rem] text-slate-500">
                                  {w.number}.
                                </span>
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-slate-700">
                                    {w.clue}
                                  </span>
                                </div>
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
            <div className="primary-school-game-footer relative z-10">
              <div className="footer-content">
                <div className="footer-left">
                  <Button onClick={shareGame} variant="outline" className="footer-button">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button onClick={challengeFriend} variant="outline" className="footer-button">
                    <Zap className="h-4 w-4" /> Challenge
                  </Button>
                </div>
                <div className="footer-right">
                  <Button onClick={generateGrid} variant="outline" className="footer-button">
                    <RefreshCw className="h-4 w-4" /> New Game
                  </Button>
                  <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-2/theme-2/games")}>
                    ← Back
                  </Button>
                </div>
              </div>
            </div>
          </>

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
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-cyan-500 to-green-500"></div>
                  
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
                    <Trophy className="h-24 w-24 text-blue-500 mx-auto relative drop-shadow-md" />
                  </div>
                  
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Great Job!</h2>
                  <p className="text-slate-600 mb-8 text-lg">You solved the whole puzzle!</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Words</p>
                       <p className="text-2xl font-black text-blue-600">{placedWords.length}</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Rating</p>
                       <p className="text-2xl font-black text-yellow-500">⭐⭐⭐</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button onClick={generateGrid} size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                      Play Again
                    </Button>
                    <Button onClick={() => setLocation("/primary-school/grade-2/theme-2/games")} variant="ghost" size="lg" className="w-full text-slate-600 hover:bg-slate-50 rounded-xl">
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
