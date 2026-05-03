import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Zap, Volume2, Trophy, Star, Heart, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import "@/styles/3.1.catch-that.css";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";
import { playCatchThatPositiveRewardSound, playCatchThatNegativeRewardSound } from "@/lib/catch-that-sounds";

// Unit 7 vocabulary - uppercase single words for catch-that
const vocabulary = [
  { word: "BUILDING", turkish: "Bina", file: "building.png" },
  { word: "PLACE", turkish: "Yer", file: "place.png" },
  { word: "SCHOOL", turkish: "Okul", file: "school.png" },
  { word: "LIBRARY", turkish: "Kütüphane", file: "library.png" },
  { word: "SHOPPINGCENTRE", turkish: "Alışveriş merkezi", file: "shopping centre.png" },
  { word: "MUSEUM", turkish: "Müze", file: "museum.png" },
  { word: "ZOO", turkish: "Hayvanat bahçesi", file: "zoo.png" },
  { word: "HOSPITAL", turkish: "Hastane", file: "hospital.png" },
  { word: "BANK", turkish: "Banka", file: "bank.png" },
  { word: "PARK", turkish: "Park", file: "park.png" },
  { word: "MOSQUE", turkish: "Cami", file: "mosque.png" },
  { word: "CAFE", turkish: "Kafe", file: "cafe.png" },
  { word: "POLICESTATION", turkish: "Polis merkezi", file: "police station.png" },
  { word: "BUSSTOP", turkish: "Otobüs durağı", file: "bus stop.png" },
  { word: "HOME", turkish: "Ev", file: "home.png" },
  { word: "ROAD", turkish: "Yol", file: "road.png" },
  { word: "MAP", turkish: "Harita", file: "map.png" },
  { word: "CITY", turkish: "Şehir", file: "city.png" },
  { word: "TOWN", turkish: "Kasaba", file: "town.png" },
  { word: "VILLAGE", turkish: "Köy", file: "village.png" },
  { word: "AT", turkish: "-de / -da", file: "at.png" },
  { word: "OVERTHERE", turkish: "Orada", file: "over there.png" },
  { word: "HERE", turkish: "Burada", file: "here.png" },
  { word: "KNOW", turkish: "Bilmek", file: "know.png" },
  { word: "NOW", turkish: "Şimdi", file: "now.png" },
  { word: "IDONTKNOW", turkish: "Bilmiyorum", file: "I don't know.png" },
  { word: "SORRY", turkish: "Özür dilerim", file: "sorry.png" },
  { word: "EXCUSEME", turkish: "Affedersiniz", file: "excuse me.png" },
  { word: "WHERE", turkish: "Nerede", file: "where.png" },
  { word: "GO", turkish: "Gitmek", file: "go.png" },
  { word: "IT", turkish: "O", file: "it.png" },
];

// Word style colors - diverse vibrant colors different from each other and from game's orange theme
const wordStyles = [
  { bg: "bg-[#FF4444]", text: "text-white", border: "border-[#DC2626]" },      // Red
  { bg: "bg-[#4444FF]", text: "text-white", border: "border-[#2626DC]" },      // Blue
  { bg: "bg-[#AA44FF]", text: "text-white", border: "border-[#8800DD]" },       // Purple
  { bg: "bg-[#FFFF44]", text: "text-[#1e293b]", border: "border-[#EEEE33]" },   // Yellow (dark text)
  { bg: "bg-[#FF44AA]", text: "text-white", border: "border-[#DD2288]" },       // Pink
  { bg: "bg-[#00FFFF]", text: "text-[#1e293b]", border: "border-[#00CCCC]" },  // Cyan (dark text)
  { bg: "bg-[#FF44FF]", text: "text-white", border: "border-[#DD22DD]" },      // Magenta
  { bg: "bg-[#44FF44]", text: "text-white", border: "border-[#22DD22]" },      // Green
  { bg: "bg-[#00AAFF]", text: "text-white", border: "border-[#0088DD]" },       // Sky Blue
  { bg: "bg-[#FFAA00]", text: "text-white", border: "border-[#DD8800]" },      // Amber
];

