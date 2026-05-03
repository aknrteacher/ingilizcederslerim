import { getCrosswordSpeakText } from "./crosswordSpeak";
import { getSpellQuestDisplayWord } from "./spellQuestSpeak";

/** Readable phrase for Web Speech (underscores → spaces). */
function polishSpeakPhrase(text: string): string {
  return text.replace(/_/g, " ");
}

/**
 * When the Turkish gloss ends with ? or ! and the English label does not, append the same mark.
 * Keeps learner-facing English aligned with question/exclamation prompts (e.g. HOW ARE YOU?).
 */
export function mirrorClosingPunctuationFromTurkish(english: string, turkish?: string): string {
  const t = turkish?.trim() ?? "";
  if (!t) return english;
  const last = t[t.length - 1];
  if (last !== "?" && last !== "!") return english;
  const en = english.trimEnd();
  if (en.endsWith(last)) return english;
  return en + last;
}

/** Banner / balloon label: spaced uppercase from vocab image basename + optional closing punct from Turkish gloss. */
export function getWordPopDisplayWord(gridWord: string, imageFile?: string, turkish?: string): string {
  const label = getSpellQuestDisplayWord(gridWord, imageFile);
  return mirrorClosingPunctuationFromTurkish(label, turkish);
}

/** Natural lowercase phrase for TTS (multi-word basenames, underscores as spaces) + closing punct when gloss has ?!. */
export function getWordPopSpeakText(gridWord: string, imageFile?: string, turkish?: string): string {
  const raw = polishSpeakPhrase(getCrosswordSpeakText(gridWord, imageFile));
  return mirrorClosingPunctuationFromTurkish(raw, turkish);
}

export type WordPopSpeakOptions = {
  /** Defaults to 0.8 (primary Word Pop); preschool games typically pass 0.7. */
  rate?: number;
};

/** Word Pop synthesis — spaced phrase from vocab basename, not the compressed grid token. */
export function speakWordPopAnswer(
  gridWord: string,
  imageFile?: string,
  turkish?: string,
  options?: WordPopSpeakOptions
): void {
  const text = getWordPopSpeakText(gridWord, imageFile, turkish);
  if (!text) return;

  window.speechSynthesis?.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = options?.rate ?? 0.8;
  window.speechSynthesis?.speak(utterance);
}
