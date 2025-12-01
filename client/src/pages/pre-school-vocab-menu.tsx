import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import "@/styles/2.1.voc.css";

export default function PreSchoolVocabMenu() {
  const vocabSets = [
    {
      title: "Colours",
      description: "Learn basic colors: Red, Blue, Yellow, Green, and more",
      href: "/pre-school/kelime-kartlari/0.1-vocab",
      icon: "🎨",
      color: "from-rainbow-1 to-rainbow-2"
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
            <Link key={index} href={set.href}>
              <a className="vocab-set-card" data-testid={`card-vocab-set-${index}`}>
                <div className="vocab-card-icon">{set.icon}</div>
                <h3 className="vocab-card-title">{set.title}</h3>
                <p className="vocab-card-description">{set.description}</p>
                <span className="vocab-card-arrow">→</span>
              </a>
            </Link>
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

        .vocab-set-card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 32px 24px;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .vocab-set-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .vocab-set-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.6);
        }

        .vocab-set-card:hover::before {
          opacity: 1;
        }

        .vocab-card-icon {
          font-size: 64px;
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }

        .vocab-card-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
          position: relative;
          z-index: 2;
        }

        .vocab-card-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 20px 0;
          line-height: 1.5;
          position: relative;
          z-index: 2;
        }

        .vocab-card-arrow {
          font-size: 24px;
          color: #6366f1;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .vocab-set-card:hover .vocab-card-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .vocab-menu-grid {
            grid-template-columns: 1fr;
            padding: 20px 16px;
            gap: 16px;
          }

          .vocab-card-icon {
            font-size: 48px;
          }

          .vocab-card-title {
            font-size: 20px;
          }
        }
      `}</style>
    </Layout>
  );
}
