import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { TEST_PRIMARY_VOCAB } from "@/data/test-primary-vocab";
import "@/styles/2.1.voc.css";

interface VocabularyCard {
  word: string;
  imageUrl: string;
  turkish: string;
}

export default function TestVocabularyCards() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const vocabulary = useMemo<VocabularyCard[]>(
    () =>
      TEST_PRIMARY_VOCAB.map((item) => ({
        word: item.word,
        imageUrl: `/images/primary/test/${item.image}`,
        turkish: item.turkish,
      })),
    [],
  );

  const currentCard = vocabulary[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;

    const utterance = new SpeechSynthesisUtterance(currentCard.word);
    utterance.lang = "en-GB";

    const voices = speechSynthesis.getVoices();
    const englishVoice =
      voices.find((voice) => voice.lang === "en-GB") ||
      voices.find((voice) => voice.lang.startsWith("en"));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % vocabulary.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
    setIsFlipped(false);
  };

  const handleStartOver = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowTranslation(false);
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

  if (!currentCard) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Layout>
      <div className="vocabulary-container">
        <div className="title-container">
          <p>Primary School</p>
          <p>Test Vocabulary Cards</p>
        </div>

        <div className="center-layout" data-testid="layout-center">
          <div className="left-side">
            <div className="counter-section">
              <div className="counter-display">
                {vocabulary.map((_, index) => (
                  <div
                    key={index}
                    className={`counter-item clickable ${currentCardIndex === index ? "active" : ""}`}
                    onClick={() => {
                      setCurrentCardIndex(index);
                      setIsFlipped(false);
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="center-card">
            <div className="flashcard-container">
              <div className={`flashcard ${isFlipped ? "flipped" : ""}`} onClick={handleFlip}>
                <div className="flashcard-front">
                  <button className="pronunciation-btn" onClick={handlePronounce} title="Pronounce">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  </button>
                  <div className="word">{currentCard.word}</div>
                </div>
                <div className="flashcard-back">
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.word}
                    className="card-image"
                    onClick={handleImageClick}
                  />
                </div>
              </div>
            </div>

            {showTranslation && <div className="translation-display">{currentCard.turkish}</div>}
          </div>

          <div className="right-side">
            <div className="controls-section">
              <button className="icon-control-btn" onClick={handleStartOver} title="Start Over">
                &lt;&lt;
              </button>
              <button className="icon-control-btn" onClick={handlePrev} title="Previous Card">
                &lt;
              </button>
              <button className="icon-control-btn" onClick={handleNext} title="Next Card">
                &gt;
              </button>
              <button className="icon-control-btn" onClick={handleFlip} title="Flip Card">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              </button>
              <button
                className={`icon-control-btn ${showTranslation ? "active" : ""}`}
                onClick={() => setShowTranslation((prev) => !prev)}
                title="Show Translation"
              >
                ?
              </button>
            </div>
          </div>
        </div>

        <div id="image-overlay" className="image-overlay" onClick={handleOverlayClick}>
          <img className="zoomed-image" src={currentCard.imageUrl} alt="Zoomed view" />
        </div>
      </div>
    </Layout>
  );
}
