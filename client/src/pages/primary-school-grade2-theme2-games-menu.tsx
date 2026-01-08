import { Layout } from "@/components/Layout";
import { CombinedGameButton } from "@/components/CombinedGameButton";
import "../styles/oyunlar.css";
import "@/styles/2.1.voc.css";

// Import topic button halves (300x100px)
import topic2_2 from "@/assets/2.2game.png";

// Import game type button halves (300x300px)
import gameTypeMatchlings from "@/assets/matchlings.png";
import gameTypeWordCross from "@/assets/word cross.png";
import gameTypeSpellQuest from "@/assets/spell quest.png";
import gameTypeWordPop from "@/assets/word pop.png";
import gameTypeCatchThat from "@/assets/catch that.png";

export default function PrimarySchoolGrade2Theme2GamesMenu() {
  // Game type configurations
  const gameTypes = [
    {
      id: "matching",
      name: "Matchlings",
      icon: "🎮",
      gradient: "yellow-orange" as const,
      pathSuffix: "2.2-matching-game",
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

  // Topic configuration
  const topic = {
    value: "2.2",
    label: "Sınıf Hayatı (Classroom Life)",
    image: topic2_2,
  };

  // Generate all game combinations
  const gameCombinations = gameTypes.map((gameType) => ({
    topicValue: topic.value,
    topicLabel: topic.label,
    gameType: gameType.name,
    gameIcon: gameType.icon,
    gameGradient: gameType.gradient,
    path: `/primary-school/grade-2/theme-2/${gameType.pathSuffix}`,
    id: `${topic.value}.${gameType.id}`,
    topicImage: topic.image,
    gameTypeImage: gameType.image,
  }));

  return (
    <Layout>
      <div className="oyunlar-container">
        <div className="oyunlar-header">
          <div>
            <h1 className="oyunlar-title">2. Sınıf - Tema 2: Sınıf Hayatı</h1>
            <p className="oyunlar-subtitle">Sınıf hayatıyla ilgili kelimeleri öğren ve oyunlarla pekiştir</p>
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

          {/* Combined Game Buttons - Single Row Layout */}
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
        /* Game Type Buttons - Single Row Layout */
        .game-type-buttons-row {
          display: flex;
          flex-wrap: nowrap;
          gap: 12px;
          width: 100%;
          margin-bottom: 32px;
          justify-content: center;
          align-items: stretch;
        }

        @media (max-width: 1024px) {
          .game-type-buttons-row {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 768px) {
          .game-type-buttons-row {
            gap: 10px;
            margin-bottom: 24px;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .game-type-buttons-row {
            gap: 8px;
          }
        }
      `}</style>
    </Layout>
  );
}
