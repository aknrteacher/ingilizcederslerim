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

    const newIndex = (currentCardIndex + 1) % vocabulary.length;

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
      (currentCardIndex - 1 + vocabulary.length) % vocabulary.length;
    setCurrentCardIndex(newIndex);
    setIsFlipped(false);
  };

  const handleCardSelect = (index: number, e: React.MouseEvent) => {
    spawnFlyingEmoji(e);
    playRandomSound();
    setCurrentCardIndex(index);
    setIsFlipped(false);
  };

  const handleImageClick = () => {
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

  const currentCard = vocabulary[currentCardIndex];
  const windowSize = 2;
  const start = Math.max(0, currentCardIndex - windowSize);
  const end = Math.min(vocabulary.length - 1, currentCardIndex + windowSize);
  const visibleNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <Layout>
      <div className="vocabulary-container">
        <div className="title-container">
          <p>2nd Grades</p>
          <p>Theme 1: School Life</p>
        </div>

        <div className="center-layout" data-testid="layout-center">
          {/* Left Controls */}
          <div className="left-controls">
            <button
              className="control-btn"
              onClick={handlePrev}
              title="Previous Card"
              data-testid="button-previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              className="control-btn"
              onClick={handleFlip}
              title="Flip Card"
              data-testid="button-flip"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
              >
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
            </button>
            <button
              className="control-btn"
              onClick={handleNext}
              title="Next Card"
              data-testid="button-next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>

          {/* Center Card */}
          <div className="center-card">
            <div className="flashcard-container">
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
            </div>

            {/* Bottom Controls */}
            <div className="bottom-controls">
              <button 
                className="icon-btn start-over-btn"
                onClick={handleStartOver}
                title="Start Over"
                data-testid="button-start-over"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              </button>
              <button 
                className={`icon-btn translation-btn ${showTranslation ? 'active' : ''}`}
                onClick={handleToggleTranslation}
                title="Show Translation"
                data-testid="button-translation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.21-6.66h5.69c.25 0 .45-.18.49-.42l.04-.63c.02-.23-.12-.44-.35-.49H10.9V5c0-.25-.2-.45-.45-.45h-.56c-.25 0-.45.2-.45.45v.52H6.54c-.25 0-.45.2-.45.45v.56c0 .25.2.45.45.45h3.13c-.22 2.87-1.61 5.43-3.72 7.15-.59-.33-1.14-.76-1.62-1.27-.48-.51-1.05-1.08-1.66-1.7-.13-.14-.3-.21-.48-.21h-.77c-.35 0-.56.22-.56.56v.77c0 .18.07.35.21.48.7.75 1.31 1.39 1.88 1.91.63.64 1.15 1.14 1.59 1.51.56.54 1.12 1.04 1.67 1.51.52.47 1.08.95 1.66 1.47.38.35.8.58 1.21.58.47 0 .92-.23 1.28-.63.42-.5.75-1.18 1.01-2.02.26-.84.44-1.9.54-3.12h3.13c.25 0 .45-.2.45-.45v-.56c0-.25-.2-.45-.45-.45h-3.06c-.23-2.49-1.47-4.72-3.21-6.66l2.54-2.51c.18-.18.28-.42.28-.68v-.77c0-.35-.22-.56-.56-.56h-.77c-.26 0-.5.1-.68.28l-3.72 3.72-3.72-3.72c-.18-.18-.42-.28-.68-.28h-.77c-.35 0-.56.22-.56.56v.77c0 .26.1.5.28.68l2.54 2.51c-1.74 1.94-2.98 4.17-3.21 6.66H4.5c-.25 0-.45.2-.45.45v.56c0 .25.2.45.45.45h3.06c.1 1.22.28 2.28.54 3.12.26.84.59 1.52 1.01 2.02.36.4.81.63 1.28.63.41 0 .83-.23 1.21-.58.55-.51 1.1-.99 1.66-1.47.58-.52 1.14-1 1.67-1.51.44-.37.96-.87 1.59-1.51.57-.52 1.18-1.16 1.88-1.91.14-.13.21-.3.21-.48v-.77c0-.35-.21-.56-.56-.56h-.77c-.18 0-.35.07-.48.21-.61.62-1.18 1.19-1.66 1.7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Counter */}
          <div className="right-counter">
            <div className="counter-display">
              <div className="counter-item prev" data-testid="text-counter-previous">
                {currentCardIndex > 0 ? currentCardIndex : ''}
              </div>
              <div className="counter-item active" data-testid="text-counter-current">
                {currentCardIndex + 1}
              </div>
              <div className="counter-item next" data-testid="text-counter-next">
                {currentCardIndex < vocabulary.length - 1 ? currentCardIndex + 2 : ''}
              </div>
            </div>
            {showTranslation && (
              <div className="translation-display" data-testid="text-translation">
                {currentCard.turkish}
              </div>
            )}
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
