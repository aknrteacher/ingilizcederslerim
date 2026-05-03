import { getCrosswordSpeakText } from "./crosswordSpeak";

export function vocabImageBasename(file: string): string {
  return file.replace(/\.(png|jpg|jpeg|webp|gif)$/i, "").trim();
}

function lettersOnlyAlphabeticUpper(s: string): string {
  return s.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

export type SpellQuestAnswerSlot =
  | { kind: "letter"; letterIndex: number }
  | { kind: "gap" };

/**
 * Letter tiles in spelling order plus optional gap placeholders between words when the vocab
 * image basename uses spaces that align with the concatenated grid word (e.g. thank you.png + THANKYOU).
 */
export function buildSpellQuestAnswerSlots(gridWord: string, imageFile?: string): SpellQuestAnswerSlot[] {
  const gw = gridWord.trim();
  const chars = gw.split("");
  if (!chars.length) return [];

  if (!imageFile?.trim()) {
    return chars.map((_, i) => ({ kind: "letter", letterIndex: i }));
  }

  const base = vocabImageBasename(imageFile);
  if (!base.includes(" ")) {
    return chars.map((_, i) => ({ kind: "letter", letterIndex: i }));
  }

  const rawWords = base.split(/\s+/).filter(Boolean);
  const pieces = rawWords.map((w) => lettersOnlyAlphabeticUpper(w));
  const merged = pieces.join("");
  const gwLetters = lettersOnlyAlphabeticUpper(gw);

  if (merged !== gwLetters || merged.length !== chars.length) {
    return chars.map((_, i) => ({ kind: "letter", letterIndex: i }));
  }

  const slots: SpellQuestAnswerSlot[] = [];
  let offset = 0;
  pieces.forEach((piece, wi) => {
    for (let i = 0; i < piece.length; i++) {
      slots.push({ kind: "letter", letterIndex: offset++ });
    }
    if (wi < pieces.length - 1) slots.push({ kind: "gap" });
  });
  return slots;
}

/**
 * Label shown to learners for Spell Quest (success overlay, prompts).
 * Derived from image basename → uppercase so multi-word phrases show spaces ("GOOD MORNING").
 */
export function getSpellQuestDisplayWord(gridWord: string, imageFile?: string): string {
  if (!imageFile?.trim()) return gridWord;
  return vocabImageBasename(imageFile).toUpperCase();
}

/** Web Speech: natural spaced phrase from filename when needed (same rules as crossword). */
export function speakSpellQuestAnswer(gridWord: string, imageFile?: string): void {
  const text = getCrosswordSpeakText(gridWord, imageFile);
  if (!text) return;

  window.speechSynthesis?.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  window.speechSynthesis?.speak(utterance);
}
