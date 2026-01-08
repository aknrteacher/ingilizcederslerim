import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Zap, Sparkles, Volume2, Star, Trophy, ChevronRight, RotateCcw } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "@/styles/2.1.spell-quest.css";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

interface VocabWord {
  word: string; // For spelling (no spaces, uppercase)
  displayWord: string; // For display/speech (original format)
  turkish: string;
  file: string;
}

// Vocabulary from 2.5 (Homes, Houses, Neighbourhoods)
const vocabulary: VocabWord[] = [
  { word: "HOUSE", displayWord: "house", turkish: "ev", file: "house.png" },
  { word: "GARDEN", displayWord: "garden", turkish: "bahçe", file: "garden.png" },
  { word: "LIVINGROOM", displayWord: "living room", turkish: "oturma odası", file: "living room.png" },
  { word: "DININGROOM", displayWord: "dining room", turkish: "yemek odası", file: "dining room.png" },
  { word: "BEDROOM", displayWord: "bedroom", turkish: "yatak odası", file: "bedroom.png" },
  { word: "BATHROOM", displayWord: "bathroom", turkish: "banyo", file: "bathroom.png" },
  { word: "KITCHEN", displayWord: "kitchen", turkish: "mutfak", file: "kitchen.png" },
  { word: "DOOR", displayWord: "door", turkish: "kapı", file: "door.png" },
  { word: "WINDOW", displayWord: "window", turkish: "pencere", file: "window.png" },
  { word: "SOFA", displayWord: "sofa", turkish: "kanepe", file: "sofa.png" },
  { word: "BED", displayWord: "bed", turkish: "yatak", file: "bed.png" },
  { word: "CHAIR", displayWord: "chair", turkish: "sandalye", file: "chair.png" },
  { word: "COFFEETABLE", displayWord: "coffee table", turkish: "sehpa", file: "coffee table.png" },
  { word: "DOG", displayWord: "dog", turkish: "köpek", file: "dog.png" },
  { word: "CAT", displayWord: "cat", turkish: "kedi", file: "cat.png" },
  { word: "GOLDFISH", displayWord: "goldfish", turkish: "japon balığı", file: "goldfish.png" },
  { word: "BIRD", displayWord: "bird", turkish: "kuş", file: "bird.png" },
  { word: "RABBIT", displayWord: "rabbit", turkish: "tavşan", file: "rabbit.png" },
  { word: "TURTLE", displayWord: "turtle", turkish: "kaplumbağa", file: "turtle.png" },
  { word: "PAW", displayWord: "paw", turkish: "pati", file: "paw.png" },
  { word: "CLAW", displayWord: "claw", turkish: "pençe", file: "claw.png" },
  { word: "TAIL", displayWord: "tail", turkish: "kuyruk", file: "tail.png" },
  { word: "WHISKERS", displayWord: "whiskers", turkish: "bıyık", file: "whiskers.png" },
  { word: "BEAK", displayWord: "beak", turkish: "gaga", file: "beak.png" },
  { word: "FUR", displayWord: "fur", turkish: "kürk", file: "fur.png" },
  { word: "WINGS", displayWord: "wings", turkish: "kanatlar", file: "wings.png" },
  { word: "WHERE", displayWord: "where", turkish: "nerede", file: "where.png" },
  { word: "FIND", displayWord: "find", turkish: "bul", file: "find.png" },
  { word: "HERE", displayWord: "here", turkish: "burada", file: "here.png" },
  { word: "HAPPY", displayWord: "happy", turkish: "mutlu", file: "happy.png" },
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

export default function SpellQuestGame2_5() {
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
  const [totalWords] = useState(10);

  const currentWord = shuffledVocab[currentWordIndex];

  // Helper function to create slot structure with spaces for display
  const getAnswerSlots = () => {
    if (!currentWord) return [];
    
    const slots: Array<{ type: 'letter' | 'space'; letterIndex?: number }> = [];
    const displayWords = currentWord.displayWord.split(' ');
    let letterIndex = 0;
    
    displayWords.forEach((word, wordIndex) => {
      // Add letter slots for this word
      for (let i = 0; i < word.length; i++) {
        slots.push({ type: 'letter', letterIndex: letterIndex++ });
      }
      // Add space slot after each word except the last
      if (wordIndex < displayWords.length - 1) {
        slots.push({ type: 'space' });
      }
    });
    
    return slots;
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, totalWords);
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
    
    // Shuffle letters
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
    
    // Add letter to selected
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);
    
    // Mark as used in scrambled
    setScrambledLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, used: true } : l)
    );
    
    // Play click sound
    const audio = new Audio("/sounds/pop.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});

    // Check if word is complete
    if (newSelected.length === currentWord.word.length) {
      const spelled = newSelected.map(l => l.letter).join("");
      
      if (spelled === currentWord.word) {
        // Correct!
        setIsCorrect(true);
        setScore(prev => prev + (10 * (streak + 1)));
        setStreak(prev => prev + 1);
        
        // Play success sound
        const successAudio = new Audio("/sounds/bell.mp3");
        successAudio.volume = 0.5;
        successAudio.play().catch(() => {});
        
        // Speak the display word (original format)
        speakWord(currentWord.displayWord);
        
        // Celebration
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#10b981"],
        });
      } else {
        // Wrong
        setIsWrong(true);
        setStreak(0);
        
        // Play error sound
        const errorAudio = new Audio("/sounds/wrong.mp3");
        errorAudio.volume = 0.3;
        errorAudio.play().catch(() => {});
        
        // Reset after a moment
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
    
    // Remove from selected
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    
    // Mark as unused in scrambled
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
      // Game complete!
      setGameComplete(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#10b981", "#34d399"],
      });
    }
  };

  const shareGame = () => {
    const text = `I scored ${score} points on Spell Quest! Can you beat my score? ✨`;
    if (navigator.share) {
      navigator.share({ title: "Spell Quest", text, url: window.location.href });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `Challenge me on Spell Quest! I scored ${score} points - can you do better? 🏆`;
    if (navigator.share) {
      navigator.share({ title: "Spell Quest Challenge", text, url: window.location.href });
    } else {
      alert(text);
    }
  };

  if (!currentWord && !gameComplete) {
    return (
      <Layout>
        <div className="spell-quest-wrapper primary-school-game">
          <div className="loading">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="spell-quest-wrapper primary-school-game" id="spell-quest-game">
        {/* Background - Blue/Sky theme for primary school */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-200 to-cyan-100 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-300 to-transparent opacity-50" />
          <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-80 cloud-float" />
          <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70 cloud-float-delayed" />
          <div className="absolute top-5 left-1/3 w-24 h-12 bg-white rounded-full opacity-75 cloud-float" />
        </div>

        <div className="spell-quest-container relative z-10">
          <PrimarySchoolGameHeader 
            gameName="Spell Quest"
            description="2nd Grade - Theme 5: Homes, Houses, Neighbourhoods"
            containerId="spell-quest-game"
            icon="✨"
          />
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap mb-4">
            <div className="bg-blue-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-blue-700 text-sm sm:text-base">{score}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-green-100 px-2 sm:px-3 py-1 rounded-lg">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="font-bold text-green-700 text-sm sm:text-base">{currentWordIndex + 1} / {shuffledVocab.length}</span>
            </div>
            
            {streak > 1 && (
              <div className="bg-orange-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
                <span className="text-lg">🔥</span>
                <span className="font-bold text-orange-700 text-sm sm:text-base">x{streak}</span>
              </div>
            )}
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
                    src={`/images/primary/2.5/${currentWord.file}`} 
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
                    onClick={() => speakWord(currentWord.displayWord)}
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
                  {getAnswerSlots().map((slot, displayIndex) => {
                    if (slot.type === 'space') {
                      return (
                        <div key={`space-${displayIndex}`} className="answer-slot space-slot">
                          <span className="space-indicator"> </span>
                        </div>
                      );
                    }
                    
                    const letterIndex = slot.letterIndex!;
                    return (
                      <motion.div
                        key={letterIndex}
                        className={`answer-slot ${selectedLetters[letterIndex] ? "filled" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                        onClick={() => selectedLetters[letterIndex] && handleRemoveLetter(letterIndex)}
                        whileHover={selectedLetters[letterIndex] ? { scale: 1.05 } : {}}
                        whileTap={selectedLetters[letterIndex] ? { scale: 0.95 } : {}}
                      >
                        <AnimatePresence mode="wait">
                          {selectedLetters[letterIndex] && (
                            <motion.span
                              key={selectedLetters[letterIndex].id}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              className={`slot-letter ${selectedLetters[letterIndex].color}`}
                            >
                              {selectedLetters[letterIndex].letter}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
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
                      <p className="success-word">{currentWord.displayWord}</p>
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
                <p className="complete-subtitle">You spelled all the words!</p>
                
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
                  <Button variant="outline" onClick={() => setLocation("/primary-school/grade-2/theme-5/games")}>
                    Back to Games
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="primary-school-game-footer">
            <div className="footer-content">
              <div className="footer-left">
                <Button onClick={shareGame} variant="outline" className="footer-button" data-testid="button-share">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button onClick={challengeFriend} variant="outline" className="footer-button" data-testid="button-challenge">
                  <Zap className="h-4 w-4" /> Challenge
                </Button>
              </div>
              <div className="footer-right">
                <Button onClick={startNewGame} variant="outline" className="footer-button" data-testid="button-new-game">
                  New Game
                </Button>
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-2/theme-5/games")}>
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

