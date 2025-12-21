import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import coloursBanner from "@/assets/colours-banner.png";
import numbersBanner from "@/assets/numbers-banner.png";
import thealphabetBanner from "@/assets/thealphabet-banner.png";
import greetingsBanner from "@/assets/greetings-banner.png";
import actionsBanner from "@/assets/actions.banner.png";
import "@/styles/2.1.voc.css";

export default function PreSchoolVocabMenu() {
  const vocabBanners = [
    {
      href: "/pre-school/kelime-kartlari/0.0-alphabet",
      image: thealphabetBanner,
      alt: "THE ALPHABET - ALFABE",
      testId: "card-vocab-set-0",
    },
    {
      href: "/pre-school/kelime-kartlari/0.1-numbers",
      image: numbersBanner,
      alt: "NUMBERS - SAYILAR",
      testId: "card-vocab-set-1",
    },
    {
      href: "/pre-school/kelime-kartlari/0.2-colours",
      image: coloursBanner,
      alt: "COLOURS - RENKLER",
      testId: "card-vocab-set-2",
    },
    {
      href: "/pre-school/kelime-kartlari/0.3-greetings",
      image: greetingsBanner,
      alt: "GREETINGS - SELAMLAŞMALAR",
      testId: "card-vocab-set-3",
    },
    {
      href: "/pre-school/kelime-kartlari/0.4-actions",
      image: actionsBanner,
      alt: "ACTIONS - EYLEMLER",
      testId: "card-vocab-set-4",
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
          {vocabBanners.map((banner, index) => (
            <Link key={index} href={banner.href}>
              <a className="vocab-banner-link" data-testid={banner.testId}>
                <img 
                  src={banner.image} 
                  alt={banner.alt} 
                  className="vocab-banner-image"
                />
              </a>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .vocab-menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 1400px) {
          .vocab-menu-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1024px) and (max-width: 1399px) {
          .vocab-menu-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .vocab-menu-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .vocab-menu-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .vocab-banner-link {
          display: block;
          text-decoration: none;
          transition: transform 0.3s ease, filter 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .vocab-banner-link:hover {
          transform: translateY(-8px) scale(1.02);
          filter: brightness(1.05);
          box-shadow: 0 12px 32px rgba(255, 224, 102, 0.4);
        }

        .vocab-banner-link:active {
          transform: translateY(-4px) scale(1.01);
        }

        .vocab-banner-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }

        @media (min-width: 1400px) {
          .vocab-banner-link {
            grid-column: span 2;
          }
        }

        @media (min-width: 1024px) and (max-width: 1399px) {
          .vocab-banner-link {
            grid-column: span 2;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .vocab-banner-link {
            grid-column: span 2;
          }
        }
      `}</style>
    </Layout>
  );
}
