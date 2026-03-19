import { Layout } from "@/components/Layout";
import { Link } from "wouter";

const SONGS = [
  {
    id: "hello-school",
    title: "Hello School",
    href: "/primary-school/grade-2/theme-1/songs/hello-school",
  },
  {
    id: "hello-how-are-you",
    title: "Hello! How Are You?",
    href: "/primary-school/grade-2/theme-1/songs/hello-how-are-you",
  },
];

export default function SongsLandingGrade2Theme1() {
  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">Songs</h1>
            <p className="text-muted-foreground">Grade 2 · Unit 1</p>
          </div>

          <ul className="space-y-3">
            {SONGS.map((song) => (
              <li key={song.id}>
                <Link href={song.href}>
                  <a className="flex items-center gap-4 p-4 rounded-xl bg-card border-2 border-border hover:border-primary hover:shadow-md transition-all duration-200">
                    <span className="text-2xl" aria-hidden>🎵</span>
                    <span className="text-xl font-semibold text-foreground">{song.title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/primary-school/grade-2/theme-1/games">
              <a className="underline hover:no-underline">← Back to Games</a>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
