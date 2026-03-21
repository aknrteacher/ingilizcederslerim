import { Layout } from "@/components/Layout";
import { Link } from "wouter";

const WORKSHEETS = [
  {
    id: "colouring",
    title: "Colouring",
    href: "/primary-school/grade-2/theme-1/worksheets/colouring",
  },
];

export default function WorksheetsLandingGrade2Theme1() {
  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">Çalışma Kağıtları</h1>
            <p className="text-muted-foreground">2. Sınıf · Tema 1</p>
          </div>

          <ul className="space-y-3">
            {WORKSHEETS.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>
                  <a className="flex items-center gap-4 p-4 rounded-xl bg-card border-2 border-border hover:border-primary hover:shadow-md transition-all duration-200">
                    <span className="text-2xl" aria-hidden>
                      🖍️
                    </span>
                    <span className="text-xl font-semibold text-foreground">{item.title}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/primary-school/grade-2/theme-1/games">
              <a className="underline hover:no-underline">← Oyunlara dön</a>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
