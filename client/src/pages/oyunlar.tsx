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
      title: "Kelime Eşleştirme",
      description: "Kelimeleri resimle eşleştir ve öğren",
      icon: "🎮",
      grade: 2,
      theme: 1,
      path: "/primary-school/grade-2/theme-1/2.1-matching-game",
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

        {/* Coming Soon Section */}
        <section className="games-section">
          <div className="section-header">
            <h2 className="section-title">Yakında Gelecek</h2>
          </div>

          <div className="coming-soon-grid">
            {[
              {
                title: "Kelime Bulmaca",
                grade: 2,
                theme: 1,
              },
              {
                title: "Konuşma Pratiği",
                grade: 2,
                theme: 1,
              },
              {
                title: "Yazma Egzersizleri",
                grade: 2,
                theme: 1,
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="coming-soon-card"
                data-testid={`card-coming-soon-${idx}`}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="coming-soon-badge">Yakında</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.grade}. Sınıf - Tema {item.theme}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
