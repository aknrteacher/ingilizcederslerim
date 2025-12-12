import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Zap, Volume2, Trophy, Star, Heart, Maximize2, Minimize2 } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/2.1.word-pop.css";

const vocabulary = [
  { word: "HELLO", turkish: "Merhaba", file: "hello.png" },
  { word: "GOODBYE", turkish: "Hoşça kalın", file: "goodbye.png" },
  { word: "SCHOOL", turkish: "Okul", file: "school.png" },
  { word: "CLASSROOM", turkish: "Sınıf", file: "classroom.png" },
  { word: "LIBRARY", turkish: "Kütüphane", file: "library.png" },
  { word: "CANTEEN", turkish: "Kafeterya", file: "canteen.png" },
  { word: "PLAYGROUND", turkish: "Oyun Alanı", file: "playground.png" },
  { word: "GARDEN", turkish: "Bahçe", file: "garden.png" },
  { word: "TEACHER", turkish: "Öğretmen", file: "teacher.png" },
  { word: "STUDENT", turkish: "Öğrenci", file: "student.png" },
  { word: "GIRL", turkish: "Kız", file: "girl.png" },
  { word: "BOY", turkish: "Erkek", file: "boy.png" },
  { word: "FRIEND", turkish: "Arkadaş", file: "friend.png" },
  { word: "DAY", turkish: "Gün", file: "day.png" },
  { word: "WEEK", turkish: "Hafta", file: "week.png" },
];

const balloonColors = [
  { bg: "bg-red-500", hover: "hover:bg-red-400" },
  { bg: "bg-blue-500", hover: "hover:bg-blue-400" },
  { bg: "bg-green-500", hover: "hover:bg-green-400" },
  { bg: "bg-yellow-500", hover: "hover:bg-yellow-400" },
  { bg: "bg-purple-500", hover: "hover:bg-purple-400" },
  { bg: "bg-pink-500", hover: "hover:bg-pink-400" },
  { bg: "bg-orange-500", hover: "hover:bg-orange-400" },
  { bg: "bg-cyan-500", hover: "hover:bg-cyan-400" },
];

interface Balloon {
  id: string;
  word: string;
  isCorrect: boolean;
  x: number;
  y: number;
  colorIndex: number;
  popped: boolean;
}

export default function WordPopGame() {
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
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const totalWords = 10;

  const speakWord = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const getRandomWords = (correctWord: string, count: number) => {
    const others = vocabulary.filter(v => v.word !== correctWord);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(v => v.word);
  };

  const spawnBalloons = useCallback((word: typeof vocabulary[0]) => {
    const wrongWords = getRandomWords(word.word, 3);
    const allWords = [word.word, ...wrongWords].sort(() => Math.random() - 0.5);
    
    const newBalloons: Balloon[] = allWords.map((w, i) => ({
      id: `${Date.now()}-${i}`,
      word: w,
      isCorrect: w === word.word,
      x: 10 + (i * 22),
      y: 100,
      colorIndex: Math.floor(Math.random() * balloonColors.length),
      popped: false,
    }));
    
    setBalloons(newBalloons);
  }, []);

  const nextWord = useCallback(() => {
    if (wordsCompleted + 1 >= totalWords) {
      setGameWon(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#fbbf24", "#f59e0b"]
      });
      return;
    }

    const remaining = vocabulary.filter(v => v.word !== currentWord.word);
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentWord(next);
    setWordsCompleted(prev => prev + 1);
    
    setTimeout(() => {
      spawnBalloons(next);
    }, 500);
  }, [currentWord, wordsCompleted, spawnBalloons]);

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
        colors: ["#3b82f6", "#60a5fa", "#fbbf24"]
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
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setCurrentWord(randomWord);
    spawnBalloons(randomWord);
  }, [spawnBalloons]);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (!gameStarted || gameOver || gameWon || balloons.length === 0) return;

    const animate = () => {
      setBalloons(prev => {
        const updated = prev.map(b => {
          if (b.popped) return b;
          return { ...b, y: b.y - 0.3 };
        });
        
        const anyEscaped = updated.some(b => !b.popped && b.y < -20);
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
        className={`word-pop-container ${isFullscreen ? 'fullscreen-mode' : ''}`}
        data-testid="word-pop-game"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-400 to-transparent opacity-50" />
          <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 cloud-float" />
          <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70 cloud-float-delayed" />
          <div className="absolute top-5 left-1/3 w-24 h-12 bg-white rounded-full opacity-75 cloud-float" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/oyunlar")}>
                <ArrowLeft className="h-6 w-6 text-slate-700" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  🎈 Word Pop
                </h1>
                <p className="text-slate-600 text-xs">Pop the correct balloon!</p>
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

              <div className="bg-blue-100 px-3 py-1 rounded-lg flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-blue-700">{score}</span>
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

          {/* Target Word Card */}
          <div className="flex justify-center mb-4">
            <motion.div 
              key={currentWord.word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4 border-4 border-blue-200"
            >
              <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={`/images/2.1/${currentWord.file}`} 
                  alt={currentWord.word}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800">{currentWord.turkish}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakWord(currentWord.word)}
                  className="mt-1"
                >
                  <Volume2 className="h-4 w-4 mr-1" /> Listen
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Combo Display */}
          <AnimatePresence>
            {showCombo && combo >= 2 && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                  🔥 {combo}x Combo!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Area with Balloons */}
          <div className="flex-1 relative overflow-hidden rounded-xl min-h-[300px] bg-gradient-to-b from-transparent to-green-200/30">
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

            {gameStarted && balloons.map((balloon) => (
              <button
                key={balloon.id}
                onClick={() => popBalloon(balloon)}
                disabled={balloon.popped}
                className={`absolute transform transition-transform hover:scale-110 ${balloon.popped ? 'opacity-0 scale-0' : ''}`}
                style={{ 
                  left: `${balloon.x}%`, 
                  bottom: `${balloon.y}%`,
                  transition: balloon.popped ? 'all 0.3s' : 'none'
                }}
                data-testid={`balloon-${balloon.word}`}
              >
                <div className="relative">
                  <div className={`w-28 h-36 ${balloonColors[balloon.colorIndex].bg} ${balloonColors[balloon.colorIndex].hover} rounded-full shadow-xl flex items-center justify-center cursor-pointer relative`}>
                    <div className="absolute top-3 left-3 w-6 h-6 bg-white/40 rounded-full" />
                    <span className="text-white font-bold text-base text-center px-2 drop-shadow-lg">
                      {balloon.word}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 ${balloonColors[balloon.colorIndex].bg} rotate-45`} />
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gray-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-center gap-4">
            <Button onClick={shareGame} variant="outline" className="gap-2 bg-white hover:bg-blue-50">
              <Share2 className="h-4 w-4 text-blue-500" /> Share
            </Button>
            <Button onClick={resetGame} variant="outline" className="gap-2 bg-white hover:bg-blue-50">
              <Zap className="h-4 w-4 text-blue-500" /> New Game
            </Button>
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
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-blue-700">{score} points</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {wordsCompleted} words completed
                  </p>
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
                    onClick={() => setLocation("/oyunlar")}
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
