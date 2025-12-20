import { Layout } from "@/components/Layout";
import { PreschoolButton } from "@/components/PreschoolButton";
import { Link } from "wouter";
import matchlingsBanner from "@/assets/matchlings-banner.png";
import wordCrossBanner from "@/assets/word-cross-banner.png";
import spellQuestBanner from "@/assets/spell-quest-banner.png";
import wordPopBanner from "@/assets/word-pop-banner.png";
import colorCatchBanner from "@/assets/color-catch-banner.png";
import "../styles/oyunlar.css";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  gradient: "yellow-orange" | "blue-purple" | "pink-red" | "green-teal" | "purple-pink";
}

export default function PreSchoolGamesMenu() {
  const games: Game[] = [
    {
      id: "0.1.matching",
      title: "Matchlings",
      subtitle: "Colours",
      description: "Match colours with their English names. Drag and hatch cute characters!",
      icon: "🌈",
      path: "/pre-school/0.1-matching-game",
      gradient: "yellow-orange",
    },
    {
      id: "0.1.crossword",
      title: "Word Cross",
      subtitle: "Colours",
      description: "Solve the crossword puzzle using colour names!",
      icon: "🧩",
      path: "/pre-school/0.1-crossword",
      gradient: "blue-purple",
    },
    {
      id: "0.1.spell-quest",
      title: "Spell Quest",
      subtitle: "Colours",
      description: "Unscramble letters to spell colour words!",
      icon: "✨",
      path: "/pre-school/0.1-spell-quest",
      gradient: "pink-red",
    },
    {
      id: "0.1.word-pop",
      title: "Word Pop",
      subtitle: "Colours",
      description: "Pop the balloon with the matching colour!",
      icon: "🎈",
      path: "/pre-school/0.1-word-pop",
      gradient: "green-teal",
    },
    {
      id: "0.1.color-catch",
      title: "Catch That",
      subtitle: "Colours",
      description: "Catch the falling colors with your basket!",
      icon: "🎨",
      path: "/pre-school/0.1-catch-that",
      gradient: "purple-pink",
    },
    {
      id: "0.1-numbers.matching",
      title: "Matchlings",
      subtitle: "Numbers",
      description: "Match numbers with their English names. Drag and hatch cute characters!",
      icon: "🔢",
      path: "/pre-school/0.1-numbers-matching-game",
      gradient: "yellow-orange",
    },
    {
      id: "0.1-numbers.crossword",
      title: "Word Cross",
      subtitle: "Numbers",
      description: "Solve the crossword puzzle using number names!",
      icon: "🧩",
      path: "/pre-school/0.1-numbers-crossword",
      gradient: "blue-purple",
    },
    {
      id: "0.1-numbers.spell-quest",
      title: "Spell Quest",
      subtitle: "Numbers",
      description: "Unscramble letters to spell number words!",
      icon: "✨",
      path: "/pre-school/0.1-numbers-spell-quest",
      gradient: "pink-red",
    },
    {
      id: "0.1-numbers.word-pop",
      title: "Word Pop",
      subtitle: "Numbers",
      description: "Pop the balloon with the matching number!",
      icon: "🎈",
      path: "/pre-school/0.1-numbers-word-pop",
      gradient: "green-teal",
    },
    {
      id: "0.1-numbers.catch-that",
      title: "Catch That",
      subtitle: "Numbers",
      description: "Catch the falling numbers with your basket!",
      icon: "🔢",
      path: "/pre-school/0.1-numbers-catch-that",
      gradient: "purple-pink",
    },
  ];

  return (
    <Layout>
      <div className="oyunlar-container">
        <div className="oyunlar-header">
          <div>
            <h1 className="oyunlar-title">Okul Öncesi & 1. Sınıf - Oyunlar</h1>
            <p className="oyunlar-subtitle">Renkler, sayılar ve temel kavramları oyunlarla öğren!</p>
          </div>
        </div>

        {/* Pre-School Games */}
        <section className="games-section">
          <div className="section-header">
            <h2 className="section-title">Mevcut Oyunlar</h2>
            <p className="section-description">
              Eğlenerek İngilizce öğren
            </p>
          </div>

          <div className="preschool-games-grid">
            {/* Matchlings Game with Custom Banner */}
            <Link href="/pre-school/0.1-matching-game">
              <a className="game-banner-link" data-testid="card-game-0.1.matching">
                <img 
                  src={matchlingsBanner} 
                  alt="Matchlings - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Cross Game with Custom Banner */}
            <Link href="/pre-school/0.1-crossword">
              <a className="game-banner-link" data-testid="card-game-0.1.crossword">
                <img 
                  src={wordCrossBanner} 
                  alt="Word Cross - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Spell Quest Game with Custom Banner */}
            <Link href="/pre-school/0.1-spell-quest">
              <a className="game-banner-link" data-testid="card-game-0.1.spell-quest">
                <img 
                  src={spellQuestBanner} 
                  alt="Spell Quest - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Pop Game with Custom Banner */}
            <Link href="/pre-school/0.1-word-pop">
              <a className="game-banner-link" data-testid="card-game-0.1.word-pop">
                <img 
                  src={wordPopBanner} 
                  alt="Word Pop - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Color Catch Game with Custom Banner */}
            <Link href="/pre-school/0.1-catch-that">
              <a className="game-banner-link" data-testid="card-game-0.1.color-catch">
                <img 
                  src={colorCatchBanner} 
                  alt="Catch That - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Number Games */}
            {games.filter(game => game.id.startsWith("0.1-numbers")).map((game) => (
              <PreschoolButton
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                description={game.description}
                icon={game.icon}
                href={game.path}
                gradient={game.gradient}
                dataTestId={`card-game-${game.id}`}
              />
            ))}
            
            {/* Other Games */}
            {games.filter(game => game.id !== "0.1.matching" && game.id !== "0.1.crossword" && game.id !== "0.1.spell-quest" && game.id !== "0.1.word-pop" && game.id !== "0.1.color-catch" && !game.id.startsWith("0.1-numbers")).map((game) => (
              <PreschoolButton
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                description={game.description}
                icon={game.icon}
                href={game.path}
                gradient={game.gradient}
                dataTestId={`card-game-${game.id}`}
              />
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .preschool-games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
        }

        @media (min-width: 1400px) {
          .preschool-games-grid {
            grid-template-columns: repeat(4, 1fr);
            max-width: 1400px;
          }
        }

        @media (min-width: 1024px) and (max-width: 1399px) {
          .preschool-games-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .preschool-games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .preschool-games-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .game-banner-link {
          display: block;
          text-decoration: none;
          transition: transform 0.3s ease, filter 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .game-banner-link:hover {
          transform: translateY(-8px) scale(1.02);
          filter: brightness(1.05);
          box-shadow: 0 12px 32px rgba(255, 224, 102, 0.4);
        }

        .game-banner-link:active {
          transform: translateY(-4px) scale(1.01);
        }

        .game-banner-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        @media (min-width: 1400px) {
          .game-banner-link {
            grid-column: span 2;
          }
        }

        @media (min-width: 1024px) and (max-width: 1399px) {
          .game-banner-link {
            grid-column: span 2;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .game-banner-link {
            grid-column: span 2;
          }
        }
      `}</style>
    </Layout>
  );
}
