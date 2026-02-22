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
  title: "3. Sınıf Ünite 7: In My City",
  href: "/primary-school/grade-3/unit-7/games",
  description: "3. sınıf 7. ünite kelime kartları ve kelime oyunları (In My City).",
  addedAt: "2025-02-22",
  level: "primary-school",
};

/** The most recently added page — update when you publish new content. */
export const lastAdded: LandingItem = {
  title: "3. Sınıf Ünite 7 Kelime Oyunları",
  href: "/primary-school/grade-3/unit-7/games",
  description: "3. sınıf 7. ünite kelime oyunları (In My City) — 9 oyun.",
  addedAt: "2025-02-22",
  level: "primary-school",
};
