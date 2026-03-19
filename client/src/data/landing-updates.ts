/**
 * Single source of truth for the main landing page "Now Working On" and "Last Added" sections.
 * Update these when you add new materials or start working on something new.
 * Use `level` so the card uses that level's accent color and graphics.
 */

export type LandingLevel =
  | "pre-school"
  | "primary-school"
  | "secondary-school"
  | "high-school"
  | "university"
  | "business-english";

export interface LandingItem {
  title: string;
  href: string;
  description?: string;
  /** ISO date when added/updated (e.g. "2025-02-22") */
  addedAt?: string;
  /** Level this material belongs to — used for accent colors and graphics. */
  level: LandingLevel;
}

/**
 * Sections we are currently working on — 3 items, cycle with arrows on landing.
 * Update when you change focus.
 */
export const nowWorkingOnList: LandingItem[] = [
  {
    title: "3. Sınıf 8, 9 ve 10. Üniteler",
    href: "/primary-school/grade-3",
    description: "3. sınıf 8, 9 ve 10. üniteler kelime kartları ve oyunlar.",
    addedAt: "2025-02-23",
    level: "primary-school",
  },
  {
    title: "4. Sınıf Eksik Üniteler Kelime Kartları",
    href: "/primary-school/grade-4",
    description: "4. sınıf eksik üniteler için kelime kartları.",
    addedAt: "2025-02-23",
    level: "primary-school",
  },
  {
    title: "2. Sınıf Şarkıları",
    href: "/primary-school/grade-2/theme-1/songs",
    description: "2. sınıf ünite şarkıları: dinleme ve karaoke.",
    addedAt: "2026-03-19",
    level: "primary-school",
  },
];

/**
 * Last added pages — most recent first. Show in "Son Eklenen" as a scrollable list.
 * Add new items at the top when you publish new content.
 */
export const lastAddedList: LandingItem[] = [
  {
    title: "2. Sınıf Ünite 1 Şarkı: Hello School",
    href: "/primary-school/grade-2/theme-1/songs/hello-school",
    description: "2. sınıf 1. ünite için Hello School şarkısı: dinleme, karaoke ve sözler.",
    addedAt: "2026-03-19",
    level: "primary-school",
  },
  {
    title: "4. Sınıf Ünite 7: Jobs",
    href: "/primary-school/grade-4/unit-7/games",
    description: "4. sınıf 7. ünite kelime kartları ve 9 kelime oyunu (Jobs).",
    addedAt: "2025-02-23",
    level: "primary-school",
  },
  {
    title: "4. Sınıf Ünite 6",
    href: "/primary-school/grade-4/unit-6/games",
    description: "4. sınıf 6. ünite kelime kartları ve kelime oyunları.",
    addedAt: "2025-02-23",
    level: "primary-school",
  },
];
