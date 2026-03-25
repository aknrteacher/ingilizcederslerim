import type { ReactNode } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";

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
