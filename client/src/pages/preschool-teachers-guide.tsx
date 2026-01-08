import { Layout } from "@/components/Layout";

export default function PreschoolTeachersGuide() {
  return (
    <Layout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-amber-900 mb-6 text-center">
              Velilere, 1.sınıf ya da Okul Öncesi Öğretmenlerine Özel
            </h1>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
              <p className="text-lg font-semibold text-amber-900 mb-2">
                📌 İngilizce Derslerim Okul Öncesi ve 1. Sınıf Konu Sıralaması:
              </p>
              <p className="text-gray-700">
                Web sitemizde yer alan İngilizce konuları, MEB Okul Öncesi ve 1. Sınıf gelişim hedefleri dikkate alınarak, çocukların 2. sınıfta başlayacak resmi İngilizce derslerine hazır olmalarını sağlayacak şekilde sıralanmıştır.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Amaç:</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Çocuklara erken yaşta akademik İngilizce öğretmek değil,</li>
                <li>İngilizceye karşı olumlu tutum, özgüven ve kulak aşinalığı kazandırmaktır.</li>
              </ul>
              <p className="text-gray-700">
                Bu nedenle konu sıralaması, kolaydan zora değil; çocuktan dünyaya, hareketten kavrama, somuttan daha soyuta doğru ilerlemektedir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">
                🔹 Konular Nasıl Gruplandırıldı?
              </h2>
              <p className="text-gray-700 mb-4">
                Konular, öğrenme sürecini daha anlaşılır kılmak için 4 ana öğrenme alanı altında görsel olarak gruplanmıştır. Bu gruplama yalnızca anlamayı kolaylaştırmak içindir; konu sırası değiştirilmemelidir.
              </p>

              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    🟦 Foundations (0.0–0.2)
                  </h3>
                  <p className="font-semibold text-blue-900 mb-2">
                    Alphabet – Numbers – Colours
                  </p>
                  <p className="text-gray-700 mb-2">Bu bölüm:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Tüm diğer konuların temelini oluşturur</li>
                    <li>Görsel ve bilişsel destek sağlar</li>
                    <li>Daha sonraki tüm kelimelerde tekrar kullanılır</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded">
                  <h3 className="text-xl font-bold text-green-900 mb-3">
                    🟩 Communication & Action (0.3–0.5)
                  </h3>
                  <p className="font-semibold text-green-900 mb-2">
                    Greetings – Actions – Our Body
                  </p>
                  <p className="text-gray-700 mb-2">Bu bölüm:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>İngilizceyi "ders" değil iletişim aracı olarak tanıtır</li>
                    <li>Hareket ve rutinler yoluyla öğrenmeyi destekler</li>
                    <li>Çocuğun derse katılımını ve özgüvenini artırır</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded">
                  <h3 className="text-xl font-bold text-yellow-900 mb-3">
                    🟨 My World (0.6–0.8)
                  </h3>
                  <p className="font-semibold text-yellow-900 mb-2">
                    Our Classroom – Things – People
                  </p>
                  <p className="text-gray-700 mb-2">Bu bölüm:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Çocuğun günlük hayatında gördüğü ve kullandığı nesneleri kapsar</li>
                    <li>Sosyal farkındalık ve çevre tanıma becerilerini destekler</li>
                    <li>Sınıf İngilizce ünitelerine doğrudan hazırlık sağlar</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded">
                  <h3 className="text-xl font-bold text-red-900 mb-3">
                    🟥 The World (0.9–0.11)
                  </h3>
                  <p className="font-semibold text-red-900 mb-2">
                    Animals – Around Us – Food
                  </p>
                  <p className="text-gray-700 mb-2">Bu bölüm:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Daha fazla kelime içeren, kavramsal olarak biraz daha geniş konulardır</li>
                    <li>Çocuğun gözlem yapma ve sınıflandırma becerilerini kullanmasını gerektirir</li>
                    <li>Bu nedenle en sona yerleştirilmiştir</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded">
                <h2 className="text-2xl font-bold text-orange-900 mb-4">
                  ⚠️ Önemli Bir Hatırlatma
                </h2>
                <p className="text-gray-700 mb-3">Bu programda:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Dil bilgisi (grammar) öğretilmez</li>
                  <li>Yazma ve test yoktur</li>
                  <li>Çoğunlukla opsiyonel kelime ipuçları dışında çeviri yapılmaz.</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  Öğrenme; şarkılar, oyunlar, görseller, hareket ve tekrar yoluyla gerçekleşir.
                </p>
                <p className="text-gray-700 mt-2 font-semibold">
                  Bu yaklaşım, MEB'in erken yaş yabancı dil yaklaşımıyla tam uyumludur.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded">
                <h2 className="text-2xl font-bold text-green-900 mb-4">
                  ✅ Sonuç Olarak
                </h2>
                <p className="text-gray-700 mb-3">Bu konu sıralaması:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Pedagojik olarak doğrudur</li>
                  <li>Türkiye bağlamına uygundur</li>
                  <li>Çocukları zorlamaz</li>
                  <li>Sınıf İngilizce derslerine sağlam bir zemin hazırlar</li>
                </ul>
                <p className="text-gray-700 mt-4 font-semibold text-lg">
                  Bu nedenle gönül rahatlığıyla uygulanabilir.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

