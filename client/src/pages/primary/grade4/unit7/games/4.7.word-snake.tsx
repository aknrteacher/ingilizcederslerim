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
  { word: "job", file: "job.png", turkish: "iş, meslek" },
  { word: "teacher", file: "teacher.png", turkish: "öğretmen" },
  { word: "doctor", file: "doctor.png", turkish: "doktor" },
  { word: "nurse", file: "nurse.png", turkish: "hemşire" },
  { word: "writer", file: "writer.png", turkish: "yazar" },
  { word: "vet", file: "vet.png", turkish: "veteriner" },
  { word: "firefighter", file: "firefighter.png", turkish: "itfaiyeci" },
  { word: "waiter", file: "waiter.png", turkish: "garson" },
  { word: "farmer", file: "farmer.png", turkish: "çiftçi" },
  { word: "actor, actress", file: "actor, actress.png", turkish: "erkek oyuncu, kadın oyuncu" },
  { word: "pilot", file: "pilot.png", turkish: "pilot" },
  { word: "dancer", file: "dancer.png", turkish: "dansçı" },
  { word: "singer", file: "singer.png", turkish: "şarkıcı" },
  { word: "businessman", file: "businessman.png", turkish: "iş adamı" },
  { word: "musician", file: "musician.png", turkish: "müzisyen" },
  { word: "chef", file: "chef.png", turkish: "şef" },
  { word: "dentist", file: "dentist.png", turkish: "diş hekimi" },
  { word: "police officer", file: "police officer.png", turkish: "polis" },
  { word: "student", file: "student.png", turkish: "öğrenci" },
  { word: "fire station", file: "fire station.png", turkish: "itfaiye" },
  { word: "hospital", file: "hospital.png", turkish: "hastane" },
  { word: "restaurant", file: "restaurant.png", turkish: "restoran" },
  { word: "farm", file: "farm.png", turkish: "çiftlik" },
  { word: "police station", file: "police station.png", turkish: "polis karakolu" },
  { word: "airport", file: "airport.png", turkish: "havaalanı" },
  { word: "work", file: "work.png", turkish: "çalışmak" },
  { word: "like", file: "like.png", turkish: "sevmek" },
  { word: "plane", file: "plane.png", turkish: "uçak" },
  { word: "help", file: "help.png", turkish: "yardım etmek" },
  { word: "cook", file: "cook.png", turkish: "yemek yapmak" },
  { word: "write", file: "write.png", turkish: "yazmak" },
  { word: "where", file: "where.png", turkish: "nerede" },
  { word: "teach", file: "teach.png", turkish: "öğretmek" },
  { word: "because", file: "because.png", turkish: "çünkü" },
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

const GRID_SIZE = 20;
const CELL_SIZE = 100 / GRID_SIZE;

