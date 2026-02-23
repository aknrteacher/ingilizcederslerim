import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Zap, Volume2, Trophy, Star, Heart, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import "@/styles/2.1.word-pop.css";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

const vocabulary = [
  { word: "BODY", turkish: "vücut", file: "body.png" },
  { word: "HEAD", turkish: "baş", file: "head.png" },
  { word: "HAIR", turkish: "saç", file: "hair.png" },
  { word: "FACE", turkish: "yüz", file: "face.png" },
  { word: "EYES", turkish: "gözler", file: "eyes.png" },
  { word: "MOUTH", turkish: "ağız", file: "mouth.png" },
  { word: "EARS", turkish: "kulaklar", file: "ears.png" },
  { word: "ARMS", turkish: "kollar", file: "arms.png" },
  { word: "HANDS", turkish: "eller", file: "hands.png" },
  { word: "LEGS", turkish: "bacaklar", file: "legs.png" },
  { word: "NOSE", turkish: "burun", file: "nose.png" },
  { word: "BLONDE", turkish: "sarı", file: "blonde.png" },
  { word: "SHIRT", turkish: "gömlek", file: "shirt.png" },
  { word: "GLASSES", turkish: "gözlük", file: "glasses.png" },
  { word: "SCARF", turkish: "atkı", file: "scarf.png" },
  { word: "GLOVES", turkish: "eldiven", file: "gloves.png" },
  { word: "UMBRELLA", turkish: "şemsiye", file: "umbrella.png" },
  { word: "COAT", turkish: "palto", file: "coat.png" },
  { word: "SHOES", turkish: "ayakkabılar", file: "shoes.png" },
  { word: "DRESS", turkish: "elbise", file: "dress.png" },
  { word: "HAT", turkish: "şapka", file: "hat.png" },
  { word: "WEATHER", turkish: "hava", file: "weather.png" },
  { word: "HOT", turkish: "sıcak", file: "hot.png" },
  { word: "COLD", turkish: "soğuk", file: "cold.png" },
  { word: "SUNNY", turkish: "güneşli", file: "sunny.png" },
  { word: "RAINY", turkish: "yağmurlu", file: "rainy.png" },
  { word: "SNOWY", turkish: "karlı", file: "snowy.png" },
  { word: "BREAK", turkish: "mola", file: "break.png" },
  { word: "PUPPET", turkish: "kukla", file: "puppet.png" },
  { word: "WELL DONE", turkish: "aferin", file: "well done.png" },
];

// Display multi-word vocabulary with spaces (from file name)
const getDisplayWord = (wordKey: string) => {
  const v = vocabulary.find((x) => x.word === wordKey);
  return v ? v.file.replace(/\.png$/i, "").toUpperCase() : wordKey;
};

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
  const baseClasses = `bg-gradient-to-b ${style.color} shadow-xl flex items-center justify-center cursor-pointer relative overflow-visible`;
  
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
        </div>
      );
    case "star":
      return (
        <div className={`w-36 h-36 ${baseClasses}`} style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}>
          {patternOverlay()}
          {shineEffect}
        </div>
      );
    case "oval":
      return (
        <div className={`w-24 h-36 rounded-[50%] ${baseClasses}`}>
          {patternOverlay()}
          {shineEffect}
        </div>
      );
    default: // round
      return (
        <div className={`w-32 h-32 rounded-full ${baseClasses}`}>
          {patternOverlay()}
          {shineEffect}
        </div>
      );
  }
}

