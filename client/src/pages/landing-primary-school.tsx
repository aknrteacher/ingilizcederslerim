import { Layout } from "@/components/Layout";
import { Link } from "wouter";

export default function PrimarySchoolLandingPage() {
  const sections = [
    {
      title: "Hikayeler",
      href: "/primary-school/stories",
      description: "Stories"
    },
    {
      title: "Oyunlar",
      href: "/primary-school/grade-2/theme-1/games",
      description: "Games"
    },
    {
      title: "Kelime Kartları",
      href: "/primary-school/grade-2/theme-1/2.1-vocab",
      description: "Vocabulary Cards"
    }
  ];

  return (
    <Layout>
      <div className="min-h-[60vh] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Primary School</h1>
            <p className="text-lg text-muted-foreground">Choose a section to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <Link key={index} href={section.href}>
                <a className="block p-6 bg-card rounded-lg border-2 border-border hover:border-primary hover:shadow-lg transition-all duration-200 text-center">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
