/**
 * Crossword answers use a grid token (often uppercase, spaces removed).
 * Web Speech reads that badly for phrases ("HOWAREYOU"). Prefer the natural phrase from the
 * vocab image basename when it contains spaces (e.g. "how are you.png" → "how are you").
 */
export function getCrosswordSpeakText(gridWord: string, imageFile?: string): string {
  const gw = gridWord.trim();
  if (!gw) return "";

  if (imageFile) {
    const base = imageFile.replace(/\.(png|jpg|jpeg|webp|gif)$/i, "").trim();
    if (base.includes(" ")) {
      return base;
    }
    return base.toLowerCase();
  }

  return gw.replace(/_/g, " ").toLowerCase();
}

export function speakCrosswordAnswer(gridWord: string, imageFile?: string): void {
  const text = getCrosswordSpeakText(gridWord, imageFile);
  if (!text) return;

  window.speechSynthesis?.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis?.speak(utterance);
}
