import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import "../styles/oyunlar.css";
import "@/styles/2.1.voc.css";

export default function PrimarySchoolGrade2Theme1GamesMenu() {
  const games = [
    { id: "matching", name: "Matching", icon: "🎮", path: "2.1-matching-game", color: "#f59e0b" },
    { id: "crossword", name: "Crossword", icon: "🧩", path: "crossword", color: "#6366f1" },
    { id: "spell-quest", name: "Spell Quest", icon: "✨", path: "spell-quest", color: "#ec4899" },
    { id: "word-pop", name: "Word Pop", icon: "🎈", path: "word-pop", color: "#22c55e" },
    { id: "catch-that", name: "Catch", icon: "🎯", path: "catch-that", color: "#a855f7" },
    { id: "sound-match", name: "Sound", icon: "🔊", path: "sound-match", color: "#667eea" },
    { id: "memory", name: "Memory", icon: "🧠", path: "memory-flip", color: "#10b981" },
    { id: "word-race", name: "Race", icon: "🏎️", path: "word-race", color: "#f97316" },
    { id: "shooter", name: "Shooter", icon: "🚀", path: "word-shooter", color: "#ef4444" },
    { id: "snake", name: "Snake", icon: "🐍", path: "word-snake", color: "#16a34a" },
    { id: "builder", name: "Builder", icon: "🔤", path: "word-builder", color: "#4f46e5" },
  ];

  return (
    <Layout>
      <div className="games-menu-container">
        <div className="games-menu-header">
          <h1>2. Sınıf - Tema 1</h1>
          <p>Okul Hayatı (School Life)</p>
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <Link key={game.id} href={`/primary-school/grade-2/theme-1/${game.path}`}>
              <a 
                className="game-card"
                style={{ '--game-color': game.color } as React.CSSProperties}
              >
                <span className="game-icon">{game.icon}</span>
                <span className="game-name">{game.name}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .games-menu-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .games-menu-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .games-menu-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin-bottom: 8px;
        }

        .games-menu-header p {
          font-size: 16px;
          color: hsl(var(--muted-foreground));
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
        }

        .game-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px 12px;
          background: hsl(var(--card));
          border: 2px solid hsl(var(--border));
          border-radius: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .game-card:hover {
          transform: translateY(-4px);
          border-color: var(--game-color);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .game-icon {
          font-size: 36px;
          line-height: 1;
        }

        .game-name {
          font-size: 14px;
          font-weight: 600;
          color: hsl(var(--foreground));
          text-align: center;
        }

        @media (max-width: 480px) {
          .games-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .game-card {
            padding: 16px 8px;
          }

          .game-icon {
            font-size: 28px;
          }

          .game-name {
            font-size: 12px;
          }
        }
      `}</style>
    </Layout>
  );
}
