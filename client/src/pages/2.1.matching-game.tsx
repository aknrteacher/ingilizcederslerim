import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import "../styles/2.1.matching-game.css";

interface VocabularyItem {
  word: string;
  file: string;
  turkish: string;
}

interface MatchPair {
  word: string;
  imageUrl: string;
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

  const [wordList, setWordList] = useState<MatchPair[]>([]);
  const [pictureList, setPictureList] = useState<MatchPair[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Initialize game with 10 random words
  useEffect(() => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, 10);
    const words = shuffled.map((item) => ({
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
    }));
    setWordList(words);
    
    // Shuffle pictures
    const pictures = [...words].sort(() => Math.random() - 0.5);
    setPictureList(pictures);
    
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

  // Check for game completion
  useEffect(() => {
    if (wordList.length > 0 && matches.length === wordList.length) {
      setGameComplete(true);
    }
  }, [matches, wordList.length]);

  const handleWordClick = (word: string) => {
    if (matches.includes(word)) return;
    setSelectedWord(selectedWord === word ? null : word);
  };

  const handlePictureClick = (imageUrl: string) => {
    if (!selectedWord || gameComplete) return;
    
    // Find the matching word
    const matchingWord = wordList.find((w) => w.imageUrl === imageUrl);
    if (matchingWord && matchingWord.word === selectedWord) {
      setMatches([...matches, selectedWord]);
      setSelectedWord(null);
    } else {
      setSelectedWord(null);
    }
  };

  const resetGame = () => {
    setMatches([]);
    setSelectedWord(null);
    setGameComplete(false);
    setElapsedTime(0);
    setStartTime(Date.now());
    
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, 10);
    const words = shuffled.map((item) => ({
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
    }));
    setWordList(words);
    
    const pictures = [...words].sort(() => Math.random() - 0.5);
    setPictureList(pictures);
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
            <p className="game-subtitle">Kelimeleri doğru resimle eşleştir</p>
          </div>
          <div className="game-timer" data-testid="text-timer">
            ⏱️ {formatTime(elapsedTime)}
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
                  <strong>Eşleşen Kelimeler:</strong> {matches.length} / {wordList.length}
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
                <a href="/oyunlar" className="btn-secondary">
                  Oyunlara Dön
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="game-board">
          <div className="game-column">
            <h3 className="column-title">Kelimeler</h3>
            <div className="cards-container">
              {wordList.map((item) => (
                <button
                  key={item.word}
                  onClick={() => handleWordClick(item.word)}
                  className={`word-card ${
                    selectedWord === item.word ? "selected" : ""
                  } ${matches.includes(item.word) ? "matched" : ""}`}
                  data-testid={`card-word-${item.word}`}
                  disabled={matches.includes(item.word)}
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>

          <div className="game-column">
            <h3 className="column-title">Resimler</h3>
            <div className="cards-container">
              {pictureList.map((item) => (
                <button
                  key={item.imageUrl}
                  onClick={() => handlePictureClick(item.imageUrl)}
                  className={`picture-card ${
                    matches.find((m) => wordList.find((w) => w.word === m)?.imageUrl === item.imageUrl)
                      ? "matched"
                      : ""
                  }`}
                  data-testid={`card-picture-${item.word}`}
                  disabled={matches.find((m) => wordList.find((w) => w.word === m)?.imageUrl === item.imageUrl) !== undefined}
                >
                  <img src={item.imageUrl} alt={item.word} />
                </button>
              ))}
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
            <ArrowLeft className="h-4 w-4" /> Oyunlara Dön
          </a>
        </div>
      </div>
    </Layout>
  );
}
