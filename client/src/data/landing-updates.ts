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

/** What we are currently working on — update when you start a new focus. */
export const nowWorkingOn: LandingItem = {
  title: "3. Sınıf 8, 9 ve 10. Üniteler",
  href: "/primary-school/grade-3",
  description: "3. sınıf 8, 9 ve 10. üniteler kelime kartları ve oyunlar.",
  addedAt: "2025-02-23",
  level: "primary-school",
};

/** The most recently added page — update when you publish new content. */
export const lastAdded: LandingItem = {
  title: "4. Sınıf Ünite 7: Jobs",
  href: "/primary-school/grade-4/unit-7/games",
  description: "4. sınıf 7. ünite kelime kartları ve 9 kelime oyunu (Jobs).",
  addedAt: "2025-02-23",
  level: "primary-school",
};
