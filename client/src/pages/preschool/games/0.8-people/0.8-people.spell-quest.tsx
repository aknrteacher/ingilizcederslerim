import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Zap, Sparkles, Volume2, Star, Trophy, ChevronRight, RotateCcw } from "lucide-react";
import { PreschoolGameHeader } from "@/components/PreschoolGameHeader";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "@/styles/0.1.spell-quest.css";
import "@/styles/preschool-game-header.css";
import "@/styles/preschool-game-footer.css";
import { buildSpellQuestAnswerSlots, getSpellQuestDisplayWord, speakSpellQuestAnswer } from "@/lib/spellQuestSpeak";

interface VocabWord {
  word: string;
  turkish: string;
  file: string;
}

const vocabulary: VocabWord[] = [
  { word: "TEACHER", turkish: "öğretmen", file: "teacher.png" },
  { word: "FRIEND", turkish: "arkadaş", file: "friend.png" },
  { word: "BOY", turkish: "erkek çocuk", file: "boy.png" },
  { word: "GIRL", turkish: "kız", file: "girl.png" },
  { word: "MOM", turkish: "anne", file: "mom.png" },
  { word: "DAD", turkish: "baba", file: "dad.png" },
  { word: "SISTER", turkish: "kız kardeş", file: "sister.png" },
  { word: "BROTHER", turkish: "erkek kardeş", file: "brother.png" },
  { word: "MAN", turkish: "adam", file: "man.png" },
  { word: "WOMAN", turkish: "kadın", file: "woman.png" },
  { word: "BABY", turkish: "bebek", file: "baby.png" },
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

export default function PeopleSpellQuestGame() {
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
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, 11);
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
        
        speakSpellQuestAnswer(currentWord.word, currentWord.file);
        
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
    const text = `I scored ${score} points on Spell Quest People! Can you beat my score? 👋`;
    if (navigator.share) {
      navigator.share({ title: "Spell Quest - People", text, url: window.location.href });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `Challenge me on Spell Quest People! I scored ${score} points - can you do better? 🏆`;
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
          <PreschoolGameHeader 
            gameName="Spell Quest"
              description="Pre-School & 1st Grade - Theme: People"
            containerId="spell-quest-colors-game"
            icon="✨"
          />
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap mb-4">
            <div className="bg-amber-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-amber-700 text-sm sm:text-base">{score}</span>
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
                    src={`/images/preschool/vocab/0.8-people/${currentWord.file}`} 
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
                    onClick={() => speakSpellQuestAnswer(currentWord.word, currentWord.file)}
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
                <div className="english-spell-prompt text-center font-bold text-lg sm:text-xl tracking-wide text-slate-800 mb-3 px-2">{getSpellQuestDisplayWord(currentWord.word, currentWord.file)}</div>

                <div className="answer-slots">
                  {buildSpellQuestAnswerSlots(currentWord.word, currentWord.file).map((slot, displayIndex) =>
                    slot.kind === "gap" ? (
                      <div
                        key={`spell-gap-${displayIndex}`}
                        className="answer-slot space-slot"
                        aria-hidden
                      >
                        <span className="space-indicator" />
                      </div>
                    ) : (
                      <motion.div
                        key={slot.letterIndex}
                        className={`answer-slot ${selectedLetters[slot.letterIndex] ? "filled" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                        onClick={() => selectedLetters[slot.letterIndex] && handleRemoveLetter(slot.letterIndex)}
                        whileHover={selectedLetters[slot.letterIndex] ? { scale: 1.05 } : {}}
                        whileTap={selectedLetters[slot.letterIndex] ? { scale: 0.95 } : {}}
                      >
                        <AnimatePresence mode="wait">
                          {selectedLetters[slot.letterIndex] && (
                            <motion.span
                              key={selectedLetters[slot.letterIndex].id}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              className={`slot-letter ${selectedLetters[slot.letterIndex].color}`}
                            >
                              {selectedLetters[slot.letterIndex].letter}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  )}
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
                      <p className="success-word">{getSpellQuestDisplayWord(currentWord.word, currentWord.file)}</p>
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
                <p className="complete-subtitle">You spelled all the people!</p>
                
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
          <div className="preschool-game-footer">
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
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/pre-school/games")}>
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

