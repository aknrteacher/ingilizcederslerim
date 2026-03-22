import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Trophy, Clock, Zap, Keyboard } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import confetti from "canvas-confetti";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

const allVocabulary = [
  { word: "vehicle", file: "vehicle.png", turkish: "araç" },
  { word: "car", file: "car.png", turkish: "araba" },
  { word: "bus", file: "bus.png", turkish: "otobüs" },
  { word: "train", file: "train.png", turkish: "tren" },
  { word: "truck", file: "truck.png", turkish: "kamyon" },
  { word: "plane", file: "plane.png", turkish: "uçak" },
  { word: "subway", file: "subway.png", turkish: "metro" },
  { word: "ship", file: "ship.png", turkish: "gemi" },
  { word: "boat", file: "boat.png", turkish: "tekne" },
  { word: "bicycle (bike)", file: "bicycle (bike).png", turkish: "bisiklet" },
  { word: "motorbike", file: "motorbike.png", turkish: "motosiklet" },
  { word: "helicopter", file: "helicopter.png", turkish: "helikopter" },
  { word: "drive", file: "drive.png", turkish: "araba kullanmak" },
  { word: "ride", file: "ride.png", turkish: "binmek" },
  { word: "fly", file: "fly.png", turkish: "uçmak" },
  { word: "go", file: "go.png", turkish: "gitmek" },
  { word: "stop", file: "stop.png", turkish: "durmak" },
  { word: "air", file: "air.png", turkish: "hava" },
  { word: "sky", file: "sky.png", turkish: "gökyüzü" },
  { word: "road", file: "road.png", turkish: "yol" },
  { word: "sea", file: "sea.png", turkish: "deniz" },
  { word: "map", file: "map.png", turkish: "harita" },
  { word: "transportation", file: "transportation.png", turkish: "ulaşım" },
  { word: "by bus", file: "by bus.png", turkish: "otobüsle" },
  { word: "by car", file: "by car.png", turkish: "arabayla" },
  { word: "by train", file: "by train.png", turkish: "trenle" },
  { word: "how", file: "how.png", turkish: "nasıl" },
  { word: "where", file: "where.png", turkish: "nerede" },
  { word: "here", file: "here.png", turkish: "burada" },
  { word: "excuse me", file: "excuse me.png", turkish: "affedersiniz" },
];

interface FallingWord {
  id: string;
  word: string;
  file: string;
  x: number;
  y: number;
  typed: boolean;
}

