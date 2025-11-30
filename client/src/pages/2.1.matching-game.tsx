import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import "../styles/2.1.matching-game.css";

interface GameCard {
  id: string;
  word: string;
  imageUrl: string;
  type: "word" | "picture";
}

export default function MatchingGame() {
  const allWords = [
    { word: "hello", file: "hello.png" },
    { word: "goodbye", file: "goodbye.png" },
    { word: "How are you", file: "how are you.png" },
    { word: "I am fine", file: "I m fine.png" },
    { word: "school", file: "school.png" },
    { word: "classroom", file: "classroom.png" },
    { word: "library", file: "library.png" },
    { word: "canteen", file: "canteen.png" },
    { word: "sports hall", file: "sports hall.png" },
    { word: "playground", file: "playground.png" },
  ];

  const [wordCards, setWordCards] = useState<GameCard[]>([]);
  const [pictureCards, setPictureCards] = useState<GameCard[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    const words: GameCard[] = allWords.map((item, idx) => ({
      id: `word-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      type: "word",
    }));

    const pictures: GameCard[] = allWords.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      type: "picture",
    }));

    // Shuffle both
    setWordCards(words.sort(() => Math.random() - 0.5));
    setPictureCards(pictures.sort(() => Math.random() - 0.5));
    setStartTime(Date.now());
  }, []);

  // Timer
  useEffect(() => {
    if (!startTime || gameComplete) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  // Check for completion
  useEffect(() => {
    if (allWords.length > 0 && matches.length === allWords.length) {
      setGameComplete(true);
    }
  }, [matches]);

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
      // Correct match
      setMatches([...matches, draggedCard_.word]);
    }

    setDraggedCard(null);
  };

  const resetGame = () => {
    setMatches([]);
    setDraggedCard(null);
    setGameComplete(false);
    setElapsedTime(0);

    const words: GameCard[] = allWords.map((item, idx) => ({
      id: `word-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      type: "word",
    }));

    const pictures: GameCard[] = allWords.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
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

  return (
    <Layout>
      <div className="matching-game-container">
        <div className="game-header">
          <div>
            <h1 className="game-title">Kelime - Resim Eşleştir</h1>
            <p className="game-subtitle">Kelimeleri resimle sürükle ve eşleştir</p>
          </div>
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Süre</span>
              <span className="stat-value" data-testid="text-timer">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Eşleşti</span>
              <span className="stat-value" data-testid="text-matched">
                {matches.length} / {allWords.length}
              </span>
            </div>
          </div>
        </div>

        {gameComplete && (
          <div className="win-modal">
            <div className="win-content">
              <h2>🎉 Tebrikler! 🎉</h2>
              <p>Tüm kelimeleri eşleştirdin!</p>
              <div className="win-stats">
                <p>
                  <strong>Süre:</strong> {formatTime(elapsedTime)}
                </p>
                <p>
                  <strong>Eşleşen Kelimeler:</strong> {matches.length} / {allWords.length}
                </p>
              </div>
              <div className="win-buttons">
                <button
                  onClick={resetGame}
                  className="btn-primary"
                  data-testid="button-play-again"
                >
                  Tekrar Oyna
                </button>
                <a href="/oyunlar" className="btn-secondary">
                  Oyunlara Dön
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="game-board">
          <div className="pictures-section">
            <h3 className="section-label">Resimler</h3>
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
                    data-testid={`card-picture-${card.word}-${card.id}`}
                  >
                    <img src={card.imageUrl} alt={card.word} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="words-section">
            <h3 className="section-label">Kelimeler</h3>
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
          <Button
            onClick={resetGame}
            variant="outline"
            className="reset-button"
            data-testid="button-reset-game"
          >
            Oyunu Sıfırla
          </Button>
          <a href="/oyunlar" className="back-link">
            ← Oyunlara Dön
          </a>
        </div>
      </div>
    </Layout>
  );
}
