import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Share2, Zap, Eye, Trophy, Clock } from "lucide-react";
import { PreschoolGameHeader } from "@/components/PreschoolGameHeader";
import "@/styles/0.1.i-spy.css";
import "@/styles/preschool-game-header.css";
import "@/styles/preschool-game-footer.css";

interface SpyObject {
  id: string;
  name: string;
  color: string;
  x: number; // percentage position
  y: number; // percentage position
  width: number; // percentage width
  height: number; // percentage height
}

// Colors vocabulary
const colors = [
  { word: "red", turkish: "kırmızı" },
  { word: "blue", turkish: "mavi" },
  { word: "yellow", turkish: "sarı" },
  { word: "green", turkish: "yeşil" },
  { word: "orange", turkish: "turuncu" },
  { word: "purple", turkish: "mor" },
  { word: "pink", turkish: "pembe" },
  { word: "brown", turkish: "kahverengi" },
  { word: "gray", turkish: "gri" },
  { word: "white", turkish: "beyaz" },
  { word: "black", turkish: "siyah" },
];

// Background image path - Update this to your uploaded image
// 
// INSTRUCTIONS TO ADD YOUR IMAGE:
// 1. Create the directory: /client/public/images/games/i-spy/
// 2. Upload your classroom image there (e.g., classroom-scene.jpg or classroom-scene.png)
// 3. Update the BACKGROUND_IMAGE path below to match your filename
//
// TIP: Use a high-resolution image (at least 1200x800px) for best quality
const BACKGROUND_IMAGE = "/images/preschool/games/i-spy/classroom-scene.jpg"; // Change to your image path

// Classroom objects with colors
// 
// POSITIONING INSTRUCTIONS:
// - x, y: Position of the object (percentage from top-left: 0-100)
// - width, height: Size of the clickable area (percentage)
// 
// To position objects on your image:
// 1. Open your image in an image editor
// 2. Note the pixel coordinates of each object
// 3. Convert to percentages: (pixel_x / image_width) * 100
// 4. Adjust the x, y, width, height values below to match your image
//
// Example: If a book is at pixel (240, 160) in a 1600x1000px image:
//   x = (240 / 1600) * 100 = 15%
//   y = (160 / 1000) * 100 = 16%
const classroomObjects: SpyObject[] = [
  { id: "1", name: "book", color: "blue", x: 15, y: 20, width: 12, height: 15 },
  { id: "2", name: "pencil", color: "red", x: 30, y: 25, width: 8, height: 12 },
  { id: "3", name: "eraser", color: "pink", x: 45, y: 30, width: 10, height: 8 },
  { id: "4", name: "ruler", color: "yellow", x: 60, y: 22, width: 15, height: 6 },
  { id: "5", name: "crayon", color: "green", x: 20, y: 50, width: 6, height: 10 },
  { id: "6", name: "notebook", color: "orange", x: 35, y: 55, width: 14, height: 12 },
  { id: "7", name: "backpack", color: "purple", x: 55, y: 50, width: 18, height: 20 },
  { id: "8", name: "glue", color: "blue", x: 25, y: 70, width: 8, height: 10 },
  { id: "9", name: "scissors", color: "red", x: 50, y: 75, width: 10, height: 8 },
  { id: "10", name: "marker", color: "green", x: 70, y: 60, width: 6, height: 12 },
];

