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

export default function ColorsVocabulary() {
  const { currentTheme } = useTheme();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyCard[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState(1);
  const autoplayRef = useRef(false);
  const speedRef = useRef(1);

  const imageFiles = [
    { word: "red", file: "red.png", turkish: "kırmızı" },
    { word: "blue", file: "blue.png", turkish: "mavi" },
    { word: "yellow", file: "yellow.png", turkish: "sarı" },
    { word: "green", file: "green.png", turkish: "yeşil" },
    { word: "orange", file: "orange.png", turkish: "turuncu" },
    { word: "purple", file: "purple.png", turkish: "mor" },
    { word: "pink", file: "pink.png", turkish: "pembe" },
    { word: "brown", file: "brown.png", turkish: "kahverengi" },
    { word: "gray", file: "gray.png", turkish: "gri" },
    { word: "white", file: "white.png", turkish: "beyaz" },
  ];

  const reactionEmojis = ["👍", "🔥", "💯", "✅", "🤩", "🚀", "✨", "🧠", "💡"];
  const EMOJI_CHANCE = 0.5;
  const SOUND_CHANCE = 0.25;

  const reactionSounds = [
    "/sounds/yay.mp3", "/sounds/woosh.mp3", "/sounds/tennis.mp3", "/sounds/tap.mp3",
    "/sounds/tada.mp3", "/sounds/among us.mp3", "/sounds/arcade.mp3", "/sounds/bell.mp3",
    "/sounds/blip.mp3", "/sounds/bubble.mp3", "/sounds/button.mp3", "/sounds/cash.mp3",
    "/sounds/click1.mp3", "/sounds/click2.mp3", "/sounds/click3.mp3", "/sounds/click5.mp3",
    "/sounds/click6.mp3", "/sounds/eating.mp3", "/sounds/error.mp3", "/sounds/fall.mp3",
    "/sounds/fist.mp3", "/sounds/flip.mp3", "/sounds/game.mp3", "/sounds/hit.mp3",
    "/sounds/interface.mp3", "/sounds/keyboard.mp3", "/sounds/level.mp3", "/sounds/levelup.mp3",
    "/sounds/low.mp3", "/sounds/mouse.mp3", "/sounds/multipop.mp3", "/sounds/notice.mp3",
    "/sounds/pen.mp3", "/sounds/pick.mp3", "/sounds/pop.mp3", "/sounds/radio.mp3",
    "/sounds/rclick.mp3", "/sounds/select2.mp3", "/sounds/select.mp3", "/sounds/shutter.mp3",
    "/sounds/sparkle.mp3", "/sounds/swipe.mp3", "/sounds/switch2.mp3", "/sounds/switch.mp3",
    "/sounds/swoosh.mp3", "/sounds/sword.mp3",
  ];

  useEffect(() => {
    const vocabData = imageFiles.map((item) => ({
      word: item.word,
      imageUrl: `/images/0.1/${item.file}`,
      turkish: item.turkish,
    }));
    setVocabulary(vocabData);
  }, []);

  useEffect(() => {
    speedRef.current = autoplaySpeed;
  }, [autoplaySpeed]);

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

        if (vocabulary[index]) {
          const utterance = new SpeechSynthesisUtterance(vocabulary[index].word);
          speechSynthesis.speak(utterance);
        }
        await new Promise(resolve => setTimeout(resolve, 6000 / speedRef.current));

        if (!autoplayRef.current) break;

        setIsFlipped(true);
        await new Promise(resolve => setTimeout(resolve, 2000 / speedRef.current));

        if (!autoplayRef.current) break;

        setIsImageZoomed(true);
        await new Promise(resolve => setTimeout(resolve, 2000 / speedRef.current));

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
    reaction.textContent = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    reaction.style.left = `${event.pageX}px`;
    reaction.style.top = `${event.pageY}px`;
    document.body.appendChild(reaction);

    reaction.addEventListener("animationend", () => {
      reaction.remove();
    });
  };

  const playRandomSound = () => {
    if (reactionSounds.length === 0 || Math.random() > SOUND_CHANCE) return;

    const soundToPlay = reactionSounds[Math.floor(Math.random() * reactionSounds.length)];
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

    if (currentCardIndex === vocabulary.length) {
      return;
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

    const newIndex = (currentCardIndex - 1 + totalCards) % totalCards;
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
          title: 'İngilizce Derslerim - Colors',
          text: `Check out this colors vocabulary lesson!`,
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

  const totalCards = vocabulary.length + 1;
  const isBonusCard = currentCardIndex === vocabulary.length;
  const currentCard = isBonusCard ? { word: "Review", imageUrl: "", turkish: "" } : vocabulary[currentCardIndex];

  const generateCounterItems = () => {
    const items: Array<{ type: 'number' | 'dash' | 'separator' | 'total'; value: number | string; }> = [];
    
    let windowStart = Math.max(0, currentCardIndex - 1);
    if (windowStart + 3 >= vocabulary.length) {
      windowStart = Math.max(0, vocabulary.length - 4);
    }
    
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
    
    items.push({ type: 'separator', value: 'next' });
    items.push({ type: 'total', value: vocabulary.length });
    
    return items;
  };

  const counterItems = generateCounterItems();

  return (
    <Layout>
      <div className="vocabulary-container">
        <div className="title-container">
          <p>Pre-School & 1st Grade</p>
          <p>Colours</p>
        </div>

        <div className="center-layout" data-testid="layout-center">
          <div className="left-side">
            <div className="counter-section">
              <div className="counter-display">
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
                      <div key={index} className="counter-item separator-button" data-testid={`text-counter-${index}`}>
                        <div className="separator-content">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" style={{ transform: 'rotate(90deg)', width: 'clamp(16px, 3.5vw, 20px)', height: 'clamp(16px, 3.5vw, 20px)' }}>
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                          </svg>
                          <span className="separator-text">of</span>
                        </div>
                      </div>
                    );
                  }
                  if (item.type === 'total') {
                    return (
                      <div key={index} className="counter-item total-display" data-testid={`text-total-${index}`}>
                        <span className="total-value">{item.value}</span>
                      </div>
                    );
                  }
                  return (
                    <button key={index} onClick={() => isClickable && handleCardSelect(cardAtThisPosition, {} as React.MouseEvent)} disabled={!isClickable} className={`counter-item ${isActive ? 'active' : ''} ${isClickable ? '' : 'disabled'}`} data-testid={`button-card-${index}`}>
                      {item.value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card-section">
            <div className="card-wrapper" onClick={handleFlip} data-testid="card-wrapper">
              <div className={`card ${isFlipped ? 'flipped' : ''}`} data-testid="card-content">
                <div className="card-front">
                  <img src={currentCard.imageUrl} alt={currentCard.word} style={{ filter: isImageZoomed ? 'brightness(1.1)' : 'brightness(1)' }} onClick={handleImageClick} data-testid="card-image" />
                </div>
                <div className="card-back">
                  <span className="word-display">{currentCard.word}</span>
                  <span className={`translation ${showTranslation ? 'visible' : ''}`}>{currentCard.turkish}</span>
                </div>
              </div>
            </div>

            <div className="button-group">
              <button onClick={handlePrev} className="nav-button" data-testid="button-previous">←</button>
              <button onClick={handlePronounce} className="nav-button" data-testid="button-pronounce">🔊</button>
              <button onClick={handleToggleTranslation} className="nav-button" data-testid="button-translation">TR</button>
              <button onClick={handleNext} className="nav-button" data-testid="button-next">→</button>
            </div>

            <div className="bottom-button-group">
              <button onClick={handleStartOver} className="control-button start-over-button" data-testid="button-start-over">Start Over</button>
              <button onClick={handleAutoplayStart} className={`control-button autoplay-button ${isAutoplay ? 'active' : ''}`} data-testid="button-autoplay">
                {isAutoplay ? '⏸ Autoplay' : '▶ Autoplay'}
              </button>
              <button onClick={handleFullscreen} className="control-button fullscreen-button" data-testid="button-fullscreen">⛶</button>
              <button onClick={handleShare} className="control-button share-button" data-testid="button-share">📤</button>
            </div>

            {showShareDrawer && (
              <div className="share-drawer">
                <button onClick={() => handleShareOption('copy')} className="share-option" data-testid="button-share-copy">📋 Copy Link</button>
                <button onClick={() => handleShareOption('native')} className="share-option" data-testid="button-share-native">🔗 Share</button>
              </div>
            )}
          </div>

          <div className="right-side">
            <div className="card-thumbnails">
              {vocabulary.map((card, index) => (
                <div key={index} onClick={(e) => handleCardSelect(index, e)} className={`thumbnail ${index === currentCardIndex ? 'active' : ''}`} data-testid={`thumbnail-card-${index}`}>
                  <img src={card.imageUrl} alt={card.word} />
                  <span className="thumbnail-label">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="image-overlay" className="image-overlay" onClick={handleOverlayClick}>
          {currentCard && <img src={currentCard.imageUrl} alt={currentCard.word} className="overlay-image" data-testid="overlay-image" />}
        </div>
      </div>
    </Layout>
  );
}
