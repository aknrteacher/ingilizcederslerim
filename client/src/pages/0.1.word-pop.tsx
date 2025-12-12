import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Zap, Volume2, Trophy, Star, Heart, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/2.1.word-pop.css";

const vocabulary = [
  { word: "RED", turkish: "Kırmızı", file: "red.png" },
  { word: "BLUE", turkish: "Mavi", file: "blue.png" },
  { word: "YELLOW", turkish: "Sarı", file: "yellow.png" },
  { word: "GREEN", turkish: "Yeşil", file: "green.png" },
  { word: "ORANGE", turkish: "Turuncu", file: "orange.png" },
  { word: "PURPLE", turkish: "Mor", file: "purple.png" },
  { word: "PINK", turkish: "Pembe", file: "pink.png" },
  { word: "BROWN", turkish: "Kahverengi", file: "brown.png" },
  { word: "GRAY", turkish: "Gri", file: "gray.png" },
  { word: "WHITE", turkish: "Beyaz", file: "white.png" },
  { word: "BLACK", turkish: "Siyah", file: "black.png" },
];

const balloonStyles = [
  { shape: "round", color: "from-orange-400 to-orange-600", pattern: "stripes" },
  { shape: "round", color: "from-red-400 to-red-600", pattern: "hearts" },
  { shape: "oval", color: "from-blue-400 to-blue-600", pattern: "circles" },
  { shape: "oval", color: "from-green-400 to-green-600", pattern: "waves" },
  { shape: "heart", color: "from-pink-400 to-pink-600", pattern: "none" },
  { shape: "star", color: "from-yellow-400 to-orange-500", pattern: "none" },
  { shape: "round", color: "from-purple-400 to-purple-600", pattern: "dots" },
  { shape: "oval", color: "from-cyan-400 to-cyan-600", pattern: "stripes" },
];

interface Balloon {
  id: string;
  word: string;
  isCorrect: boolean;
  x: number;
  y: number;
  styleIndex: number;
  popped: boolean;
  floatOffset: number;
}

function BalloonShape({ style, word }: { style: typeof balloonStyles[0], word: string }) {
  const baseClasses = `bg-gradient-to-b ${style.color} shadow-xl flex items-center justify-center cursor-pointer relative overflow-hidden`;
  
  const patternOverlay = () => {
    switch (style.pattern) {
      case "stripes":
        return <div className="absolute inset-0 opacity-30" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.4) 8px, rgba(255,255,255,0.4) 16px)" }} />;
      case "hearts":
        return <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-30 text-white text-xs">♥♥♥</div>;
      case "circles":
        return <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 5px, transparent 5px), radial-gradient(circle at 60% 50%, rgba(255,255,255,0.4) 8px, transparent 8px), radial-gradient(circle at 40% 70%, rgba(255,255,255,0.3) 6px, transparent 6px)" }} />;
      case "waves":
        return <div className="absolute inset-0 opacity-25" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.3) 6px, rgba(255,255,255,0.3) 8px, transparent 8px, transparent 14px)" }} />;
      case "dots":
        return <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5) 2px, transparent 2px)", backgroundSize: "10px 10px" }} />;
      default:
        return null;
    }
  };

  const shineEffect = <div className="absolute top-3 left-3 w-6 h-6 bg-white/50 rounded-full blur-sm" />;

  switch (style.shape) {
    case "heart":
      return (
        <div className={`w-32 h-32 ${baseClasses}`} style={{ clipPath: "path('M64 120 C20 80 0 40 32 20 C50 8 64 20 64 35 C64 20 78 8 96 20 C128 40 108 80 64 120Z')" }}>
          {patternOverlay()}
          {shineEffect}
          <span className="text-white font-bold text-sm text-center px-2 drop-shadow-lg z-10">{word}</span>
        </div>
      );
    case "star":
      return (
        <div className={`w-36 h-36 ${baseClasses}`} style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}>
          {patternOverlay()}
          {shineEffect}
          <span className="text-white font-bold text-sm text-center px-2 drop-shadow-lg z-10">{word}</span>
        </div>
      );
    case "oval":
      return (
        <div className={`w-24 h-36 rounded-[50%] ${baseClasses}`}>
          {patternOverlay()}
          {shineEffect}
          <span className="text-white font-bold text-sm text-center px-2 drop-shadow-lg z-10">{word}</span>
        </div>
      );
    default:
      return (
        <div className={`w-32 h-32 rounded-full ${baseClasses}`}>
          {patternOverlay()}
          {shineEffect}
          <span className="text-white font-bold text-sm text-center px-2 drop-shadow-lg z-10">{word}</span>
        </div>
      );
  }
}

