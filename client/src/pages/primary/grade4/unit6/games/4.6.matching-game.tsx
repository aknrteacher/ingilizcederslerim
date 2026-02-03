import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Zap, Puzzle, Trophy, Clock } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import "@/styles/4.6.matching-game.css";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

interface GameCard {
  id: string;
  word: string;
  imageUrl: string;
  turkish: string;
  type: "word" | "picture";
}

const getRandomHatchling = () => {
  const hatchlingCount = 16;
  const randomNum = Math.floor(Math.random() * hatchlingCount) + 1;
  return `/images/hatchlings/hatchling${randomNum}.png`;
};

export default function MatchingGame4_6() {
  const [, setLocation] = useLocation();
  const allVocabulary = [
    { word: "fun", file: "fun.png", turkish: "eğlence" },
    { word: "science", file: "science.png", turkish: "bilim" },
    { word: "colour", file: "colour.png", turkish: "renk" },
    { word: "rainbow", file: "rainbow.png", turkish: "gökkuşağı" },
    { word: "tail", file: "tail.png", turkish: "kuyruk" },
    { word: "bowl", file: "bowl.png", turkish: "kase" },
    { word: "milk", file: "milk.png", turkish: "süt" },
    { word: "dish", file: "dish.png", turkish: "tabak" },
    { word: "soap", file: "soap.png", turkish: "sabun" },
    { word: "cotton", file: "cotton.png", turkish: "pamuk" },
    { word: "food", file: "food.png", turkish: "yiyecek" },
    { word: "primary", file: "primary.png", turkish: "birincil" },
    { word: "secondary", file: "secondary.png", turkish: "ikincil" },
    { word: "mix", file: "mix.png", turkish: "karıştırmak" },
    { word: "get", file: "get.png", turkish: "almak" },
    { word: "paint", file: "paint.png", turkish: "boya" },
    { word: "brush", file: "brush.png", turkish: "fırça" },
    { word: "box", file: "box.png", turkish: "kutu" },
    { word: "in front of", file: "in front of.png", turkish: "önünde" },
    { word: "behind", file: "behind.png", turkish: "arkasında" },
    { word: "near", file: "near.png", turkish: "yakın" },
    { word: "salt", file: "salt.png", turkish: "tuz" },
    { word: "saucepan", file: "saucepan.png", turkish: "tencere" },
    { word: "clock", file: "clock.png", turkish: "saat" },
    { word: "table", file: "table.png", turkish: "masa" },
    { word: "cup", file: "cup.png", turkish: "fincan" },
    { word: "board", file: "board.png", turkish: "tahta" },
    { word: "scale", file: "scale.png", turkish: "terazi" },
    { word: "bed", file: "bed.png", turkish: "yatak" },
    { word: "paper", file: "paper.png", turkish: "kağıt" },
    { word: "look", file: "look.png", turkish: "bakmak" },
    { word: "stone", file: "stone.png", turkish: "taş" },
    { word: "charcoal", file: "charcoal.png", turkish: "kömür" },
    { word: "jar", file: "jar.png", turkish: "kavanoz" },
    { word: "soil", file: "soil.png", turkish: "toprak" },
    { word: "plant", file: "plant.png", turkish: "bitki" },
    { word: "lid", file: "lid.png", turkish: "kapak" },
    { word: "candle", file: "candle.png", turkish: "mum" },
    { word: "liquid", file: "liquid.png", turkish: "sıvı" },
    { word: "heat", file: "heat.png", turkish: "ısı" },
    { word: "glass", file: "glass.png", turkish: "cam" },
    { word: "shake", file: "shake.png", turkish: "sallamak" },
    { word: "flower", file: "flower.png", turkish: "çiçek" },
    { word: "result", file: "result.png", turkish: "sonuç" },
  ];

  const selectRandomCards = (count: number) => {
    const shuffled = [...allVocabulary].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const [selectedCards, setSelectedCards] = useState(selectRandomCards(10));

  const [wordCards, setWordCards] = useState<GameCard[]>([]);
  const [pictureCards, setPictureCards] = useState<GameCard[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(true);
  const [hoveredPictureWord, setHoveredPictureWord] = useState<string | null>(null);
  const [showHatchingSequence, setShowHatchingSequence] = useState(false);
  const [hintCardId, setHintCardId] = useState<string | null>(null);
  const [selectedHatchling, setSelectedHatchling] = useState<string>(getRandomHatchling());

  const eggHatchStages = [0, 3, 5, 7, 10];
  const currentStage = eggHatchStages.findIndex((stage) => matches.length <= stage) - 1;

  // Initialize game
  useEffect(() => {
    const words: GameCard[] = selectedCards.map((item, idx) => ({
      id: `word-${idx}`,
      word: item.word,
      imageUrl: `/images/primary/4.6/${item.file}`,
      turkish: item.turkish,
      type: "word",
    }));

    const pictures: GameCard[] = selectedCards.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/primary/4.6/${item.file}`,
      turkish: item.turkish,
      type: "picture",
    }));

    setWordCards(words.sort(() => Math.random() - 0.5));
    setPictureCards(pictures.sort(() => Math.random() - 0.5));
    setStartTime(Date.now());

    // Show hint animation on first word after a short delay
    setTimeout(() => {
      if (words.length > 0) {
        setHintCardId(words[0].id);
        
        // Clear hint after animation
        setTimeout(() => {
          setHintCardId(null);
        }, 1000);
      }
    }, 800);
  }, [selectedCards]);

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
    if (gameStarted && selectedCards.length > 0 && matches.length === selectedCards.length) {
      setSelectedHatchling(getRandomHatchling());
      setShowHatchingSequence(true);
      setTimeout(() => {
        setGameComplete(true);
      }, 8000); // 3s crack + 5s hatch
    }
  }, [matches, gameStarted, selectedCards]);

  const speakWord = (word: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis?.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis?.speak(utterance);
  };

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId);
    
    // Speak the word if it's from word cards
    const wordCard = wordCards.find((c) => c.id === cardId);
    if (wordCard) {
      speakWord(wordCard.word);
    }
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
    setElapsedTime(0);
    setShowHatchingSequence(false);
    setHintCardId(null);

    const newCards = selectRandomCards(10);
    setSelectedCards(newCards);

    const words: GameCard[] = newCards.map((item, idx) => ({
      id: `word-${idx}`,
      word: item.word,
      imageUrl: `/images/primary/4.6/${item.file}`,
      turkish: item.turkish,
      type: "word",
    }));

    const pictures: GameCard[] = newCards.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/primary/4.6/${item.file}`,
      turkish: item.turkish,
      type: "picture",
    }));

    const shuffledWords = words.sort(() => Math.random() - 0.5);
    const shuffledPictures = pictures.sort(() => Math.random() - 0.5);
    
    setWordCards(shuffledWords);
    setPictureCards(shuffledPictures);
    setStartTime(Date.now());

    // Show hint animation on first word after a short delay
    setTimeout(() => {
      if (shuffledWords.length > 0) {
        setHintCardId(shuffledWords[0].id);
        
        // Clear hint after animation
        setTimeout(() => {
          setHintCardId(null);
        }, 1000);
      }
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const shareGame = () => {
    const text = `I just scored ${formatTime(elapsedTime)} on Matchlings Unit 6! Can you beat my time? 🎮`;
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
    const text = `Challenge me on Matchlings Unit 6! Can you match all the words faster than my ${formatTime(elapsedTime)}? 🏆`;
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
    <Layout>
      <div className="matching-game-wrapper primary-school-game" id="matchlings-game">
        <div className="matching-game-container">
          <>
            <PrimarySchoolGameHeader 
              gameName="Matchlings"
              description="Grade 4 - Unit 6: Fun with Science"
              containerId="matchlings-game"
              icon={<Puzzle className="h-7 w-7 text-blue-600" />}
            />
            
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap mb-4">
              <div className="flex items-center gap-2 bg-blue-100 px-2 sm:px-3 py-1 rounded-lg">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="font-bold text-blue-700 text-sm sm:text-base">{matches.length} / {selectedCards.length}</span>
              </div>
              
              <div className="bg-blue-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="font-bold text-blue-700 text-sm sm:text-base" data-testid="text-timer">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>

              <div className="game-board relative">
                {/* Hatching Sequence - Contained within game board */}
                {showHatchingSequence && !gameComplete && (
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
                      <img src={selectedHatchling} alt="Hatchling!" />
                    </div>
                  </div>
                )}

                {/* Win Modal - Contained within game board */}
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
                        <Button variant="ghost" onClick={() => setLocation("/primary-school/grade-4/unit-6/games")} className="btn-secondary">
                          Back to Games
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

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
                          className={`word-card ${draggedCard === card.id ? "dragging" : ""} ${hintCardId === card.id ? "hint-drag" : ""}`}
                          data-testid={`card-word-${card.word}-${card.id}`}
                        >
                          <span>{card.word}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

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
                          className={`picture-card ${draggedCard === card.id ? "dragging" : ""} ${hintCardId === card.id ? "hint-drag" : ""}`}
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
              </div>

              <div className="primary-school-game-footer">
                <div className="footer-content">
                  <div className="footer-left">
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
                  </div>
                  <div className="footer-right">
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="footer-button"
                      data-testid="button-reset-game"
                    >
                      New Game
                    </Button>
                    <Button
                      variant="outline"
                      className="footer-button"
                      onClick={() => setLocation("/primary-school/grade-4/unit-6/games")}
                    >
                      ← Back
                    </Button>
                  </div>
                </div>
              </div>
            </>
        </div>
      </div>
    </Layout>
  );
}
