import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Zap, Volume2, Trophy, Heart, RefreshCw } from "lucide-react";
import { PrimarySchoolGameHeader } from "@/components/PrimarySchoolGameHeader";
import confetti from "canvas-confetti";
import "@/styles/primary-school-game-header.css";
import "@/styles/primary-school-game-footer.css";

const allVocabulary = [
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

interface Option {
  word: string;
  file: string;
  turkish: string;
  isCorrect: boolean;
}

export default function SoundMatchGame() {
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

    // Auto-play the word after a short delay
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
      
      // Play success sound effect
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
    const text = `I scored ${score} points on Sound Match! Can you beat me? 🎧`;
    if (navigator.share) {
      navigator.share({ title: "Sound Match", text, url: window.location.href });
    }
  };

  return (
    <Layout>
      <div className="sound-match-wrapper primary-school-game" id="sound-match-game">
        <div className="sound-match-container">
          <PrimarySchoolGameHeader
            gameName="Sound Match"
            description="Grade 2 - Theme 1: School Life"
            containerId="sound-match-game"
            icon={<Volume2 className="h-7 w-7 text-purple-600" />}
          />

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{Array(lives).fill('❤️').join('')}</span>
            </div>
            <div className="stat-item">
              <span>Round {Math.min(round, totalRounds)}/{totalRounds}</span>
            </div>
            {streak > 1 && (
              <div className="stat-item streak">
                <span>🔥 {streak} streak!</span>
              </div>
            )}
          </div>

          {/* Game Area */}
          {!gameOver && !gameWon && currentWord && (
            <div className="game-area">
              {/* Listen Button */}
              <div className="listen-section">
                <button
                  className="listen-btn"
                  onClick={() => speakWord(currentWord.word)}
                >
                  <Volume2 className="h-12 w-12" />
                  <span>Listen</span>
                </button>
                <p className="instruction">Click to hear the word, then find the matching picture!</p>
              </div>

              {/* Options Grid */}
              <div className="options-grid">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-card ${selectedOption === option.word ? (option.isCorrect ? 'correct' : 'wrong') : ''} ${showResult && option.isCorrect ? 'highlight-correct' : ''}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={showResult}
                  >
                    <img
                      src={`/images/primary/2.1/${option.file}`}
                      alt={option.word}
                    />
                    {showResult && (
                      <div className="option-label">
                        <span className="word">{option.word}</span>
                        <span className="turkish">{option.turkish}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Result Message */}
              {showResult && (
                <div className={`result-message ${isCorrect ? 'correct' : 'wrong'}`}>
                  {isCorrect ? '✅ Correct!' : `❌ Wrong! It was "${currentWord.word}"`}
                </div>
              )}
            </div>
          )}

          {/* Game Over */}
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
                  <Button variant="outline" onClick={() => setLocation("/primary-school/grade-2/theme-1/games")}>
                    Back to Games
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Game Won */}
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
                  <Button variant="outline" onClick={() => setLocation("/primary-school/grade-2/theme-1/games")}>
                    Back to Games
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
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
                <Button variant="outline" className="footer-button" onClick={() => setLocation("/primary-school/grade-2/theme-1/games")}>
                  ← Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sound-match-wrapper {
          min-height: 100vh;
          padding: 20px;
        }

        .sound-match-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: hsl(var(--card));
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          border: 2px solid hsl(var(--border));
        }

        .stat-item.streak {
          background: linear-gradient(135deg, #ff6b6b, #ffa500);
          color: white;
          border: none;
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .game-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .listen-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .listen-btn {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .listen-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
        }

        .listen-btn:active {
          transform: scale(0.95);
        }

        .instruction {
          color: hsl(var(--muted-foreground));
          font-size: 14px;
          text-align: center;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
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
          border-radius: 16px;
          background: hsl(var(--card));
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .option-card:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border-color: hsl(var(--primary));
        }

        .option-card img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .option-card.correct {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
          animation: correctPulse 0.5s ease;
        }

        .option-card.wrong {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          animation: shake 0.5s ease;
        }

        .option-card.highlight-correct {
          border-color: #22c55e;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }

        @keyframes correctPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .option-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 4px;
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

        .result-message {
          font-size: 20px;
          font-weight: 700;
          padding: 12px 24px;
          border-radius: 12px;
          animation: slideIn 0.3s ease;
        }

        .result-message.correct {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .result-message.wrong {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .game-end-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        .modal-content p {
          font-size: 18px;
          color: hsl(var(--muted-foreground));
          margin-bottom: 8px;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
        }

        .game-end-modal.won .modal-content {
          background: linear-gradient(135deg, #fef3c7, #fcd34d);
        }

        .game-end-modal.won h2 {
          color: #92400e;
        }
      `}</style>
    </Layout>
  );
}