export default function ISpyGame() {
  const [, setLocation] = useLocation();
  const [objects] = useState<SpyObject[]>(classroomObjects);
  const [currentColor, setCurrentColor] = useState<string>("");
  const [foundObjects, setFoundObjects] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize game
  useEffect(() => {
    if (gameStarted && !currentColor) {
      startNewRound();
    }
  }, [gameStarted]);

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
    if (gameStarted && foundObjects.length === objects.length) {
      setGameComplete(true);
    }
  }, [foundObjects, objects.length, gameStarted]);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const startNewRound = () => {
    // Find objects that haven't been found yet
    const availableObjects = objects.filter(obj => !foundObjects.includes(obj.id));
    
    if (availableObjects.length === 0) {
      return;
    }

    // Get unique colors from available objects
    const availableColors = [...new Set(availableObjects.map(obj => obj.color))];
    
    // Pick a random color
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setCurrentColor(randomColor);
    
    // Speak the challenge
    setTimeout(() => {
      speakText(`I spy with my little eye something ${randomColor}`);
    }, 300);
  };

  const handleObjectClick = (object: SpyObject) => {
    if (foundObjects.includes(object.id) || !currentColor || isSpeaking) {
      return;
    }

    const audio = new Audio("/sounds/click1.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});

    if (object.color === currentColor) {
      // Correct!
      setFoundObjects([...foundObjects, object.id]);
      setScore(prev => prev + 10);
      
      const successAudio = new Audio("/sounds/yay.mp3");
      successAudio.volume = 0.5;
      successAudio.play().catch(() => {});

      const feedbackMessage = `A ${object.color} ${object.name}! Well done!`;
      setShowFeedback({ message: feedbackMessage, isCorrect: true });
      
      speakText(feedbackMessage);
      
      // Start next round after a delay
      setTimeout(() => {
        setShowFeedback(null);
        startNewRound();
      }, 2000);
    } else {
      // Wrong color
      const errorAudio = new Audio("/sounds/error.mp3");
      errorAudio.volume = 0.3;
      errorAudio.play().catch(() => {});

      setShowFeedback({ 
        message: `That's a ${object.color} ${object.name}. Try again!`, 
        isCorrect: false 
      });
      
      setTimeout(() => {
        setShowFeedback(null);
      }, 2000);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    setFoundObjects([]);
    setScore(0);
    setGameComplete(false);
    setCurrentColor("");
    startNewRound();
  };

  const resetGame = () => {
    setGameStarted(false);
    setFoundObjects([]);
    setScore(0);
    setElapsedTime(0);
    setGameComplete(false);
    setCurrentColor("");
    setShowFeedback(null);
    window.speechSynthesis?.cancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const shareGame = () => {
    const text = `I just found all ${objects.length} objects in ${formatTime(elapsedTime)} on I Spy Colours! Can you beat my time? 👁️`;
    if (navigator.share) {
      navigator.share({
        title: "I Spy",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  const challengeFriend = () => {
    const text = `Challenge me on I Spy Colours! Can you find all objects faster than my ${formatTime(elapsedTime)}? 🏆`;
    if (navigator.share) {
      navigator.share({
        title: "Challenge on I Spy",
        text: text,
        url: window.location.href,
      });
    } else {
      alert(text);
    }
  };

  const getColorClass = (color: string) => {
    return `color-${color}`;
  };

  return (
    <Layout>
      <div className="i-spy-game-wrapper preschool-game" id="i-spy-game">
        <div className="i-spy-game-container">
          <PreschoolGameHeader 
            gameName="I Spy"
            description="Pre-School & 1st Grade - Theme: Colours & Classroom Objects"
            containerId="i-spy-game"
            icon={<Eye className="h-7 w-7 text-amber-600" />}
          />
          
          {!gameStarted ? (
            <div className="game-start-screen">
              <div className="start-content">
                <Eye className="h-16 w-16 text-amber-600 mb-4" />
                <h2 className="start-title">I Spy with My Little Eye</h2>
                <p className="start-description">
                  Listen carefully! The narrator will tell you what color to find.
                  Click on objects that match the color!
                </p>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="start-button"
                  data-testid="button-start-game"
                >
                  Start Game
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap mb-4">
                <div className="flex items-center gap-2 bg-green-100 px-2 sm:px-3 py-1 rounded-lg">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="font-bold text-green-700 text-sm sm:text-base">
                    {foundObjects.length} / {objects.length}
                  </span>
                </div>
                
                <div className="bg-amber-100 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1 sm:gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                  <span className="font-bold text-amber-700 text-sm sm:text-base" data-testid="text-timer">
                    {formatTime(elapsedTime)}
                  </span>
                </div>
              </div>

              {currentColor && (
                <div className="current-challenge">
                  <p className="challenge-text">
                    Find something <span className={`challenge-color ${getColorClass(currentColor)}`}>{currentColor}</span>
                  </p>
                </div>
              )}

              {showFeedback && (
                <div className={`feedback-message ${showFeedback.isCorrect ? 'correct' : 'incorrect'}`}>
                  {showFeedback.message}
                </div>
              )}

              <div className="game-scene-container">
                <div 
                  className="game-scene" 
                  style={{ 
                    backgroundImage: `url(${BACKGROUND_IMAGE})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Background image is set via CSS background-image */}
                  {/* If image doesn't load, a gradient fallback will show */}
                  {objects.map((object) => {
                    const isFound = foundObjects.includes(object.id);
                    const isTargetColor = object.color === currentColor;
                    
                    return (
                      <div
                        key={object.id}
                        className={`spy-object ${getColorClass(object.color)} ${isFound ? 'found' : ''} ${isTargetColor && !isFound ? 'highlight' : ''}`}
                        style={{
                          left: `${object.x}%`,
                          top: `${object.y}%`,
                          width: `${object.width}%`,
                          height: `${object.height}%`,
                        }}
                        onClick={() => handleObjectClick(object)}
                        title={`${object.color} ${object.name}`}
                        data-testid={`object-${object.id}`}
                      >
                        {!isFound && isTargetColor && (
                          <div className="object-hint-indicator"></div>
                        )}
                        {isFound && (
                          <div className="found-checkmark">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="preschool-game-footer">
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
                      onClick={() => setLocation("/pre-school/games")}
                    >
                      ← Back
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {gameComplete && (
            <div className="win-modal">
              <div className="win-content">
                <h2>🎉 Perfect! 🎉</h2>
                <p>You found all the objects!</p>
                <div className="win-stats">
                  <p>
                    <strong>Time:</strong> {formatTime(elapsedTime)}
                  </p>
                  <p>
                    <strong>Score:</strong> {score} points
                  </p>
                  <p className="score-note">
                    {elapsedTime < 60 ? "⭐ Amazing speed!" : "✨ Great job!"}
                  </p>
                </div>
                <div className="win-buttons">
                  <button onClick={resetGame} className="btn-primary" data-testid="button-play-again">
                    Play Again
                  </button>
                  <Button variant="ghost" onClick={() => setLocation("/pre-school/games")} className="btn-secondary">
                    Back to Games
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

