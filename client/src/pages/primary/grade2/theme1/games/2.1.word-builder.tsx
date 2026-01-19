import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Trophy, Heart, Volume2, Puzzle } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import confetti from "canvas-confetti";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

const allVocabulary = [
  { word: "hello", file: "hello.png", turkish: "merhaba" },
  { word: "goodbye", file: "goodbye.png", turkish: "hoşça kalın" },
  { word: "school", file: "school.png", turkish: "okul" },
  { word: "classroom", file: "classroom.png", turkish: "sınıf" },
  { word: "library", file: "library.png", turkish: "kütüphane" },
  { word: "canteen", file: "canteen.png", turkish: "kafeterya" },
  { word: "playground", file: "playground.png", turkish: "oyun alanı" },
  { word: "garden", file: "garden.png", turkish: "bahçe" },
  { word: "teacher", file: "teacher.png", turkish: "öğretmen" },
  { word: "student", file: "student.png", turkish: "öğrenci" },
  { word: "girl", file: "girl.png", turkish: "kız" },
  { word: "boy", file: "boy.png", turkish: "erkek" },
  { word: "friend", file: "friend.png", turkish: "arkadaş" },
  { word: "day", file: "day.png", turkish: "gün" },
  { word: "week", file: "week.png", turkish: "hafta" },
  { word: "Monday", file: "Monday.png", turkish: "Pazartesi" },
  { word: "Tuesday", file: "Tuesday.png", turkish: "Salı" },
  { word: "Friday", file: "Friday.png", turkish: "Cuma" },
  { word: "what", file: "what.png", turkish: "ne" },
  { word: "where", file: "where.png", turkish: "nerede" },
  { word: "who", file: "who.png", turkish: "kim" },
];

interface ScrambledLetter {
  id: string;
  char: string;
  originalIndex: number;
}

