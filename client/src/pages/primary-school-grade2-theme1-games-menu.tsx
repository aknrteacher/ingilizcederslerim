import { Layout } from "@/components/Layout";
import { PreschoolButton } from "@/components/PreschoolButton";
import { Link } from "wouter";
import matchlingsBanner from "@/assets/matchlings-banner-primary.png";
import wordCrossBanner from "@/assets/word-cross-banner-primary.png";
import spellQuestBanner from "@/assets/spell-quest-banner-primary.png";
import wordPopBanner from "@/assets/word-pop-banner-primary.png";
import catchThatBanner from "@/assets/catch-that-banner-primary.png";
import "../styles/oyunlar.css";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  gradient: "yellow-orange" | "blue-purple" | "pink-red" | "green-teal" | "purple-pink";
}

export default function PrimarySchoolGrade2Theme1GamesMenu() {
  const games: Game[] = [
    {
      id: "2.1.matching",
      title: "Matchlings",
      subtitle: "School Life",
      description: "Drag to match words with pictures. Hatch cute characters!",
      icon: "🎮",
      path: "/primary-school/grade-2/theme-1/2.1-matching-game",
      gradient: "yellow-orange",
    },
    {
      id: "2.1.crossword",
      title: "Word Cross",
      subtitle: "School Life",
      description: "Solve the puzzle using Turkish clues. Find all 15 hidden words!",
      icon: "🧩",
      path: "/primary-school/grade-2/theme-1/crossword",
      gradient: "blue-purple",
    },
    {
      id: "2.1.spell-quest",
      title: "Spell Quest",
      subtitle: "School Life",
      description: "Unscramble letters to spell words. Build your spelling skills!",
      icon: "✨",
      path: "/primary-school/grade-2/theme-1/spell-quest",
      gradient: "pink-red",
    },
    {
      id: "2.1.word-pop",
      title: "Word Pop",
      subtitle: "School Life",
      description: "Pop the balloons with the correct English words before they float away!",
      icon: "🎈",
      path: "/primary-school/grade-2/theme-1/word-pop",
      gradient: "green-teal",
    },
    {
      id: "2.1.catch-that",
      title: "Catch That",
      subtitle: "School Life",
      description: "Move the basket to catch the correct falling words. Don't miss them!",
      icon: "🎯",
      path: "/primary-school/grade-2/theme-1/catch-that",
      gradient: "purple-pink",
    },
  ];

  return (
    <Layout>
      <div className="oyunlar-container">
        <div className="oyunlar-header">
          <div>
            <h1 className="oyunlar-title">2. Sınıf - Tema 1: Okul Hayatı</h1>
            <p className="oyunlar-subtitle">Okul hayatıyla ilgili kelimeleri öğren ve oyunlarla pekiştir</p>
          </div>
        </div>

        {/* Primary School Games */}
        <section className="games-section">
          <div className="section-header">
            <h2 className="section-title">Mevcut Oyunlar</h2>
            <p className="section-description">
              Eğlenerek İngilizce öğren
            </p>
          </div>

          <div className="preschool-games-grid">
            {/* Matchlings Game with Custom Banner */}
            <Link href="/primary-school/grade-2/theme-1/2.1-matching-game">
              <a className="game-banner-link" data-testid="card-game-2.1.matching">
                <img 
                  src={matchlingsBanner} 
                  alt="Matchlings - School Life / Okul Hayatı" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Cross Game with Custom Banner */}
            <Link href="/primary-school/grade-2/theme-1/crossword">
              <a className="game-banner-link" data-testid="card-game-2.1.crossword">
                <img 
                  src={wordCrossBanner} 
                  alt="Word Cross - School Life / Okul Hayatı" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Spell Quest Game with Custom Banner */}
            <Link href="/primary-school/grade-2/theme-1/spell-quest">
              <a className="game-banner-link" data-testid="card-game-2.1.spell-quest">
                <img 
                  src={spellQuestBanner} 
                  alt="Spell Quest - School Life / Okul Hayatı" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Word Pop Game with Custom Banner */}
            <Link href="/primary-school/grade-2/theme-1/word-pop">
              <a className="game-banner-link" data-testid="card-game-2.1.word-pop">
                <img 
                  src={wordPopBanner} 
                  alt="Word Pop - School Life / Okul Hayatı" 
                  className="game-banner-image"
                />
              </a>
            </Link>
            
            {/* Catch That Game with Custom Banner */}
            <Link href="/primary-school/grade-2/theme-1/catch-that">
              <a className="game-banner-link" data-testid="card-game-2.1.catch-that">
                <img 
                  src={catchThatBanner} 
                  alt="Catch That - School Life / Okul Hayatı" 
                  className="game-banner-image"
                />
              </a>
            </Link>
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
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
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
