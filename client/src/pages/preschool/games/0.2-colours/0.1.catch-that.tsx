import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Zap, Volume2, Trophy, Star, Heart, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { PreschoolGameHeader } from "@/components/PreschoolGameHeader";
import "@/styles/0.1.catch-that.css";
import "@/styles/preschool-game-header.css";
import "@/styles/preschool-game-footer.css";

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

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  "RED": { bg: "bg-red-500", text: "text-white", border: "border-red-600" },
  "BLUE": { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" },
  "YELLOW": { bg: "bg-yellow-400", text: "text-gray-800", border: "border-yellow-500" },
  "GREEN": { bg: "bg-green-500", text: "text-white", border: "border-green-600" },
  "ORANGE": { bg: "bg-orange-500", text: "text-white", border: "border-orange-600" },
  "PURPLE": { bg: "bg-purple-500", text: "text-white", border: "border-purple-600" },
  "PINK": { bg: "bg-pink-500", text: "text-white", border: "border-pink-600" },
  "BROWN": { bg: "bg-amber-700", text: "text-white", border: "border-amber-800" },
  "GRAY": { bg: "bg-gray-500", text: "text-white", border: "border-gray-600" },
  "WHITE": { bg: "bg-white", text: "text-gray-800", border: "border-gray-300" },
  "BLACK": { bg: "bg-gray-900", text: "text-white", border: "border-black" },
};

interface FallingColor {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  isCorrect: boolean;
  caught: boolean;
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

export default function ColorsCatchGame() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(10);
  const [currentWord, setCurrentWord] = useState(() => vocabulary[Math.floor(Math.random() * vocabulary.length)]);
  const [fallingColors, setFallingColors] = useState<FallingColor[]>([]);
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
  const [showPictureCard, setShowPictureCard] = useState(false);
  const [pictureCardTimer, setPictureCardTimer] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const missedCorrectWordsRef = useRef<Set<string>>(new Set());
  const pictureCardTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalWords = 8;
  const hintPenalty = 5;
  const correctPoints = 10;
  const noHintBonus = 5;
  const spawnInterval = 1500; // milliseconds between spawns
  const prizeSpawnInterval = 4000; // milliseconds between prize spawns (less frequent)
  const prizeSpawnChance = 0.1; // 10% chance to spawn a prize instead of a color word
  const fallSpeed = 0.25; // pixels per frame (slower for easier catching)

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