export default function WordPopGame2_3() {
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

  const totalWords = 10;
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
      utterance.rate = 0.8;
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
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#10b981", "#34d399"]
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
        colors: ["#3b82f6", "#60a5fa", "#10b981"]
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
          const speed = 0.15 + (b.floatOffset * 0.03);
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const shareGame = () => {
    const text = `I scored ${score} points in Word Pop! Can you beat my score? 🎈`;
    if (navigator.share) {
      navigator.share({ title: "Word Pop - English Learning Game", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
    }
  };

  return (
    <Layout>
      <div 
        ref={gameAreaRef}
        className={'word-pop-container' + (isFullscreen ? ' fullscreen-mode' : '')}
        id="word-pop-game"
        data-testid="word-pop-game"
      >
        {/* Background - Blue/Sky theme for primary school */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-200 to-cyan-100 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-300 to-transparent opacity-50" />
          <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 cloud-float" />
          <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70 cloud-float-delayed" />
          <div className="absolute top-5 left-1/3 w-24 h-12 bg-white rounded-full opacity-75 cloud-float" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 min-h-0 p-2 sm:p-4">
          <PrimarySchoolGameHeader 
            gameName="Word Pop"
            description="2nd Grade - Theme 3: Personal Life"
            containerId="word-pop-game"
            icon="🎈"
          />

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap mb-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                />
              ))}
            </div>

            <div className="bg-blue-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-blue-700 text-sm sm:text-base">{score}</span>
            </div>

            <div className="flex items-center gap-2 bg-green-100 px-2 sm:px-3 py-1 rounded-lg">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="font-bold text-green-700 text-sm sm:text-base">{wordsCompleted}/{totalWords}</span>
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
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                  🔥 {combo}x Combo!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Game Area - Card + Balloons side by side */}
          <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-8 bg-gradient-to-b from-sky-50 to-green-100/30 rounded-xl p-3 sm:p-6 min-h-0 overflow-hidden">
            {/* Target Word Card */}
            <motion.div 
              key={currentWord.word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-xl p-3 sm:p-4 border-4 border-blue-300 flex-shrink-0 self-center w-full lg:w-auto"
            >
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden mb-3 mx-auto">
                <img 
                  src={`/images/primary/2.3/${currentWord.file}`} 
                  alt={currentWord.word}
                  className="w-28 h-28 sm:w-40 sm:h-40 object-contain"
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
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-8 py-6 rounded-2xl shadow-xl"
                  >
                    🎈 Start Game!
                  </Button>
                </div>
              )}

              {gameStarted && balloons.map((balloon, index) => {
                // Get balloon color for banner border
                const getBalloonColor = () => {
                  const colorMap: Record<string, string> = {
                    "from-orange-400 to-orange-600": "#ea580c",
                    "from-red-400 to-red-600": "#dc2626",
                    "from-blue-400 to-blue-600": "#2563eb",
                    "from-green-400 to-green-600": "#16a34a",
                    "from-pink-400 to-pink-600": "#ec4899",
                    "from-yellow-400 to-orange-500": "#eab308",
                    "from-purple-400 to-purple-600": "#9333ea",
                    "from-cyan-400 to-cyan-600": "#06b6d4",
                  };
                  return colorMap[balloonStyles[balloon.styleIndex].color] || "#4b5563";
                };
                
                const balloonColor = getBalloonColor();
                const bannerStyle = {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: `2px solid ${balloonColor}`,
                  borderRadius: '8px',
                  padding: '6px 12px',
                  display: 'inline-block',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  color: balloonColor,
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                };
                
                return (
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
                      <BalloonShape style={balloonStyles[balloon.styleIndex]} word={getDisplayWord(balloon.word)} />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-400" />
                      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2" style={bannerStyle}>
                        {getDisplayWord(balloon.word)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="primary-school-game-footer flex-shrink-0 mt-auto">
            <div className="footer-content">
              <div className="footer-left">
                <Button onClick={shareGame} variant="outline" className="footer-button">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button onClick={() => {}} variant="outline" className="footer-button">
                  <Zap className="h-4 w-4" /> Challenge
                </Button>
              </div>
              <div className="footer-right">
                <Button onClick={resetGame} variant="outline" className="footer-button">
                  <RefreshCw className="h-4 w-4" /> New Game
                </Button>
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-2/theme-3/games")}>
                  ← Back
                </Button>
              </div>
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
                    ? `You completed all ${totalWords} words!` 
                    : "Don't give up! Try again!"}
                </p>

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-blue-700">{score} points</span>
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
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setLocation("/primary-school/grade-2/theme-3/games")}
                    variant="ghost"
                    size="lg"
                    className="w-full"
                  >
                    Back to Games
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