export default function WordBuilderGame() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);
  const [currentWord, setCurrentWord] = useState<typeof allVocabulary[0] | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<ScrambledLetter[]>([]);
  const [builtWord, setBuiltWord] = useState<ScrambledLetter[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);

  const speakWord = useCallback((text: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;
    
    const voices = speechSynthesis.getVoices();
    const englishVoice = 
      voices.find(voice => voice.lang === 'en-GB') ||
      voices.find(voice => voice.lang.startsWith('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis?.speak(utterance);
  }, []);

  const setupRound = useCallback(() => {
    const availableWords = allVocabulary.filter(v => !usedWords.includes(v.word));
    if (availableWords.length === 0) {
      setUsedWords([]);
      return;
    }

    const vocab = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(vocab);
    setUsedWords(prev => [...prev, vocab.word]);

    // Scramble the letters
    const letters: ScrambledLetter[] = vocab.word.split('').map((char, idx) => ({
      id: `letter-${idx}-${Math.random()}`,
      char: char.toUpperCase(),
      originalIndex: idx,
    }));

    // Shuffle until it's actually scrambled (not in original order)
    let shuffled = [...letters];
    let attempts = 0;
    do {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
      attempts++;
    } while (
      shuffled.every((l, i) => l.originalIndex === i) && 
      attempts < 10 &&
      letters.length > 1
    );

    setScrambledLetters(shuffled);
    setBuiltWord([]);
    setShowResult(false);
    setHintsUsed(0);

    // Speak the word
    setTimeout(() => speakWord(vocab.word), 500);
  }, [usedWords, speakWord]);

  useEffect(() => {
    setupRound();
  }, []);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  useEffect(() => {
    if (round > totalRounds && !gameOver) {
      setGameWon(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [round, totalRounds, gameOver]);

  const handleLetterClick = (letter: ScrambledLetter) => {
    if (showResult) return;
    
    // Move from scrambled to built
    setScrambledLetters(prev => prev.filter(l => l.id !== letter.id));
    setBuiltWord(prev => [...prev, letter]);
  };

  const handleBuiltLetterClick = (letter: ScrambledLetter) => {
    if (showResult) return;
    
    // Move back from built to scrambled
    setBuiltWord(prev => prev.filter(l => l.id !== letter.id));
    setScrambledLetters(prev => [...prev, letter]);
  };

  const checkAnswer = () => {
    if (!currentWord || builtWord.length !== currentWord.word.length) return;

    const answer = builtWord.map(l => l.char).join('').toLowerCase();
    const correct = answer === currentWord.word.toLowerCase();

    setShowResult(true);
    setIsCorrect(correct);

    if (correct) {
      const points = 10 + (currentWord.word.length * 2) - (hintsUsed * 3);
      setScore(prev => prev + Math.max(points, 5));
      speakWord(currentWord.word);

      setTimeout(() => {
        if (round < totalRounds) {
          setRound(prev => prev + 1);
          setupRound();
        } else {
          setRound(prev => prev + 1);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      
      setTimeout(() => {
        if (lives > 1) {
          // Reset the word for retry
          const letters: ScrambledLetter[] = currentWord.word.split('').map((char, idx) => ({
            id: `letter-${idx}-${Math.random()}`,
            char: char.toUpperCase(),
            originalIndex: idx,
          }));
          setScrambledLetters(letters.sort(() => Math.random() - 0.5));
          setBuiltWord([]);
          setShowResult(false);
        }
      }, 1500);
    }
  };

  const useHint = () => {
    if (!currentWord || showResult) return;

    // Find next correct letter
    const nextIndex = builtWord.length;
    const nextChar = currentWord.word[nextIndex]?.toUpperCase();

    if (nextChar) {
      const letterToMove = scrambledLetters.find(l => l.char === nextChar);
      if (letterToMove) {
        handleLetterClick(letterToMove);
        setHintsUsed(prev => prev + 1);
        setScore(prev => Math.max(0, prev - 2));
      }
    }
  };

  const resetWord = () => {
    if (!currentWord || showResult) return;
    
    const letters: ScrambledLetter[] = currentWord.word.split('').map((char, idx) => ({
      id: `letter-${idx}-${Math.random()}`,
      char: char.toUpperCase(),
      originalIndex: idx,
    }));
    setScrambledLetters(letters.sort(() => Math.random() - 0.5));
    setBuiltWord([]);
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setRound(1);
    setUsedWords([]);
    setGameOver(false);
    setGameWon(false);
    setShowResult(false);
    setTimeout(() => setupRound(), 100);
  };

  const shareGame = () => {
    const text = `I scored ${score} points on Word Builder! 🧩`;
    if (navigator.share) {
      navigator.share({ title: "Word Builder", text, url: window.location.href });
    }
  };

  return (
    <Layout>
      <div className="word-builder-wrapper primary-school-game" id="word-builder-game">
        <div className="word-builder-container">
          <PrimarySchoolGameHeader
            gameName="Builder"
            description="Grade 2 - Theme 1: School Life"
            containerId="word-builder-game"
            icon={<Puzzle className="h-7 w-7 text-indigo-600" />}
          />

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{Array(lives).fill('❤️').join('')}</span>
            </div>
            <div className="stat-item">
              <span>Round {Math.min(round, totalRounds)}/{totalRounds}</span>
            </div>
          </div>

          {/* Game Area */}
          {!gameOver && !gameWon && currentWord && (
            <div className="game-area">
              {/* Picture & Word */}
              <div className="word-display">
                <div className="picture-frame">
                  <img src={`/images/primary/2.1/${currentWord.file}`} alt={currentWord.word} />
                </div>
                <button className="listen-btn" onClick={() => speakWord(currentWord.word)}>
                  <Volume2 className="h-5 w-5" />
                  Listen
                </button>
                <p className="turkish-hint">{currentWord.turkish}</p>
              </div>

              {/* Built Word Area */}
              <div className="build-area">
                <p className="build-label">Your word:</p>
                <div className="letter-slots">
                  {currentWord.word.split('').map((_, idx) => (
                    <div key={idx} className={`letter-slot ${builtWord[idx] ? 'filled' : ''}`}>
                      {builtWord[idx] && (
                        <button
                          className="placed-letter"
                          onClick={() => handleBuiltLetterClick(builtWord[idx])}
                        >
                          {builtWord[idx].char}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrambled Letters */}
              <div className="scrambled-area">
                <p className="scramble-label">Available letters:</p>
                <div className="scrambled-letters">
                  {scrambledLetters.map(letter => (
                    <button
                      key={letter.id}
                      className="scrambled-letter"
                      onClick={() => handleLetterClick(letter)}
                    >
                      {letter.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <Button variant="outline" onClick={resetWord} disabled={showResult}>
                  ↺ Reset
                </Button>
                <Button variant="outline" onClick={useHint} disabled={showResult || scrambledLetters.length === 0}>
                  💡 Hint
                </Button>
                <Button 
                  onClick={checkAnswer} 
                  disabled={showResult || builtWord.length !== currentWord.word.length}
                  className="check-btn"
                >
                  ✓ Check
                </Button>
              </div>

              {/* Result Message */}
              {showResult && (
                <div className={`result-message ${isCorrect ? 'correct' : 'wrong'}`}>
                  {isCorrect ? '✅ Correct!' : `❌ Wrong! The word is "${currentWord.word}"`}
                </div>
              )}
            </div>
          )}

          {/* Game Over */}
          {gameOver && (
            <div className="game-end-modal">
              <div className="modal-content">
                <h2>💔 Game Over!</h2>
                <p>Final Score: {score}</p>
                <p>Rounds Completed: {round - 1}/{totalRounds}</p>
                <div className="modal-buttons">
                  <Button onClick={resetGame} className="btn-primary">
                    <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/primary-school/grade-2/theme-1/games")}>
                    Back to Games
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Game Won */}
          {gameWon && (
            <div className="game-end-modal won">
              <div className="modal-content">
                <h2>🎉 Congratulations!</h2>
                <p>You completed all {totalRounds} rounds!</p>
                <p>Final Score: {score}</p>
                <div className="modal-buttons">
                  <Button onClick={resetGame} className="btn-primary">
                    <RefreshCw className="h-4 w-4 mr-2" /> Play Again
                  </Button>
                  <Button variant="outline" onClick={shareGame}>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/primary-school/grade-2/theme-1/games")}>
                    Back to Games
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="primary-school-game-footer">
            <div className="footer-content">
              <div className="footer-left">
                <Button onClick={shareGame} variant="outline" className="footer-button">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
              <div className="footer-right">
                <Button onClick={resetGame} variant="outline" className="footer-button">
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-2/theme-1/games")}>
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .word-builder-wrapper {
          min-height: 100vh;
          padding: 20px;
        }

        .word-builder-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: hsl(var(--card));
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          border: 2px solid hsl(var(--border));
        }

        .game-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .word-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .picture-frame {
          width: 150px;
          height: 150px;
          background: hsl(var(--card));
          border: 3px solid hsl(var(--border));
          border-radius: 16px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .picture-frame img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .listen-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .listen-btn:hover {
          transform: scale(1.05);
        }

        .turkish-hint {
          color: hsl(var(--muted-foreground));
          font-size: 14px;
        }

        .build-area {
          width: 100%;
          text-align: center;
        }

        .build-label, .scramble-label {
          font-weight: 600;
          margin-bottom: 12px;
          color: hsl(var(--muted-foreground));
        }

        .letter-slots {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .letter-slot {
          width: 50px;
          height: 60px;
          border: 3px dashed hsl(var(--border));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .letter-slot.filled {
          border-style: solid;
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
        }

        .placed-letter {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .placed-letter:hover {
          transform: scale(0.95);
        }

        .scrambled-area {
          width: 100%;
          text-align: center;
        }

        .scrambled-letters {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .scrambled-letter {
          width: 50px;
          height: 60px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1e293b;
          border: none;
          border-radius: 12px;
          font-size: 24px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .scrambled-letter:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .check-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
        }

        .check-btn:disabled {
          opacity: 0.5;
        }

        .result-message {
          font-size: 20px;
          font-weight: 700;
          padding: 12px 24px;
          border-radius: 12px;
          animation: slideIn 0.3s ease;
        }

        .result-message.correct {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .result-message.wrong {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .game-end-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: hsl(var(--card));
          padding: 40px;
          border-radius: 24px;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .modal-content h2 {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .modal-content p {
          font-size: 18px;
          color: hsl(var(--muted-foreground));
          margin-bottom: 8px;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          border: none;
        }

        .game-end-modal.won .modal-content {
          background: linear-gradient(135deg, #fef3c7, #fcd34d);
        }

        .game-end-modal.won h2 {
          color: #92400e;
        }
      `}</style>
    </Layout>
  );
}
