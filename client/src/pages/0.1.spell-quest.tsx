import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Zap, Sparkles, Volume2, Star, Trophy, ChevronRight, RotateCcw } from "lucide-react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "../styles/0.1.spell-quest.css";

interface VocabWord {
  word: string;
  turkish: string;
  file: string;
}

const vocabulary: VocabWord[] = [
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

const letterColors = [
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-yellow-400 to-yellow-600",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-red-400 to-red-600",
];

export default function ColorsSpellQuestGame() {
  const [, setLocation] = useLocation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<{ letter: string; id: number; used: boolean; color: string }[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; id: number; color: string }[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [shuffledVocab, setShuffledVocab] = useState<VocabWord[]>([]);

  const currentWord = shuffledVocab[currentWordIndex];

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    setShuffledVocab(shuffled);
    setCurrentWordIndex(0);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
    setSelectedLetters([]);
    setIsCorrect(false);
    setIsWrong(false);
    setShowHint(false);
    
    if (shuffled.length > 0) {
      scrambleWord(shuffled[0].word);
    }
  };

  const scrambleWord = (word: string) => {
    const letters = word.split("").map((letter, idx) => ({
      letter,
      id: idx,
      used: false,
      color: letterColors[idx % letterColors.length],
    }));
    
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setScrambledLetters(shuffled);
    setSelectedLetters([]);
    setIsCorrect(false);
    setIsWrong(false);
    setShowHint(false);
  };

  const speakWord = (word: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis?.speak(utterance);
  };

  const handleLetterClick = (letter: { letter: string; id: number; color: string }) => {
    if (isCorrect) return;
    
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);
    
    setScrambledLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, used: true } : l)
    );
    
    const audio = new Audio("/sounds/pop.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});

    if (newSelected.length === currentWord.word.length) {
      const spelled = newSelected.map(l => l.letter).join("");
      
      if (spelled === currentWord.word) {
        setIsCorrect(true);
        setScore(prev => prev + (10 * (streak + 1)));
        setStreak(prev => prev + 1);
        
        const successAudio = new Audio("/sounds/bell.mp3");
        successAudio.volume = 0.5;
        successAudio.play().catch(() => {});
        
        speakWord(currentWord.word);
        
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FFD700", "#FF69B4", "#00BFFF", "#32CD32"],
        });
      } else {
        setIsWrong(true);
        setStreak(0);
        
        const errorAudio = new Audio("/sounds/wrong.mp3");
        errorAudio.volume = 0.3;
        errorAudio.play().catch(() => {});
        
        setTimeout(() => {
          setIsWrong(false);
          scrambleWord(currentWord.word);
        }, 800);
      }
    }
  };

  const handleRemoveLetter = (index: number) => {
    if (isCorrect) return;
    
    const letterToRemove = selectedLetters[index];
    
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    
    setScrambledLetters(prev =>
      prev.map(l => l.id === letterToRemove.id ? { ...l, used: false } : l)
    );
  };

  const nextWord = () => {
    if (currentWordIndex < shuffledVocab.length - 1) {
      const newIndex = currentWordIndex + 1;
      setCurrentWordIndex(newIndex);
      scrambleWord(shuffledVocab[newIndex].word);
    } else {
      setGameComplete(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#FFD700", "#FFA500", "#FF69B4", "#00BFFF", "#32CD32"],
      });
    }
  };

  const shareGame = () => {
    const text = `I scored ${score} points on Spell Quest Colours! Can you beat my score? 🎨`;
    if (navigator.share) {
      navigator.share({ title: "Spell Quest - Colours", text, url: window.location.href });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `Challenge me on Spell Quest Colours! I scored ${score} points - can you do better? 🏆`;
    if (navigator.share) {
      navigator.share({ title: "Spell Quest Challenge", text, url: window.location.href });
    } else {
      alert(text);
    }
  };

  if (!currentWord && !gameComplete) {
    return (
      <Layout>
        <div className="spell-quest-colors-wrapper">
          <div className="loading">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="spell-quest-colors-wrapper" id="spell-quest-colors-game">
        <div className="spell-quest-container">
          {/* Header */}
          <div className="game-header">
            <div className="header-left">
              <h1 className="game-title">
                <Sparkles className="sparkle-icon" />
                Spell Quest
              </h1>
              <p className="game-subtitle">Pre-School & 1st Grade - Theme: Colours</p>
            </div>
            
            <div className="game-stats">
              <div className="stat-item score-stat">
                <Star className="stat-icon" />
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item progress-stat">
                <span className="stat-label">Word</span>
                <span className="stat-value">{currentWordIndex + 1} / {shuffledVocab.length}</span>
              </div>
              {streak > 1 && (
                <div className="stat-item streak-stat">
                  <span className="streak-fire">🔥</span>
                  <span className="stat-value">x{streak}</span>
                </div>
              )}
            </div>
            
            <div className="fullscreen-btn-wrapper">
              <FullscreenButton containerId="spell-quest-colors-game" />
            </div>
          </div>

          {/* Main Game Area */}
          {!gameComplete && currentWord && (
            <div className="game-main">
              {/* Picture and Hint Area */}
              <div className="picture-area">
                <motion.div 
                  className="picture-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={currentWord.word}
                >
                  <img 
                    src={`/images/0.1/${currentWord.file}`} 
                    alt={currentWord.turkish}
                    className="word-image"
                  />
                  <div className="turkish-hint">
                    <span className="hint-label">Türkçe:</span>
                    <span className="hint-text">{currentWord.turkish}</span>
                  </div>
                </motion.div>
                
                <div className="action-buttons">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hint-btn"
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? "Hide" : "Show"} First Letter
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="sound-btn"
                    onClick={() => speakWord(currentWord.word)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {showHint && (
                  <motion.div 
                    className="first-letter-hint"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Starts with: <strong>{currentWord.word[0]}</strong>
                  </motion.div>
                )}
              </div>

              {/* Spelling Area */}
              <div className="spelling-area">
                {/* Answer slots */}
                <div className="answer-slots">
                  {currentWord.word.split("").map((_, index) => (
                    <motion.div
                      key={index}
                      className={`answer-slot ${selectedLetters[index] ? "filled" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                      onClick={() => selectedLetters[index] && handleRemoveLetter(index)}
                      whileHover={selectedLetters[index] ? { scale: 1.05 } : {}}
                      whileTap={selectedLetters[index] ? { scale: 0.95 } : {}}
                    >
                      <AnimatePresence mode="wait">
                        {selectedLetters[index] && (
                          <motion.span
                            key={selectedLetters[index].id}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className={`slot-letter ${selectedLetters[index].color}`}
                          >
                            {selectedLetters[index].letter}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Scrambled letters */}
                <div className="letter-bank">
                  {scrambledLetters.map((letterObj) => (
                    <motion.button
                      key={letterObj.id}
                      className={`letter-tile ${letterObj.color} ${letterObj.used ? "used" : ""}`}
                      onClick={() => !letterObj.used && handleLetterClick(letterObj)}
                      whileHover={!letterObj.used ? { scale: 1.1, rotate: [-2, 2, -2, 0] } : {}}
                      whileTap={!letterObj.used ? { scale: 0.9 } : {}}
                      disabled={letterObj.used}
                      data-testid={`letter-tile-${letterObj.letter}-${letterObj.id}`}
                    >
                      {letterObj.letter}
                    </motion.button>
                  ))}
                </div>

                {/* Reset button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="reset-btn"
                  onClick={() => scrambleWord(currentWord.word)}
                >
                  <RotateCcw className="h-4 w-4" /> Reset Letters
                </Button>
              </div>

              {/* Success overlay */}
              <AnimatePresence>
                {isCorrect && (
                  <motion.div
                    className="success-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="success-content"
                      initial={{ scale: 0.5, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                    >
                      <div className="success-stars">⭐ ⭐ ⭐</div>
                      <h2 className="success-title">Perfect!</h2>
                      <p className="success-word">{currentWord.word}</p>
                      <Button
                        className="next-btn"
                        onClick={nextWord}
                        data-testid="button-next-word"
                      >
                        {currentWordIndex < shuffledVocab.length - 1 ? (
                          <>Next Word <ChevronRight className="h-5 w-5" /></>
                        ) : (
                          <>Finish! <Trophy className="h-5 w-5" /></>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Game Complete Screen */}
          {gameComplete && (
            <motion.div
              className="complete-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="complete-content">
                <div className="trophy-container">
                  <Trophy className="trophy-icon" />
                </div>
                <h2 className="complete-title">Quest Complete!</h2>
                <p className="complete-subtitle">You spelled all the colours!</p>
                
                <div className="final-stats">
                  <div className="final-stat">
                    <span className="final-stat-label">Total Score</span>
                    <span className="final-stat-value">{score}</span>
                  </div>
                  <div className="final-stat">
                    <span className="final-stat-label">Words Spelled</span>
                    <span className="final-stat-value">{shuffledVocab.length}</span>
                  </div>
                </div>

                <div className="complete-buttons">
                  <Button onClick={startNewGame} className="play-again-btn" data-testid="button-play-again">
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/pre-school/games")}>
                    Back to Games
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="game-footer">
            <div className="footer-buttons">
              <Button onClick={shareGame} variant="outline" className="footer-button" data-testid="button-share">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button onClick={challengeFriend} variant="outline" className="footer-button" data-testid="button-challenge">
                <Zap className="h-4 w-4" /> Challenge
              </Button>
              <Button onClick={startNewGame} variant="outline" className="footer-button" data-testid="button-new-game">
                New Game
              </Button>
            </div>
            <Button variant="ghost" className="back-link" onClick={() => setLocation("/pre-school/games")}>
              ← Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
