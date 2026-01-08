import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import coloursBanner from "@/assets/colours-banner.png";
import numbersBanner from "@/assets/numbers-banner.png";
import thealphabetBanner from "@/assets/thealphabet-banner.png";
import greetingsBanner from "@/assets/greetings-banner.png";
import actionsBanner from "@/assets/actions.banner.png";
import ourbodyBanner from "@/assets/ourbody.banner.png";
import ourclassroomBanner from "@/assets/ourclassroom.banner.png";
import thingsBanner from "@/assets/things.banner.png";
import peopleBanner from "@/assets/people.banner.png";
import animalsBanner from "@/assets/animals.banner.png";
import aroundusBanner from "@/assets/aroundus.banner.png";
import foodBanner from "@/assets/food.banner.png";
import "@/styles/2.1.voc.css";

export default function PreSchoolVocabMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Center the scrollbar on page load
    const centerScroll = () => {
      const main = document.querySelector('main');
      if (main) {
        // Wait for all content to render and images to load
        const checkAndScroll = () => {
          const scrollHeight = main.scrollHeight;
          const clientHeight = main.clientHeight;
          
          // Only scroll if content is taller than viewport
          if (scrollHeight > clientHeight) {
            // Calculate center position: (total scrollable height - visible height) / 2
            const scrollPosition = (scrollHeight - clientHeight) / 2;
            
            // Scroll to center position
            main.scrollTop = scrollPosition;
          }
        };
        
        // Try immediately
        checkAndScroll();
        
        // Also try after a short delay to account for images loading
        setTimeout(checkAndScroll, 100);
        setTimeout(checkAndScroll, 300);
      }
    };
    
    centerScroll();
    
    // Also center on window resize
    window.addEventListener('resize', centerScroll);
    return () => window.removeEventListener('resize', centerScroll);
  }, []);

  const vocabBanners = [
    {
      href: "/pre-school/kelime-kartlari/0.0-alphabet",
      image: thealphabetBanner,
      alt: "THE ALPHABET - ALFABE",
      turkishTitle: "Alfabe",
      testId: "card-vocab-set-0",
    },
    {
      href: "/pre-school/kelime-kartlari/0.1-numbers",
      image: numbersBanner,
      alt: "NUMBERS - SAYILAR",
      turkishTitle: "Sayılar",
      testId: "card-vocab-set-1",
    },
    {
      href: "/pre-school/kelime-kartlari/0.2-colours",
      image: coloursBanner,
      alt: "COLOURS - RENKLER",
      turkishTitle: "Renkler",
      testId: "card-vocab-set-2",
    },
    {
      href: "/pre-school/kelime-kartlari/0.3-greetings",
      image: greetingsBanner,
      alt: "GREETINGS - SELAMLAŞMALAR",
      turkishTitle: "Selamlaşmalar",
      testId: "card-vocab-set-3",
    },
    {
      href: "/pre-school/kelime-kartlari/0.4-actions",
      image: actionsBanner,
      alt: "ACTIONS - EYLEMLER",
      turkishTitle: "Eylemler",
      testId: "card-vocab-set-4",
    },
    {
      href: "/pre-school/kelime-kartlari/0.5-ourbody",
      image: ourbodyBanner,
      alt: "OUR BODY - VÜCUDUMUZ",
      turkishTitle: "Vücudumuz",
      testId: "card-vocab-set-5",
    },
    {
      href: "/pre-school/kelime-kartlari/0.6-ourclassroom",
      image: ourclassroomBanner,
      alt: "OUR CLASSROOM - SINIFIMIZ",
      turkishTitle: "Sınıfımız",
      testId: "card-vocab-set-6",
    },
    {
      href: "/pre-school/kelime-kartlari/0.7-things",
      image: thingsBanner,
      alt: "THINGS - EŞYALAR",
      turkishTitle: "Eşyalar",
      testId: "card-vocab-set-7",
    },
    {
      href: "/pre-school/kelime-kartlari/0.8-people",
      image: peopleBanner,
      alt: "PEOPLE - İNSANLAR",
      turkishTitle: "İnsanlar",
      testId: "card-vocab-set-8",
    },
    {
      href: "/pre-school/kelime-kartlari/0.9-animals",
      image: animalsBanner,
      alt: "ANIMALS - HAYVANLAR",
      turkishTitle: "Hayvanlar",
      testId: "card-vocab-set-9",
    },
    {
      href: "/pre-school/kelime-kartlari/0.10-aroundus",
      image: aroundusBanner,
      alt: "AROUND US - ÇEVRİMİZ",
      turkishTitle: "Çevremiz",
      testId: "card-vocab-set-10",
    },
    {
      href: "/pre-school/kelime-kartlari/0.11-food",
      image: foodBanner,
      alt: "FOOD - YİYECEK",
      turkishTitle: "Yiyecekler",
      testId: "card-vocab-set-11",
    },
  ];

  return (
    <Layout>
      <div className="vocabulary-container">
        <div className="title-container">
          <p>Pre-School & 1st Grade (Okul Öncesi & 1. Sınıf)</p>
          <p style={{ color: '#8B4513' }}>Kelime Kartları (Vocabulary Cards)</p>
        </div>

        <div className="vocab-menu-grid">
          {vocabBanners.map((banner, index) => (
            <div
              key={index}
              className="vocab-banner-wrapper"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href={banner.href}>
                <a className="vocab-banner-link" data-testid={banner.testId}>
                  <img 
                    src={banner.image} 
                    alt={banner.alt} 
                    className="vocab-banner-image"
                  />
                </a>
              </Link>
              {hoveredIndex === index && (
                <div className="vocab-tooltip">
                  <div className="tooltip-content">
                    <span className="tooltip-text">{banner.turkishTitle}</span>
                    <div className="tooltip-arrow"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        main {
          border-top: none !important;
        }

        main > div {
          border-top: none !important;
        }

        main > div.max-w-6xl {
          border-top: none !important;
        }

        .vocabulary-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 120px);
          padding: clamp(40px, 8vh, 80px) 20px clamp(60px, 10vh, 100px) 20px;
          box-sizing: border-box;
        }

        .title-container {
          border-top: none !important;
          border-bottom: none !important;
          margin-bottom: 30px;
          margin-top: 0;
          padding-top: 0 !important;
          position: relative;
        }

        .title-container::before,
        .title-container::after {
          display: none !important;
        }

        .vocabulary-container::before {
          display: none !important;
        }

        .vocab-banner-wrapper {
          position: relative;
        }

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
          transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
          border: 3px solid #ffd700;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          line-height: 0;
        }

        .vocab-banner-link:hover {
          transform: translateY(-8px) scale(1.08);
          filter: brightness(1.05);
          border-color: #ffd700;
          box-shadow: 0 12px 32px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.4);
        }

        .vocab-banner-link:active {
          transform: translateY(-4px) scale(1.05);
        }

        .vocab-banner-image {
          width: 100%;
          height: auto;
          display: block;
          transform: scale(1.08);
          transform-origin: left center;
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

        /* Tooltip Styles */
        .vocab-tooltip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          z-index: 1000;
          pointer-events: none;
          animation: tooltipFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .tooltip-content {
          position: relative;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          width: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .tooltip-text {
          font-family: 'Libre Baskerville', serif;
          font-size: 18px;
          font-weight: 700;
          color: #8B4513;
          text-transform: uppercase;
          text-shadow: 
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 215, 0, 0.6),
            0 0 30px rgba(255, 215, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.2);
          letter-spacing: 0.5px;
          white-space: nowrap;
          display: block;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .tooltip-arrow {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid rgba(255, 255, 255, 0.15);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .tooltip-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        @keyframes tooltipFadeIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) translateY(0);
          }
        }

        /* Pulse animation for tooltip glow */
        @keyframes tooltipPulse {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(255, 215, 0, 0.8),
              0 0 20px rgba(255, 215, 0, 0.6),
              0 0 30px rgba(255, 215, 0, 0.4),
              0 2px 4px rgba(0, 0, 0, 0.2);
          }
          50% {
            text-shadow: 
              0 0 15px rgba(255, 215, 0, 1),
              0 0 25px rgba(255, 215, 0, 0.8),
              0 0 35px rgba(255, 215, 0, 0.6),
              0 2px 4px rgba(0, 0, 0, 0.2);
          }
        }

        .tooltip-text {
          animation: tooltipPulse 2s ease-in-out infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .tooltip-text {
            font-size: 16px;
            padding: 10px 20px;
          }
        }
      `}</style>
    </Layout>
  );
}
