import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import "../styles/oyunlar.css";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

export default function PreSchoolGamesMenu() {
  const games: Game[] = [
    {
      id: "0.1.matching",
      title: "Matchlings - Colours",
      description: "Match colours with their English names. Drag and hatch cute characters!",
      icon: "🌈",
      path: "/pre-school/0.1-matching-game",
    },
    {
      id: "0.1.crossword",
      title: "Word Cross - Colours",
      description: "Solve the crossword puzzle using colour names!",
      icon: "🧩",
      path: "/pre-school/0.1-crossword",
    },
    {
      id: "0.1.spell-quest",
      title: "Spell Quest - Colours",
      description: "Unscramble letters to spell colour words!",
      icon: "✨",
      path: "/pre-school/0.1-spell-quest",
    },
  ];

  return (
    <Layout>
      <div className="oyunlar-container">
        <div className="oyunlar-header">
          <div>
            <h1 className="oyunlar-title">Okul Öncesi & 1. Sınıf - Oyunlar</h1>
            <p className="oyunlar-subtitle">Renkler ve temel kavramları oyunlarla öğren!</p>
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

          <div className="games-grid">
            {games.map((game) => (
              <a
                key={game.id}
                href={game.path}
                className="game-link"
                data-testid={`card-game-${game.id}`}
              >
                <Card className="game-card">
                  <CardHeader>
                    <div className="game-header-content">
                      <span className="game-icon">{game.icon}</span>
                      <CardTitle className="game-title">{game.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="game-description">
                      {game.description}
                    </CardDescription>
                    <div className="game-button" data-testid={`button-play-${game.id}`}>
                      Oyna <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2rem" }}>
          <a href="/oyunlar" style={{ color: "#0066cc", textDecoration: "none", fontSize: "1rem" }}>
            ← Tüm Oyunlara Dön
          </a>
        </div>
      </div>
    </Layout>
  );
}
