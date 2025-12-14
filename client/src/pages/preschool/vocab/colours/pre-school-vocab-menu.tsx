import { Layout } from "@/components/Layout";
import { PreschoolButton } from "@/components/PreschoolButton";
import "@/styles/2.1.voc.css";

export default function PreSchoolVocabMenu() {
  const vocabSets = [
    {
      title: "COLOURS",
      subtitle: "RENKLER",
      description: "Learn basic colors: Red, Blue, Yellow, Green, and more",
      href: "/pre-school/kelime-kartlari/0.1-vocab",
      icon: "🎨",
      gradient: "yellow-orange" as const,
    },
  ];

  return (
    <Layout>
      <div className="vocabulary-container">
        <div className="title-container">
          <p>Pre-School & 1st Grade</p>
          <p>Kelime Kartları (Vocabulary Cards)</p>
        </div>

        <div className="vocab-menu-grid">
          {vocabSets.map((set, index) => (
            <PreschoolButton
              key={index}
              title={set.title}
              subtitle={set.subtitle}
              description={set.description}
              icon={set.icon}
              href={set.href}
              gradient={set.gradient}
              dataTestId={`card-vocab-set-${index}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .vocab-menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .vocab-menu-grid {
            grid-template-columns: 1fr;
            padding: 20px 16px;
            gap: 16px;
          }
        }
      `}</style>
    </Layout>
  );
}
