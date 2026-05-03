/**
 * Free pronunciation for Catch That target words (no score penalty).
 * Used when each new round starts for preschool / Grade 2.
 */
export function speakCatchThatTargetWord(text: string, rate = 0.72): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const trimmed = text.trim();
  if (!trimmed) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}
