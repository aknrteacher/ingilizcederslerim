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
  subtitle: string;
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
    {
      id: "0.3-greetings.matching",
      title: "Matchlings",
      subtitle: "Greetings",
      description: "Match greetings with their English names. Drag and hatch cute characters!",
      icon: "👋",
      path: "/pre-school/0.3-greetings-matching-game",
      gradient: "yellow-orange",
    },
    {
      id: "0.3-greetings.crossword",
      title: "Word Cross",
      subtitle: "Greetings",
      description: "Solve the crossword puzzle using greeting words!",
      icon: "🧩",
      path: "/pre-school/0.3-greetings-crossword",
      gradient: "blue-purple",
    },
    {
      id: "0.3-greetings.spell-quest",
      title: "Spell Quest",
      subtitle: "Greetings",
      description: "Unscramble letters to spell greeting words!",
      icon: "✨",
      path: "/pre-school/0.3-greetings-spell-quest",
      gradient: "pink-red",
    },
    {
      id: "0.3-greetings.word-pop",
      title: "Word Pop",
      subtitle: "Greetings",
      description: "Pop the balloon with the matching greeting!",
      icon: "🎈",
      path: "/pre-school/0.3-greetings-word-pop",
      gradient: "green-teal",
    },
    {
      id: "0.3-greetings.catch-that",
      title: "Catch That",
      subtitle: "Greetings",
      description: "Catch the falling greetings with your basket!",
      icon: "🎯",
      path: "/pre-school/0.3-greetings-catch-that",
      gradient: "purple-pink",
    },
    {
      id: "0.4-actions.matching",
      title: "Matchlings",
      subtitle: "Actions",
      description: "Match actions with their English names. Drag and hatch cute characters!",
      icon: "🏃",
      path: "/pre-school/0.4-actions-matching-game",
      gradient: "yellow-orange",
    },
    {
      id: "0.4-actions.crossword",
      title: "Word Cross",
      subtitle: "Actions",
      description: "Solve the crossword puzzle using action words!",
      icon: "🧩",
      path: "/pre-school/0.4-actions-crossword",
      gradient: "blue-purple",
    },
    {
      id: "0.4-actions.spell-quest",
      title: "Spell Quest",
      subtitle: "Actions",
      description: "Unscramble letters to spell action words!",
      icon: "✨",
      path: "/pre-school/0.4-actions-spell-quest",
      gradient: "pink-red",
    },
    {
      id: "0.4-actions.word-pop",
      title: "Word Pop",
      subtitle: "Actions",
      description: "Pop the balloon with the matching action!",
      icon: "🎈",
      path: "/pre-school/0.4-actions-word-pop",
      gradient: "green-teal",
    },
    {
      id: "0.4-actions.catch-that",
      title: "Catch That",
      subtitle: "Actions",
      description: "Catch the falling actions with your basket!",
      icon: "🎯",
      path: "/pre-school/0.4-actions-catch-that",
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
            
            {/* Greetings Games */}
            {games.filter(game => game.id.startsWith("0.3-greetings")).map((game) => (
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
            
            {/* Actions Games */}
            {games.filter(game => game.id.startsWith("0.4-actions")).map((game) => (
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
            
            {/* TEMPORARY: Our Body Games (0.5) */}
            <PreschoolButton
              title="Matchlings"
              subtitle="Our Body"
              description="Match body parts with their English names. Drag and hatch cute characters!"
              icon="👤"
              href="/pre-school/0.5-ourbody-matching-game"
              gradient="yellow-orange"
              dataTestId="card-game-0.5-ourbody.matching"
            />
            <PreschoolButton
              title="Word Cross"
              subtitle="Our Body"
              description="Solve the crossword puzzle using body part words!"
              icon="🧩"
              href="/pre-school/0.5-ourbody-crossword"
              gradient="blue-purple"
              dataTestId="card-game-0.5-ourbody.crossword"
            />
            <PreschoolButton
              title="Spell Quest"
              subtitle="Our Body"
              description="Unscramble letters to spell body part words!"
              icon="✨"
              href="/pre-school/0.5-ourbody-spell-quest"
              gradient="pink-red"
              dataTestId="card-game-0.5-ourbody.spell-quest"
            />
            <PreschoolButton
              title="Word Pop"
              subtitle="Our Body"
              description="Pop the balloon with the matching body part!"
              icon="🎈"
              href="/pre-school/0.5-ourbody-word-pop"
              gradient="green-teal"
              dataTestId="card-game-0.5-ourbody.word-pop"
            />
            <PreschoolButton
              title="Catch That"
              subtitle="Our Body"
              description="Catch the falling body parts with your basket!"
              icon="🎯"
              href="/pre-school/0.5-ourbody-catch-that"
              gradient="purple-pink"
              dataTestId="card-game-0.5-ourbody.catch-that"
            />
            
            {/* TEMPORARY: Our Classroom Games (0.6) */}
            <PreschoolButton
              title="Matchlings"
              subtitle="Our Classroom"
              description="Match classroom items with their English names. Drag and hatch cute characters!"
              icon="📚"
              href="/pre-school/0.6-ourclassroom-matching-game"
              gradient="yellow-orange"
              dataTestId="card-game-0.6-ourclassroom.matching"
            />
            <PreschoolButton
              title="Word Cross"
              subtitle="Our Classroom"
              description="Solve the crossword puzzle using classroom item words!"
              icon="🧩"
              href="/pre-school/0.6-ourclassroom-crossword"
              gradient="blue-purple"
              dataTestId="card-game-0.6-ourclassroom.crossword"
            />
            <PreschoolButton
              title="Spell Quest"
              subtitle="Our Classroom"
              description="Unscramble letters to spell classroom item words!"
              icon="✨"
              href="/pre-school/0.6-ourclassroom-spell-quest"
              gradient="pink-red"
              dataTestId="card-game-0.6-ourclassroom.spell-quest"
            />
            <PreschoolButton
              title="Word Pop"
              subtitle="Our Classroom"
              description="Pop the balloon with the matching classroom item!"
              icon="🎈"
              href="/pre-school/0.6-ourclassroom-word-pop"
              gradient="green-teal"
              dataTestId="card-game-0.6-ourclassroom.word-pop"
            />
            <PreschoolButton
              title="Catch That"
              subtitle="Our Classroom"
              description="Catch the falling classroom items with your basket!"
              icon="🎯"
              href="/pre-school/0.6-ourclassroom-catch-that"
              gradient="purple-pink"
              dataTestId="card-game-0.6-ourclassroom.catch-that"
            />
            
            {/* TEMPORARY: Things Games (0.7) */}
            <PreschoolButton
              title="Matchlings"
              subtitle="Things"
              description="Match things with their English names. Drag and hatch cute characters!"
              icon="🧸"
              href="/pre-school/0.7-things-matching-game"
              gradient="yellow-orange"
              dataTestId="card-game-0.7-things.matching"
            />
            <PreschoolButton
              title="Word Cross"
              subtitle="Things"
              description="Solve the crossword puzzle using thing words!"
              icon="🧩"
              href="/pre-school/0.7-things-crossword"
              gradient="blue-purple"
              dataTestId="card-game-0.7-things.crossword"
            />
            <PreschoolButton
              title="Spell Quest"
              subtitle="Things"
              description="Unscramble letters to spell thing words!"
              icon="✨"
              href="/pre-school/0.7-things-spell-quest"
              gradient="pink-red"
              dataTestId="card-game-0.7-things.spell-quest"
            />
            <PreschoolButton
              title="Word Pop"
              subtitle="Things"
              description="Pop the balloon with the matching thing!"
              icon="🎈"
              href="/pre-school/0.7-things-word-pop"
              gradient="green-teal"
              dataTestId="card-game-0.7-things.word-pop"
            />
            <PreschoolButton
              title="Catch That"
              subtitle="Things"
              description="Catch the falling things with your basket!"
              icon="🎯"
              href="/pre-school/0.7-things-catch-that"
              gradient="purple-pink"
              dataTestId="card-game-0.7-things.catch-that"
            />
            
            {/* TEMPORARY: People Games (0.8) */}
            <PreschoolButton
              title="Matchlings"
              subtitle="People"
              description="Match people with their English names. Drag and hatch cute characters!"
              icon="👥"
              href="/pre-school/0.8-people-matching-game"
              gradient="yellow-orange"
              dataTestId="card-game-0.8-people.matching"
            />
            <PreschoolButton
              title="Word Cross"
              subtitle="People"
              description="Solve the crossword puzzle using people words!"
              icon="🧩"
              href="/pre-school/0.8-people-crossword"
              gradient="blue-purple"
              dataTestId="card-game-0.8-people.crossword"
            />
            <PreschoolButton
              title="Spell Quest"
              subtitle="People"
              description="Unscramble letters to spell people words!"
              icon="✨"
              href="/pre-school/0.8-people-spell-quest"
              gradient="pink-red"
              dataTestId="card-game-0.8-people.spell-quest"
            />
            <PreschoolButton
              title="Word Pop"
              subtitle="People"
              description="Pop the balloon with the matching person!"
              icon="🎈"
              href="/pre-school/0.8-people-word-pop"
              gradient="green-teal"
              dataTestId="card-game-0.8-people.word-pop"
            />
            <PreschoolButton
              title="Catch That"
              subtitle="People"
              description="Catch the falling people words with your basket!"
              icon="🎯"
              href="/pre-school/0.8-people-catch-that"
              gradient="purple-pink"
              dataTestId="card-game-0.8-people.catch-that"
            />
            
            {/* TEMPORARY: Animals Games (0.9) */}
            <PreschoolButton
              title="Matchlings"
              subtitle="Animals"
              description="Match animals with their English names. Drag and hatch cute characters!"
              icon="🐾"
              href="/pre-school/0.9-animals-matching-game"
              gradient="yellow-orange"
              dataTestId="card-game-0.9-animals.matching"
            />
            <PreschoolButton
              title="Word Cross"
              subtitle="Animals"
              description="Solve the crossword puzzle using animal words!"
              icon="🧩"
              href="/pre-school/0.9-animals-crossword"
              gradient="blue-purple"
              dataTestId="card-game-0.9-animals.crossword"
            />
            <PreschoolButton
              title="Spell Quest"
              subtitle="Animals"
              description="Unscramble letters to spell animal words!"
              icon="✨"
              href="/pre-school/0.9-animals-spell-quest"
              gradient="pink-red"
              dataTestId="card-game-0.9-animals.spell-quest"
            />
            <PreschoolButton
              title="Word Pop"
              subtitle="Animals"
              description="Pop the balloon with the matching animal!"
              icon="🎈"
              href="/pre-school/0.9-animals-word-pop"
              gradient="green-teal"
              dataTestId="card-game-0.9-animals.word-pop"
            />
            <PreschoolButton
              title="Catch That"
              subtitle="Animals"
              description="Catch the falling animals with your basket!"
              icon="🎯"
              href="/pre-school/0.9-animals-catch-that"
              gradient="purple-pink"
              dataTestId="card-game-0.9-animals.catch-that"
            />
            
            {/* TEMPORARY: Around Us Games (0.10) */}
            <PreschoolButton
              title="Matchlings"
              subtitle="Around Us"
              description="Match things around us with their English names. Drag and hatch cute characters!"
              icon="🌍"
              href="/pre-school/0.10-aroundus-matching-game"
              gradient="yellow-orange"
              dataTestId="card-game-0.10-aroundus.matching"
            />
            <PreschoolButton
              title="Word Cross"
              subtitle="Around Us"
              description="Solve the crossword puzzle using words about things around us!"
              icon="🧩"
              href="/pre-school/0.10-aroundus-crossword"
              gradient="blue-purple"
              dataTestId="card-game-0.10-aroundus.crossword"
            />
            <PreschoolButton
              title="Spell Quest"
              subtitle="Around Us"
              description="Unscramble letters to spell words about things around us!"
              icon="✨"
              href="/pre-school/0.10-aroundus-spell-quest"
              gradient="pink-red"
              dataTestId="card-game-0.10-aroundus.spell-quest"
            />
            <PreschoolButton
              title="Word Pop"
              subtitle="Around Us"
              description="Pop the balloon with the matching word about things around us!"
              icon="🎈"
              href="/pre-school/0.10-aroundus-word-pop"
              gradient="green-teal"
              dataTestId="card-game-0.10-aroundus.word-pop"
            />
            <PreschoolButton
              title="Catch That"
              subtitle="Around Us"
              description="Catch the falling words about things around us with your basket!"
              icon="🎯"
              href="/pre-school/0.10-aroundus-catch-that"
              gradient="purple-pink"
              dataTestId="card-game-0.10-aroundus.catch-that"
            />
            
            {/* Other Games */}
            {games.filter(game => game.id !== "0.2-colours.matching" && game.id !== "0.2-colours.crossword" && game.id !== "0.2-colours.spell-quest" && game.id !== "0.2-colours.word-pop" && game.id !== "0.2-colours.color-catch" && game.id !== "0.2-colours.i-spy" && !game.id.startsWith("0.1-numbers") && !game.id.startsWith("0.3-greetings") && !game.id.startsWith("0.4-actions")).map((game) => (
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