  const spawnColor = useCallback(() => {
    if (!gameStarted || gameOver || gameWon) return;

    const wrongWords = getRandomWords(currentWord.word, 2);
    const allWords = [currentWord.word, ...wrongWords].sort(() => Math.random() - 0.5);
    
    // Randomly select one word to spawn
    const wordToSpawn = allWords[Math.floor(Math.random() * allWords.length)];
    const isCorrect = wordToSpawn === currentWord.word;

    const newColor: FallingColor = {
      id: `${Date.now()}-${Math.random()}`,
      word: wordToSpawn,
      x: 10 + Math.random() * 80, // Random horizontal position (10% to 90%)
      y: 0,
      speed: fallSpeed + Math.random() * 0.1, // Slight variation in speed
      isCorrect,
      caught: false,
    };

    setFallingColors(prev => [...prev, newColor]);
  }, [currentWord, gameStarted, gameOver, gameWon]);

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
      speed: fallSpeed + Math.random() * 0.1, // Slight variation in speed
      caught: false,
    };

    setFallingPrizes(prev => [...prev, newPrize]);
  }, [gameStarted, gameOver, gameWon]);

  const nextWord = useCallback(() => {
    // Clear picture card timer if it exists
    if (pictureCardTimerRef.current) {
      clearInterval(pictureCardTimerRef.current);
      pictureCardTimerRef.current = null;
    }
    
    if (wordsCompleted + 1 >= totalWords) {
      setGameWon(true);
      setShowPictureCard(false);
      setPictureCardTimer(0);
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
    
    // Clear all falling colors when word changes to prevent incorrect correct/incorrect evaluation
    // Colors spawned with the old word would have incorrect isCorrect flags
    setFallingColors([]);
    setFallingPrizes([]);
    
    setCurrentWord(next);
    setUsedWords(prev => [...prev, next.word]);
    setShowTurkish(false);
    setWordsCompleted(prev => prev + 1);
    setShowPictureCard(false);
    setPictureCardTimer(0);
    // Clear the missed words tracking for the new word
    missedCorrectWordsRef.current.clear();
  }, [currentWord, wordsCompleted, usedWords]);

  const startPictureCardDisplay = useCallback(() => {
    // Random timer between 1-10 seconds
    const randomSeconds = Math.floor(Math.random() * 10) + 1;
    setShowPictureCard(true);
    setPictureCardTimer(randomSeconds);

    // Countdown timer
    let remaining = randomSeconds;
    const timerInterval = setInterval(() => {
      remaining -= 1;
      setPictureCardTimer(remaining);
      
      if (remaining <= 0) {
        clearInterval(timerInterval);
        pictureCardTimerRef.current = null;
        // Move to next word after timer expires
        nextWord();
      }
    }, 1000);

    pictureCardTimerRef.current = timerInterval;
  }, [nextWord]);

  const catchColor = useCallback((color: FallingColor) => {
    if (color.caught || gameOver || gameWon) return;

    setFallingColors(prev => prev.map(c => 
      c.id === color.id ? { ...c, caught: true } : c
    ));

    // Verify correctness against current word (safety check in case word changed)
    // This ensures colors are evaluated against the current word, not the word they were spawned with
    const isActuallyCorrect = color.word === currentWord.word;

    if (isActuallyCorrect && color.isCorrect) {
      const comboBonus = combo >= 2 ? combo : 1;
      setScore(prev => prev + (correctPoints * comboBonus));
      setCombo(prev => prev + 1);
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 1000);
      
      speakWord(color.word);
      
      const audio = new Audio("/sounds/bell.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: color.x / 100, y: 0.9 },
        colors: ["#fbbf24", "#f59e0b", "#fcd34d"]
      });

      // Show picture card with timer instead of immediately moving to next word
      // Only start picture card display if not already showing one
      if (!showPictureCard) {
        setTimeout(() => {
          startPictureCardDisplay();
        }, 800);
      }
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
        // Fallback to wrong.mp3 if error.mp3 doesn't exist
        const fallbackAudio = new Audio("/sounds/wrong.mp3");
        fallbackAudio.volume = 0.7;
        fallbackAudio.play().catch(() => {});
      });
    }
  }, [combo, gameOver, gameWon, speakWord, startPictureCardDisplay, showPictureCard, currentWord]);

  const catchPrize = useCallback((prize: FallingPrize) => {
    if (prize.caught || gameOver || gameWon) return;

    setFallingPrizes(prev => prev.map(p => 
      p.id === prize.id ? { ...p, caught: true } : p
    ));

    switch (prize.type) {
      case 'extra-heart':
        setLives(prev => Math.min(10, prev + 1)); // Max 10 lives
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: prize.x / 100, y: 0.9 },
          colors: ["#ef4444", "#f87171", "#fca5a5"]
        });
        break;
      case 'extra-time':
        // Add bonus points as "extra time" reward
        setScore(prev => prev + 20);
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: prize.x / 100, y: 0.9 },
          colors: ["#3b82f6", "#60a5fa", "#93c5fd"]
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
        // Play short error sound when bomb is caught
        const bombAudio = new Audio("/sounds/error.mp3");
        bombAudio.volume = 0.7;
        bombAudio.play().catch((err) => {
          console.error("Error sound failed, trying wrong.mp3:", err);
          const fallbackAudio = new Audio("/sounds/wrong.mp3");
          fallbackAudio.volume = 0.7;
          fallbackAudio.play().catch(() => {});
        });
        break;
      case 'minus-time':
        setScore(prev => Math.max(0, prev - 15));
        setCombo(0);
        // Play short error sound when minus-time prize is caught
        const minusAudio = new Audio("/sounds/error.mp3");
        minusAudio.volume = 0.7;
        minusAudio.play().catch((err) => {
          console.error("Error sound failed, trying wrong.mp3:", err);
          const fallbackAudio = new Audio("/sounds/wrong.mp3");
          fallbackAudio.volume = 0.7;
          fallbackAudio.play().catch(() => {});
        });
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
    setFallingColors([]);
    setFallingPrizes([]);
    setShowPictureCard(false);
    setPictureCardTimer(0);
    missedCorrectWordsRef.current.clear();
    if (pictureCardTimerRef.current) {
      clearInterval(pictureCardTimerRef.current);
      pictureCardTimerRef.current = null;
    }
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setCurrentWord(randomWord);
    setUsedWords([randomWord.word]);
    setBasketPosition(50);
  }, []);

  const resetGame = useCallback(() => {
    // Clear picture card timer if it exists
    if (pictureCardTimerRef.current) {
      clearInterval(pictureCardTimerRef.current);
      pictureCardTimerRef.current = null;
    }
    startGame();
  }, [startGame]);

  // Handle keyboard input for basket movement
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketPosition(prev => Math.max(10, prev - 5));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketPosition(prev => Math.min(90, prev + 5));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, gameWon]);

  // Handle mouse/touch movement for basket
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon || !gameAreaRef.current) return;

    const handleMove = (clientX: number) => {
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (!rect) return;
      const percentage = ((clientX - rect.left) / rect.width) * 100;
      setBasketPosition(Math.max(10, Math.min(90, percentage)));
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const gameArea = gameAreaRef.current;
    gameArea.addEventListener('mousemove', handleMouseMove);
    gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      gameArea.removeEventListener('mousemove', handleMouseMove);
      gameArea.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStarted, gameOver, gameWon]);

  // Spawn colors periodically
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
      return;
    }

    // Clear any existing interval first
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    // Start spawning colors (sometimes prizes instead)
    const spawn = () => {
      if (gameStarted && !gameOver && !gameWon) {
        // 30% chance to spawn a prize, 70% chance to spawn a color word
        if (Math.random() < prizeSpawnChance) {
          spawnPrize();
        } else {
          spawnColor();
        }
      }
    };
    
    spawnTimerRef.current = setInterval(spawn, spawnInterval);
    
    // Spawn first color immediately
    spawn();

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [gameStarted, gameOver, gameWon, spawnColor, spawnPrize, spawnInterval, prizeSpawnChance]);

  // Animate falling colors and prizes
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();
    
    // handleMissedCorrectColor needs access to currentWord, so we define it inside the effect
    const handleMissedCorrectColor = (color: FallingColor) => {
      // Triple-check: Verify against current word to ensure correctness
      // This prevents punishing for colors that were correct for the old word but wrong for the new word
      const isActuallyCorrect = color.word === currentWord.word;
      
      // Double-check: Only process if this is actually a correct color
      // This is a safety check to prevent wrong colors from being punished
      if (!color.isCorrect || !isActuallyCorrect) {
        console.warn("Attempted to punish for wrong color:", color.word, "Current word:", currentWord.word, "ID:", color.id);
        return;
      }
      
      // Check if we've already processed this missed color
      if (missedCorrectWordsRef.current.has(color.id)) {
        return;
      }
      
      // Mark as processed
      missedCorrectWordsRef.current.add(color.id);
      
      // Play short error sound when heart is lost
      const missAudio = new Audio("/sounds/error.mp3");
      missAudio.volume = 0.8;
      missAudio.play().catch((err) => {
        console.error("Error sound failed, trying wrong.mp3:", err);
        // Fallback to wrong.mp3 if error.mp3 doesn't exist
        const fallbackAudio = new Audio("/sounds/wrong.mp3");
        fallbackAudio.volume = 0.8;
        fallbackAudio.play().catch(() => {
          console.error("Fallback sound also failed");
        });
      });
      
      // Update state - lose a heart
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
      
      // Animate colors
      setFallingColors(prev => {
        const updated = prev.map(color => {
          if (color.caught) return color;
          // Use deltaTime for smooth animation regardless of frame rate
          const speedMultiplier = Math.min(deltaTime / 16, 2); // Normalize to 60fps, cap at 2x
          const newY = color.y + (color.speed * speedMultiplier);
          
          // Check for collision continuously as colors approach the bottom
          // Start checking from 80% down to catch colors even when basket is moving
          if (newY >= 80) {
            // Larger catch area to match actual basket width and be more forgiving
            // Basket is approximately 12-15% of screen width, so we use 15% for better edge detection
            const basketCatchWidth = 15; // Increased from 8 to 15 for better edge detection
            const basketLeft = basketPosition - basketCatchWidth;
            const basketRight = basketPosition + basketCatchWidth;
            
            // Check if color is within catch area (only if not already caught)
            if (!color.caught && color.x >= basketLeft && color.x <= basketRight) {
              catchColor(color);
              return { ...color, caught: true };
            }
          }
          
          // Check if color reached bottom (85% or beyond)
          // Only process missed colors once - check if already marked as caught to prevent double processing
          if (newY >= 85 && !color.caught) {
            // Mark as caught first to prevent any double processing
            const caughtColor = { ...color, caught: true };
            
            // Verify correctness against current word (safety check in case word changed)
            // This ensures colors are evaluated against the current word, not the word they were spawned with
            const isActuallyCorrect = color.word === currentWord.word;
            
            // Missed - lose a life ONLY if it was correct
            // Wrong colors that aren't caught should NOT cause punishment
            // Triple-check: Verify it's correct against current word AND not already processed
            if (isActuallyCorrect && color.isCorrect === true && !missedCorrectWordsRef.current.has(color.id)) {
              // Handle missed correct color immediately
              // Pass the caught color to ensure we're working with the right state
              handleMissedCorrectColor(caughtColor);
            }
            // Wrong colors (not correct against current word) that aren't caught are just removed without punishment
            // No punishment, no sound, just remove from screen silently
            return caughtColor; // Remove from screen
          }
          
          return { ...color, y: newY };
        });

        const filtered = updated.filter(c => !c.caught);
        return filtered;
      });

      // Animate prizes
      setFallingPrizes(prev => {
        const updated = prev.map(prize => {
          if (prize.caught) return prize;
          const speedMultiplier = Math.min(deltaTime / 16, 2);
          const newY = prize.y + (prize.speed * speedMultiplier);
          
          // Check for collision continuously as prizes approach the bottom
          // Start checking from 80% down to catch prizes even when basket is moving
          if (newY >= 80) {
            // Larger catch area to match actual basket width and be more forgiving
            const basketCatchWidth = 15; // Increased from 8 to 15 for better edge detection
            const basketLeft = basketPosition - basketCatchWidth;
            const basketRight = basketPosition + basketCatchWidth;
            
            // Check if prize is within catch area
            if (prize.x >= basketLeft && prize.x <= basketRight) {
              catchPrize(prize);
              return { ...prize, caught: true };
            }
          }
          
          // Check if prize reached bottom (85% or beyond)
          if (newY >= 85) {
            // Missed - remove from screen
            return { ...prize, caught: true };
          }
          
          return { ...prize, y: newY };
        });

        const filtered = updated.filter(p => !p.caught);
        return filtered;
      });

      // Continue animation loop
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
  }, [gameStarted, gameOver, gameWon, basketPosition, catchColor, catchPrize, currentWord]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const shareGame = () => {
    const text = `I scored ${score} points in Catch That! Can you beat my score? 🎨`;
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
        className={'color-catch-container' + (isFullscreen ? ' fullscreen-mode' : '')}
        id="color-catch-game"
        data-testid="color-catch-game"
      >
        {/* Background - Yellow/Amber theme for preschool */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-yellow-100 to-orange-100 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-300 to-transparent opacity-50" />
          <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 cloud-float" />
          <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70 cloud-float-delayed" />
          <div className="absolute top-5 left-1/3 w-24 h-12 bg-white rounded-full opacity-75 cloud-float" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 min-h-0 p-2 sm:p-4">
          <PreschoolGameHeader 
            gameName="Catch That"
            description="Pre-School & 1st Grade - Theme: Colours"
            containerId="color-catch-game"
            icon="🎨"
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

            <div className="bg-amber-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-amber-700 text-sm sm:text-base">{score}</span>
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
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                  🔥 {combo}x Combo!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Picture Card Timer Display */}
          <AnimatePresence>
            {showPictureCard && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold text-xl sm:text-2xl shadow-2xl flex items-center gap-3">
                  <span className="text-3xl">⏱️</span>
                  <span>Next word in: {pictureCardTimer}s</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Game Area */}
          <div className={'flex-1 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-8 bg-gradient-to-b from-amber-50 to-green-100/30 rounded-xl p-3 sm:p-6 ' + (isFullscreen ? 'min-h-[600px]' : 'min-h-[500px]')}>
            {/* Target Word Card */}
            <motion.div 
              key={currentWord.word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={'bg-white rounded-3xl shadow-xl p-3 sm:p-4 ' + (isFullscreen ? 'p-6 ' : '') + 'border-4 border-amber-300 flex-shrink-0 self-center w-full lg:w-auto ' + (showPictureCard ? 'ring-4 ring-blue-400 ring-opacity-75' : '')}
            >
              <div className={'w-32 h-32 sm:w-48 sm:h-48 ' + (isFullscreen ? 'w-96 h-96 ' : '') + 'rounded-2xl bg-amber-50 flex items-center justify-center overflow-hidden mb-3 mx-auto'}>
                <img 
                  src={'/images/preschool/vocab/0.2-colours/' + currentWord.file} 
                  alt={currentWord.word}
                  className={'w-28 h-28 sm:w-40 sm:h-40 ' + (isFullscreen ? 'w-80 h-80 ' : '') + 'object-contain'}
                />
              </div>
              {showPictureCard && (
                <div className="text-center mb-2">
                  <p className="text-sm sm:text-base font-bold text-blue-600 animate-pulse">
                    Catch the correct word!
                  </p>
                </div>
              )}
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
                    disabled={showPictureCard}
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
                  disabled={showPictureCard}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Game Play Area */}
            <div className={'flex-1 relative overflow-hidden ' + (isFullscreen ? 'min-h-[600px]' : 'min-h-[500px]') + ' rounded-xl bg-gradient-to-b from-sky-200 to-blue-100 border-4 border-blue-200'}>
              {!gameStarted && !gameOver && !gameWon && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xl px-8 py-6 rounded-2xl shadow-xl"
                  >
                    🎨 Start Game!
                  </Button>
                </div>
              )}

              {/* Instructions */}
              {gameStarted && !gameOver && !gameWon && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-4 py-2 rounded-lg text-xs text-center shadow-md">
                  Move mouse or use ← → keys to move basket
                </div>
              )}

              {/* Falling Colors */}
              {gameStarted && fallingColors.map((color) => {
                const colorStyle = colorMap[color.word];
                const bgClass = colorStyle ? colorStyle.bg : 'bg-gray-500';
                const textClass = colorStyle ? colorStyle.text : 'text-white';
                const borderClass = colorStyle ? colorStyle.border : 'border-gray-600';
                const sizeClasses = isFullscreen ? 'px-8 py-6 text-2xl' : 'px-4 py-3 text-lg';
                const fullClassName = 'absolute falling-color ' + bgClass + ' ' + textClass + ' ' + borderClass + ' border-2 rounded-lg ' + sizeClasses + ' font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform';
                const leftPercent = color.x + '%';
                const topPercent = color.y + '%';
                return (
                  <motion.div
                    key={color.id}
                    className={fullClassName}
                    style={{
                      left: leftPercent,
                      top: topPercent,
                      transform: 'translateX(-50%)',
                    }}
                    onClick={() => catchColor(color)}
                    data-testid={'falling-color-' + color.word}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    {color.word}
                  </motion.div>
                );
              })}

              {/* Falling Prizes */}
              {gameStarted && fallingPrizes.map((prize) => {
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
                    exit={{ opacity: 0, scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-2xl sm:text-3xl">{config.symbol}</span>
                    <span className="text-xs sm:text-sm whitespace-nowrap">{config.label}</span>
                  </motion.div>
                );
              })}

              {/* Catcher - Simple Horizontal Rectangle */}
              {gameStarted && (
                <div
                  ref={basketRef}
                  className={'absolute ' + (isFullscreen ? 'bottom-8' : 'bottom-4') + ' z-10 transition-all duration-100 ease-linear'}
                  style={{ left: basketPosition + '%', transform: 'translateX(-50%)' }}
                >
                  {/* Simple horizontal rectangle - maintaining 4:1 ratio, proportional scaling */}
                  <div className={(isFullscreen ? 'w-96 h-24' : 'w-48 h-12') + ' bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg border-4 border-amber-700 shadow-xl'}></div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="preschool-game-footer flex-shrink-0 mt-auto">
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
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/pre-school/games")}>
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
                    ? `You caught all ${totalWords} colors!` 
                    : "Don't give up! Try again!"}
                </p>

                <div className="bg-amber-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-amber-700">{score} points</span>
                  </div>
                  <div className="text-sm space-y-1 border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">✓ Correct catches:</span>
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
                    onClick={() => setLocation("/pre-school/games")}
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