export default function WordRaceGame() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wordsMissed, setWordsMissed] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [speed, setSpeed] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnWord = useCallback(() => {
    const vocab = allVocabulary[Math.floor(Math.random() * allVocabulary.length)];
    const newWord: FallingWord = {
      id: `word-${Date.now()}-${Math.random()}`,
      word: vocab.word.toLowerCase().replace(/[^a-z]/g, ""),
      file: vocab.file,
      x: Math.random() * 70 + 15, // 15% to 85%
      y: 0,
      typed: false,
    };
    setFallingWords(prev => [...prev, newWord]);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setWordsTyped(0);
    setWordsMissed(0);
    setCurrentInput("");
    setFallingWords([]);
    setTimeLeft(60);
    setStreak(0);
    setSpeed(1);
    inputRef.current?.focus();
  };

  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Spawn words
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = Math.max(1500 - (speed * 100), 800);
    spawnTimerRef.current = setInterval(spawnWord, spawnInterval);

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [gameStarted, gameOver, speed, spawnWord]);

  // Animate falling words
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const animate = () => {
      setFallingWords(prev => {
        const updated = prev.map(word => ({
          ...word,
          y: word.y + (0.04 * speed),
        }));

        // Check for missed words
        const missed = updated.filter(w => w.y >= 100 && !w.typed);
        if (missed.length > 0) {
          setWordsMissed(m => m + missed.length);
          setStreak(0);
        }

        // Remove words that are off screen or typed
        return updated.filter(w => w.y < 100 && !w.typed);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, speed]);

  // Handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setCurrentInput(value);

    // Check if typed word matches any falling word
    const matchedWord = fallingWords.find(w => w.word === value && !w.typed);
    if (matchedWord) {
      // Word typed correctly!
      setFallingWords(prev => prev.map(w => 
        w.id === matchedWord.id ? { ...w, typed: true } : w
      ));
      
      const points = 10 + (streak * 2) + (matchedWord.word.length);
      setScore(prev => prev + points);
      setWordsTyped(prev => prev + 1);
      setStreak(prev => prev + 1);
      setCurrentInput("");

      // Speed up every 5 words
      if ((wordsTyped + 1) % 5 === 0) {
        setSpeed(prev => Math.min(prev + 0.2, 3));
      }

      // Speak the word
      const utterance = new SpeechSynthesisUtterance(matchedWord.word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
      window.speechSynthesis?.speak(utterance);
    }
  };

  // End game confetti
  useEffect(() => {
    if (gameOver && wordsTyped >= 10) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameOver, wordsTyped]);

  const shareGame = () => {
    const text = `I typed ${wordsTyped} words and scored ${score} points in Word Race! 🏎️`;
    if (navigator.share) {
      navigator.share({ title: "Word Race", text, url: window.location.href });
    }
  };

  return (
    <Layout>
      <div className="word-race-wrapper primary-school-game" id="word-race-game">
        <div className="word-race-container">
          <PrimarySchoolGameHeader
            gameName="Word Race"
            description="Grade 3 - Unit 8: Transportation"
            containerId="word-race-game"
            icon={<Keyboard className="h-7 w-7 text-orange-600" />}
          />

          {!gameStarted && !gameOver && (
            <div className="start-screen">
              <div className="start-content">
                <h2>🏎️ Word Race</h2>
                <p>Type the falling words before they reach the bottom!</p>
                <ul>
                  <li>⌨️ Type words as they fall</li>
                  <li>🔥 Build streaks for bonus points</li>
                  <li>⚡ Speed increases as you progress</li>
                </ul>
                <Button onClick={startGame} className="start-btn">
                  Start Racing!
                </Button>
              </div>
            </div>
          )}

          {gameStarted && !gameOver && (
            <>
              {/* Stats Bar */}
              <div className="stats-bar">
                <div className="stat-item">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>{score}</span>
                </div>
                <div className="stat-item">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{timeLeft}s</span>
                </div>
                <div className="stat-item">
                  <span>✅ {wordsTyped}</span>
                </div>
                {streak > 1 && (
                  <div className="stat-item streak">
                    <Zap className="h-4 w-4" />
                    <span>{streak}x</span>
                  </div>
                )}
              </div>

              {/* Game Area */}
              <div className="game-area" ref={gameAreaRef}>
                {fallingWords.map(word => (
                  <div
                    key={word.id}
                    className={`falling-word ${word.typed ? 'typed' : ''}`}
                    style={{
                      left: `${word.x}%`,
                      top: `${word.y}%`,
                    }}
                  >
                    {word.word}
                  </div>
                ))}

                {/* Danger zone indicator */}
                <div className="danger-zone"></div>
              </div>

              {/* Input Field */}
              <div className="input-section">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={handleInputChange}
                  placeholder="Type the words..."
                  className="word-input"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </div>
            </>
          )}

          {/* Game Over */}
          {gameOver && (
            <div className="game-end-modal">
              <div className="modal-content">
                <h2>{wordsTyped >= 15 ? '🏆 Amazing!' : wordsTyped >= 10 ? '🎉 Great Job!' : '💪 Keep Practicing!'}</h2>
                <div className="final-stats">
                  <p>🎯 Score: {score}</p>
                  <p>✅ Words Typed: {wordsTyped}</p>
                  <p>❌ Words Missed: {wordsMissed}</p>
                  <p>🔥 Best Streak: {streak}</p>
                </div>
                <div className="modal-buttons">
                  <Button onClick={startGame} className="btn-primary">
                    <RefreshCw className="h-4 w-4 mr-2" /> Play Again
                  </Button>
                  <Button variant="outline" onClick={shareGame}>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                <Button variant="outline" onClick={() => setLocation("/primary-school/grade-3/unit-8/games")}>
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
                <Button onClick={startGame} variant="outline" className="footer-button">
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-3/unit-8/games")}>
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .word-race-wrapper {
          min-height: 100vh;
          padding: 20px;
          position: relative;
        }

        .word-race-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .start-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .start-content {
          text-align: center;
          background: hsl(var(--card));
          padding: 40px;
          border-radius: 24px;
          border: 2px solid hsl(var(--border));
        }

        .start-content h2 {
          font-size: 36px;
          margin-bottom: 16px;
        }

        .start-content p {
          color: hsl(var(--muted-foreground));
          margin-bottom: 20px;
        }

        .start-content ul {
          text-align: left;
          margin: 20px auto;
          max-width: 250px;
        }

        .start-content li {
          margin: 8px 0;
        }

        .start-btn {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          font-size: 18px;
          padding: 16px 32px;
          margin-top: 16px;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
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

        .stat-item.streak {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          animation: pulse 0.5s ease;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .game-area {
          position: relative;
          height: 350px;
          background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .falling-word {
          position: absolute;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1e293b;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          white-space: nowrap;
          transition: opacity 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .falling-word.typed {
          opacity: 0;
          transform: translateX(-50%) scale(1.5);
        }

        .danger-zone {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 10%;
          background: linear-gradient(0deg, rgba(239, 68, 68, 0.5) 0%, transparent 100%);
        }

        .input-section {
          display: flex;
          justify-content: center;
        }

        .word-input {
          width: 100%;
          max-width: 400px;
          padding: 16px 24px;
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          border: 3px solid hsl(var(--primary));
          border-radius: 16px;
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          outline: none;
        }

        .word-input:focus {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
        }

        .game-end-modal {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          border-radius: 16px;
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
          margin-bottom: 20px;
        }

        .final-stats {
          background: hsl(var(--muted));
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .final-stats p {
          margin: 8px 0;
          font-size: 16px;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
        }
      `}</style>
    </Layout>
  );
}
