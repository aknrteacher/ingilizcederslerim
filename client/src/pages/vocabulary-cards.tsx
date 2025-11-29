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
}

export default function VocabularyCards() {
  const { currentTheme } = useTheme();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyCard[]>([]);

  // Sample vocabulary data - replace with your own
  const imageFiles = [
    { word: "hello", file: "hello.png" },
    { word: "goodbye", file: "goodbye.png" },
    { word: "How are you", file: "goodbye.png" },
    { word: "I am fine", file: "I m fine.png" },
    { word: "school", file: "school.png" },
    { word: "classroom", file: "classroom.png" },
    { word: "library", file: "library.png" },
    { word: "canteen", file: "canteen.png" },
    { word: "sports hall", file: "sports hall.png" },
    { word: "playground", file: "playground.png" },
    { word: "garden", file: "garden.png" },
    { word: "teacher", file: "teacher.png" },
    { word: "student", file: "student.png" },
    { word: "girl", file: "girl.png" },
    { word: "boy", file: "boy.png" },
    { word: "friend", file: "friend.png" },
    { word: "day", file: "day.png" },
    { word: "week", file: "week.png" },
    { word: "Monday", file: "Monday.png" },
    { word: "Tuesday", file: "Tuesday.png" },
    { word: "Wednesday", file: "Wednesday.png" },
    { word: "Thursday", file: "Thursday.png" },
    { word: "Friday", file: "Friday.png" },
    { word: "Saturday", file: "Saturday.png" },
    { word: "Sunday", file: "Sunday.png" },
    { word: "what", file: "what.png" },
    { word: "where", file: "where.png" },
    { word: "who", file: "who.png" },
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
          <p>2. Sınıf</p>
          <p>Tema 1: Okul Hayatı</p>
        </div>

        <div className="main-content">
        {/* Number Reel */}
        <div className="number-reel-container">
          <div className="number-reel">
            {visibleNumbers.map((num) => (
              <div
                key={num}
                className={`number-item ${num === currentCardIndex ? "active" : ""}`}
                data-index={num}
                onClick={(e) => handleCardSelect(num, e)}
              >
                {num + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Flashcard */}
        <div className="flashcard-container">
          <div
            className={`flashcard ${isFlipped ? "flipped" : ""}`}
            onClick={(e) => handleFlip(e)}
          >
            {/* Front */}
            <div className="flashcard-front">
              <button
                className="pronunciation-btn"
                onClick={handlePronounce}
                title="Pronounce"
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
              <div className="word">{currentCard.word}</div>
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

        {/* Side Controls */}
        <div className="side-controls">
          <button
            className="control-btn"
            onClick={handlePrev}
            title="Previous Card"
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
