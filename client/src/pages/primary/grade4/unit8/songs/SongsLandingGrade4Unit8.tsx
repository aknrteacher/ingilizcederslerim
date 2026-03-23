import { Layout } from "@/components/Layout";
import { Link } from "wouter";

const SONGS = [
  {
    id: "whats-the-weather-like-today",
    title: "What's the Weather Like Today?",
    href: "/primary-school/grade-4/unit-8/songs/whats-the-weather-like-today",
  },
];

export default function SongsLandingGrade4Unit8() {
  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">Songs</h1>
            <p className="text-muted-foreground">Grade 4 · Unit 8</p>
          </div>

          <ul className="space-y-3">
            {SONGS.map((song) => (
              <li key={song.id}>
                <Link href={song.href}>
                  <a className="flex items-center gap-4 p-4 rounded-xl bg-card border-2 border-border hover:border-primary hover:shadow-md transition-all duration-200">
                    <span className="text-2xl" aria-hidden>
                      🎵
                    </span>
                    <span className="text-xl font-semibold text-foreground">{song.title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/primary-school/grade-4/unit-8/games">
              <a className="underline hover:no-underline">← Back to Games</a>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
