import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { useLocation } from "wouter";
import "../styles/oyunlar.css";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  grade: number;
  theme: number;
  path: string;
}

export default function Oyunlar() {
  const [, setLocation] = useLocation();
  
  const games: Game[] = [
    {
      id: "2.1.matching",
      title: "Matchlings",
      description: "Drag to match words with pictures. Hatch cute characters!",
      icon: "🎮",
      grade: 2,
      theme: 1,
      path: "/primary-school/grade-2/theme-1/2.1-matching-game",
    },
    {
      id: "2.1.crossword",
      title: "Word Cross",
      description: "Solve the puzzle using Turkish clues. Find all 15 hidden words!",
      icon: "🧩",
      grade: 2,
      theme: 1,
      path: "/primary-school/grade-2/theme-1/crossword",
    },
    {
      id: "2.1.spell-quest",
      title: "Spell Quest",
      description: "Unscramble letters to spell words. Build your spelling skills!",
      icon: "✨",
      grade: 2,
      theme: 1,
      path: "/primary-school/grade-2/theme-1/spell-quest",
    },
    {
      id: "2.1.word-pop",
      title: "Word Pop",
      description: "Pop the balloons with the correct English words before they float away!",
      icon: "🎈",
      grade: 2,
      theme: 1,
      path: "/primary-school/grade-2/theme-1/word-pop",
    },
    {
      id: "2.1.catch-that",
      title: "Catch That",
      description: "Move the basket to catch the correct falling words. Don't miss them!",
      icon: "🎯",
      grade: 2,
      theme: 1,
      path: "/primary-school/grade-2/theme-1/catch-that",
    },
  ];

  const grade2Theme1Games = games.filter((g) => g.grade === 2 && g.theme === 1);

  return (
    <Layout>
      <div className="oyunlar-container">
        <div className="oyunlar-header">
          <div>
            <h1 className="oyunlar-title">Oyunlar</h1>
            <p className="oyunlar-subtitle">İngilizce öğrenirken eğlen!</p>
          </div>
        </div>

        {/* 2. Sınıf - Tema 1 */}
        <section className="games-section">
          <div className="section-header">
            <h2 className="section-title">2. Sınıf - Tema 1: Okul Hayatı</h2>
            <p className="section-description">
              Okul hayatıyla ilgili kelimeleri öğren ve oyunlarla pekiştir
            </p>
          </div>

          <div className="games-grid">
            {grade2Theme1Games.map((game) => (
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

          {grade2Theme1Games.length === 0 && (
            <div className="empty-state">
              <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Yakında yeni oyunlar eklenecek!</p>
            </div>
          )}
        </section>

      </div>
    </Layout>
  );
}
