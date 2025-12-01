import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Zap } from "lucide-react";
import { FullscreenButton } from "@/components/FullscreenButton";
import hatchlingImage from "@assets/generated_images/cute_anime_character_mascot.png";
import "../styles/2.1.matching-game.css";

interface GameCard {
  id: string;
  word: string;
  imageUrl: string;
  turkish: string;
  type: "word" | "picture";
}

export default function MatchingGame() {
  const allWords = [
    { word: "hello", file: "hello.png", turkish: "merhaba" },
    { word: "goodbye", file: "goodbye.png", turkish: "hoşça kalın" },
    { word: "How are you", file: "how are you.png", turkish: "nasılsın" },
    { word: "I am fine", file: "I m fine.png", turkish: "iyiyim" },
    { word: "school", file: "school.png", turkish: "okul" },
    { word: "classroom", file: "classroom.png", turkish: "sınıf" },
    { word: "library", file: "library.png", turkish: "kütüphane" },
    { word: "canteen", file: "canteen.png", turkish: "kafeterya" },
    { word: "sports hall", file: "sports hall.png", turkish: "spor salonu" },
    { word: "playground", file: "playground.png", turkish: "oyun alanı" },
  ];

  const [wordCards, setWordCards] = useState<GameCard[]>([]);
  const [pictureCards, setPictureCards] = useState<GameCard[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hoveredPictureWord, setHoveredPictureWord] = useState<string | null>(null);
  const [showHatchingSequence, setShowHatchingSequence] = useState(false);

  const eggHatchStages = [0, 3, 5, 7, 10];
  const currentStage = eggHatchStages.findIndex((stage) => matches.length <= stage) - 1;

  // Initialize game
  useEffect(() => {
    const words: GameCard[] = allWords.map((item, idx) => ({
      id: `word-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      turkish: item.turkish,
      type: "word",
    }));

    const pictures: GameCard[] = allWords.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      turkish: item.turkish,
      type: "picture",
    }));

    setWordCards(words.sort(() => Math.random() - 0.5));
    setPictureCards(pictures.sort(() => Math.random() - 0.5));
    setStartTime(Date.now());
  }, []);

  // Timer
  useEffect(() => {
    if (!startTime || gameComplete || !gameStarted) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, gameComplete, gameStarted]);

  // Check for completion
  useEffect(() => {
    if (gameStarted && allWords.length > 0 && matches.length === allWords.length) {
      setShowHatchingSequence(true);
      setTimeout(() => {
        setGameComplete(true);
      }, 3500);
    }
  }, [matches, gameStarted]);

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetCardId: string) => {
    if (!draggedCard || draggedCard === targetCardId) {
      setDraggedCard(null);
      return;
    }

    const draggedFromWords = wordCards.some((c) => c.id === draggedCard);
    const draggedFromPictures = pictureCards.some((c) => c.id === draggedCard);

    let draggedCard_: GameCard | undefined;
    let targetCard: GameCard | undefined;

    if (draggedFromWords) {
      draggedCard_ = wordCards.find((c) => c.id === draggedCard);
      targetCard = pictureCards.find((c) => c.id === targetCardId);
    } else {
      draggedCard_ = pictureCards.find((c) => c.id === draggedCard);
      targetCard = wordCards.find((c) => c.id === targetCardId);
    }

    if (draggedCard_ && targetCard && draggedCard_.word === targetCard.word) {
      setMatches([...matches, draggedCard_.word]);
    }

    setDraggedCard(null);
  };

  const resetGame = () => {
    setMatches([]);
    setDraggedCard(null);
    setGameComplete(false);
    setGameStarted(false);
    setElapsedTime(0);
    setShowHatchingSequence(false);

    const words: GameCard[] = allWords.map((item, idx) => ({
      id: `word-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      turkish: item.turkish,
      type: "word",
    }));

    const pictures: GameCard[] = allWords.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      turkish: item.turkish,
      type: "picture",
    }));

    setWordCards(words.sort(() => Math.random() - 0.5));
    setPictureCards(pictures.sort(() => Math.random() - 0.5));
    setStartTime(Date.now());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const shareGame = () => {
    const text = `I just scored ${formatTime(elapsedTime)} on Matchlings! Can you beat my time? 🎮`;
    if (navigator.share) {
      navigator.share({
        title: "Matchlings",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `Challenge me on Matchlings! Can you match all the words faster than my ${formatTime(elapsedTime)}? 🏆`;
    if (navigator.share) {
      navigator.share({
        title: "Challenge on Matchlings",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  return (
    <div className="matching-game-fullscreen" id="matchlings-game">
      <div className="matching-game-container">
        {/* Opening Tutorial Animation */}
        {!gameStarted && (
          <div className="tutorial-animation">
            <div className="tutorial-inner">
              <h1 className="tutorial-title">Matchlings</h1>
              <p className="tutorial-subtitle">Match words to pictures and hatch your creature!</p>

              <div className="tutorial-steps-animated">
                <div className="tutorial-step-card">
                  <div className="step-number">1</div>
                  <div className="step-icon">👆</div>
                  <p>Drag a word</p>
                </div>

                <div className="tutorial-arrow">↓</div>

                <div className="tutorial-step-card">
                  <div className="step-number">2</div>
                  <div className="step-icon">📸</div>
                  <p>Drop on picture</p>
                </div>

                <div className="tutorial-arrow">↓</div>

                <div className="tutorial-step-card">
                  <div className="step-number">3</div>
                  <div className="step-icon">🐣</div>
                  <p>Watch it hatch!</p>
                </div>
              </div>

              <div className="tutorial-hint">
                💡 Hover over pictures to see the meaning in Turkish
              </div>

              <button
                onClick={() => {
                  console.log("Start button clicked");
                  setGameStarted(true);
                }}
                className="btn-start"
                data-testid="button-start-game"
                type="button"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameStarted && (
          <>
            <div className="game-header">
              <div className="header-left">
                <h1 className="game-title">Matchlings</h1>
                <p className="game-subtitle">Drag to match and hatch!</p>
              </div>

              <div className="egg-hatching">
                <div className={`egg egg-stage-${Math.max(0, currentStage)}`}>
                  <div className="egg-crack egg-crack-1"></div>
                  <div className="egg-crack egg-crack-2"></div>
                  <div className="egg-crack egg-crack-3"></div>
                  <div className="egg-crack egg-crack-4"></div>
                  <div className="egg-crack egg-crack-5"></div>
                </div>
                <span className="hatch-progress">{matches.length} / {allWords.length}</span>
              </div>

              <div className="game-stats">
                <div className="stat-item">
                  <span className="stat-label">Time</span>
                  <span className="stat-value" data-testid="text-timer">
                    {formatTime(elapsedTime)}
                  </span>
                </div>
                <FullscreenButton containerId="matchlings-game" />
              </div>
            </div>

            <div className="game-board">
              <div className="pictures-section">
                <div className="pictures-grid">
                  {pictureCards.map((card) => {
                    const isMatched = matches.includes(card.word);
                    if (isMatched) return null;
                    return (
                      <div
                        key={card.id}
                        draggable={true}
                        onDragStart={() => handleDragStart(card.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(card.id)}
                        className={`picture-card ${draggedCard === card.id ? "dragging" : ""}`}
                        onMouseEnter={() => setHoveredPictureWord(card.word)}
                        onMouseLeave={() => setHoveredPictureWord(null)}
                        data-testid={`card-picture-${card.word}-${card.id}`}
                      >
                        <img src={card.imageUrl} alt={card.word} />
                        {hoveredPictureWord === card.word && (
                          <div className="hint-tooltip">{card.turkish}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="words-section">
                <div className="words-grid">
                  {wordCards.map((card) => {
                    const isMatched = matches.includes(card.word);
                    if (isMatched) return null;
                    return (
                      <div
                        key={card.id}
                        draggable={true}
                        onDragStart={() => handleDragStart(card.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(card.id)}
                        className={`word-card ${draggedCard === card.id ? "dragging" : ""}`}
                        data-testid={`card-word-${card.word}-${card.id}`}
                      >
                        <span>{card.word}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="game-footer">
              <div className="footer-buttons">
                <Button
                  onClick={shareGame}
                  variant="outline"
                  className="footer-button"
                  data-testid="button-share"
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button
                  onClick={challengeFriend}
                  variant="outline"
                  className="footer-button"
                  data-testid="button-challenge"
                >
                  <Zap className="h-4 w-4" /> Challenge
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="footer-button"
                  data-testid="button-reset-game"
                >
                  New Game
                </Button>
              </div>
              <a href="/oyunlar" className="back-link">
                ← Back
              </a>
            </div>
          </>
        )}

        {/* Hatching Sequence */}
        {showHatchingSequence && (
          <div className="hatching-sequence">
            <div className="hatching-background"></div>
            <div className="egg-large">
              <div className="egg-crack egg-crack-1"></div>
              <div className="egg-crack egg-crack-2"></div>
              <div className="egg-crack egg-crack-3"></div>
              <div className="egg-crack egg-crack-4"></div>
              <div className="egg-crack egg-crack-5"></div>
              <div className="egg-crack egg-crack-6"></div>
              <div className="egg-shatter"></div>
            </div>
            <div className="hatchling-reveal">
              <img src={hatchlingImage} alt="Hatchling!" />
            </div>
          </div>
        )}

        {gameComplete && (
          <div className="win-modal">
            <div className="win-content">
              <h2>🎉 Perfect! 🎉</h2>
              <p>You hatched the Matchling!</p>
              <div className="win-stats">
                <p>
                  <strong>Time:</strong> {formatTime(elapsedTime)}
                </p>
                <p className="score-note">
                  {elapsedTime < 120 ? "⭐ Amazing speed!" : "✨ Great job!"}
                </p>
              </div>
              <div className="win-buttons">
                <button onClick={resetGame} className="btn-primary" data-testid="button-play-again">
                  Play Again
                </button>
                <a href="/oyunlar" className="btn-secondary">
                  Back to Games
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
