import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Trophy, Heart, Target } from "lucide-react";
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
  { word: "Friday", file: "Friday.png", turkish: "Cuma" },
  { word: "what", file: "what.png", turkish: "ne" },
  { word: "where", file: "where.png", turkish: "nerede" },
  { word: "who", file: "who.png", turkish: "kim" },
];

interface Bubble {
  id: string;
  word: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  hit: boolean;
}

export default function WordShooterGame() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [targetWord, setTargetWord] = useState<typeof allVocabulary[0] | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [shipX, setShipX] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const speakWord = useCallback((text: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;
    window.speechSynthesis?.speak(utterance);
  }, []);

  const setupRound = useCallback(() => {
    const availableWords = allVocabulary.filter(v => !usedWords.includes(v.word));
    if (availableWords.length < 4) {
      setUsedWords([]);
      return;
    }

    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongWords = shuffled.slice(1, 4);

    setTargetWord(correct);
    setUsedWords(prev => [...prev, correct.word]);

    // Create bubbles
    const newBubbles: Bubble[] = [
      { id: 'bubble-0', word: correct.word, isCorrect: true, x: Math.random() * 60 + 20, y: -10, speed: 0.3 + (round * 0.05), hit: false },
      ...wrongWords.map((w, i) => ({
        id: `bubble-${i + 1}`,
        word: w.word,
        isCorrect: false,
        x: Math.random() * 60 + 20,
        y: -20 - (i * 15),
        speed: 0.25 + (round * 0.05),
        hit: false,
      }))
    ].sort(() => Math.random() - 0.5);

    setBubbles(newBubbles);

    // Speak the target word
    setTimeout(() => speakWord(correct.word), 500);
  }, [round, usedWords, speakWord]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(5);
    setRound(1);
    setUsedWords([]);
    setShipX(50);
    setupRound();
  };

  // Animate bubbles
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const animate = () => {
      setBubbles(prev => {
        const updated = prev.map(bubble => ({
          ...bubble,
          y: bubble.hit ? bubble.y : bubble.y + bubble.speed,
        }));

        // Check for bubbles that escaped
        const escaped = updated.filter(b => b.y >= 90 && !b.hit);
        const correctEscaped = escaped.some(b => b.isCorrect);
        
        if (correctEscaped) {
          setLives(l => l - 1);
        }

        // Check if all bubbles are gone (hit or escaped)
        const allGone = updated.every(b => b.hit || b.y >= 100);
        if (allGone && updated.length > 0) {
          setTimeout(() => {
            setRound(r => r + 1);
          }, 500);
        }

        return updated.filter(b => b.y < 100 && !b.hit);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  // Setup new round
  useEffect(() => {
    if (gameStarted && !gameOver && round > 1) {
      setupRound();
    }
  }, [round, gameStarted, gameOver, setupRound]);

  // Check game over
  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      if (score >= 100) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, [lives, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      if (e.key === 'ArrowLeft') {
        setShipX(prev => Math.max(5, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setShipX(prev => Math.min(95, prev + 5));
      } else if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        shoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, shipX, bubbles]);

  const shoot = () => {
    // Find bubble closest to ship position
    const hitBubble = bubbles.find(b => {
      const distance = Math.abs(b.x - shipX);
      return distance < 15 && b.y > 0 && b.y < 85 && !b.hit;
    });

    if (hitBubble) {
      if (hitBubble.isCorrect) {
        setScore(prev => prev + 10 + round);
        speakWord(hitBubble.word);
      } else {
        setLives(prev => prev - 1);
      }
      
      setBubbles(prev => prev.map(b => 
        b.id === hitBubble.id ? { ...b, hit: true } : b
      ));
    }
  };

  // Touch/click controls
  const handleGameAreaClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    setShipX(Math.max(5, Math.min(95, x)));
    shoot();
  };

  const shareGame = () => {
    const text = `I scored ${score} points on Word Shooter! 🎯`;
    if (navigator.share) {
      navigator.share({ title: "Word Shooter", text, url: window.location.href });
    }
  };

  return (
    <Layout>
      <div className="word-shooter-wrapper primary-school-game" id="word-shooter-game">
        <div className="word-shooter-container">
          <PrimarySchoolGameHeader
            gameName="Shooter"
            description="Grade 2 - Theme 1: School Life"
            containerId="word-shooter-game"
            icon={<Target className="h-7 w-7 text-red-600" />}
          />

          {!gameStarted && !gameOver && (
            <div className="start-screen">
              <div className="start-content">
                <h2>🎯 Word Shooter</h2>
                <p>Shoot the bubble with the correct word!</p>
                <ul>
                  <li>⬅️ ➡️ Move left/right</li>
                  <li>⬆️ or SPACE to shoot</li>
                  <li>🎧 Listen to the target word</li>
                  <li>📱 Tap to move & shoot on mobile</li>
                </ul>
                <Button onClick={startGame} className="start-btn">
                  Start Game!
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
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{Array(lives).fill('❤️').join('')}</span>
                </div>
                <div className="stat-item">
                  <span>Round {round}</span>
                </div>
              </div>

              {/* Target Word */}
              {targetWord && (
                <div className="target-section">
                  <span>Find:</span>
                  <button className="target-word" onClick={() => speakWord(targetWord.word)}>
                    🔊 {targetWord.word}
                  </button>
                </div>
              )}

              {/* Game Area */}
              <div 
                className="game-area" 
                ref={gameAreaRef}
                onClick={handleGameAreaClick}
                onTouchStart={handleGameAreaClick}
              >
                {/* Bubbles */}
                {bubbles.map(bubble => (
                  <div
                    key={bubble.id}
                    className={`bubble ${bubble.isCorrect ? 'correct' : ''} ${bubble.hit ? 'hit' : ''}`}
                    style={{
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                    }}
                  >
                    {bubble.word}
                  </div>
                ))}

                {/* Ship */}
                <div 
                  className="ship"
                  style={{ left: `${shipX}%` }}
                >
                  🚀
                </div>

                {/* Aim line */}
                <div 
                  className="aim-line"
                  style={{ left: `${shipX}%` }}
                />
              </div>

              {/* Mobile Controls */}
              <div className="mobile-controls">
                <button className="control-btn" onClick={() => setShipX(prev => Math.max(5, prev - 10))}>
                  ⬅️
                </button>
                <button className="control-btn fire" onClick={shoot}>
                  🎯 FIRE
                </button>
                <button className="control-btn" onClick={() => setShipX(prev => Math.min(95, prev + 10))}>
                  ➡️
                </button>
              </div>
            </>
          )}

          {/* Game Over */}
          {gameOver && (
            <div className="game-end-modal">
              <div className="modal-content">
                <h2>{score >= 100 ? '🏆 Amazing!' : '💪 Good Try!'}</h2>
                <div className="final-stats">
                  <p>🎯 Score: {score}</p>
                  <p>🎮 Rounds: {round}</p>
                </div>
                <div className="modal-buttons">
                  <Button onClick={startGame} className="btn-primary">
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
                <Button onClick={startGame} variant="outline" className="footer-button">
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
        .word-shooter-wrapper {
          min-height: 100vh;
          padding: 20px;
        }

        .word-shooter-container {
          max-width: 600px;
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

        .start-content ul {
          text-align: left;
          margin: 20px auto;
          max-width: 280px;
        }

        .start-content li {
          margin: 8px 0;
        }

        .start-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          font-size: 18px;
          padding: 16px 32px;
          margin-top: 16px;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 12px;
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

        .target-section {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 18px;
          font-weight: 600;
        }

        .target-word {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1e293b;
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .target-word:hover {
          transform: scale(1.05);
        }

        .game-area {
          position: relative;
          height: 350px;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          border-radius: 16px;
          overflow: hidden;
          cursor: crosshair;
          margin-bottom: 12px;
        }

        .bubble {
          position: absolute;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          color: white;
          padding: 12px 20px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .bubble.hit {
          opacity: 0;
          transform: translate(-50%, -50%) scale(1.5);
        }

        .ship {
          position: absolute;
          bottom: 20px;
          transform: translateX(-50%);
          font-size: 40px;
          transition: left 0.1s ease;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
        }

        .aim-line {
          position: absolute;
          bottom: 60px;
          width: 2px;
          height: calc(100% - 80px);
          background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), transparent);
          transform: translateX(-50%);
          pointer-events: none;
        }

        .mobile-controls {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .control-btn {
          width: 70px;
          height: 50px;
          border-radius: 12px;
          border: 2px solid hsl(var(--border));
          background: hsl(var(--card));
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover, .control-btn:active {
          background: hsl(var(--primary));
          color: white;
        }

        .control-btn.fire {
          width: 120px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          font-size: 14px;
          font-weight: 700;
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
          font-size: 18px;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
        }

        @media (min-width: 768px) {
          .mobile-controls {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
}
