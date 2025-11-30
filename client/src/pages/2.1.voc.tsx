import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Layout } from "@/components/Layout";
import "@/styles/2.1.voc.css";

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
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const autoplayRef = useRef(false);

  // Sample vocabulary data - replace with your own
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

  // Autoplay sequence handler
  useEffect(() => {
    if (!isAutoplay) {
      autoplayRef.current = false;
      speechSynthesis.cancel();
      return;
    }

    autoplayRef.current = true;
    let index = currentCardIndex;

    const runSequence = async () => {
      while (autoplayRef.current && index < vocabulary.length) {
        setCurrentCardIndex(index);
        setIsFlipped(false);
        setIsImageZoomed(false);

        // Listen for 6 seconds
        if (vocabulary[index]) {
          const utterance = new SpeechSynthesisUtterance(vocabulary[index].word);
          speechSynthesis.speak(utterance);
        }
        await new Promise(resolve => setTimeout(resolve, 6000));

        if (!autoplayRef.current) break;

        // Flip for 2 seconds
        setIsFlipped(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!autoplayRef.current) break;

        // Zoom image for 2 seconds
        setIsImageZoomed(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!autoplayRef.current) break;

        index++;
      }
      
      if (autoplayRef.current) {
        setIsAutoplay(false);
        autoplayRef.current = false;
      }
    };

    runSequence();

    return () => {
      autoplayRef.current = false;
      speechSynthesis.cancel();
    };
  }, [isAutoplay, vocabulary]);

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

    // Don't loop - stay on review/practice card if already there
    if (currentCardIndex === vocabulary.length) {
      return; // Already on bonus card, don't move
    }

    const newIndex = currentCardIndex + 1;

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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareDrawer(!showShareDrawer);
  };

  const handleAutoplayStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoplay(!isAutoplay);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
  };

  const handleShareOption = async (option: 'copy' | 'native') => {
    const currentUrl = window.location.href;
    
    if (option === 'copy') {
      try {
        await navigator.clipboard.writeText(currentUrl);
        // Show toast notification
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = 'Link copied to clipboard!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
        setShowShareDrawer(false);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    } else if (option === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'İngilizce Derslerim - Vocabulary Cards',
          text: `Check out this vocabulary lesson on İngilizce Derslerim!`,
          url: currentUrl,
        });
        setShowShareDrawer(false);
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    }
  };

  if (vocabulary.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  const totalCards = vocabulary.length + 1; // +1 for bonus card
  const isBonusCard = currentCardIndex === vocabulary.length;
  const currentCard = isBonusCard ? { word: "Review", imageUrl: "", turkish: "" } : vocabulary[currentCardIndex];

  // Generate 6-item counter display with universal rule
  const generateCounterItems = () => {
    const items: Array<{ type: 'number' | 'dash' | 'separator' | 'total'; value: number | string; }> = [];
    
    // Universal rule: Show 4 card positions
    // - Current card ideally at position 1 or 2 (showing 1-2 before, current, 1-2 after)
    // - Adjust window at boundaries to keep current card visible
    // - Minimize dashes at the end
    
    let windowStart = Math.max(0, currentCardIndex - 1);
    // If near the end, shift window to show more past cards instead of future dashes
    if (windowStart + 3 >= vocabulary.length) {
      windowStart = Math.max(0, vocabulary.length - 4);
    }
    
    // Generate 4 items for the window
    for (let i = 0; i < 4; i++) {
      const cardIndex = windowStart + i;
      if (cardIndex < 0) {
        items.push({ type: 'dash', value: '-' });
      } else if (cardIndex >= vocabulary.length) {
        items.push({ type: 'dash', value: '-' });
      } else {
        items.push({ type: 'number', value: cardIndex + 1 });
      }
    }
    
    // Add separator (next icon placeholder)
    items.push({ type: 'separator', value: 'next' });
    
    // Add total (not clickable)
    items.push({ type: 'total', value: vocabulary.length });
    
    return items;
  };

  const counterItems = generateCounterItems();

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
                {counterItems.map((item, index) => {
                  // Calculate which card index this position represents
                  let windowStart = Math.max(0, currentCardIndex - 1);
                  if (windowStart + 3 >= vocabulary.length) {
                    windowStart = Math.max(0, vocabulary.length - 4);
                  }
                  const cardAtThisPosition = windowStart + index;
                  const isActive = cardAtThisPosition === currentCardIndex; // Active is wherever current card is in the window
                  const isClickable = item.type === 'number' && index < 4; // Only numbers in first 4 positions are clickable
                  
                  if (item.type === 'separator') {
                    // Render next button rotated 90 degrees
                    return (
                      <div
                        key={index}
                        className="counter-item separator-button"
                        data-testid={`text-counter-${index}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="currentColor"
                          style={{ transform: 'rotate(90deg)', width: 'clamp(16px, 3.5vw, 20px)', height: 'clamp(16px, 3.5vw, 20px)' }}
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </div>
                    );
                  }
                  
                  return (
                    <div
                      key={index}
                      className={`counter-item ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''} ${item.type === 'total' ? 'total' : ''} ${item.type === 'total' && currentCardIndex < 3 ? 'pulse' : ''}`}
                      onClick={(e) => {
                        if (isClickable && item.type === 'number') {
                          const cardNumber = item.value as number;
                          spawnFlyingEmoji(e);
                          playRandomSound();
                          handleCardSelect(cardNumber - 1, e);
                        }
                      }}
                      data-testid={`text-counter-${index}`}
                      style={{ cursor: isClickable ? 'pointer' : 'default' }}
                    >
                      {item.type === 'total' ? `of ${item.value}` : item.value}
                    </div>
                  );
                })}
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
                      style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', transform: isImageZoomed ? 'scale(1.15)' : 'scale(1)' }}
                      className="card-image"
                    />
                  </div>
                </div>
              )}
              
              {/* Bottom Right Fullscreen Button - Outside card so it doesn't flip */}
              {!isBonusCard && (
                <button
                  className="fullscreen-btn"
                  onClick={handleFullscreen}
                  title="Fullscreen"
                  data-testid="button-fullscreen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 0 24 24"
                    width="20px"
                    fill="#5f6368"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
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
              <button
                className={`icon-control-btn ${isAutoplay ? 'active' : ''}`}
                onClick={handleAutoplayStart}
                title={isAutoplay ? "Stop Autoplay" : "Start Autoplay"}
                data-testid="button-autoplay"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 0 24 24"
                  width="20px"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      {/* Share Button */}
      <div className="share-container">
        <button 
          className="share-button" 
          onClick={handleShare}
          data-testid="button-share"
          title="Share This Page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 24 24"
            width="20px"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.15c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.56 9.31 6.88 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.88 0 1.56-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
          <span className="share-tooltip">Share This Page</span>
        </button>

        {/* Share Drawer */}
        {showShareDrawer && (
          <div className="share-drawer-overlay" onClick={() => setShowShareDrawer(false)}>
            <div className="share-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="share-drawer-content">
                <button
                  className="share-option"
                  onClick={() => handleShareOption('copy')}
                  data-testid="share-option-copy"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  <span>Copy Link</span>
                </button>
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button
                    className="share-option"
                    onClick={() => handleShareOption('native')}
                    data-testid="share-option-native"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.15c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.56 9.31 6.88 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.88 0 1.56-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <span>Share</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fullscreen-modal-overlay" onClick={() => setIsFullscreen(false)}>
          <button 
            className="fullscreen-modal-close-btn"
            onClick={() => setIsFullscreen(false)}
            data-testid="button-fullscreen-close"
          >
            ✕
          </button>
          <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Fullscreen Counter */}
            <div className="fullscreen-counter-section">
              <div className="fullscreen-counter-display">
                {counterItems.map((item, index) => {
                  let windowStart = Math.max(0, currentCardIndex - 1);
                  if (windowStart + 3 >= vocabulary.length) {
                    windowStart = Math.max(0, vocabulary.length - 4);
                  }
                  const cardAtThisPosition = windowStart + index;
                  const isActive = cardAtThisPosition === currentCardIndex;
                  const isClickable = item.type === 'number' && index < 4;
                  
                  if (item.type === 'separator') {
                    return (
                      <div
                        key={index}
                        className="fullscreen-counter-item separator-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="14px"
                          viewBox="0 0 24 24"
                          width="14px"
                          fill="currentColor"
                          style={{ transform: 'rotate(90deg)' }}
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </div>
                    );
                  }
                  
                  return (
                    <div
                      key={index}
                      className={`fullscreen-counter-item ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''} ${item.type === 'total' ? 'total' : ''} ${item.type === 'total' && currentCardIndex < 3 ? 'pulse' : ''}`}
                      onClick={(e) => {
                        if (isClickable && item.type === 'number') {
                          const cardNumber = item.value as number;
                          spawnFlyingEmoji(e);
                          playRandomSound();
                          handleCardSelect(cardNumber - 1, e);
                        }
                      }}
                      style={{ cursor: isClickable ? 'pointer' : 'default' }}
                    >
                      {item.type === 'total' ? `of ${item.value}` : item.value}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`fullscreen-modal-card ${isFlipped ? "flipped" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
            >
              {/* Front */}
              <div className="fullscreen-modal-front">
                <button
                  className="pronunciation-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePronounce(e);
                  }}
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
              <div className="fullscreen-modal-back">
                <img
                  src={currentCard.imageUrl}
                  alt={currentCard.word}
                  style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            </div>
            
            {showTranslation && (
              <div className="translation-display">
                {currentCard.turkish}
              </div>
            )}

            {/* Fullscreen Controls */}
            <div className="fullscreen-controls-section">
              <button
                className="fullscreen-icon-control-btn"
                onClick={handleStartOver}
                title="Start Over"
                data-testid="button-start-over-fs"
              >
                &lt;&lt;
              </button>
              <button
                className="fullscreen-icon-control-btn"
                onClick={handlePrev}
                title="Previous Card"
                data-testid="button-previous-fs"
              >
                &lt;
              </button>
              <button
                className="fullscreen-icon-control-btn"
                onClick={handleNext}
                title="Next Card"
                data-testid="button-next-fs"
              >
                &gt;
              </button>
              <button
                className="fullscreen-icon-control-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                title="Flip Card"
                data-testid="button-flip-fs"
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
                className={`fullscreen-icon-control-btn ${showTranslation ? 'active' : ''}`}
                onClick={handleToggleTranslation}
                title="Show Translation"
                data-testid="button-translation-fs"
              >
                ?
              </button>
              <button
                className={`fullscreen-icon-control-btn ${isAutoplay ? 'active' : ''}`}
                onClick={handleAutoplayStart}
                title={isAutoplay ? "Stop Autoplay" : "Start Autoplay"}
                data-testid="button-autoplay-fs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 0 24 24"
                  width="20px"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

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
