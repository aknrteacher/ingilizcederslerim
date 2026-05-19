/** Theme/unit slug for grade 4 vocab routes (matches wordMap ids: 4.1 … 4.10). */
const GRADE4_UNIT_SLUGS = [
  "4.1",
  "4.2",
  "4.3",
  "4.4",
  "4.5",
  "4.6",
  "4.7",
  "4.8",
  "4.9",
  "4.10",
] as const;

export function grade4VocabHref(unitNumber: number): string {
  const slug = GRADE4_UNIT_SLUGS[unitNumber - 1];
  if (!slug) {
    return `/primary-school/grade-4/unit-${unitNumber}/4.${unitNumber}-vocab`;
  }
  return `/primary-school/grade-4/unit-${unitNumber}/${slug}-vocab`;
}

export function grade3VocabHref(unitNumber: number): string {
  return `/primary-school/grade-3/unit-${unitNumber}/3.${unitNumber}-vocab`;
}

export function grade2VocabHref(themeNumber: number): string {
  return `/primary-school/grade-2/theme-${themeNumber}/2.${themeNumber}-vocab`;
}