// Display multi-word vocabulary with spaces (from file name)
const getDisplayWord = (wordKey: string) => {
  const v = vocabulary.find((x) => x.word === wordKey);
  return v ? v.file.replace(/\.png$/i, "").toUpperCase() : wordKey;
};

interface FallingWord {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  isCorrect: boolean;
  caught: boolean;
  styleIndex: number;
}

type PrizeType = 'extra-heart' | 'extra-time' | 'bomb' | 'minus-time';

interface FallingPrize {
  id: string;
  type: PrizeType;
  x: number;
  y: number;
  speed: number;
  caught: boolean;
}

export default function CatchThatGame3_7() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(10);
  const [currentWord, setCurrentWord] = useState(() => vocabulary[Math.floor(Math.random() * vocabulary.length)]);
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [fallingPrizes, setFallingPrizes] = useState<FallingPrize[]>([]);
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
  const [basketPosition, setBasketPosition] = useState(50); // percentage from left
  const basketPositionRef = useRef(50);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // Speed boost multiplier
  const isMiddleMouseDownRef = useRef(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const playAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const missedCorrectWordsRef = useRef<Set<string>>(new Set());

  const totalWords = 10;
  const hintPenalty = 5;
  const correctPoints = 10;
  const noHintBonus = 5;
  const prizeSpawnChance = 0.1; // 10% chance to spawn a prize instead of a word
  
  // Progressive speed: faster as game progresses (overall faster)
  const getSpawnInterval = () => {
    const progress = wordsCompleted / totalWords; // 0 to 1
    // Start at 1200ms, decrease to 600ms by the end (faster overall)
    return Math.max(600, 1200 - (progress * 600));
  };
  
  const getFallSpeed = () => {
    const progress = wordsCompleted / totalWords; // 0 to 1
    // Start at 0.35, increase to 0.65 by the end (faster overall and more aggressive)
    return 0.35 + (progress * 0.3);
  };

  const setBasketPct = useCallback((pct: number) => {
    const clamped = Math.max(10, Math.min(90, pct));
    basketPositionRef.current = clamped;
    setBasketPosition(clamped);
  }, []);

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

  const spawnWord = useCallback(() => {
    if (!gameStarted || gameOver || gameWon) return;

    const wrongWords = getRandomWords(currentWord.word, 2);
    const allWords = [currentWord.word, ...wrongWords].sort(() => Math.random() - 0.5);
    
    // Randomly select one word to spawn
    const wordToSpawn = allWords[Math.floor(Math.random() * allWords.length)];
    const isCorrect = wordToSpawn === currentWord.word;

    const newWord: FallingWord = {
      id: `${Date.now()}-${Math.random()}`,
      word: wordToSpawn,
      x: 10 + Math.random() * 80, // Random horizontal position (10% to 90%)
      y: 0,
      speed: getFallSpeed() + Math.random() * 0.1, // Progressive speed with slight variation
      isCorrect,
      caught: false,
      styleIndex: Math.floor(Math.random() * wordStyles.length),
    };

    setFallingWords(prev => [...prev, newWord]);
  }, [currentWord, gameStarted, gameOver, gameWon, wordsCompleted, totalWords]);

  const spawnPrize = useCallback(() => {
    if (!gameStarted || gameOver || gameWon) return;

    // Randomly decide prize type
    const prizeTypes: PrizeType[] = ['extra-heart', 'extra-time', 'bomb', 'minus-time'];
    const randomType = prizeTypes[Math.floor(Math.random() * prizeTypes.length)];

    const newPrize: FallingPrize = {
      id: `prize-${Date.now()}-${Math.random()}`,
      type: randomType,
      x: 10 + Math.random() * 80, // Random horizontal position (10% to 90%)
      y: 0,
      speed: getFallSpeed() + Math.random() * 0.1, // Progressive speed with slight variation
      caught: false,
    };

    setFallingPrizes(prev => [...prev, newPrize]);
  }, [gameStarted, gameOver, gameWon, wordsCompleted, totalWords]);

  const nextWord = useCallback(() => {
    if (wordsCompleted + 1 >= totalWords) {
      setGameWon(true);
      setFallingWords([]);
      setFallingPrizes([]);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FF8844", "#FF9955", "#FFAA66", "#FF7733", "#FFBB77"]
      });
      return;
    }

    const remaining = vocabulary.filter(v => !usedWords.includes(v.word) && v.word !== currentWord.word);
    const pool = remaining.length > 0 ? remaining : vocabulary.filter(v => v.word !== currentWord.word);
    const next = pool[Math.floor(Math.random() * pool.length)];
    
    // Clear all falling words when word changes to prevent incorrect correct/incorrect evaluation
    setFallingWords([]);
    setFallingPrizes([]);
    
    setCurrentWord(next);
    setUsedWords(prev => [...prev, next.word]);
    setShowTurkish(false);
    setWordsCompleted(prev => prev + 1);
    // Clear the missed words tracking for the new word
    missedCorrectWordsRef.current.clear();
  }, [currentWord, wordsCompleted, usedWords]);


  const catchWord = useCallback((word: FallingWord) => {
    if (word.caught || gameOver || gameWon) return;

    setFallingWords(prev => prev.map(w => 
      w.id === word.id ? { ...w, caught: true } : w
    ));

    // Verify correctness against current word (safety check in case word changed)
    const isActuallyCorrect = word.word === currentWord.word;

    if (isActuallyCorrect && word.isCorrect) {
      const comboBonus = Math.max(1, combo + 1);
      setScore(prev => prev + (correctPoints * comboBonus));
      setCombo(prev => prev + 1);
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 1000);
      
      speakWord(word.word);
      
      const audio = new Audio("/sounds/bell.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: word.x / 100, y: 0.9 },
        colors: ["#FF8844", "#FF9955", "#FFAA66"]
      });

      queueMicrotask(() => nextWord());
    } else {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
      setCombo(0);
      
      // Play short error sound when wrong word is caught
      const audio = new Audio("/sounds/error.mp3");
      audio.volume = 0.7;
      audio.play().catch((err) => {
        console.error("Error sound failed, trying wrong.mp3:", err);
        const fallbackAudio = new Audio("/sounds/wrong.mp3");
        fallbackAudio.volume = 0.7;
        fallbackAudio.play().catch(() => {});
      });
    }
  }, [combo, gameOver, gameWon, speakWord, currentWord, nextWord]);

  const catchPrize = useCallback((prize: FallingPrize) => {
    if (prize.caught || gameOver || gameWon) return;

    setFallingPrizes(prev => prev.map(p => 
      p.id === prize.id ? { ...p, caught: true } : p
    ));

    switch (prize.type) {
      case 'extra-heart':
        playCatchThatPositiveRewardSound();
        setLives(prev => Math.min(10, prev + 1)); // Max 10 lives
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: prize.x / 100, y: 0.9 },
          colors: ["#ef4444", "#f87171", "#fca5a5"]
        });
        break;
      case 'extra-time':
        playCatchThatPositiveRewardSound();
        // Add bonus points as "extra time" reward
        setScore(prev => prev + 20);
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: prize.x / 100, y: 0.9 },
          colors: ["#FF8844", "#FF9955", "#FFAA66"]
        });
        break;
      case 'bomb':
        setLives(prev => {
          const newLives = Math.max(0, prev - 2);
          if (newLives <= 0) {
            setGameOver(true);
          }
          return newLives;
        });
        setCombo(0);
        playCatchThatNegativeRewardSound();
        break;
      case 'minus-time':
        setScore(prev => Math.max(0, prev - 15));
        setCombo(0);
        playCatchThatNegativeRewardSound();
        break;
    }
  }, [gameOver, gameWon]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(10);
    setWordsCompleted(0);
    setCombo(0);
    setHintsUsed(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
    setShowTurkish(false);
    setFallingWords([]);
    setFallingPrizes([]);
    setSpeedMultiplier(1); // Reset speed multiplier
    isMiddleMouseDownRef.current = false; // Reset middle mouse state
    missedCorrectWordsRef.current.clear();
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setCurrentWord(randomWord);
    setUsedWords([randomWord.word]);
    setBasketPct(50);
  }, [setBasketPct]);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Handle keyboard input for basket movement and speed boost
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketPct(basketPositionRef.current - 5);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketPct(basketPositionRef.current + 5);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        // Speed boost with down arrow
        setSpeedMultiplier(prev => Math.min(3, prev + 0.5)); // Max 3x speed
        // Reset after a short delay
        setTimeout(() => {
          setSpeedMultiplier(prev => Math.max(1, prev - 0.5));
        }, 100);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, gameWon, setBasketPct]);

  // Handle mouse/touch movement for basket and speed boost with middle mouse scroll
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon || !playAreaRef.current) return;

    const handleMove = (clientX: number) => {
      const rect = playAreaRef.current?.getBoundingClientRect();
      if (!rect) return;
      const percentage = ((clientX - rect.left) / rect.width) * 100;
      setBasketPct(percentage);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const handleWheel = (e: WheelEvent) => {
      // Check if middle mouse button is held down and scrolling down
      if (isMiddleMouseDownRef.current && e.deltaY > 0) {
        e.preventDefault();
        // Speed boost with middle mouse scroll down
        setSpeedMultiplier(prev => Math.min(3, prev + 0.3)); // Max 3x speed
        // Reset after a short delay
        setTimeout(() => {
          setSpeedMultiplier(prev => Math.max(1, prev - 0.3));
        }, 150);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Check if middle mouse button is pressed
      if (e.button === 1) {
        e.preventDefault();
        isMiddleMouseDownRef.current = true;
        setSpeedMultiplier(prev => Math.min(3, prev + 0.5));
        setTimeout(() => {
          setSpeedMultiplier(prev => Math.max(1, prev - 0.5));
        }, 150);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // Check if middle mouse button is released
      if (e.button === 1) {
        isMiddleMouseDownRef.current = false;
      }
    };

    const playArea = playAreaRef.current;
    playArea.addEventListener('mousemove', handleMouseMove);
    playArea.addEventListener('touchstart', handleTouchStart, { passive: true });
    playArea.addEventListener('touchmove', handleTouchMove, { passive: false });
    playArea.addEventListener('wheel', handleWheel, { passive: false });
    playArea.addEventListener('mousedown', handleMouseDown);
    playArea.addEventListener('mouseup', handleMouseUp);
    // Also listen on window for mouseup in case mouse is released outside game area
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      playArea.removeEventListener('mousemove', handleMouseMove);
      playArea.removeEventListener('touchmove', handleTouchMove);
      playArea.removeEventListener('wheel', handleWheel);
      playArea.removeEventListener('mousedown', handleMouseDown);
      playArea.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameStarted, gameOver, gameWon, setBasketPct]);

  // Spawn words periodically
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
      return;
    }

    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    const spawn = () => {
      if (gameStarted && !gameOver && !gameWon) {
        // 10% chance to spawn a prize, 90% chance to spawn a word
        if (Math.random() < prizeSpawnChance) {
          spawnPrize();
        } else {
          spawnWord();
        }
      }
    };
    
    const currentInterval = getSpawnInterval();
    spawnTimerRef.current = setInterval(spawn, currentInterval);
    
    // Spawn first word immediately
    spawn();

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [gameStarted, gameOver, gameWon, spawnWord, spawnPrize, prizeSpawnChance, wordsCompleted, totalWords]);

  // Animate falling words and prizes
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();
    
    const handleMissedCorrectWord = (word: FallingWord) => {
      const isActuallyCorrect = word.word === currentWord.word;
      
      if (!word.isCorrect || !isActuallyCorrect) {
        return;
      }
      
      if (missedCorrectWordsRef.current.has(word.id)) {
        return;
      }
      
      missedCorrectWordsRef.current.add(word.id);
      
      const missAudio = new Audio("/sounds/error.mp3");
      missAudio.volume = 0.8;
      missAudio.play().catch((err) => {
        console.error("Error sound failed, trying wrong.mp3:", err);
        const fallbackAudio = new Audio("/sounds/wrong.mp3");
        fallbackAudio.volume = 0.8;
        fallbackAudio.play().catch(() => {});
      });
      
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return newLives;
      });
      setCombo(0);
    };
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Animate words
      setFallingWords(prev => {
        const updated = prev.map(word => {
          if (word.caught) return word;
          const deltaMultiplier = Math.min(deltaTime / 16, 2);
          const newY = word.y + (word.speed * deltaMultiplier * speedMultiplier); // Apply speed boost
          
          if (newY >= 80) {
            const bx = basketPositionRef.current;
            const basketCatchWidth = isFullscreen ? 10 : 16;
            const basketLeft = bx - basketCatchWidth;
            const basketRight = bx + basketCatchWidth;
            
            if (!word.caught && word.x >= basketLeft && word.x <= basketRight) {
              catchWord(word);
              return { ...word, caught: true };
            }
          }
          
          if (newY >= 85 && !word.caught) {
            const caughtWord = { ...word, caught: true };
            const isActuallyCorrect = word.word === currentWord.word;
            
            if (isActuallyCorrect && word.isCorrect === true && !missedCorrectWordsRef.current.has(word.id)) {
              handleMissedCorrectWord(caughtWord);
            }
            return caughtWord;
          }
          
          return { ...word, y: newY };
        });

        const filtered = updated.filter(w => !w.caught);
        return filtered;
      });

      // Animate prizes
      setFallingPrizes(prev => {
        const updated = prev.map(prize => {
          if (prize.caught) return prize;
          const deltaMultiplier = Math.min(deltaTime / 16, 2);
          const newY = prize.y + (prize.speed * deltaMultiplier * speedMultiplier); // Apply speed boost
          
          if (newY >= 80) {
            const bx = basketPositionRef.current;
            const basketCatchWidth = isFullscreen ? 10 : 16;
            const basketLeft = bx - basketCatchWidth;
            const basketRight = bx + basketCatchWidth;
            
            if (prize.x >= basketLeft && prize.x <= basketRight) {
              catchPrize(prize);
              return { ...prize, caught: true };
            }
          }
          
          if (newY >= 85) {
            return { ...prize, caught: true };
          }
          
          return { ...prize, y: newY };
        });

        const filtered = updated.filter(p => !p.caught);
        return filtered;
      });

      if (gameStarted && !gameOver && !gameWon) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [gameStarted, gameOver, gameWon, catchWord, catchPrize, currentWord, isFullscreen, speedMultiplier]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const challengeFriends = () => {
    const text = `Catch That — I'm at ${score} points. Think you can beat me? 🎯`;
    if (navigator.share) {
      navigator.share({ title: "Catch That — Challenge", text, url: window.location.href }).catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        navigator.clipboard.writeText(text + " " + window.location.href);
      });
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
    }
  };

  const shareGame = () => {
    const text = `I scored ${score} points in Catch That! Can you beat my score? 🎯`;
    if (navigator.share) {
      navigator.share({ title: "Catch That - English Learning Game", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
    }
  };

  return (
    <Layout>
      <div 
        ref={gameAreaRef}
        className={'catch-that-container' + (isFullscreen ? ' fullscreen-mode' : '')}
        id="catch-that-game"
        data-testid="catch-that-game"
      >
        {/* Background - Orange theme for primary school */}
        <div className="absolute inset-0 bg-[#FF8844] z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#FF9955] opacity-50" />
          <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 cloud-float" />
          <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70 cloud-float-delayed" />
          <div className="absolute top-5 left-1/3 w-24 h-12 bg-white rounded-full opacity-75 cloud-float" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 min-h-0 p-2 sm:p-4">
          <PrimarySchoolGameHeader 
            gameName="Catch That"
            description="Grade 3 - Unit 7: In My City"
            containerId="catch-that-game"
            icon="🎯"
          />

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap mb-4">
            <div className="flex items-center gap-1 flex-wrap max-w-[200px] sm:max-w-none">
              {[...Array(10)].map((_, i) => (
                <Heart
                  key={i}
                  className={'h-4 w-4 sm:h-5 sm:w-5 ' + (i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300')}
                />
              ))}
            </div>

            <div className="bg-orange-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-orange-700 text-sm sm:text-base">{score}</span>
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
                <div className="bg-[#FF8844] text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                  🔥 {combo}x Combo!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

                    {/* Main Game Area */}
          <div className={'flex-1 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-8 bg-[#FFEEDD] rounded-xl p-3 sm:p-6 ' + (isFullscreen ? 'min-h-[600px]' : 'min-h-[500px]')}>
            {/* Target Word Card */}
            <motion.div 
              key={currentWord.word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={'bg-white rounded-3xl shadow-xl p-3 sm:p-4 ' + (isFullscreen ? 'p-6 ' : '') + 'border-4 border-[#FF8844] flex-shrink-0 self-center w-full lg:w-auto '}
            >
              <div className={'w-32 h-32 sm:w-48 sm:h-48 ' + (isFullscreen ? 'w-64 h-64 ' : '') + 'rounded-2xl bg-orange-50 flex items-center justify-center overflow-hidden mb-3 mx-auto'}>
                <img 
                  src={'/images/primary/3.7/' + currentWord.file} 
                  alt={currentWord.word}
                  className={'w-28 h-28 sm:w-40 sm:h-40 ' + (isFullscreen ? 'w-56 h-56 ' : '') + 'object-contain'}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                {showTurkish ? (
                  <p className={(isFullscreen ? 'text-xl' : 'text-base') + ' font-semibold text-slate-700'}>{currentWord.turkish}</p>
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

            {/* Game Play Area — basket coords use this region only */}
            <div
              ref={playAreaRef}
              className={'flex-1 relative overflow-hidden touch-none ' + (isFullscreen ? 'min-h-[600px]' : 'min-h-[500px]') + ' rounded-xl bg-[#FFEEDD] border-4 border-[#FF8844]'}>
              {!gameStarted && !gameOver && !gameWon && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-[#FF8844] hover:bg-[#FF7733] text-white text-xl px-8 py-6 rounded-2xl shadow-xl"
                  >
                    🎯 Start Game!
                  </Button>
                </div>
              )}

              {/* Instructions */}
              {gameStarted && !gameOver && !gameWon && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-4 py-2 rounded-lg text-xs text-center shadow-md max-w-[95%]">
                  Move inside this play area (mouse wheel / keys work here) to slide the catcher
                </div>
              )}

              {/* Falling Words */}
              {gameStarted && (
                <AnimatePresence initial={false}>
                  {fallingWords.map((word) => {
                const style = wordStyles[word.styleIndex];
                const sizeClasses = isFullscreen ? 'px-8 py-6 text-2xl' : 'px-4 py-3 text-lg';
                const fullClassName = 'absolute falling-word ' + style.bg + ' ' + style.text + ' ' + style.border + ' border-2 rounded-lg ' + sizeClasses + ' font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform';
                const leftPercent = word.x + '%';
                const topPercent = word.y + '%';
                return (
                  <motion.div
                    key={word.id}
                    layout={false}
                    className={fullClassName}
                    style={{
                      left: leftPercent,
                      top: topPercent,
                      transform: 'translateX(-50%)',
                    }}
                    onClick={() => catchWord(word)}
                    data-testid={'falling-word-' + word.word}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.2, filter: "blur(10px)", rotate: -8, transition: { duration: 0.28 } }}
                  >
                    {getDisplayWord(word.word)}
                  </motion.div>
                );
              })}
                </AnimatePresence>
              )}

              {/* Falling Prizes */}
              {gameStarted && (
                <AnimatePresence initial={false}>
                  {fallingPrizes.map((prize) => {
                const prizeConfig = {
                  'extra-heart': { 
                    symbol: '❤️', 
                    bg: 'bg-red-500', 
                    text: 'text-white', 
                    border: 'border-red-600',
                    label: '+1'
                  },
                  'extra-time': { 
                    symbol: '⭐', 
                    bg: 'bg-blue-500', 
                    text: 'text-white', 
                    border: 'border-blue-600',
                    label: '+20'
                  },
                  'bomb': { 
                    symbol: '💣', 
                    bg: 'bg-gray-800', 
                    text: 'text-white', 
                    border: 'border-black',
                    label: '-2'
                  },
                  'minus-time': { 
                    symbol: '⏰', 
                    bg: 'bg-orange-600', 
                    text: 'text-white', 
                    border: 'border-orange-800',
                    label: '-15'
                  }
                };
                const config = prizeConfig[prize.type];
                const sizeClasses = isFullscreen ? 'px-6 py-6 text-3xl' : 'px-4 py-4 text-2xl';
                const fullClassName = 'absolute falling-prize ' + config.bg + ' ' + config.text + ' ' + config.border + ' border-2 rounded-full ' + sizeClasses + ' font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform flex flex-col items-center justify-center gap-1';
                const leftPercent = prize.x + '%';
                const topPercent = prize.y + '%';
                return (
                  <motion.div
                    key={prize.id}
                    layout={false}
                    className={fullClassName}
                    style={{
                      left: leftPercent,
                      top: topPercent,
                      transform: 'translateX(-50%)',
                    }}
                    onClick={() => catchPrize(prize)}
                    data-testid={'falling-prize-' + prize.type}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.15, filter: "blur(8px)", rotate: 220, transition: { duration: 0.26 } }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-2xl sm:text-3xl">{config.symbol}</span>
                    <span className="text-xs sm:text-sm whitespace-nowrap">{config.label}</span>
                  </motion.div>
                );
              })}
                </AnimatePresence>
              )}

              {/* Catcher - Simple Horizontal Rectangle */}
              {gameStarted && (
                <div
                  ref={basketRef}
                  className={'absolute ' + (isFullscreen ? 'bottom-8' : 'bottom-4') + ' z-10 pointer-events-none'}
                  style={{ left: basketPosition + '%', transform: 'translateX(-50%)' }}
                >
                  {/* Simple horizontal rectangle - orange theme - thinner for better playability */}
                  <div className={(isFullscreen ? 'w-64 h-10' : 'w-48 h-8') + ' bg-[#FF8844] rounded-lg border-4 border-[#FF7733] shadow-xl'}></div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="primary-school-game-footer flex-shrink-0 mt-auto">
            <div className="footer-content">
              <div className="footer-left">
                <Button onClick={shareGame} variant="outline" className="footer-button">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button onClick={challengeFriends} variant="outline" className="footer-button">
                  <Zap className="h-4 w-4" /> Challenge
                </Button>
              </div>
              <div className="footer-right">
                <Button onClick={resetGame} variant="outline" className="footer-button">
                  <RefreshCw className="h-4 w-4" /> New Game
                </Button>
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-3/unit-7/games")}>
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
                    ? `You caught all ${totalWords} words!` 
                    : "Don't give up! Try again!"}
                </p>

                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-orange-700">{score} points</span>
                  </div>
                  <div className="text-sm space-y-2 border-t border-gray-200 pt-3 text-left">
                    <p className="text-gray-600">
                      Total score counts streak bonuses on consecutive correct catches, plus falling bonuses or penalties you collected during play.
                    </p>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Words cleared</span>
                      <span className="font-semibold text-green-600">{(gameWon ? totalWords : wordsCompleted)} / {totalWords}</span>
                    </div>
                    {hintsUsed > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hints used (during play)</span>
                        <span className="font-semibold text-orange-500">{hintsUsed} × −{hintPenalty} pts</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={resetGame}
                    size="lg"
                    className="w-full bg-[#FF8844] hover:bg-[#FF7733] text-white rounded-xl"
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setLocation("/primary-school/grade-3/unit-7/games")}
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
