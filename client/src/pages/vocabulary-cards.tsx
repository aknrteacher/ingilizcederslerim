import { useTheme } from "@/context/ThemeContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const vocabularyCards = [
  { word: "Apple", turkish: "Elma", color: "bg-red-100" },
  { word: "Ball", turkish: "Top", color: "bg-blue-100" },
  { word: "Cat", turkish: "Kedi", color: "bg-yellow-100" },
  { word: "Dog", turkish: "Köpek", color: "bg-orange-100" },
  { word: "Elephant", turkish: "Fil", color: "bg-pink-100" },
  { word: "Flower", turkish: "Çiçek", color: "bg-purple-100" },
];

const levelColors: Record<string, { dark: string; light: string; darkText: string }> = {
  "primary-school": { dark: "bg-blue-700", light: "border-blue-200", darkText: "text-blue-100" },
};

export default function VocabularyCards() {
  const { currentTheme } = useTheme();
  const themeColor = levelColors[currentTheme] || levelColors["primary-school"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <Link href="/primary-school/grade-2/theme-1">
          <a className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors mb-6 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Geri Dön
          </a>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-black text-blue-900 mb-2">Kelime Kartları</h1>
          <p className="text-lg text-blue-700">2. Sınıf - Tema 1</p>
          <p className="text-sm text-blue-600 mt-2">İngilizce kelimelerini öğren ve tekrar et!</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vocabularyCards.map((card, index) => (
            <div
              key={index}
              className={cn(
                "group relative h-64 rounded-2xl overflow-hidden cursor-pointer perspective transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2",
                card.color
              )}
              data-testid={`card-vocabulary-${index}`}
            >
              {/* Card Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-transparent to-black/5">
                <div className="text-center">
                  <p className="text-5xl font-serif font-black text-gray-800 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {card.word}
                  </p>
                  <div className="h-1 w-12 bg-blue-400 mx-auto mb-4 group-hover:w-16 transition-all duration-300"></div>
                  <p className="text-2xl font-bold text-blue-700">
                    {card.turkish}
                  </p>
                </div>
              </div>

              {/* Hover Accent Border */}
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-blue-300 rounded-2xl transition-all duration-300 pointer-events-none"></div>

              {/* Index Badge */}
              <div className={cn(
                "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                themeColor.dark,
                themeColor.darkText,
                "shadow-lg group-hover:shadow-xl transition-all"
              )}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <p className="text-blue-600 text-sm">
          💡 Kartlara tıkla ve kelimeyi öğren. Düzenli olarak tekrar et!
        </p>
      </div>
    </div>
  );
}
