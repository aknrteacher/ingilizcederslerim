import { Layout } from "@/components/Layout";
import { CombinedGameButton } from "@/components/CombinedGameButton";
import "../styles/oyunlar.css";
import "@/styles/3.4.voc.css";

// Import topic button half (300x100px)
import topic3_4 from "@/assets/3.4game.png";

// Import game type button halves (300x300px)
import gameTypeMatchlings from "@/assets/matchlings.png";
import gameTypeWordCross from "@/assets/word cross.png";
import gameTypeSpellQuest from "@/assets/spell quest.png";
import gameTypeWordPop from "@/assets/word pop.png";
import gameTypeCatchThat from "@/assets/catch that.png";
import gameTypeSayWhat from "@/assets/say what.png";
import gameTypeMemoryFlip from "@/assets/memory flip.png";
import gameTypeWordRace from "@/assets/word race.png";
import gameTypeWordSnake from "@/assets/word snake.png";

export default function PrimarySchoolGrade3Unit4GamesMenu() {
  // Game type configurations
  const gameTypes = [
    {
      id: "matching",
      name: "Matchlings",
      icon: "🎮",
      gradient: "yellow-orange" as const,
      pathSuffix: "3.4-matching-game",
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
    {
      id: "say-what",
      name: "Say What?",
      icon: "🔊",
      gradient: "blue-purple" as const,
      pathSuffix: "say-what",
      image: gameTypeSayWhat,
    },
    {
      id: "memory-flip",
      name: "Memory Flip",
      icon: "🧠",
      gradient: "green-teal" as const,
      pathSuffix: "memory-flip",
      image: gameTypeMemoryFlip,
    },
    {
      id: "word-race",
      name: "Word Race",
      icon: "🏎️",
      gradient: "yellow-orange" as const,
      pathSuffix: "word-race",
      image: gameTypeWordRace,
    },
    {
      id: "word-snake",
      name: "Word Snake",
      icon: "🐍",
      gradient: "green-teal" as const,
      pathSuffix: "word-snake",
      image: gameTypeWordSnake,
    },
  ];

  // Topic configuration
  const topic = {
    value: "3.4",
    label: "Unit 4: Feelings",
    image: topic3_4,
  };

  // Generate all game combinations
  const gameCombinations = gameTypes.map((gameType) => ({
    topicValue: topic.value,
    topicLabel: topic.label,
    gameType: gameType.name,
    gameIcon: gameType.icon,
    gameGradient: gameType.gradient,
    path: `/primary-school/grade-3/unit-4/${gameType.pathSuffix}`,
    id: `${topic.value}.${gameType.id}`,
    topicImage: topic.image,
    gameTypeImage: gameType.image,
  }));

  return (
    <Layout>
      <div className="oyunlar-container">
        {/* Combined Game Buttons - Single Row Layout */}
        <section className="games-section">
          <div className="game-type-buttons-row">
            {gameCombinations.map((game) => (
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
        </section>
      </div>

      <style>{`
        /* Game Type Buttons - 5 Per Row Layout */
        .game-type-buttons-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          width: 100%;
          margin-bottom: 32px;
          justify-items: center;
        }

        @media (max-width: 1200px) {
          .game-type-buttons-row {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .game-type-buttons-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .game-type-buttons-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }
        }

        @media (max-width: 480px) {
          .game-type-buttons-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </Layout>
  );
}
