import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Zap, Volume2, Trophy, Star, Heart, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import "@/styles/2.1.catch-that.css";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

// Vocabulary from 2.5 (Homes, Houses, Neighbourhoods)
const vocabulary = [
  { word: "HOUSE", turkish: "ev", file: "house.png" },
  { word: "GARDEN", turkish: "bahçe", file: "garden.png" },
  { word: "LIVINGROOM", turkish: "oturma odası", file: "living room.png" },
  { word: "DININGROOM", turkish: "yemek odası", file: "dining room.png" },
  { word: "BEDROOM", turkish: "yatak odası", file: "bedroom.png" },
  { word: "BATHROOM", turkish: "banyo", file: "bathroom.png" },
  { word: "KITCHEN", turkish: "mutfak", file: "kitchen.png" },
  { word: "DOOR", turkish: "kapı", file: "door.png" },
  { word: "WINDOW", turkish: "pencere", file: "window.png" },
  { word: "SOFA", turkish: "kanepe", file: "sofa.png" },
  { word: "BED", turkish: "yatak", file: "bed.png" },
  { word: "CHAIR", turkish: "sandalye", file: "chair.png" },
  { word: "COFFEETABLE", turkish: "sehpa", file: "coffee table.png" },
  { word: "DOG", turkish: "köpek", file: "dog.png" },
  { word: "CAT", turkish: "kedi", file: "cat.png" },
  { word: "GOLDFISH", turkish: "japon balığı", file: "goldfish.png" },
  { word: "BIRD", turkish: "kuş", file: "bird.png" },
  { word: "RABBIT", turkish: "tavşan", file: "rabbit.png" },
  { word: "TURTLE", turkish: "kaplumbağa", file: "turtle.png" },
  { word: "PAW", turkish: "pati", file: "paw.png" },
  { word: "CLAW", turkish: "pençe", file: "claw.png" },
  { word: "TAIL", turkish: "kuyruk", file: "tail.png" },
  { word: "WHISKERS", turkish: "bıyık", file: "whiskers.png" },
  { word: "BEAK", turkish: "gaga", file: "beak.png" },
  { word: "FUR", turkish: "kürk", file: "fur.png" },
  { word: "WINGS", turkish: "kanatlar", file: "wings.png" },
  { word: "WHERE", turkish: "nerede", file: "where.png" },
  { word: "FIND", turkish: "bul", file: "find.png" },
  { word: "HERE", turkish: "burada", file: "here.png" },
  { word: "HAPPY", turkish: "mutlu", file: "happy.png" },
];

