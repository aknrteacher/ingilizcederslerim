import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Volume2, Trophy, Heart, RefreshCw, Sparkles } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import confetti from "canvas-confetti";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

const allVocabulary = [
  { word: "body", file: "body.png", turkish: "vücut" },
  { word: "head", file: "head.png", turkish: "baş" },
  { word: "hair", file: "hair.png", turkish: "saç" },
  { word: "face", file: "face.png", turkish: "yüz" },
  { word: "eyes", file: "eyes.png", turkish: "gözler" },
  { word: "mouth", file: "mouth.png", turkish: "ağız" },
  { word: "ears", file: "ears.png", turkish: "kulaklar" },
  { word: "arms", file: "arms.png", turkish: "kollar" },
  { word: "hands", file: "hands.png", turkish: "eller" },
  { word: "legs", file: "legs.png", turkish: "bacaklar" },
  { word: "nose", file: "nose.png", turkish: "burun" },
  { word: "shirt", file: "shirt.png", turkish: "gömlek" },
  { word: "glasses", file: "glasses.png", turkish: "gözlük" },
  { word: "scarf", file: "scarf.png", turkish: "atkı" },
  { word: "gloves", file: "gloves.png", turkish: "eldiven" },
  { word: "umbrella", file: "umbrella.png", turkish: "şemsiye" },
  { word: "coat", file: "coat.png", turkish: "palto" },
  { word: "shoes", file: "shoes.png", turkish: "ayakkabılar" },
  { word: "dress", file: "dress.png", turkish: "elbise" },
  { word: "hat", file: "hat.png", turkish: "şapka" },
  { word: "hot", file: "hot.png", turkish: "sıcak" },
  { word: "cold", file: "cold.png", turkish: "soğuk" },
  { word: "sunny", file: "sunny.png", turkish: "güneşli" },
  { word: "rainy", file: "rainy.png", turkish: "yağmurlu" },
  { word: "snowy", file: "snowy.png", turkish: "karlı" },
];

interface Option {
  word: string;
  file: string;
  turkish: string;
  isCorrect: boolean;
}

