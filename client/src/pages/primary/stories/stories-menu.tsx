import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { BookOpen } from 'lucide-react';
import { stories } from '@/data/stories';

export default function StoriesMenu() {
  return (
    <Layout>
      <div className="space-y-8 py-8 max-w-4xl mx-auto">
        {/* Header Text */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Edincik İlkokulu 2. Sınıflar için Ara Tatil Ödevimiz:
          </h1>
          <p className="text-base text-foreground">
            <span className="text-sm text-muted-foreground">
              ''Öğrencilerimize dağıtılan aşağıdaki hikaye kitaplarından -en az- birini anlayarak okuyoruz. Sonundaki soruları yapıyoruz ve her bir kitaptan 5 cümleyi Türkçesi ile birlikte deftere yazıyoruz''
            </span>
          </p>
          <p className="text-base text-foreground">
            Çocuklara hem ödevlerinde yardımcı olması hem de dinleme becerilerine katkı sağlaması için aşağıdaki kitap sayfalarını hazırladım.
          </p>
          
          {/* Important Section - Red with bold words between -- */}
          <div className="text-base text-red-600 dark:text-red-400 space-y-2">
            <p className="font-semibold">ÖNEMLİ:</p>
            <p>
              Herbir kitap sayfasında:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                En üstte: Yavaşlatıp hızlandırabileceğiniz sesli <span className="font-bold">-dinleme-</span> bölümü (çalma tuşu, yavaşlatma/hızlandırma, ses seviyesi)
              </li>
              <li>
                Orta bölümde: dinleme ile otomatik ilerleyen kitap sayfaları
              </li>
              <li>
                En altta da: İngilizce yazılar VE bastığınızda beliren <span className="font-bold">-TÜRKÇE çeviriler-</span> bulunmakta.
              </li>
            </ul>
          </div>

          <p className="text-base text-foreground">
            Yapay zeka seslendirmeleri malesef tek düze ama umarım yine de ilgilerini çeker. Ayrıca sayfanın tamamı da anlamalarında yardımcı olur diye umuyorum 🍀 Sayfaları, bilgisayar ya da tablette görüntülenecek şekilde hazırladım ama benim telefonumda da sayfa fena gözükmüyor 🤞
          </p>
          <p className="text-base text-foreground">
            Herhangi Teknik sorun yaşarsanız bana ulaşmaktan çekinmeyin.
          </p>
          <p className="text-base text-foreground font-semibold">
            -Akıner Teacher
          </p>
        </div>

        {/* Stories Grid - Just Thumbnails */}
        <div className="flex gap-4 justify-center items-center flex-nowrap">
          {stories.map((story, index) => (
            <Link key={story.id} href={`/primary-school/stories/${story.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer p-2 flex-shrink-0 flex flex-col items-center">
                <div className="relative bg-muted flex items-center justify-center">
                  <img
                    src={story.thumbnailUrl}
                    alt={story.title}
                    className="w-[180px] h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    Hikaye Kitabı {index + 1}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz hikaye mevcut değil.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

