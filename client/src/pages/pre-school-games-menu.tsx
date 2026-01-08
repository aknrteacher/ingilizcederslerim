import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PreschoolButton } from "@/components/PreschoolButton";
import { CombinedGameButton } from "@/components/CombinedGameButton";
import { Link } from "wouter";

// Import topic button halves (300x100px)
import topicNumbers from "@/assets/numbers.png";
import topicColours from "@/assets/colours.png";
import topicGreetings from "@/assets/greetings.png";
import topicActions from "@/assets/actions.png";
import topicOurBody from "@/assets/our body.png";
import topicOurClassroom from "@/assets/our classroom.png";
import topicThings from "@/assets/things.png";
import topicPeople from "@/assets/people.png";
import topicAnimals from "@/assets/animals.png";
import topicAroundUs from "@/assets/around us.png";
import topicFood from "@/assets/food.png";

// Import game type button halves (300x300px)
import gameTypeMatchlings from "@/assets/matchlings.png";
import gameTypeWordCross from "@/assets/word cross.png";
import gameTypeSpellQuest from "@/assets/spell quest.png";
import gameTypeWordPop from "@/assets/word pop.png";
import gameTypeCatchThat from "@/assets/catch that.png";

import "../styles/oyunlar.css";
import "@/styles/2.1.voc.css";

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
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  const topics = [
    { value: "all", label: "Tümü (All)" },
    { value: "0.1-numbers", label: "Sayılar (Numbers)" },
    { value: "0.2-colours", label: "Renkler (Colours)" },
    { value: "0.3-greetings", label: "Selamlaşmalar (Greetings)" },
    { value: "0.4-actions", label: "Eylemler (Actions)" },
    { value: "0.5-ourbody", label: "Vücudumuz (Our Body)" },
    { value: "0.6-ourclassroom", label: "Sınıfımız (Our Classroom)" },
    { value: "0.7-things", label: "Eşyalar (Things)" },
    { value: "0.8-people", label: "İnsanlar (People)" },
    { value: "0.9-animals", label: "Hayvanlar (Animals)" },
    { value: "0.10-aroundus", label: "Çevremiz (Around Us)" },
    { value: "0.11-food", label: "Yiyecekler (Food)" },
  ];

  // Topic image mappings
  const topicImages: Record<string, string> = {
    "0.1-numbers": topicNumbers,
    "0.2-colours": topicColours,
    "0.3-greetings": topicGreetings,
    "0.4-actions": topicActions,
    "0.5-ourbody": topicOurBody,
    "0.6-ourclassroom": topicOurClassroom,
    "0.7-things": topicThings,
    "0.8-people": topicPeople,
    "0.9-animals": topicAnimals,
    "0.10-aroundus": topicAroundUs,
    "0.11-food": topicFood,
  };

  // Game type image mappings
  const gameTypeImages: Record<string, string> = {
    "matching": gameTypeMatchlings,
    "crossword": gameTypeWordCross,
    "spell-quest": gameTypeSpellQuest,
    "word-pop": gameTypeWordPop,
    "catch-that": gameTypeCatchThat,
  };

  const gameTypes = [
    {
      id: "matching",
      name: "Matchlings",
      icon: "🔢",
      gradient: "yellow-orange" as const,
      pathSuffix: "matching-game",
      image: gameTypeMatchlings,
    },
    {
      id: "crossword",
      name: "Word Cross",
      icon: "🧩",
      gradient: "blue-purple" as const,
      pathSuffix: "crossword",
      image: gameTypeWordCross,
    },
    {
      id: "spell-quest",
      name: "Spell Quest",
      icon: "✨",
      gradient: "pink-red" as const,
      pathSuffix: "spell-quest",
      image: gameTypeSpellQuest,
    },
    {
      id: "word-pop",
      name: "Word Pop",
      icon: "🎈",
      gradient: "green-teal" as const,
      pathSuffix: "word-pop",
      image: gameTypeWordPop,
    },
    {
      id: "catch-that",
      name: "Catch That",
      icon: "🎯",
      gradient: "purple-pink" as const,
      pathSuffix: "catch-that",
      image: gameTypeCatchThat,
    },
  ];

  // Generate all game combinations
  const generateGameCombinations = () => {
    const combinations: Array<{
      topicValue: string;
      topicLabel: string;
      gameType: string;
      gameIcon: string;
      gameGradient: "yellow-orange" | "blue-purple" | "pink-red" | "green-teal" | "purple-pink";
      path: string;
      id: string;
      topicImage?: string;
      gameTypeImage?: string;
    }> = [];

    topics.slice(1).forEach((topic) => { // Skip "all"
      gameTypes.forEach((gameType) => {
        combinations.push({
          topicValue: topic.value,
          topicLabel: topic.label,
          gameType: gameType.name,
          gameIcon: gameType.icon,
          gameGradient: gameType.gradient,
          path: `/pre-school/${topic.value}-${gameType.pathSuffix}`,
          id: `${topic.value}.${gameType.id}`,
          topicImage: topicImages[topic.value], // Get topic image if available
          gameTypeImage: gameType.image, // Get game type image
        });
      });
    });

    return combinations;
  };

  const allGameCombinations = generateGameCombinations();

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
        <div className="title-container">
          <p>Pre-School & 1st Grade (Okul Öncesi & 1. Sınıf)</p>
          <p style={{ color: '#8B4513' }}>Oyunlar (Games)</p>
        </div>

        {/* Filter Section */}
        <div className="filter-container">
          <label htmlFor="topic-filter" className="filter-label">Filtrele</label>
          <select
            id="topic-filter"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="filter-select"
          >
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pre-School Games */}
        <section className="games-section">
          {/* Combined Game Buttons - Grouped by Topic */}
          {topics.slice(1).map((topic) => {
            const topicGames = allGameCombinations.filter(
              (game) => game.topicValue === topic.value
            );
            
            if (selectedTopic !== "all" && selectedTopic !== topic.value) {
              return null;
            }

            return (
              <div key={topic.value} className="game-type-buttons-row">
                {topicGames.map((game) => (
                  <CombinedGameButton
                    key={game.id}
                    topicLabel={game.topicLabel}
                    topicValue={game.topicValue}
                    gameType={game.gameType}
                    gameIcon={game.gameIcon}
                    href={game.path}
                    gameGradient={game.gameGradient}
                    dataTestId={`card-game-${game.id}`}
                    topicImage={game.topicImage}
                    gameTypeImage={game.gameTypeImage}
                  />
                ))}
              </div>
            );
          })}


          <div className="preschool-games-grid">
            
            {/* Other Games - I Spy for Colours */}
            {games.filter(game => {
              // Filter out games that are already displayed as banners
              const isBannerGame = game.id === "0.2-colours.matching" || 
                                   game.id === "0.2-colours.crossword" || 
                                   game.id === "0.2-colours.spell-quest" || 
                                   game.id === "0.2-colours.word-pop" || 
                                   game.id === "0.2-colours.color-catch" || 
                                   game.id === "0.2-colours.i-spy" || 
                                   game.id.startsWith("0.1-numbers") || 
                                   game.id.startsWith("0.3-greetings") || 
                                   game.id.startsWith("0.4-actions");
              
              if (isBannerGame) return false;
              
              // Apply topic filter
              if (selectedTopic === "all") return true;
              
              // For I Spy game, it belongs to colours topic
              if (game.id === "0.2-colours.i-spy" && selectedTopic === "0.2-colours") return true;
              
              // Check if game belongs to selected topic
              return game.id.startsWith(selectedTopic);
            }).map((game) => (
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
        /* Filter Container */
        .filter-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          justify-content: center;
        }

        .filter-label {
          font-size: 16px;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .filter-select {
          padding: 8px 16px;
          font-size: 16px;
          border: 2px solid hsl(var(--border));
          border-radius: 8px;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          cursor: pointer;
          min-width: 200px;
          transition: border-color 0.2s ease;
        }

        .filter-select:hover {
          border-color: hsl(var(--primary));
        }

        .filter-select:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
        }

        /* First Five Game Type Buttons - Single Row Layout */
        .game-type-buttons-row {
          display: flex;
          flex-wrap: nowrap;
          gap: 12px;
          width: 100%;
          margin-bottom: 32px;
          justify-content: center;
          align-items: stretch;
        }

        .game-banner-link-small {
          display: block;
          text-decoration: none;
          transition: transform 0.3s ease, filter 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          flex: 1 1 0;
          min-width: 0;
          max-width: 100%;
        }

        .game-banner-link-small:hover {
          transform: translateY(-4px) scale(1.02);
          filter: brightness(1.05);
          box-shadow: 0 8px 20px rgba(255, 224, 102, 0.3);
        }

        .game-banner-link-small:active {
          transform: translateY(-2px) scale(1.01);
        }

        .game-banner-image-small {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        /* Test Button Hover Overlay Styles */
        .test-button-wrapper {
          position: relative;
          overflow: hidden;
        }

        .play-now-overlay {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 16px;
        }

        .play-now-container {
          background-color: #000000;
          border-radius: 6px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4px 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .play-now-text {
          background-color: #000000;
          color: #00ff00;
          font-weight: bold;
          font-size: 0.9rem;
          padding: 4px 12px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .test-button-wrapper:hover .play-now-overlay {
          opacity: 1;
        }

        .test-button-wrapper:hover .game-banner-image-small {
          filter: brightness(0.7);
        }

        @media (max-width: 1024px) {
          .game-type-buttons-row {
            flex-wrap: wrap;
          }
          .game-banner-link-small {
            flex: 1 1 calc(33.333% - 8px);
            max-width: calc(33.333% - 8px);
          }
        }

        @media (max-width: 768px) {
          .game-type-buttons-row {
            gap: 10px;
            margin-bottom: 24px;
            flex-wrap: wrap;
          }
          .game-banner-link-small {
            flex: 1 1 calc(50% - 5px);
            max-width: calc(50% - 5px);
            min-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .game-type-buttons-row {
            gap: 8px;
          }
          .game-banner-link-small {
            flex: 1 1 calc(50% - 4px);
            max-width: calc(50% - 4px);
            min-width: 100px;
          }
        }

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