// Word style colors - varied backgrounds for visual appeal
const wordStyles = [
  { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" },
  { bg: "bg-green-500", text: "text-white", border: "border-green-600" },
  { bg: "bg-purple-500", text: "text-white", border: "border-purple-600" },
  { bg: "bg-orange-500", text: "text-white", border: "border-orange-600" },
  { bg: "bg-pink-500", text: "text-white", border: "border-pink-600" },
  { bg: "bg-cyan-500", text: "text-white", border: "border-cyan-600" },
  { bg: "bg-red-500", text: "text-white", border: "border-red-600" },
  { bg: "bg-indigo-500", text: "text-white", border: "border-indigo-600" },
  { bg: "bg-teal-500", text: "text-white", border: "border-teal-600" },
  { bg: "bg-amber-500", text: "text-white", border: "border-amber-600" },
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

export default function CatchThatGame2_5() {
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
  const [showPictureCard, setShowPictureCard] = useState(false);
  const [pictureCardTimer, setPictureCardTimer] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // Speed boost multiplier
  const isMiddleMouseDownRef = useRef(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const missedCorrectWordsRef = useRef<Set<string>>(new Set());
  const pictureCardTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#10b981", "#34d399"]
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

  const catchWord = useCallback((word: FallingWord) => {
    if (word.caught || gameOver || gameWon) return;

    setFallingWords(prev => prev.map(w => 
      w.id === word.id ? { ...w, caught: true } : w
    ));

    // Verify correctness against current word (safety check in case word changed)
    const isActuallyCorrect = word.word === currentWord.word;

    if (isActuallyCorrect && word.isCorrect) {
      const comboBonus = combo >= 2 ? combo : 1;
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
        colors: ["#3b82f6", "#60a5fa", "#10b981"]
      });

      // Show picture card with timer instead of immediately moving to next word
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
    setFallingWords([]);
    setFallingPrizes([]);
    setShowPictureCard(false);
    setPictureCardTimer(0);
    setSpeedMultiplier(1); // Reset speed multiplier
    isMiddleMouseDownRef.current = false; // Reset middle mouse state
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
    if (pictureCardTimerRef.current) {
      clearInterval(pictureCardTimerRef.current);
      pictureCardTimerRef.current = null;
    }
    startGame();
  }, [startGame]);

  // Handle keyboard input for basket movement and speed boost
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketPosition(prev => Math.max(10, prev - 5));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketPosition(prev => Math.min(90, prev + 5));
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
  }, [gameStarted, gameOver, gameWon]);

  // Handle mouse/touch movement for basket and speed boost with middle mouse scroll
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

    const gameArea = gameAreaRef.current;
    gameArea.addEventListener('mousemove', handleMouseMove);
    gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });
    gameArea.addEventListener('wheel', handleWheel, { passive: false });
    gameArea.addEventListener('mousedown', handleMouseDown);
    gameArea.addEventListener('mouseup', handleMouseUp);
    // Also listen on window for mouseup in case mouse is released outside game area
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      gameArea.removeEventListener('mousemove', handleMouseMove);
      gameArea.removeEventListener('touchmove', handleTouchMove);
      gameArea.removeEventListener('wheel', handleWheel);
      gameArea.removeEventListener('mousedown', handleMouseDown);
      gameArea.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameStarted, gameOver, gameWon]);

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
      
      // Double-check: Only penalize if this is actually the correct word
      // Never penalize for missing incorrect words
      if (!word.isCorrect || !isActuallyCorrect) {
        return; // Early return - don't penalize for incorrect words
      }
      
      // Additional safety check: verify the word matches current word exactly
      if (word.word !== currentWord.word) {
        return; // Safety check - word doesn't match, don't penalize
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
            const basketCatchWidth = isFullscreen ? 8 : 12; // Smaller catch width in fullscreen
            const basketLeft = basketPosition - basketCatchWidth;
            const basketRight = basketPosition + basketCatchWidth;
            
            if (!word.caught && word.x >= basketLeft && word.x <= basketRight) {
              catchWord(word);
              return { ...word, caught: true };
            }
          }
          
          if (newY >= 85 && !word.caught) {
            const caughtWord = { ...word, caught: true };
            const isActuallyCorrect = word.word === currentWord.word;
            
            // Only penalize for missing CORRECT words - never penalize for missing incorrect words
            if (isActuallyCorrect && word.isCorrect === true && !missedCorrectWordsRef.current.has(word.id)) {
              handleMissedCorrectWord(caughtWord);
            }
            // If word is incorrect, just remove it without penalty
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
            const basketCatchWidth = isFullscreen ? 8 : 12; // Smaller catch width in fullscreen
            const basketLeft = basketPosition - basketCatchWidth;
            const basketRight = basketPosition + basketCatchWidth;
            
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
  }, [gameStarted, gameOver, gameWon, basketPosition, catchWord, catchPrize, currentWord, isFullscreen, speedMultiplier]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
        {/* Background - Blue/Sky theme for primary school */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-200 to-cyan-100 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-300 to-transparent opacity-50" />
          <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 cloud-float" />
          <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70 cloud-float-delayed" />
          <div className="absolute top-5 left-1/3 w-24 h-12 bg-white rounded-full opacity-75 cloud-float" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 min-h-0 p-2 sm:p-4">
          <PrimarySchoolGameHeader 
            gameName="Catch That"
            description="2nd Grade - Theme 5: Homes, Houses, Neighbourhoods"
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
          <div className={'flex-1 flex flex-col lg:flex-row items-stretch gap-4 lg:gap-8 bg-gradient-to-b from-sky-50 to-green-100/30 rounded-xl p-3 sm:p-6 ' + (isFullscreen ? 'min-h-[600px]' : 'min-h-[500px]')}>
            {/* Target Word Card */}
            <motion.div 
              key={currentWord.word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={'bg-white rounded-3xl shadow-xl p-3 sm:p-4 ' + (isFullscreen ? 'p-6 ' : '') + 'border-4 border-blue-300 flex-shrink-0 self-center w-full lg:w-auto ' + (showPictureCard ? 'ring-4 ring-blue-400 ring-opacity-75' : '')}
            >
              <div className={'w-32 h-32 sm:w-48 sm:h-48 ' + (isFullscreen ? 'w-64 h-64 ' : '') + 'rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden mb-3 mx-auto'}>
                <img 
                  src={'/images/primary/2.5/' + currentWord.file} 
                  alt={currentWord.word}
                  className={'w-28 h-28 sm:w-40 sm:h-40 ' + (isFullscreen ? 'w-56 h-56 ' : '') + 'object-contain'}
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
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-8 py-6 rounded-2xl shadow-xl"
                  >
                    🎯 Start Game!
                  </Button>
                </div>
              )}

              {/* Instructions */}
              {gameStarted && !gameOver && !gameWon && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 px-4 py-2 rounded-lg text-xs text-center shadow-md">
                  Use your mouse or ← → keys to move the catcher, ↓ key to speed up the words
                </div>
              )}

              {/* Falling Words */}
              {gameStarted && fallingWords.map((word) => {
                const style = wordStyles[word.styleIndex];
                const sizeClasses = isFullscreen ? 'px-8 py-6 text-2xl' : 'px-4 py-3 text-lg';
                const fullClassName = 'absolute falling-word ' + style.bg + ' ' + style.text + ' ' + style.border + ' border-2 rounded-lg ' + sizeClasses + ' font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform';
                const leftPercent = word.x + '%';
                const topPercent = word.y + '%';
                return (
                  <motion.div
                    key={word.id}
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
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    {getDisplayWord(word.word)}
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
                  {/* Simple horizontal rectangle - blue theme - thinner for better playability */}
                  <div className={(isFullscreen ? 'w-64 h-10' : 'w-48 h-8') + ' bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg border-4 border-blue-700 shadow-xl'}></div>
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
                <Button onClick={() => {}} variant="outline" className="footer-button">
                  <Zap className="h-4 w-4" /> Challenge
                </Button>
              </div>
              <div className="footer-right">
                <Button onClick={resetGame} variant="outline" className="footer-button">
                  <RefreshCw className="h-4 w-4" /> New Game
                </Button>
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-2/theme-5/games")}>
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

                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-blue-700">{score} points</span>
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
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setLocation("/primary-school/grade-2/theme-5/games")}
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

