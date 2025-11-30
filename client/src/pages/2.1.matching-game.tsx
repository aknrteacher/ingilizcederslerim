import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import "../styles/2.1.matching-game.css";

interface VocabularyCard {
  word: string;
  imageUrl: string;
  turkish: string;
}

interface GamePair {
  id: string;
  word: VocabularyCard;
  matched: boolean;
}

export default function MatchingGame() {
  const [, setLocation] = useLocation();
  const [gameCards, setGameCards] = useState<GamePair[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const imageFiles = [
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
    { word: "Wednesday", file: "Wednesday.png", turkish: "Çarşamba" },
    { word: "Thursday", file: "Thursday.png", turkish: "Perşembe" },
    { word: "Friday", file: "Friday.png", turkish: "Cuma" },
    { word: "Saturday", file: "Saturday.png", turkish: "Cumartesi" },
    { word: "Sunday", file: "Sunday.png", turkish: "Pazar" },
    { word: "what", file: "what.png", turkish: "ne" },
    { word: "where", file: "where.png", turkish: "nerede" },
    { word: "who", file: "who.png", turkish: "kim" },
  ];

  // Initialize game
  useEffect(() => {
    const shuffled = [...imageFiles].sort(() => Math.random() - 0.5);
    const cards: GamePair[] = shuffled.map((item, idx) => ({
      id: `${idx}`,
      word: {
        word: item.word,
        imageUrl: `/images/2.1/${item.file}`,
        turkish: item.turkish,
      },
      matched: false,
    }));
    setGameCards(cards);
  }, []);

  // Check for matches
  useEffect(() => {
    if (selectedCards.length === 2) {
      const [card1Id, card2Id] = selectedCards;
      const card1 = gameCards.find((c) => c.id === card1Id);
      const card2 = gameCards.find((c) => c.id === card2Id);

      if (card1 && card2) {
        if (card1.word.word === card2.word.word) {
          // Match found!
          setMatchedPairs([...matchedPairs, card1Id, card2Id]);
          setScore(score + 10);
          setSelectedCards([]);
        } else {
          // No match, deselect after delay
          setTimeout(() => {
            setSelectedCards([]);
          }, 800);
        }
        setMoves(moves + 1);
      }
    }
  }, [selectedCards, gameCards, matchedPairs, moves, score]);

  // Check for win
  useEffect(() => {
    if (
      gameCards.length > 0 &&
      matchedPairs.length === gameCards.length &&
      gameCards.length > 0
    ) {
      setGameWon(true);
    }
  }, [matchedPairs, gameCards.length]);

  const toggleCard = (id: string) => {
    if (
      selectedCards.includes(id) ||
      matchedPairs.includes(id) ||
      selectedCards.length === 2
    ) {
      return;
    }
    setSelectedCards([...selectedCards, id]);
  };

  const resetGame = () => {
    const shuffled = [...imageFiles].sort(() => Math.random() - 0.5);
    const cards: GamePair[] = shuffled.map((item, idx) => ({
      id: `${idx}`,
      word: {
        word: item.word,
        imageUrl: `/images/2.1/${item.file}`,
        turkish: item.turkish,
      },
      matched: false,
    }));
    setGameCards(cards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setGameWon(false);
  };

  return (
    <Layout>
      <div className="matching-game-container">
        <div className="game-header">
          <div className="header-top">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/oyunlar")}
              className="back-button"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="header-title">
              <h1>Kelime Eşleştirme Oyunu</h1>
              <p>Kelimeyi resmiyle eşleştir</p>
            </div>
          </div>

          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Hamle:</span>
              <span className="stat-value" data-testid="text-moves">
                {moves}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Puan:</span>
              <span className="stat-value" data-testid="text-score">
                {score}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Eşleşti:</span>
              <span className="stat-value" data-testid="text-matched">
                {matchedPairs.length / 2} / {gameCards.length}
              </span>
            </div>
          </div>
        </div>

        {gameWon && (
          <div className="win-modal">
            <div className="win-content">
              <h2>🎉 Tebrikler! 🎉</h2>
              <p>Tüm kelimeyi eşleştirdin!</p>
              <div className="win-stats">
                <p>
                  <strong>Toplam Hamle:</strong> {moves}
                </p>
                <p>
                  <strong>Puan:</strong> {score}
                </p>
              </div>
              <div className="win-buttons">
                <Button
                  onClick={resetGame}
                  className="btn-primary"
                  data-testid="button-play-again"
                >
                  Tekrar Oyna
                </Button>
                <Button
                  onClick={() => setLocation("/oyunlar")}
                  variant="outline"
                  data-testid="button-back-to-games"
                >
                  Oyunlara Dön
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="game-board">
          {gameCards.map((card) => (
            <div
              key={card.id}
              className={`game-card ${
                selectedCards.includes(card.id) ? "selected" : ""
              } ${matchedPairs.includes(card.id) ? "matched" : ""}`}
              onClick={() => toggleCard(card.id)}
              data-testid={`card-${card.word.word}-${card.id}`}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span className="card-number">?</span>
                </div>
                <div className="card-back">
                  {selectedCards.includes(card.id) ||
                  matchedPairs.includes(card.id) ? (
                    <>
                      <img
                        src={card.word.imageUrl}
                        alt={card.word.word}
                        className="card-image"
                      />
                      <span className="card-text">{card.word.word}</span>
                    </>
                  ) : (
                    <span className="card-number">?</span>
                  )}
                </div>
              </div>
            </div>
          ))}
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
        </div>
      </div>
    </Layout>
  );
}