export default function ColorsWordPopGame() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentWord, setCurrentWord] = useState(() => vocabulary[Math.floor(Math.random() * vocabulary.length)]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTurkish, setShowTurkish] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const totalWords = 8;
  const hintPenalty = 5;
  const correctPoints = 10;
  const noHintBonus = 5;

  const speakWord = useCallback((text: string, applyPenalty: boolean = false) => {
    if (applyPenalty && gameStarted && !gameOver && !gameWon) {
      setScore(prev => Math.max(0, prev - hintPenalty));
      setHintsUsed(prev => prev + 1);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  }, [gameStarted, gameOver, gameWon]);

  const revealTurkish = useCallback(() => {
    if (gameStarted && !gameOver && !gameWon) {
      setScore(prev => Math.max(0, prev - hintPenalty));
      setHintsUsed(prev => prev + 1);
    }
    setShowTurkish(true);
  }, [gameStarted, gameOver, gameWon]);

  const getRandomWords = (correctWord: string, count: number) => {
    const others = vocabulary.filter(v => v.word !== correctWord);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(v => v.word);
  };

  const spawnBalloons = useCallback((word: typeof vocabulary[0]) => {
    const wrongWords = getRandomWords(word.word, 3);
    const allWords = [word.word, ...wrongWords].sort(() => Math.random() - 0.5);
    
    const usedStyles: number[] = [];
    const newBalloons: Balloon[] = allWords.map((w, i) => {
      let styleIndex;
      do {
        styleIndex = Math.floor(Math.random() * balloonStyles.length);
      } while (usedStyles.includes(styleIndex) && usedStyles.length < balloonStyles.length);
      usedStyles.push(styleIndex);
      
      return {
        id: `${Date.now()}-${i}`,
        word: w,
        isCorrect: w === word.word,
        x: 10 + i * 22,
        y: 5 + (i * 3),
        styleIndex,
        popped: false,
        floatOffset: Math.random() * Math.PI * 2,
      };
    });
    
    setBalloons(newBalloons);
  }, []);

  const nextWord = useCallback(() => {
    if (wordsCompleted + 1 >= totalWords) {
      setGameWon(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#f59e0b", "#fcd34d", "#f97316", "#fb923c"]
      });
      return;
    }

    const remaining = vocabulary.filter(v => !usedWords.includes(v.word) && v.word !== currentWord.word);
    const pool = remaining.length > 0 ? remaining : vocabulary.filter(v => v.word !== currentWord.word);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(next);
    setUsedWords(prev => [...prev, next.word]);
    setShowTurkish(false);
    setWordsCompleted(prev => prev + 1);
    
    setTimeout(() => {
      spawnBalloons(next);
    }, 500);
  }, [currentWord, wordsCompleted, usedWords, spawnBalloons]);

  const popBalloon = useCallback((balloon: Balloon) => {
    if (balloon.popped || gameOver || gameWon) return;

    setBalloons(prev => prev.map(b => 
      b.id === balloon.id ? { ...b, popped: true } : b
    ));

    if (balloon.isCorrect) {
      const comboBonus = combo >= 2 ? combo : 1;
      setScore(prev => prev + (10 * comboBonus));
      setCombo(prev => prev + 1);
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 1000);
      
      speakWord(balloon.word);
      
      const audio = new Audio("/sounds/bell.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#fbbf24", "#f59e0b", "#fcd34d"]
      });

      setTimeout(nextWord, 800);
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
      setCombo(0);
      
      const audio = new Audio("/sounds/wrong.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [combo, gameOver, gameWon, nextWord, speakWord]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setWordsCompleted(0);
    setCombo(0);
    setHintsUsed(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
    setShowTurkish(false);
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setCurrentWord(randomWord);
    setUsedWords([randomWord.word]);
    spawnBalloons(randomWord);
  }, [spawnBalloons]);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (!gameStarted || gameOver || gameWon || balloons.length === 0) return;

    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      setBalloons(prev => {
        const allPopped = prev.every(b => b.popped);
        if (allPopped) return prev;
        
        const updated = prev.map(b => {
          if (b.popped) return b;
          const speed = 0.06 + (b.floatOffset * 0.015);
          return { ...b, y: b.y + speed * deltaTime * 0.1 };
        });
        
        const anyEscaped = updated.some(b => !b.popped && b.y > 100);
        if (anyEscaped) {
          return [];
        }
        
        return updated;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, gameWon, balloons.length]);

  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon && balloons.length === 0 && balloons.every(b => b.popped || b.y < -20)) {
      const timer = setTimeout(() => {
        spawnBalloons(currentWord);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [balloons, gameStarted, gameOver, gameWon, currentWord, spawnBalloons]);

  const toggleFullscreen = () => {
    if (!gameAreaRef.current) return;
    
    if (!document.fullscreenElement) {
      gameAreaRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const shareGame = () => {
    const text = `I scored ${score} points in Word Pop Colors! Can you beat my score? 🎈`;
    if (navigator.share) {
      navigator.share({ title: "Word Pop Colors - English Learning Game", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
    }
  };

  return (
    <Layout>
      <div 
        ref={gameAreaRef}
        className={`word-pop-container ${isFullscreen ? 'fullscreen-mode' : ''}`}
        data-testid="word-pop-colors-game"
      >
        {/* Background - Yellow/Amber theme for preschool */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-yellow-100 to-orange-100 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-300 to-transparent opacity-50" />
          <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 cloud-float" />
          <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70 cloud-float-delayed" />
          <div className="absolute top-5 left-1/3 w-24 h-12 bg-white rounded-full opacity-75 cloud-float" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/okul-oncesi/renkler")}>
                <ArrowLeft className="h-6 w-6 text-slate-700" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-amber-700 flex items-center gap-2">
                  🎈 Word Pop - Colors
                </h1>
                <p className="text-amber-600 text-xs">Pop the correct balloon!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`h-5 w-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>

              <div className="bg-amber-100 px-3 py-1 rounded-lg flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-amber-700">{score}</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="font-bold text-green-700">{wordsCompleted}/{totalWords}</span>
              </div>

              <div className="hidden md:block">
                <Button
                  onClick={toggleFullscreen}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Combo Display */}
          <AnimatePresence>
            {showCombo && combo >= 2 && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                  🔥 {combo}x Combo!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Game Area - Card + Balloons side by side */}
          <div className="flex-1 flex items-stretch gap-8 bg-gradient-to-b from-amber-50 to-green-100/30 rounded-xl p-6 min-h-[400px]">
            {/* Target Word Card */}
            <motion.div 
              key={currentWord.word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-xl p-4 border-4 border-amber-300 flex-shrink-0 self-center"
            >
              <div className="w-48 h-48 rounded-2xl bg-amber-50 flex items-center justify-center overflow-hidden mb-3">
                <img 
                  src={`/images/0.1/${currentWord.file}`} 
                  alt={currentWord.word}
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                {showTurkish ? (
                  <p className="text-base font-semibold text-slate-700">{currentWord.turkish}</p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={revealTurkish}
                    className="h-8 px-3 text-orange-500 border-orange-300 hover:bg-orange-50"
                    title="Show Turkish meaning (-5 points)"
                  >
                    <span className="text-xs mr-1">?</span> Hint
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord(currentWord.word, true)}
                  className="h-8 px-3"
                  title="Hear pronunciation (-5 points)"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Balloons Area */}
            <div className="flex-1 relative overflow-visible min-h-[300px]">
              {!gameStarted && !gameOver && !gameWon && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xl px-8 py-6 rounded-2xl shadow-xl"
                  >
                    🎈 Start Game!
                  </Button>
                </div>
              )}

              {gameStarted && balloons.map((balloon, index) => (
                <button
                  key={balloon.id}
                  onClick={() => popBalloon(balloon)}
                  disabled={balloon.popped}
                  className={`absolute transform hover:scale-110 ${balloon.popped ? 'balloon-pop' : ''}`}
                  style={{ 
                    left: `${5 + index * 23}%`,
                    top: `${85 - balloon.y}%`,
                    transform: 'translateY(-50%)',
                    transition: balloon.popped ? 'all 0.3s' : 'none',
                  }}
                  data-testid={`balloon-${balloon.word}`}
                >
                  <div className="relative balloon-wiggle" style={{ animationDelay: `${index * 0.2}s` }}>
                    <BalloonShape style={balloonStyles[balloon.styleIndex]} word={balloon.word} />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex flex-wrap justify-between items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-lg">
            <div className="flex gap-2">
              <Button onClick={shareGame} variant="outline" className="gap-2 bg-white hover:bg-amber-50 border-amber-200">
                <Share2 className="h-4 w-4 text-amber-500" /> Share
              </Button>
              <Button onClick={() => {}} variant="outline" className="gap-2 bg-white hover:bg-amber-50 border-amber-200">
                <Zap className="h-4 w-4 text-amber-500" /> Challenge
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetGame} variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200">
                <RefreshCw className="h-4 w-4 text-slate-500" /> New Game
              </Button>
              <Button variant="ghost" className="gap-2 text-slate-500 hover:text-slate-800" onClick={() => setLocation("/okul-oncesi/renkler")}>
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Game Over / Win Modal */}
        <AnimatePresence>
          {(gameOver || gameWon) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
              >
                <div className="text-6xl mb-4">
                  {gameWon ? "🎉" : "💔"}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {gameWon ? "Amazing!" : "Game Over"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {gameWon 
                    ? `You completed all ${totalWords} colors!` 
                    : "Don't give up! Try again!"}
                </p>

                <div className="bg-amber-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-amber-700">{score} points</span>
                  </div>
                  <div className="text-sm space-y-1 border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">✓ Correct answers:</span>
                      <span className="font-semibold text-green-600">{wordsCompleted} × {correctPoints} = +{wordsCompleted * correctPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">🎯 No hint bonus:</span>
                      <span className="font-semibold text-blue-600">{wordsCompleted - hintsUsed} × {noHintBonus} = +{Math.max(0, (wordsCompleted - hintsUsed)) * noHintBonus}</span>
                    </div>
                    {hintsUsed > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">💡 Hints used:</span>
                        <span className="font-semibold text-orange-500">{hintsUsed} × {hintPenalty} = -{hintsUsed * hintPenalty}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={resetGame}
                    size="lg"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setLocation("/okul-oncesi/renkler")}
                    variant="ghost"
                    size="lg"
                    className="w-full"
                  >
                    Back to Colors
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
