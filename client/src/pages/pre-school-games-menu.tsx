import { Layout } from "@/components/Layout";
import { PreschoolButton } from "@/components/PreschoolButton";
import { Link } from "wouter";
import matchlingsBanner from "@/assets/matchlings-banner.png";
import wordCrossBanner from "@/assets/word-cross-banner.png";
import spellQuestBanner from "@/assets/spell-quest-banner.png";
import wordPopBanner from "@/assets/word-pop-banner.png";
import colorCatchBanner from "@/assets/color-catch-banner.png";
import matchlingsNumbersBanner from "@/assets/matchlings-numbers-banner.png";
import wordCrossNumbersBanner from "@/assets/word-cross-numbers-banner.png";
import spellQuestNumbersBanner from "@/assets/spell-quest-numbers-banner.png";
import wordPopNumbersBanner from "@/assets/word-pop-numbers-banner.png";
import catchThatNumbersBanner from "@/assets/catch-that-numbers-banner.png";
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
      id: "0.2-colours.matching",
      title: "Matchlings",
      subtitle: "Colours",
      description: "Match colours with their English names. Drag and hatch cute characters!",
      icon: "🌈",
      path: "/pre-school/0.2-colours-matching-game",
      gradient: "yellow-orange",
    },
    {
      id: "0.2-colours.crossword",
      title: "Word Cross",
      subtitle: "Colours",
      description: "Solve the crossword puzzle using colour names!",
      icon: "🧩",
      path: "/pre-school/0.2-colours-crossword",
      gradient: "blue-purple",
    },
    {
      id: "0.2-colours.spell-quest",
      title: "Spell Quest",
      subtitle: "Colours",
      description: "Unscramble letters to spell colour words!",
      icon: "✨",
      path: "/pre-school/0.2-colours-spell-quest",
      gradient: "pink-red",
    },
    {
      id: "0.2-colours.word-pop",
      title: "Word Pop",
      subtitle: "Colours",
      description: "Pop the balloon with the matching colour!",
      icon: "🎈",
      path: "/pre-school/0.2-colours-word-pop",
      gradient: "green-teal",
    },
    {
      id: "0.2-colours.color-catch",
      title: "Catch That",
      subtitle: "Colours",
      description: "Catch the falling colors with your basket!",
      icon: "🎨",
      path: "/pre-school/0.2-colours-catch-that",
      gradient: "purple-pink",
    },
    {
      id: "0.2-colours.i-spy",
      title: "I Spy",
      subtitle: "Colours & Objects",
      description: "I spy with my little eye... Find objects by their colors!",
      icon: "👁️",
      path: "/pre-school/0.2-colours-i-spy",
      gradient: "blue-purple",
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
            <Link href="/pre-school/0.2-colours-matching-game">
              <a className="game-banner-link" data-testid="card-game-0.2-colours.matching">
                <img 
                  src={matchlingsBanner} 
                  alt="Matchlings - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Cross Game with Custom Banner */}
            <Link href="/pre-school/0.2-colours-crossword">
              <a className="game-banner-link" data-testid="card-game-0.2-colours.crossword">
                <img 
                  src={wordCrossBanner} 
                  alt="Word Cross - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Spell Quest Game with Custom Banner */}
            <Link href="/pre-school/0.2-colours-spell-quest">
              <a className="game-banner-link" data-testid="card-game-0.2-colours.spell-quest">
                <img 
                  src={spellQuestBanner} 
                  alt="Spell Quest - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Pop Game with Custom Banner */}
            <Link href="/pre-school/0.2-colours-word-pop">
              <a className="game-banner-link" data-testid="card-game-0.2-colours.word-pop">
                <img 
                  src={wordPopBanner} 
                  alt="Word Pop - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Color Catch Game with Custom Banner */}
            <Link href="/pre-school/0.2-colours-catch-that">
              <a className="game-banner-link" data-testid="card-game-0.2-colours.color-catch">
                <img 
                  src={colorCatchBanner} 
                  alt="Catch That - Colours / Renkler" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Matchlings Numbers Game with Custom Banner */}
            <Link href="/pre-school/0.1-numbers-matching-game">
              <a className="game-banner-link" data-testid="card-game-0.1-numbers.matching">
                <img 
                  src={matchlingsNumbersBanner} 
                  alt="Matchlings - Numbers 1 to 10 / Sayılar 1'den 10'a" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Cross Numbers Game with Custom Banner */}
            <Link href="/pre-school/0.1-numbers-crossword">
              <a className="game-banner-link" data-testid="card-game-0.1-numbers.crossword">
                <img 
                  src={wordCrossNumbersBanner} 
                  alt="Word Cross - Numbers 1 to 10 / Sayılar 1'den 10'a" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Spell Quest Numbers Game with Custom Banner */}
            <Link href="/pre-school/0.1-numbers-spell-quest">
              <a className="game-banner-link" data-testid="card-game-0.1-numbers.spell-quest">
                <img 
                  src={spellQuestNumbersBanner} 
                  alt="Spell Quest - Numbers 1 to 10 / Sayılar 1'den 10'a" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Pop Numbers Game with Custom Banner */}
            <Link href="/pre-school/0.1-numbers-word-pop">
              <a className="game-banner-link" data-testid="card-game-0.1-numbers.word-pop">
                <img 
                  src={wordPopNumbersBanner} 
                  alt="Word Pop - Numbers 1 to 10 / Sayılar 1'den 10'a" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Catch That Numbers Game with Custom Banner */}
            <Link href="/pre-school/0.1-numbers-catch-that">
              <a className="game-banner-link" data-testid="card-game-0.1-numbers.catch-that">
                <img 
                  src={catchThatNumbersBanner} 
                  alt="Catch That - Numbers 1 to 10 / Sayılar 1'den 10'a" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Other Games */}
            {games.filter(game => game.id !== "0.2-colours.matching" && game.id !== "0.2-colours.crossword" && game.id !== "0.2-colours.spell-quest" && game.id !== "0.2-colours.word-pop" && game.id !== "0.2-colours.color-catch" && game.id !== "0.2-colours.i-spy" && !game.id.startsWith("0.1-numbers")).map((game) => (
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
