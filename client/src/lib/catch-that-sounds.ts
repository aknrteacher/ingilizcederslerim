/** Prize / reward feedback — matches correct-word bell + wrong/error tones used elsewhere in Catch That. */

export function playCatchThatPositiveRewardSound(): void {
  const audio = new Audio("/sounds/bell.mp3");
  audio.volume = 0.4;
  audio.play().catch(() => {});
}

export function playCatchThatNegativeRewardSound(): void {
  const audio = new Audio("/sounds/error.mp3");
  audio.volume = 0.7;
  audio.play().catch((err) => {
    console.error("Error sound failed, trying wrong.mp3:", err);
    const fallbackAudio = new Audio("/sounds/wrong.mp3");
    fallbackAudio.volume = 0.7;
    fallbackAudio.play().catch(() => {});
  });
}
