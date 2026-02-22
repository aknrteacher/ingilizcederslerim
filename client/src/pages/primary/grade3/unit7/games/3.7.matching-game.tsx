import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Zap, Puzzle, Trophy, Clock } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import "@/styles/3.1.matching-game.css";
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

export default function MatchingGame() {
  const [, setLocation] = useLocation();
  const allVocabulary = [
    { word: "building", file: "building.png", turkish: "bina" },
    { word: "place", file: "place.png", turkish: "yer" },
    { word: "school", file: "school.png", turkish: "okul" },
    { word: "library", file: "library.png", turkish: "kütüphane" },
    { word: "shopping centre", file: "shopping centre.png", turkish: "alışveriş merkezi" },
    { word: "museum", file: "museum.png", turkish: "müze" },
    { word: "zoo", file: "zoo.png", turkish: "hayvanat bahçesi" },
    { word: "hospital", file: "hospital.png", turkish: "hastane" },
    { word: "bank", file: "bank.png", turkish: "banka" },
    { word: "park", file: "park.png", turkish: "park" },
    { word: "mosque", file: "mosque.png", turkish: "cami" },
    { word: "cafe", file: "cafe.png", turkish: "kafe" },
    { word: "police station", file: "police station.png", turkish: "polis merkezi" },
    { word: "bus stop", file: "bus stop.png", turkish: "otobüs durağı" },
    { word: "home", file: "home.png", turkish: "ev" },
    { word: "road", file: "road.png", turkish: "yol" },
    { word: "map", file: "map.png", turkish: "harita" },
    { word: "city", file: "city.png", turkish: "şehir" },
    { word: "town", file: "town.png", turkish: "kasaba" },
    { word: "village", file: "village.png", turkish: "köy" },
    { word: "at", file: "at.png", turkish: "-de / -da" },
    { word: "over there", file: "over there.png", turkish: "orada" },
    { word: "here", file: "here.png", turkish: "burada" },
    { word: "know", file: "know.png", turkish: "bilmek" },
    { word: "now", file: "now.png", turkish: "şimdi" },
    { word: "I don't know", file: "I don't know.png", turkish: "bilmiyorum" },
    { word: "sorry", file: "sorry.png", turkish: "özür dilerim" },
    { word: "excuse me", file: "excuse me.png", turkish: "affedersiniz" },
    { word: "where", file: "where.png", turkish: "nerede" },
    { word: "go", file: "go.png", turkish: "gitmek" },
    { word: "it", file: "it.png", turkish: "o" },
  ];

  const selectRandomCards = (count: number) => {
    const shuffled = [...allVocabulary].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const [selectedCards, setSelectedCards] = useState(selectRandomCards(10));

  const [wordCards, setWordCards] = useState<GameCard[]>([]);
  const [pictureCards, setPictureCards] = useState<GameCard[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
      imageUrl: `/images/primary/3.7/${item.file}`,
      turkish: item.turkish,
      type: "word",
    }));

    const pictures: GameCard[] = selectedCards.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/primary/3.7/${item.file}`,
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
    setIsDragging(true);
    setSelectedCard(null); // Clear tap selection when dragging starts
    
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
      setIsDragging(false);
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
      // Match found!
      setMatches([...matches, draggedCard_.word]);
    }

    setDraggedCard(null);
    setIsDragging(false);
  };

  const handleCardClick = (cardId: string, cardType: "word" | "picture", e?: React.MouseEvent) => {
    // Prevent click from firing after a drag operation
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    // If clicking the same card, deselect it
    if (selectedCard === cardId) {
      setSelectedCard(null);
      return;
    }

    // If no card is selected, select this one
    if (!selectedCard) {
      setSelectedCard(cardId);
      
      // Speak the word if it's from word cards
      if (cardType === "word") {
        const wordCard = wordCards.find((c) => c.id === cardId);
        if (wordCard) {
          speakWord(wordCard.word);
        }
      }
      return;
    }

    // If a card is already selected, try to match
    const selectedCardData = wordCards.find((c) => c.id === selectedCard) || 
                            pictureCards.find((c) => c.id === selectedCard);
    const clickedCardData = wordCards.find((c) => c.id === cardId) || 
                           pictureCards.find((c) => c.id === cardId);

    if (!selectedCardData || !clickedCardData) {
      // If we can't find the cards, just select the new one
      setSelectedCard(cardId);
      return;
    }

    // Check if they match (same word, different types)
    const selectedIsWord = wordCards.some((c) => c.id === selectedCard);
    const clickedIsWord = wordCards.some((c) => c.id === cardId);
    
    if (selectedCardData.word === clickedCardData.word && selectedIsWord !== clickedIsWord) {
      // Match found!
      setMatches([...matches, selectedCardData.word]);
      setSelectedCard(null);
    } else {
      // No match, select the new card instead
      setSelectedCard(cardId);
      
      // Speak the word if it's from word cards
      if (cardType === "word") {
        speakWord(clickedCardData.word);
      }
    }
  };

  const resetGame = () => {
    setMatches([]);
    setSelectedCard(null);
    setDraggedCard(null);
    setIsDragging(false);
    setGameComplete(false);
    setElapsedTime(0);
    setShowHatchingSequence(false);
    setHintCardId(null);

    const newCards = selectRandomCards(10);
    setSelectedCards(newCards);

    const words: GameCard[] = newCards.map((item, idx) => ({
      id: `word-${idx}`,
      word: item.word,
      imageUrl: `/images/primary/3.7/${item.file}`,
      turkish: item.turkish,
      type: "word",
    }));

    const pictures: GameCard[] = newCards.map((item, idx) => ({
      id: `picture-${idx}`,
      word: item.word,
      imageUrl: `/images/primary/3.7/${item.file}`,
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
    const text = `I just scored ${formatTime(elapsedTime)} on Matchlings Unit 7! Can you beat my time? 🎮`;
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
    const text = `Challenge me on Matchlings Unit 7! Can you match all the words faster than my ${formatTime(elapsedTime)}? 🏆`;
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
              description="Grade 3 - Unit 7: In My City"
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
                        <Button variant="ghost" onClick={() => setLocation("/primary-school/grade-3/unit-7/games")} className="btn-secondary">
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
                          onClick={(e) => handleCardClick(card.id, "word", e)}
                          className={`word-card ${selectedCard === card.id ? "selected" : ""} ${draggedCard === card.id ? "dragging" : ""} ${hintCardId === card.id ? "hint-drag" : ""}`}
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
                          onClick={(e) => handleCardClick(card.id, "picture", e)}
                          className={`picture-card ${selectedCard === card.id ? "selected" : ""} ${draggedCard === card.id ? "dragging" : ""} ${hintCardId === card.id ? "hint-drag" : ""}`}
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
                      onClick={() => setLocation("/primary-school/grade-3/unit-7/games")}
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
