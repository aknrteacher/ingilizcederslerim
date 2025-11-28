import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock, Trophy, Star } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <section className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              Kontrol Paneli
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              İlerlemenizi izleyin ve kaldığınız yerden devam edin.
            </p>
          </div>
          <Button className="gap-2 shadow-lg w-full sm:w-auto">
            Öğrenmeye Devam Et <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Toplam Zaman</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">12.5s</div>
              <p className="text-xs text-muted-foreground">Geçen haftaya göre +2.5s</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Dersler</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">%85 doğruluk</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Seri</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">7 Gün</div>
              <p className="text-xs text-muted-foreground">Böyle devam et!</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Puanlar</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">1.450</div>
              <p className="text-xs text-muted-foreground">En iyi %10</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Split */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Current Course */}
          <Card className="lg:col-span-2 shadow-md border-none ring-1 ring-black/5">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Mevcut Kurs: İş İngilizcesi B1</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Modül 3: E-posta Görgüsü ve Resmi İletişim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium">Modül İlerlemesi</span>
                  <span className="text-muted-foreground">%65</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className={`rounded-lg border p-3 sm:p-4 hover:bg-secondary/50 transition-colors cursor-pointer group ${num > 2 ? 'opacity-60' : ''}`}>
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-sm">
                      {num}
                    </div>
                    <h3 className="font-semibold text-sm">
                      {num === 1 && 'Resmi Selamlamalar'}
                      {num === 2 && 'İstekleri Yapılandırma'}
                      {num === 3 && 'İmza Satırları'}
                      {num === 4 && 'Final Sınavı'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {num <= 2 ? (num === 1 ? 'Tamamlandı' : 'Devam Ediyor') : 'Kilitli'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Recommended */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Günlük Kelimeler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="rounded-md bg-secondary p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-primary break-words">Ubiquitous</h4>
                      <span className="text-[10px] sm:text-xs italic text-muted-foreground">/juːˈbɪk.wɪ.təs/ • Sıfat</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-foreground/80">
                    Her yerde bulunmak, görülmek veya var olmak.
                  </p>
                  <p className="mt-2 text-[10px] sm:text-xs text-muted-foreground border-l-2 border-primary/30 pl-2">
                    "Mobil telefonlar günlük yaşamda her yerde görülmektedir."
                  </p>
                </div>
                <Button variant="outline" className="w-full text-xs sm:text-sm">Geçmiş Kelimeleri Görüntüle</Button>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Pro İpucu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm opacity-90">
                  Günde sadece 15 dakika İngilizce podcast dinlemek, bir ay içinde anlamanızı %40 oranında artırabilir.
                </p>
                <Button variant="secondary" className="mt-3 sm:mt-4 w-full text-xs sm:text-sm text-primary hover:bg-white/90">
                  Podcast'leri Gözat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
