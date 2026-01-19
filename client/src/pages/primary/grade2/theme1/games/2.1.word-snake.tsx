import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Trophy, Heart } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import confetti from "canvas-confetti";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

const allVocabulary = [
  { word: "hello", file: "hello.png", turkish: "merhaba" },
  { word: "school", file: "school.png", turkish: "okul" },
  { word: "teacher", file: "teacher.png", turkish: "öğretmen" },
  { word: "student", file: "student.png", turkish: "öğrenci" },
  { word: "friend", file: "friend.png", turkish: "arkadaş" },
  { word: "girl", file: "girl.png", turkish: "kız" },
  { word: "boy", file: "boy.png", turkish: "erkek" },
  { word: "day", file: "day.png", turkish: "gün" },
  { word: "week", file: "week.png", turkish: "hafta" },
  { word: "garden", file: "garden.png", turkish: "bahçe" },
  { word: "what", file: "what.png", turkish: "ne" },
  { word: "where", file: "where.png", turkish: "nerede" },
  { word: "who", file: "who.png", turkish: "kim" },
];

interface Position {
  x: number;
  y: number;
}

interface Letter {
  char: string;
  position: Position;
  isTarget: boolean;
}

const GRID_SIZE = 12;
const CELL_SIZE = 100 / GRID_SIZE;

