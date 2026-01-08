import React from "react";
import { Link } from "wouter";
import "@/styles/combined-game-button.css";

interface CombinedGameButtonProps {
  topicLabel: string;
  topicValue: string;
  gameType: string;
  gameIcon: string;
  href: string;
  gameGradient: "yellow-orange" | "blue-purple" | "pink-red" | "green-teal" | "purple-pink";
  dataTestId?: string;
  topicImage?: string; // Path to topic button PNG
  gameTypeImage?: string; // Path to game type button PNG
}

const gradientStyles = {
  "yellow-orange": {
    gradient: "linear-gradient(135deg, #FFE066 0%, #FF8C42 100%)",
    glow: "rgba(255, 224, 102, 0.6)",
    textColor: "#FF6B00",
    shadowColor: "rgba(255, 140, 66, 0.4)",
  },
  "blue-purple": {
    gradient: "linear-gradient(135deg, #6BCEFF 0%, #9B7FFF 100%)",
    glow: "rgba(107, 206, 255, 0.6)",
    textColor: "#4A5FFF",
    shadowColor: "rgba(155, 127, 255, 0.4)",
  },
  "pink-red": {
    gradient: "linear-gradient(135deg, #FFB3D9 0%, #FF6B6B 100%)",
    glow: "rgba(255, 179, 217, 0.6)",
    textColor: "#CC0044",
    shadowColor: "rgba(255, 107, 107, 0.4)",
  },
  "green-teal": {
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #3DD9C7 100%)",
    glow: "rgba(168, 230, 207, 0.6)",
    textColor: "#006B5C",
    shadowColor: "rgba(61, 217, 199, 0.4)",
  },
  "purple-pink": {
    gradient: "linear-gradient(135deg, #C8A8E9 0%, #FF8CC8 100%)",
    glow: "rgba(200, 168, 233, 0.6)",
    textColor: "#CC00AA",
    shadowColor: "rgba(255, 140, 200, 0.4)",
  },
};

const topicColors: Record<string, string> = {
  "0.1-numbers": "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
  "0.2-colours": "linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)",
  "0.3-greetings": "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
  "0.4-actions": "linear-gradient(135deg, #FF9A56 0%, #FF6A88 100%)",
  "0.5-ourbody": "linear-gradient(135deg, #A8E6CF 0%, #3DD9C7 100%)",
  "0.6-ourclassroom": "linear-gradient(135deg, #FFD89B 0%, #19547B 100%)",
  "0.7-things": "linear-gradient(135deg, #B4A7D6 0%, #8B7FA8 100%)",
  "0.8-people": "linear-gradient(135deg, #FFB347 0%, #FF8C00 100%)",
  "0.9-animals": "linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)",
  "0.10-aroundus": "linear-gradient(135deg, #74B9FF 0%, #0984E3 100%)",
  "0.11-food": "linear-gradient(135deg, #FDCB6E 0%, #E17055 100%)",
};

export function CombinedGameButton({
  topicLabel,
  topicValue,
  gameType,
  gameIcon,
  href,
  gameGradient,
  dataTestId,
  topicImage,
  gameTypeImage,
}: CombinedGameButtonProps) {
  const gameStyle = gradientStyles[gameGradient];
  const topicGradient = topicColors[topicValue] || "linear-gradient(135deg, #E0E0E0 0%, #B0B0B0 100%)";

  return (
    <Link href={href}>
      <a
        className="combined-game-button-link"
        data-testid={dataTestId}
        style={{
          ['--game-glow' as any]: gameStyle.glow,
          ['--game-shadow' as any]: gameStyle.shadowColor,
        }}
      >
        <div className="combined-game-button">
          {/* Game Type Section - Top Half */}
          <div
            className="combined-game-type"
            style={gameTypeImage ? {} : {
              background: gameStyle.gradient,
              boxShadow: `0 0 20px ${gameStyle.glow}, 0 4px 12px ${gameStyle.shadowColor}`,
            }}
          >
            {gameTypeImage ? (
              <img 
                src={gameTypeImage} 
                alt={gameType}
                className="combined-game-type-image"
              />
            ) : (
              <>
                <div className="combined-game-icon">{gameIcon}</div>
                <span 
                  className="combined-game-type-text"
                  style={{ color: gameStyle.textColor }}
                >
                  {gameType}
                </span>
              </>
            )}
          </div>
          
          {/* Topic Section - Bottom Half */}
          <div 
            className="combined-game-topic"
            style={topicImage ? {} : { background: topicGradient }}
          >
            {topicImage ? (
              <img 
                src={topicImage} 
                alt={topicLabel}
                className="combined-game-topic-image"
              />
            ) : (
              <span className="combined-game-topic-text">{topicLabel}</span>
            )}
          </div>
          
          {/* Hover Overlay */}
          <div className="combined-game-overlay">
            <div className="play-now-container">
              <span className="play-now-text">PLAY NOW</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

