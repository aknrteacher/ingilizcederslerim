import { Layout } from "@/components/Layout";
import { Link } from "wouter";

export default function WorksheetsColouringGrade2Theme1() {
  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">Colouring</h1>
            <p className="text-muted-foreground">2. Sınıf · Tema 1 · Çalışma Kağıdı</p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 min-h-[200px] flex items-center justify-center p-8">
            <p className="text-muted-foreground text-center">
              İçerik buraya eklenecek.
            </p>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            <Link href="/primary-school/grade-2/theme-1/worksheets">
              <a className="underline hover:no-underline">← Çalışma kağıtlarına dön</a>
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
