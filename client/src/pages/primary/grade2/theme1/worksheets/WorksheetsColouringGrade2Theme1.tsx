import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { CombinedGameButton } from "@/components/CombinedGameButton";
import { Link } from "wouter";
import gameTypeColourThis from "@/assets/colour this.png";
import {
  colourThisGameHref,
  type GradeId,
  getDefaultTopicId,
  getTopicsForGrade,
} from "./worksheetsColouringGamePickerData";

function StarNumberBullet({ n }: { n: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 w-11 h-11 items-center justify-center select-none"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full text-yellow-400 drop-shadow-sm"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <polygon
          fill="currentColor"
          stroke="#CA8A04"
          strokeWidth="2.5"
          strokeLinejoin="round"
          points="50,6 61,38 96,38 68,58 79,94 50,74 21,94 32,58 4,38 39,38"
        />
      </svg>
      <span className="relative z-10 text-sm font-bold text-foreground tabular-nums leading-none pt-0.5">
        {n}
      </span>
    </span>
  );
}

const instructions: { n: number; text: ReactNode }[] = [
  { n: 1, text: "İsminizi yazmayı unutmayın" },
  { n: 2, text: "Çizgilerin içini dikkatlice boyayın" },
  {
    n: 3,
    text: (
      <>
        Resimleri boyarken kullandığınız renklerin İngilizcelerini söyleyin{" "}
        <span className="whitespace-nowrap">(RED, BLUE, YELLOW, ...)</span>
      </>
    ),
  },
  {
    n: 4,
    text: (
      <>
        Harfleri boyarken İngilizce olarak söyleyin{" "}
        <span className="whitespace-nowrap">{"(A > ey, B > bi, ...)"}</span>
      </>
    ),
  },
  { n: 5, text: "Kelimeleri boyadıktan sonra yüksek sesle okuyun." },
];

export default function WorksheetsColouringGrade2Theme1() {
  const [grade, setGrade] = useState<GradeId>("2");
  const [topicId, setTopicId] = useState(1);

  const topics = useMemo(() => getTopicsForGrade(grade), [grade]);
  const topic = useMemo(() => {
    const found = topics.find((t) => t.id === topicId);
    return found ?? topics[0];
  }, [topics, topicId]);

  const onGradeChange = (next: GradeId) => {
    setGrade(next);
    setTopicId(getDefaultTopicId(next));
  };

  const gameHref = colourThisGameHref(topic);

  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">Colouring</h1>
            <p className="text-muted-foreground">2. Sınıf · Tema 1 · Çalışma Kağıdı</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
            <div className="w-full md:w-[min(100%,280px)] shrink-0 mx-auto md:mx-0">
              <img
                src="/images/worksheets/colouring-five-stars-instructions.png"
                alt="Beş yıldız için: isim, çizgiler içinde boyama, renkleri, harfleri ve kelimeleri söyleme"
                className="w-full h-auto rounded-lg border-2 border-border bg-white"
                width={280}
                height={420}
                loading="lazy"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              <p className="text-base md:text-lg font-semibold text-foreground leading-snug">
                Boyama çalışmasından 5 YILDIZ almak için;
              </p>
              <ul className="space-y-3 list-none pl-0">
                {instructions.map(({ n, text }) => (
                  <li key={n} className="flex gap-3 items-start">
                    <StarNumberBullet n={n} />
                    <span className="text-foreground leading-relaxed pt-1.5">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section
            className="mt-10 pt-8 border-t border-border"
            aria-labelledby="worksheet-games-heading"
          >
            <h2
              id="worksheet-games-heading"
              className="text-base md:text-lg font-semibold text-foreground leading-snug mb-2"
            >
              Colour This Game:
            </h2>
            <p className="text-foreground leading-relaxed mb-6 max-w-2xl">
              Çalışma kağıdının oyununa girmek için aşağıdan sınıf ve ünite seçin.
            </p>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
              <div className="w-full lg:w-[min(100%,280px)] shrink-0 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="worksheet-game-grade"
                    className="block text-base font-semibold text-foreground leading-snug"
                  >
                    Sınıf seçin
                  </label>
                  <select
                    id="worksheet-game-grade"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={grade}
                    onChange={(e) => onGradeChange(e.target.value as GradeId)}
                  >
                    <option value="2">2. sınıf</option>
                    <option value="3">3. sınıf</option>
                    <option value="4">4. sınıf</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="worksheet-game-topic"
                    className="block text-base font-semibold text-foreground leading-snug"
                  >
                    {grade === "2" ? "Tema seçin" : "Ünite seçin"}
                  </label>
                  <select
                    id="worksheet-game-topic"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={topic?.id ?? ""}
                    onChange={(e) => setTopicId(Number(e.target.value))}
                  >
                    {topics.map((t) => (
                      <option key={`${grade}-${t.id}`} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Link href={gameHref}>
                  <a
                    className="flex w-full min-h-[3rem] items-center justify-center bg-green-600 px-6 py-3 pl-5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 md:text-base"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 1.25rem) 0, 100% 50%, calc(100% - 1.25rem) 100%, 0 100%)",
                    }}
                  >
                    Oyuna Git
                  </a>
                </Link>
              </div>

              <div className="flex-1 min-w-0 w-full flex justify-center lg:justify-start">
                <div className="w-full max-w-[280px] shrink-0 [&_.combined-game-button-link]:max-w-full">
                  <CombinedGameButton
                    topicLabel={topic.label}
                    topicValue={topic.topicValue}
                    gameType="Colour This"
                    gameIcon="🖌️"
                    href={gameHref}
                    gameGradient="pink-red"
                    dataTestId={`worksheet-colour-this-${topic.topicValue}`}
                    topicImage={topic.topicImage}
                    gameTypeImage={gameTypeColourThis}
                  />
                </div>
              </div>
            </div>
          </section>

          <p className="mt-10 text-sm text-muted-foreground">
            <Link href="/primary-school/grade-2/theme-1/worksheets">
              <a className="underline hover:no-underline">← Çalışma kağıtlarına dön</a>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