export default function SayWhatGame() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);
  const [currentWord, setCurrentWord] = useState<typeof allVocabulary[0] | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);

  const speakWord = useCallback((text: string) => {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = speechSynthesis.getVoices();
    const englishVoice = 
      voices.find(voice => voice.lang === 'en-GB') ||
      voices.find(voice => voice.lang.startsWith('en-GB')) ||
      voices.find(voice => voice.lang === 'en-US') ||
      voices.find(voice => voice.lang.startsWith('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis?.speak(utterance);
  }, []);

  const setupRound = useCallback(() => {
    const availableWords = allVocabulary.filter(v => !usedWords.includes(v.word));
    if (availableWords.length < 4) {
      setUsedWords([]);
      return;
    }

    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);

    const allOptions: Option[] = [
      { ...correct, isCorrect: true },
      ...wrongOptions.map(w => ({ ...w, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    setCurrentWord(correct);
    setOptions(allOptions);
    setSelectedOption(null);
    setShowResult(false);
    setUsedWords(prev => [...prev, correct.word]);

    setTimeout(() => {
      speakWord(correct.word);
    }, 500);
  }, [usedWords, speakWord]);

  useEffect(() => {
    setupRound();
  }, []);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  useEffect(() => {
    if (round > totalRounds && !gameOver) {
      setGameWon(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [round, totalRounds, gameOver]);

  const handleOptionClick = (option: Option) => {
    if (showResult || gameOver || gameWon) return;

    setSelectedOption(option.word);
    setShowResult(true);
    setIsCorrect(option.isCorrect);

    if (option.isCorrect) {
      const points = 10 + (streak * 2);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      speakWord(option.word);

      setTimeout(() => {
        if (round < totalRounds) {
          setRound(prev => prev + 1);
          setupRound();
        } else {
          setRound(prev => prev + 1);
        }
      }, 1500);
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
      
      setTimeout(() => {
        if (lives > 1) {
          setupRound();
        }
      }, 2000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setRound(1);
    setUsedWords([]);
    setGameOver(false);
    setGameWon(false);
    setStreak(0);
    setSelectedOption(null);
    setShowResult(false);
    setTimeout(() => setupRound(), 100);
  };

  const shareGame = () => {
    const text = `I scored ${score} points on Say What?! Can you beat me? 🎧`;
    if (navigator.share) {
      navigator.share({ title: "Say What?", text, url: window.location.href });
    }
  };

  return (
    <Layout>
      <div className="say-what-wrapper primary-school-game" id="say-what-game">
        <div className="say-what-container">
          <PrimarySchoolGameHeader
            gameName="Say What?"
            description="Grade 2 - Theme 3: Body, Clothes & Weather"
            containerId="say-what-game"
            icon={<Volume2 className="h-7 w-7 text-teal-500" />}
          />

          <div className="stats-bar">
            <div className="stat-item score-item">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item lives-item">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="stat-value">{Array(lives).fill('❤️').join('')}</span>
            </div>
            <div className="stat-item round-item">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="stat-value">Round {Math.min(round, totalRounds)}/{totalRounds}</span>
            </div>
            {streak > 1 && (
              <div className="stat-item streak">
                <span>🔥 {streak} streak!</span>
              </div>
            )}
          </div>

          {!gameOver && !gameWon && currentWord && (
            <div className="game-area">
              <div className="listen-section">
                <div className="listen-button-wrapper">
                  <button
                    className="listen-btn"
                    onClick={() => speakWord(currentWord.word)}
                  >
                    <div className="sound-waves">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <Volume2 className="h-14 w-14" />
                    <span>Listen</span>
                  </button>
                  {showResult && (
                    <div className={`result-popup ${isCorrect ? 'correct' : 'wrong'}`}>
                      <div className="result-popup-content">
                        {isCorrect ? '✅ Correct!' : `❌ Wrong!`}
                      </div>
                    </div>
                  )}
                </div>
                <p className="instruction">Click to hear the word, then find the matching picture!</p>
              </div>

              <div className="options-grid">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-card ${selectedOption === option.word ? (option.isCorrect ? 'correct' : 'wrong') : ''} ${showResult && selectedOption === option.word && option.isCorrect ? 'highlight-correct' : ''}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={showResult}
                  >
                    <div className="card-glow"></div>
                    <img
                      src={`/images/primary/2.3/${option.file}`}
                      alt={option.word}
                    />
                    {showResult && !isCorrect && (selectedOption === option.word || option.isCorrect) && (
                      <div className="option-label">
                        <span className="word">{option.word}</span>
                        <span className="turkish">{option.turkish}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="primary-school-game-footer">
            <div className="footer-content">
              <div className="footer-left">
                <Button onClick={shareGame} variant="outline" className="footer-button">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
              <div className="footer-right">
                <Button onClick={resetGame} variant="outline" className="footer-button">
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-2/theme-3/games")}>
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </div>

        {gameOver && (
          <div className="game-end-modal">
            <div className="modal-content">
              <h2>💔 Game Over!</h2>
              <p>Final Score: {score}</p>
              <p>Rounds Completed: {round - 1}/{totalRounds}</p>
              <div className="modal-buttons">
                <Button onClick={resetGame} className="btn-primary">
                  <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                </Button>
                <Button variant="outline" onClick={() => setLocation("/primary-school/grade-2/theme-3/games")}>
                  Back to Games
                </Button>
              </div>
            </div>
          </div>
        )}

        {gameWon && (
          <div className="game-end-modal won">
            <div className="modal-content">
              <h2>🎉 Congratulations!</h2>
              <p>You completed all {totalRounds} rounds!</p>
              <p>Final Score: {score}</p>
              <div className="modal-buttons">
                <Button onClick={resetGame} className="btn-primary">
                  <RefreshCw className="h-4 w-4 mr-2" /> Play Again
                </Button>
                <Button variant="outline" onClick={shareGame}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button variant="outline" onClick={() => setLocation("/primary-school/grade-2/theme-3/games")}>
                  Back to Games
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .say-what-wrapper {
          min-height: 100vh;
          padding: 20px;
          position: relative;
        }

        .say-what-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: hsl(var(--card));
          padding: 10px 18px;
          border-radius: 24px;
          font-weight: 600;
          border: 2px solid hsl(var(--border));
        }

        .stat-item.streak {
          background: #14B8A6;
          color: white;
          border: none;
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .game-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .listen-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .listen-button-wrapper {
          position: relative;
        }

        .listen-btn {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: #14B8A6;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.4);
          position: relative;
          overflow: visible;
        }

        .listen-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(20, 184, 166, 0.6);
        }

        .sound-waves {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          pointer-events: none;
        }

        .sound-waves span {
          width: 4px;
          height: 20px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 2px;
          animation: wave 1.2s ease-in-out infinite;
        }

        .sound-waves span:nth-child(2) { animation-delay: 0.2s; }
        .sound-waves span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        .instruction {
          color: hsl(var(--muted-foreground));
          font-size: 15px;
          text-align: center;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 500px;
          width: 100%;
        }

        @media (min-width: 640px) {
          .options-grid {
            grid-template-columns: repeat(4, 1fr);
            max-width: 700px;
          }
        }

        .option-card {
          aspect-ratio: 1;
          border: 3px solid hsl(var(--border));
          border-radius: 20px;
          background: hsl(var(--card));
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .option-card:hover:not(:disabled) {
          transform: translateY(-6px) scale(1.02);
          border-color: #14B8A6;
        }

        .option-card img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 12px;
        }

        .option-card.correct {
          border-color: #22c55e;
          animation: correctPulse 0.6s ease;
        }

        .option-card.wrong {
          border-color: #ef4444;
          animation: shake 0.5s ease;
        }

        @keyframes correctPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .option-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          color: white;
          padding: 6px 4px;
          text-align: center;
        }

        .option-label .word {
          display: block;
          font-weight: 600;
          font-size: 12px;
        }

        .option-label .turkish {
          display: block;
          font-size: 10px;
          color: #a0a0a0;
        }

        .result-popup {
          position: absolute;
          top: -90px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2000;
          animation: popupAppear 0.4s ease;
        }

        .result-popup-content {
          font-size: 22px;
          font-weight: 700;
          padding: 14px 28px;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .result-popup.correct .result-popup-content {
          background: #22c55e;
          color: white;
        }

        .result-popup.wrong .result-popup-content {
          background: #ef4444;
          color: white;
        }

        @keyframes popupAppear {
          0% { opacity: 0; transform: translateX(-50%) scale(0.5); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }

        .game-end-modal {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          border-radius: 16px;
        }

        .modal-content {
          background: hsl(var(--card));
          padding: 40px;
          border-radius: 24px;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .modal-content h2 {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-primary {
          background: #14B8A6;
          color: white;
          border: none;
        }

        .game-end-modal.won .modal-content {
          background: #0D9488;
          color: white;
        }
      `}</style>
    </Layout>
  );
}
