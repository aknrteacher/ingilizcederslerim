import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Layout } from "@/components/Layout";
import "@/styles/vocabulary-cards.css";

declare global {
  interface Window {
    confetti?: (options: any) => void;
  }
}

interface VocabularyCard {
  word: string;
  imageUrl: string;
  turkish: string;
}

export default function VocabularyCards() {
  const { currentTheme } = useTheme();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyCard[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);

  // Sample vocabulary data - replace with your own
  const imageFiles = [
    { word: "hello", file: "hello.png", turkish: "merhaba" },
    { word: "goodbye", file: "goodbye.png", turkish: "hoşça kalın" },
    { word: "How are you", file: "goodbye.png", turkish: "nasılsın" },
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

  const reactionEmojis = ["👍", "🔥", "💯", "✅", "🤩", "🚀", "✨", "🧠", "💡"];
  const EMOJI_CHANCE = 0.5;
  const SOUND_CHANCE = 0.25;

  const reactionSounds = [
    "/sounds/yay.mp3",
    "/sounds/woosh.mp3",
    "/sounds/tennis.mp3",
    "/sounds/tap.mp3",
    "/sounds/tada.mp3",
    "/sounds/among us.mp3",
    "/sounds/arcade.mp3",
    "/sounds/bell.mp3",
    "/sounds/blip.mp3",
    "/sounds/bubble.mp3",
    "/sounds/button.mp3",
    "/sounds/cash.mp3",
    "/sounds/click1.mp3",
    "/sounds/click2.mp3",
    "/sounds/click3.mp3",
    "/sounds/click5.mp3",
    "/sounds/click6.mp3",
    "/sounds/eating.mp3",
    "/sounds/error.mp3",
    "/sounds/fall.mp3",
    "/sounds/fist.mp3",
    "/sounds/flip.mp3",
    "/sounds/game.mp3",
    "/sounds/hit.mp3",
    "/sounds/interface.mp3",
    "/sounds/keyboard.mp3",
    "/sounds/level.mp3",
    "/sounds/levelup.mp3",
    "/sounds/low.mp3",
    "/sounds/mouse.mp3",
    "/sounds/multipop.mp3",
    "/sounds/notice.mp3",
    "/sounds/pen.mp3",
    "/sounds/pick.mp3",
    "/sounds/pop.mp3",
    "/sounds/radio.mp3",
    "/sounds/rclick.mp3",
    "/sounds/select2.mp3",
    "/sounds/select.mp3",
    "/sounds/shutter.mp3",
    "/sounds/sparkle.mp3",
    "/sounds/swipe.mp3",
    "/sounds/switch2.mp3",
    "/sounds/switch.mp3",
    "/sounds/swoosh.mp3",
    "/sounds/sword.mp3",
  ];

  useEffect(() => {
    const vocabData = imageFiles.map((item) => ({
      word: item.word,
      imageUrl: `/images/2.1/${item.file}`,
      turkish: item.turkish,
    }));
    console.log("Vocabulary loaded:", vocabData);
    setVocabulary(vocabData);
  }, []);

  const spawnFlyingEmoji = (event: React.MouseEvent) => {
    if (Math.random() > EMOJI_CHANCE) return;

    const reaction = document.createElement("span");
    reaction.classList.add("flying-reaction");
    reaction.textContent =
      reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    reaction.style.left = `${event.pageX}px`;
    reaction.style.top = `${event.pageY}px`;
    document.body.appendChild(reaction);

    reaction.addEventListener("animationend", () => {
      reaction.remove();
    });
  };

  const playRandomSound = () => {
    if (reactionSounds.length === 0 || Math.random() > SOUND_CHANCE) return;

    const soundToPlay =
      reactionSounds[Math.floor(Math.random() * reactionSounds.length)];
    const audio = new Audio(soundToPlay);
    audio.play().catch((e) => console.error("Error playing sound:", e));
  };

  const handleFlip = (e: React.MouseEvent) => {
    spawnFlyingEmoji(e);
    playRandomSound();
    setIsFlipped(!isFlipped);
  };

  const handlePronounce = (e: React.MouseEvent) => {
    spawnFlyingEmoji(e);
    e.stopPropagation();
    if (vocabulary[currentCardIndex]) {
      const utterance = new SpeechSynthesisUtterance(vocabulary[currentCardIndex].word);
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    spawnFlyingEmoji(e);
    playRandomSound();

    const newIndex = (currentCardIndex + 1) % totalCards;

    if (currentCardIndex === vocabulary.length - 1 && window.confetti) {
      window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }

    setCurrentCardIndex(newIndex);
    setIsFlipped(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    spawnFlyingEmoji(e);
    playRandomSound();

    const newIndex =
      (currentCardIndex - 1 + totalCards) % totalCards;
    setCurrentCardIndex(newIndex);
    setIsFlipped(false);
  };

  const handleCardSelect = (index: number, e: React.MouseEvent) => {
    spawnFlyingEmoji(e);
    playRandomSound();
    setCurrentCardIndex(index);
    setIsFlipped(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const overlay = document.getElementById("image-overlay");
    if (overlay) {
      overlay.classList.add("visible");
    }
  };

  const handleOverlayClick = () => {
    const overlay = document.getElementById("image-overlay");
    if (overlay) {
      overlay.classList.remove("visible");
    }
  };

  const handleStartOver = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowTranslation(false);
  };

  const handleToggleTranslation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(!showTranslation);
  };

  if (vocabulary.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  const totalCards = vocabulary.length + 1; // +1 for bonus card
  const isBonusCard = currentCardIndex === vocabulary.length;
  const currentCard = isBonusCard ? { word: "Review", imageUrl: "", turkish: "" } : vocabulary[currentCardIndex];

  return (
    <Layout>
      <div className="vocabulary-container">
        <div className="title-container">
          <p>2nd Grades</p>
          <p>Theme 1: School Life</p>
        </div>

        <div className="center-layout" data-testid="layout-center">
          {/* Left Counter */}
          <div className="left-side">
            <div className="counter-section">
              <div className="counter-display">
                <div className="counter-item" data-testid="text-counter-n2">
                  {currentCardIndex > 1 ? currentCardIndex - 1 : ''}
                </div>
                <div className="counter-item" data-testid="text-counter-n1">
                  {currentCardIndex > 0 ? currentCardIndex : ''}
                </div>
                <div className="counter-item active" data-testid="text-counter-current">
                  {currentCardIndex + 1}
                </div>
                <div className="counter-item" data-testid="text-counter-p1">
                  {currentCardIndex < totalCards - 1 ? currentCardIndex + 2 : ''}
                </div>
                <div className="counter-item" data-testid="text-counter-p2">
                  {currentCardIndex < totalCards - 2 ? currentCardIndex + 3 : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Center Card */}
          <div className="center-card">
            <div className="flashcard-container">
              {isBonusCard ? (
                <div className="flashcard bonus-card" data-testid="card-bonus">
                  <div className="bonus-content">
                    <div className="bonus-emoji">🎮</div>
                    <div className="bonus-title">Review & Practice</div>
                    <div className="bonus-subtitle">Videos & Games coming soon!</div>
                  </div>
                </div>
              ) : (
                <div
                  className={`flashcard ${isFlipped ? "flipped" : ""}`}
                  onClick={(e) => handleFlip(e)}
                  data-testid="card-flashcard"
                >
                  {/* Front */}
                  <div className="flashcard-front">
                    <button
                      className="pronunciation-btn"
                      onClick={handlePronounce}
                      title="Pronounce"
                      data-testid="button-pronounce"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#5f6368"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    </button>
                    <div className="word" data-testid="text-word">{currentCard.word}</div>
                  </div>

                  {/* Back */}
                  <div className="flashcard-back">
                    <img
                      src={currentCard.imageUrl}
                      alt={currentCard.word}
                      onClick={handleImageClick}
                      onLoad={() => console.log("Image loaded:", currentCard.imageUrl)}
                      onError={(e) => console.log("Image failed to load:", currentCard.imageUrl, e)}
                      style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {showTranslation && (
              <div className="translation-display" data-testid="text-translation">
                {currentCard.turkish}
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="right-side">
            <div className="controls-section">
              <button
                className="icon-control-btn"
                onClick={handleStartOver}
                title="Start Over"
                data-testid="button-start-over"
              >
                &lt;&lt;
              </button>
              <button
                className="icon-control-btn"
                onClick={handlePrev}
                title="Previous Card"
                data-testid="button-previous"
              >
                &lt;
              </button>
              <button
                className="icon-control-btn"
                onClick={handleNext}
                title="Next Card"
                data-testid="button-next"
              >
                &gt;
              </button>
              <button
                className="icon-control-btn"
                onClick={handleFlip}
                title="Flip Card"
                data-testid="button-flip"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 0 24 24"
                  width="20px"
                >
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              </button>
              <button
                className={`icon-control-btn ${showTranslation ? 'active' : ''}`}
                onClick={handleToggleTranslation}
                title="Show Translation"
                data-testid="button-translation"
              >
                ?
              </button>
            </div>
          </div>
        </div>

      {/* Image Overlay */}
      <div id="image-overlay" className="image-overlay" onClick={handleOverlayClick}>
        <img
          className="zoomed-image"
          src={currentCard.imageUrl}
          alt="Zoomed view"
        />
      </div>
      </div>
    </Layout>
  );
}
