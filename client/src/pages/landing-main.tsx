import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Users, Award } from "lucide-react";
import { Link } from "wouter";

export default function MainLandingPage() {
  return (
    <Layout>
      <div className="min-h-[60vh] space-y-12 py-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            İngilizce Öğrenmeye
            <br />
            <span className="text-primary">Hoş Geldiniz</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Her seviyeye uygun, interaktif ve eğlenceli İngilizce dersleri ile dil öğrenme yolculuğunuza başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              Hemen Başla <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-foreground/20 hover:border-foreground/40">
              Daha Fazla Bilgi
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Okul Öncesi</CardTitle>
              <CardDescription className="text-muted-foreground">
                Renkli ve eğlenceli aktivitelerle İngilizce öğrenmeye başlayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pre-school">
                <Button variant="ghost" className="w-full text-primary hover:text-accent">
                  Keşfet <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">İlkokul</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sınıf bazlı müfredat ve interaktif oyunlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/primary-school">
                <Button variant="ghost" className="w-full text-primary hover:text-accent">
                  Keşfet <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Ortaokul & Lise</CardTitle>
              <CardDescription className="text-muted-foreground">
                Gelişmiş dil becerileri ve akademik İngilizce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/secondary-school">
                <Button variant="ghost" className="w-full text-primary hover:text-accent">
                  Keşfet <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">İş İngilizcesi</CardTitle>
              <CardDescription className="text-muted-foreground">
                Profesyonel hayatınız için özel dersler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/business-english">
                <Button variant="ghost" className="w-full text-primary hover:text-accent">
                  Keşfet <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 border-t-2 border-border">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Binlerce öğrenci ile birlikte İngilizce öğrenme yolculuğunuza bugün başlayın.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            Ücretsiz Deneyin <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </div>
    </Layout>
  );
}