export default function WordSnakeGame4_7() {
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
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to center the game when page loads
  useEffect(() => {
    if (gameContainerRef.current) {
      setTimeout(() => {
        gameContainerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, []);

  // Keep direction ref updated
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const speakWord = useCallback((text: string) => {
    if (!text) return;
    try {
      // Cancel any ongoing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      // Small delay to ensure cancel completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-GB';
        utterance.rate = 0.85;
        utterance.volume = 1;
        
        utterance.onstart = () => console.log('Speaking:', text);
        utterance.onerror = (e) => console.error('Speech error:', e);
        
        window.speechSynthesis.speak(utterance);
      }, 100);
    } catch (error) {
      console.error('Error speaking word:', error);
    }
  }, []);

  const speakLetter = useCallback((letter: string) => {
    if (!letter) return;
    try {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = 'en-GB';
      utterance.rate = 1.0;
      utterance.volume = 1;
      utterance.pitch = 1.2;
      
      utterance.onstart = () => console.log('Speaking letter:', letter);
      utterance.onerror = (e) => console.error('Letter speech error:', e);
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error speaking letter:', error);
    }
  }, []);

  const playBuzzSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/low.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.error('Error playing sound:', err));
    } catch (error) {
      console.error('Error playing buzz sound:', error);
    }
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
    // Speak the word automatically with longer delay
    setTimeout(() => {
      console.log('Attempting to speak word:', vocab.word);
      speakWord(vocab.word);
    }, 800);
  }, [snake, getRandomPosition, collectedLetters.length, speakWord]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setSnake([{ x: 10, y: 10 }]);
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
          return [{ x: 10, y: 10 }]; // Reset snake position
        }

        // Move snake: add new head, remove tail (unless we just ate a letter)
        return [newHead, ...prevSnake.slice(0, prevSnake.length - 1)];
      });
    }, 350);

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
        // Grow the snake by adding a segment
        setSnake(prev => [...prev, prev[prev.length - 1]]);
        
        // Play letter sound
        console.log('Collected letter:', hitLetter.char);
        setTimeout(() => speakLetter(hitLetter.char), 50);

        // Check if word is complete
        if (collectedLetters.length + 1 === targetWord.word.length) {
          setScore(prev => prev + 20);
          setWordsCompleted(prev => prev + 1);
          
          // Speak the completed word
          setTimeout(() => {
            console.log('Word completed, speaking:', targetWord.word);
            speakWord(targetWord.word);
          }, 600);
          
          if (wordsCompleted + 1 >= 5) {
            // Win!
            setGameOver(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } else {
            setTimeout(() => setupWord(), 2000);
          }
        }
      } else if (hitLetter.isTarget) {
        // Wrong order - put it back in a new position
        playBuzzSound();
        setLives(prev => prev - 1);
        const occupied = [...snake, ...letters.filter(l => l !== hitLetter).map(l => l.position)];
        const newPos = getRandomPosition(occupied);
        setLetters(prev => prev.map(l => l === hitLetter ? { ...l, position: newPos } : l));
      } else {
        // Decoy letter - put it back in a new position
        playBuzzSound();
        setScore(prev => Math.max(0, prev - 2));
        const occupied = [...snake, ...letters.filter(l => l !== hitLetter).map(l => l.position)];
        const newPos = getRandomPosition(occupied);
        setLetters(prev => prev.map(l => l === hitLetter ? { ...l, position: newPos } : l));
      }
    }
  }, [snake, letters, targetWord, collectedLetters, gameStarted, gameOver, wordsCompleted, setupWord, speakWord, speakLetter, playBuzzSound, getRandomPosition]);

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
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current !== 'up') setDirection('down');
          break;
        case 'ArrowLeft':
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current !== 'right') setDirection('left');
          break;
        case 'ArrowRight':
          e.preventDefault(); // Prevent page scroll
          if (directionRef.current !== 'left') setDirection('right');
          break;
        case 'w':
        case 'W':
          if (directionRef.current !== 'down') setDirection('up');
          break;
        case 's':
        case 'S':
          if (directionRef.current !== 'up') setDirection('down');
          break;
        case 'a':
        case 'A':
          if (directionRef.current !== 'right') setDirection('left');
          break;
        case 'd':
        case 'D':
          if (directionRef.current !== 'left') setDirection('right');
          break;
        case ' ':
          e.preventDefault(); // Prevent page scroll
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
        <div className="word-snake-container" ref={gameContainerRef}>
          <PrimarySchoolGameHeader
            gameName="Snake"
            description="Grade 4 - Unit 7: Jobs: Fun with Science"
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
              {/* Stats Bar - Outside the grid */}
              <div className="game-stats-bar">
                <div className="compact-stats">
                  <div className="stat-compact">
                    <Trophy className="h-3 w-3" />
                    <span>{score}</span>
                  </div>
                  <div className="stat-compact">
                    <span>{Array(lives).fill('❤️').join('')}</span>
                  </div>
                  <div className="stat-compact">
                    <span>{wordsCompleted}/5</span>
                  </div>
                </div>
                
                {targetWord && (
                  <div className="target-overlay">
                    <div className="word-progress-compact">
                      {targetWord.word.split('').map((char, idx) => (
                        <span 
                          key={idx} 
                          className={`letter-box-small ${idx < collectedLetters.length ? 'collected' : idx === collectedLetters.length ? 'next' : ''}`}
                        >
                          {idx < collectedLetters.length ? char.toUpperCase() : '_'}
                        </span>
                      ))}
                    </div>
                    <button 
                      className="speak-btn-compact" 
                      onClick={() => {
                        console.log('Button clicked, speaking:', targetWord.word);
                        speakWord(targetWord.word);
                      }} 
                      title="Listen to word"
                    >
                      🔊
                    </button>
                  </div>
                )}
              </div>

              {/* Game Grid */}
              <div 
                className="game-grid"
                style={{
                  backgroundImage: targetWord ? `url(/images/primary/4.7/${targetWord.file})` : 'none'
                }}
              >
                {/* Snake */}
                {snake.map((segment, idx) => (
                  <div
                    key={`snake-${idx}`}
                    className={`snake-segment ${idx === 0 ? 'head' : 'body'}`}
                    style={{
                      left: `${segment.x * CELL_SIZE}%`,
                      top: `${segment.y * CELL_SIZE}%`,
                      width: `${CELL_SIZE}%`,
                      height: `${CELL_SIZE}%`,
                    }}
                  />
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
                  <Button variant="outline" onClick={() => setLocation("/primary-school/grade-4/unit-7/games")}>
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
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-4/unit-7/games")}>
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .word-snake-wrapper {
          min-height: calc(100vh - 80px);
          padding: 10px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .word-snake-container {
          max-width: 550px;
          width: 100%;
          margin: 0 auto;
        }
        
        @media (max-height: 800px) {
          .word-snake-container {
            max-width: 480px;
          }
        }
        
        @media (max-height: 700px) {
          .word-snake-container {
            max-width: 420px;
          }
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

        .game-stats-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: linear-gradient(135deg, #1e293b, #334155);
          border-radius: 12px 12px 0 0;
          margin-bottom: 0;
        }

        .compact-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stat-compact {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          color: white;
        }

        .target-overlay {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          padding: 6px 10px;
          border-radius: 8px;
        }

        .word-progress-compact {
          display: flex;
          gap: 4px;
        }

        .letter-box-small {
          width: 26px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          font-weight: 700;
          font-size: 15px;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .letter-box-small.collected {
          background: #22c55e;
          color: white;
          border-color: #16a34a;
        }

        .letter-box-small.next {
          border: 2px solid #fbbf24;
          animation: pulse 1s infinite;
          background: rgba(251, 191, 36, 0.2);
        }

        .speak-btn-compact {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(34, 197, 94, 0.4);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .speak-btn-compact:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 10px rgba(34, 197, 94, 0.5);
        }

        .speak-btn-compact:active {
          transform: scale(0.95);
        }


        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .game-grid {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          background-color: #1e293b;
          background-position: center;
          background-size: 50%;
          background-repeat: no-repeat;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .game-grid::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(51, 65, 85, 0.7));
          pointer-events: none;
          z-index: 0;
        }

        .snake-segment {
          position: absolute;
          border-radius: 2px;
          transition: all 0.1s linear;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
          z-index: 10;
        }

        .snake-segment.head {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          z-index: 20;
          border: 2px solid #15803d;
        }

        .snake-segment.body {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          border: 1px solid #16a34a;
          z-index: 15;
        }

        .grid-letter {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          border-radius: 50%;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .grid-letter.target {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #1e293b;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.5);
        }

        .grid-letter.decoy {
          background: linear-gradient(135deg, #94a3b8, #64748b);
          color: white;
          box-shadow: 0 2px 8px rgba(148, 163, 184, 0.4);
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
          gap: 4px;
          margin-bottom: 8px;
          margin-top: 4px;
        }

        .control-row {
          display: flex;
          gap: 6px;
        }

        .d-btn {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          border: 2px solid hsl(var(--border));
          background: hsl(var(--card));
          font-size: 20px;
          cursor: pointer;
        }

        .d-btn:active {
          background: hsl(var(--primary));
        }
        
        @media (max-height: 700px) {
          .d-btn {
            width: 44px;
            height: 44px;
            font-size: 18px;
          }
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
