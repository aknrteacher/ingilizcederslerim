import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, RefreshCw, Trophy, Clock, Grid3X3 } from "lucide-react";
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
  { word: "Monday", file: "Monday.png", turkish: "Pazartesi" },
  { word: "Tuesday", file: "Tuesday.png", turkish: "Salı" },
  { word: "Friday", file: "Friday.png", turkish: "Cuma" },
];

interface Card {
  id: string;
  word: string;
  file: string;
  type: 'word' | 'picture';
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryFlipGame() {
  const [, setLocation] = useLocation();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [pairCount, setPairCount] = useState(6);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeGame = (pairs: number) => {
    const shuffledVocab = [...allVocabulary].sort(() => Math.random() - 0.5).slice(0, pairs);
    
    const gameCards: Card[] = [];
    
    shuffledVocab.forEach((vocab, index) => {
      // Word card
      gameCards.push({
        id: `word-${index}`,
        word: vocab.word,
        file: vocab.file,
        type: 'word',
        isFlipped: false,
        isMatched: false,
      });
      // Picture card
      gameCards.push({
        id: `picture-${index}`,
        word: vocab.word,
        file: vocab.file,
        type: 'picture',
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameComplete(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    initializeGame(pairCount);
  }, [pairCount]);

  // Timer
  useEffect(() => {
    if (!startTime || gameComplete) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === pairCount && pairCount > 0) {
      setGameComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [matchedPairs, pairCount]);

  const speakWord = (text: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;
    
    const voices = speechSynthesis.getVoices();
    const englishVoice = 
      voices.find(voice => voice.lang === 'en-GB') ||
      voices.find(voice => voice.lang.startsWith('en-GB')) ||
      voices.find(voice => voice.lang === 'en-US') ||
      voices.find(voice => voice.lang.startsWith('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis?.speak(utterance);
  };

  const handleCardClick = (cardId: string) => {
    if (isProcessing) return;
    
    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;
    if (flippedCards.length >= 2) return;

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    // Speak the word
    speakWord(clickedCard.word);

    // Check for match if two cards are flipped
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsProcessing(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.word === secondCard.word && firstCard.type !== secondCard.type) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.word === firstCard.word ? { ...c, isMatched: true } : c
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetGame = () => {
    initializeGame(pairCount);
  };

  const shareGame = () => {
    const text = `I matched ${pairCount} pairs in ${formatTime(elapsedTime)} with ${moves} moves on Memory Flip! 🧠`;
    if (navigator.share) {
      navigator.share({ title: "Memory Flip", text, url: window.location.href });
    }
  };

  const getGridCols = () => {
    if (pairCount <= 4) return 4;
    if (pairCount <= 6) return 4;
    return 4;
  };

  return (
    <Layout>
      <div className="memory-flip-wrapper primary-school-game" id="memory-flip-game">
        <div className="memory-flip-container">
          <PrimarySchoolGameHeader
            gameName="Memory"
            description="Grade 2 - Theme 1: School Life"
            containerId="memory-flip-game"
            icon={<Grid3X3 className="h-7 w-7 text-green-600" />}
          />

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{matchedPairs}/{pairCount}</span>
            </div>
            <div className="stat-item">
              <span>Moves: {moves}</span>
            </div>
            <div className="stat-item">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="difficulty-bar">
            <span>Pairs:</span>
            {[4, 6, 8].map(num => (
              <button
                key={num}
                className={`diff-btn ${pairCount === num ? 'active' : ''}`}
                onClick={() => setPairCount(num)}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Game Board */}
          {!gameComplete && (
            <div 
              className="game-board"
              style={{ gridTemplateColumns: `repeat(${getGridCols()}, 1fr)` }}
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <span>?</span>
                    </div>
                    <div className="card-back">
                      {card.type === 'word' ? (
                        <span className="word-text">{card.word}</span>
                      ) : (
                        <img src={`/images/primary/2.1/${card.file}`} alt={card.word} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Game Complete */}
          {gameComplete && (
            <div className="game-end-modal">
              <div className="modal-content">
                <h2>🎉 Excellent!</h2>
                <p>You matched all {pairCount} pairs!</p>
                <div className="final-stats">
                  <p>⏱️ Time: {formatTime(elapsedTime)}</p>
                  <p>🎯 Moves: {moves}</p>
                  <p>⭐ Efficiency: {Math.round((pairCount / moves) * 100)}%</p>
                </div>
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
        .memory-flip-wrapper {
          min-height: 100vh;
          padding: 20px;
        }

        .memory-flip-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 20px;
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

        .difficulty-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .diff-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid hsl(var(--border));
          background: hsl(var(--card));
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .diff-btn:hover {
          border-color: hsl(var(--primary));
        }

        .diff-btn.active {
          background: hsl(var(--primary));
          color: white;
          border-color: hsl(var(--primary));
        }

        .game-board {
          display: grid;
          gap: 12px;
          max-width: 600px;
          margin: 0 auto;
        }

        .memory-card {
          aspect-ratio: 1;
          perspective: 1000px;
          cursor: pointer;
        }

        .card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }

        .memory-card.flipped .card-inner,
        .memory-card.matched .card-inner {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid hsl(var(--border));
        }

        .card-front {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-size: 32px;
          font-weight: bold;
        }

        .card-back {
          background: hsl(var(--card));
          transform: rotateY(180deg);
          padding: 8px;
          overflow: hidden;
        }

        .card-back img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .card-back .word-text {
          font-size: clamp(12px, 3vw, 18px);
          font-weight: 700;
          text-align: center;
          color: hsl(var(--foreground));
          word-break: break-word;
        }

        .memory-card.matched .card-inner {
          opacity: 0.6;
        }

        .memory-card.matched .card-back {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
        }

        .memory-card:hover:not(.flipped):not(.matched) .card-front {
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
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
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, #fef3c7, #fcd34d);
          padding: 40px;
          border-radius: 24px;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .modal-content h2 {
          font-size: 32px;
          margin-bottom: 16px;
          color: #92400e;
        }

        .modal-content p {
          font-size: 18px;
          color: #78350f;
          margin-bottom: 8px;
        }

        .final-stats {
          background: rgba(255, 255, 255, 0.5);
          padding: 16px;
          border-radius: 12px;
          margin: 16px 0;
        }

        .final-stats p {
          margin: 4px 0;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }
      `}</style>
    </Layout>
  );
}