export default function WordSnakeGame() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [snake, setSnake] = useState<Position[]>([{ x: 6, y: 6 }]);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [targetWord, setTargetWord] = useState<typeof allVocabulary[0] | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(direction);

  // Keep direction ref updated
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const speakWord = useCallback((text: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;
    window.speechSynthesis?.speak(utterance);
  }, []);

  const getRandomPosition = useCallback((occupied: Position[]): Position => {
    let pos: Position;
    let attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;
    } while (
      occupied.some(o => o.x === pos.x && o.y === pos.y) && 
      attempts < 100
    );
    return pos;
  }, []);

  const setupWord = useCallback(() => {
    const vocab = allVocabulary[Math.floor(Math.random() * allVocabulary.length)];
    const word = vocab.word.toLowerCase();
    
    setTargetWord(vocab);
    setCollectedLetters([]);

    // Place letters on the grid
    const occupied = [...snake];
    const newLetters: Letter[] = [];

    // Place target letters
    word.split('').forEach((char, index) => {
      const pos = getRandomPosition([...occupied, ...newLetters.map(l => l.position)]);
      newLetters.push({
        char: char.toUpperCase(),
        position: pos,
        isTarget: true,
      });
    });

    // Place some decoy letters
    const decoyCount = Math.min(5, 26 - word.length);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < decoyCount; i++) {
      const pos = getRandomPosition([...occupied, ...newLetters.map(l => l.position)]);
      let char = alphabet[Math.floor(Math.random() * 26)];
      // Make sure decoy is not the next needed letter
      if (collectedLetters.length < word.length && char === word[collectedLetters.length].toUpperCase()) {
        char = alphabet[(alphabet.indexOf(char) + 1) % 26];
      }
      newLetters.push({
        char,
        position: pos,
        isTarget: false,
      });
    }

    setLetters(newLetters);
    speakWord(vocab.word);
  }, [snake, getRandomPosition, collectedLetters.length, speakWord]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setSnake([{ x: 6, y: 6 }]);
    setDirection('right');
    directionRef.current = 'right';
    setWordsCompleted(0);
    setCollectedLetters([]);
    setIsPaused(false);
    setTimeout(() => setupWord(), 100);
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newHead: Position;

        switch (directionRef.current) {
          case 'up':
            newHead = { x: head.x, y: (head.y - 1 + GRID_SIZE) % GRID_SIZE };
            break;
          case 'down':
            newHead = { x: head.x, y: (head.y + 1) % GRID_SIZE };
            break;
          case 'left':
            newHead = { x: (head.x - 1 + GRID_SIZE) % GRID_SIZE, y: head.y };
            break;
          case 'right':
            newHead = { x: (head.x + 1) % GRID_SIZE, y: head.y };
            break;
          default:
            newHead = head;
        }

        // Check collision with self
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setLives(l => l - 1);
          return [{ x: 6, y: 6 }]; // Reset snake position
        }

        return [newHead, ...prevSnake.slice(0, prevSnake.length)];
      });
    }, 200);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused]);

  // Check letter collection
  useEffect(() => {
    if (!gameStarted || gameOver || !targetWord) return;

    const head = snake[0];
    const hitLetter = letters.find(l => l.position.x === head.x && l.position.y === head.y);

    if (hitLetter) {
      const nextNeededLetter = targetWord.word[collectedLetters.length]?.toUpperCase();

      if (hitLetter.char === nextNeededLetter) {
        // Correct letter!
        setCollectedLetters(prev => [...prev, hitLetter.char]);
        setLetters(prev => prev.filter(l => l !== hitLetter));
        setScore(prev => prev + 5);

        // Check if word is complete
        if (collectedLetters.length + 1 === targetWord.word.length) {
          setScore(prev => prev + 20);
          setWordsCompleted(prev => prev + 1);
          speakWord(targetWord.word);
          
          if (wordsCompleted + 1 >= 5) {
            // Win!
            setGameOver(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } else {
            setTimeout(() => setupWord(), 1000);
          }
        }
      } else if (hitLetter.isTarget) {
        // Wrong order - penalty
        setLives(prev => prev - 1);
        setLetters(prev => prev.filter(l => l !== hitLetter));
      } else {
        // Decoy letter - small penalty
        setScore(prev => Math.max(0, prev - 2));
        setLetters(prev => prev.filter(l => l !== hitLetter));
      }
    }
  }, [snake, letters, targetWord, collectedLetters, gameStarted, gameOver, wordsCompleted, setupWord, speakWord]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 && gameStarted) {
      setGameOver(true);
    }
  }, [lives, gameStarted]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'up') setDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'right') setDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'left') setDirection('right');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  const shareGame = () => {
    const text = `I collected ${wordsCompleted} words and scored ${score} points on Word Snake! 🐍`;
    if (navigator.share) {
      navigator.share({ title: "Word Snake", text, url: window.location.href });
    }
  };

  return (
    <Layout>
      <div className="word-snake-wrapper primary-school-game" id="word-snake-game">
        <div className="word-snake-container">
          <PrimarySchoolGameHeader
            gameName="Snake"
            description="Grade 2 - Theme 1: School Life"
            containerId="word-snake-game"
            icon={<span className="text-2xl">🐍</span>}
          />

          {!gameStarted && !gameOver && (
            <div className="start-screen">
              <div className="start-content">
                <h2>🐍 Word Snake</h2>
                <p>Collect letters in order to spell the word!</p>
                <ul>
                  <li>⬆️⬇️⬅️➡️ or WASD to move</li>
                  <li>🔤 Collect letters in ORDER</li>
                  <li>⚠️ Avoid wrong letters!</li>
                  <li>🎯 Complete 5 words to win</li>
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
                  <span>Words: {wordsCompleted}/5</span>
                </div>
              </div>

              {/* Target Word */}
              {targetWord && (
                <div className="target-section">
                  <span>Spell:</span>
                  <div className="word-progress">
                    {targetWord.word.split('').map((char, idx) => (
                      <span 
                        key={idx} 
                        className={`letter-box ${idx < collectedLetters.length ? 'collected' : idx === collectedLetters.length ? 'next' : ''}`}
                      >
                        {idx < collectedLetters.length ? char.toUpperCase() : '_'}
                      </span>
                    ))}
                  </div>
                  <button className="speak-btn" onClick={() => speakWord(targetWord.word)}>
                    🔊
                  </button>
                </div>
              )}

              {/* Game Grid */}
              <div className="game-grid">
                {/* Snake */}
                {snake.map((segment, idx) => (
                  <div
                    key={`snake-${idx}`}
                    className={`snake-segment ${idx === 0 ? 'head' : ''}`}
                    style={{
                      left: `${segment.x * CELL_SIZE}%`,
                      top: `${segment.y * CELL_SIZE}%`,
                      width: `${CELL_SIZE}%`,
                      height: `${CELL_SIZE}%`,
                    }}
                  >
                    {idx === 0 && '🐍'}
                  </div>
                ))}

                {/* Letters */}
                {letters.map((letter, idx) => (
                  <div
                    key={`letter-${idx}`}
                    className={`grid-letter ${letter.isTarget ? 'target' : 'decoy'}`}
                    style={{
                      left: `${letter.position.x * CELL_SIZE}%`,
                      top: `${letter.position.y * CELL_SIZE}%`,
                      width: `${CELL_SIZE}%`,
                      height: `${CELL_SIZE}%`,
                    }}
                  >
                    {letter.char}
                  </div>
                ))}

                {isPaused && (
                  <div className="pause-overlay">
                    <span>PAUSED</span>
                    <p>Press SPACE to continue</p>
                  </div>
                )}
              </div>

              {/* Mobile Controls */}
              <div className="mobile-controls">
                <div className="control-row">
                  <button className="d-btn" onClick={() => directionRef.current !== 'down' && setDirection('up')}>⬆️</button>
                </div>
                <div className="control-row">
                  <button className="d-btn" onClick={() => directionRef.current !== 'right' && setDirection('left')}>⬅️</button>
                  <button className="d-btn" onClick={() => directionRef.current !== 'up' && setDirection('down')}>⬇️</button>
                  <button className="d-btn" onClick={() => directionRef.current !== 'left' && setDirection('right')}>➡️</button>
                </div>
              </div>
            </>
          )}

          {/* Game Over */}
          {gameOver && (
            <div className="game-end-modal">
              <div className="modal-content">
                <h2>{wordsCompleted >= 5 ? '🏆 You Won!' : '💪 Good Try!'}</h2>
                <div className="final-stats">
                  <p>🎯 Score: {score}</p>
                  <p>📝 Words: {wordsCompleted}/5</p>
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
        .word-snake-wrapper {
          min-height: 100vh;
          padding: 20px;
        }

        .word-snake-container {
          max-width: 500px;
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
          max-width: 260px;
        }

        .start-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
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

        .word-progress {
          display: flex;
          gap: 4px;
        }

        .letter-box {
          width: 30px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(var(--muted));
          border-radius: 6px;
          font-weight: 700;
          font-size: 18px;
        }

        .letter-box.collected {
          background: #22c55e;
          color: white;
        }

        .letter-box.next {
          border: 2px solid #fbbf24;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .speak-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .game-grid {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          background: linear-gradient(135deg, #1e293b, #334155);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .snake-segment {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.1s linear;
        }

        .snake-segment.head {
          z-index: 10;
        }

        .grid-letter {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .grid-letter.target {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1e293b;
        }

        .grid-letter.decoy {
          background: linear-gradient(135deg, #94a3b8, #64748b);
          color: white;
        }

        .pause-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          font-weight: 700;
        }

        .pause-overlay p {
          font-size: 14px;
          margin-top: 12px;
        }

        .mobile-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .control-row {
          display: flex;
          gap: 8px;
        }

        .d-btn {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          border: 2px solid hsl(var(--border));
          background: hsl(var(--card));
          font-size: 24px;
          cursor: pointer;
        }

        .d-btn:active {
          background: hsl(var(--primary));
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

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
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
