import { Layout } from "@/components/Layout";
import { Link } from "wouter";

export default function PreschoolLandingPage() {
  const sections = [
    {
      title: "Kelime Kartları",
      href: "/pre-school/kelime-kartlari",
      description: "Vocabulary Cards"
    },
    {
      title: "Oyunlar",
      href: "/pre-school/games",
      description: "Games"
    },
    {
      title: "Şarkılar",
      href: "/pre-school/songs",
      description: "Songs"
    },
    {
      title: "Hikayeler",
      href: "/pre-school/stories",
      description: "Stories"
    }
  ];

  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">Pre-School & 1st Grade</h1>
            <p className="text-lg text-gray-600">Choose a section to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <Link key={index} href={section.href}>
                <a className="block p-6 bg-white rounded-lg border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 text-center">
                  <h2 className="text-2xl font-semibold text-amber-900 mb-2">{section.title}</h2>
                  <p className="text-gray-600">{section.description}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
