import { GoogleGenAI } from "@google/genai";
import { ArtStyle } from "../types";

/** Use this in the UI to show a message when the key is missing. Vite only loads .env at startup. */
export const isGeminiApiKeySet = (): boolean =>
  !!import.meta.env.VITE_GEMINI_API_KEY?.trim?.();

/** For debugging: prefix of the key so you can confirm the right .env is loaded (e.g. "AIzaSyD1"). Empty if not set. */
export const getApiKeyPrefix = (): string => {
  const k = import.meta.env.VITE_GEMINI_API_KEY?.trim?.();
  return k ? k.slice(0, 8) : "";
};

/** Turn API errors (expired/invalid key, etc.) into a short message for the UI. */
function getFriendlyApiErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  try {
    const parsed = typeof msg === "string" && msg.startsWith("{") ? JSON.parse(msg) : null;
    const apiMsg = parsed?.error?.message ?? parsed?.message;
    if (typeof apiMsg === "string") {
      if (/expired|renew|API key invalid|API_KEY_INVALID|not valid/i.test(apiMsg))
        return "Gemini API key was rejected: " + apiMsg + " — If the key is new: wait 5–15 min for propagation; ensure .env is in the project root (same folder as package.json, not inside venv); restart the dev server. Some regions require billing in AI Studio.";
      return apiMsg;
    }
  } catch {
    // ignore parse errors
  }
  return msg;
}

/** Global base prompt used for ALL styles. Can be overridden by the user. */
export const getDefaultBasePrompt = (): string =>
  "High-quality educational flashcard image. Clearly defined, recognizable subject on solid pure white background. No background elements. Not cropped. No text, no label, no watermark. No decorative elements. Isolated composition optimized for vocabulary learning.";

const FLASHCARD_BASE_PROMPT = getDefaultBasePrompt();

/** Style-only prompts (combined with base prompt). */
export const getDefaultStylePrompt = (style: ArtStyle): string => {
  switch (style) {
    case ArtStyle.Clipart:
      return "Soft bold cartoon clipart style. Very thick clean black outlines. Simple rounded shapes. Bright cheerful colors. Gentle soft gradient shading inside iconic shapes. Minimal detail. Friendly expression. Strong clear silhouette. No realistic texture.";
    case ArtStyle.Cartoon:
      return "Children's book cartoon style. Cute characters or objects with rounded proportions. Whimsical charm. Bright, vibrant colors. Gentle shading. Warm soft lighting. Friendly shapes. Engaging aesthetic for children. Cheerful mood.";
    case ArtStyle.Animation:
      return "Modern 3D Pixar, Disney animation styles. Slightly realistic proportions. Soft studio lighting. Sharp images with subtle depth of field, giving it a polished and contemporary look.";
    case ArtStyle.Vector:
      return "Modern flat vector style. Natural shapes. Precise edges. Balanced color palette. Minimal shading. No artistic distortion.";
    case ArtStyle.Comics:
      return "Graphic novel comic book art. Refined linework with bold ink lines. Subtle controlled cel-shading. Natural relaxed pose. Modern comic book illustration elements.";
    case ArtStyle.Realistic:
      return "Professional realistic crisp photography. Natural lighting. Sharp focus. True-to-life colors. No artistic filters. High-definition, sharp focus, professional lighting.";
    default:
      return "High-quality professional illustration.";
  }
};

const getStylePrompt = (style: ArtStyle, customPrompts?: Partial<Record<ArtStyle, string>>): string => {
  const custom = customPrompts?.[style];
  if (custom?.trim()) return custom.trim();
  return getDefaultStylePrompt(style);
};

const getPrompt = (
  word: string,
  style: ArtStyle,
  count: number,
  clarification?: string,
  customPrompts?: Partial<Record<ArtStyle, string>>,
  customBasePrompt?: string
): string => {
  const base = (customBasePrompt?.trim() || FLASHCARD_BASE_PROMPT).trim();
  const stylePart = getStylePrompt(style, customPrompts);
  return `Generate exactly ${count} SEPARATE images. Each image must be a single standalone image—do NOT combine multiple subjects into one image, do NOT create a grid, collage, or multi-in-one layout.

Subject: "${word}"

${base}

Style: ${stylePart}
${clarification ? `\nAdditional detail: ${clarification}` : ""}`;
};

const extractImagesFromResponse = (response: { candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string }; text?: string }> } }> }): string[] => {
  const imageUrls: string[] = [];
  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) return imageUrls;
  for (const part of candidates[0].content?.parts ?? []) {
    if (part.inlineData) {
      imageUrls.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
    }
  }
  return imageUrls;
};

export const generateImageOptions = async (
  word: string,
  style: ArtStyle,
  clarification?: string,
  imagesPerWord: number = 3,
  customStylePrompts?: Partial<Record<ArtStyle, string>>,
  customBasePrompt?: string
): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) throw new Error("VITE_GEMINI_API_KEY is not set. Add it to .env in the project root and restart the dev server.");
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const targetCount = Math.min(4, Math.max(2, imagesPerWord));
  const base = (customBasePrompt?.trim() || FLASHCARD_BASE_PROMPT).trim();
  const prompt = getPrompt(word, style, targetCount, clarification, customStylePrompts, customBasePrompt);
  const allImages: string[] = [];

  try {
    let response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });

    allImages.push(...extractImagesFromResponse(response));

    let retries = 0;
    while (allImages.length < targetCount && retries < 2) {
      retries++;
      const needed = targetCount - allImages.length;
      const retryPrompt = `Generate exactly ${needed} more SEPARATE image(s) of "${word}".

${base}

Style: ${getStylePrompt(style, customStylePrompts)}

Each image must be standalone—no grid or collage.`;
      const retryResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: retryPrompt }] },
      });
      const more = extractImagesFromResponse(retryResponse);
      allImages.push(...more);
      if (more.length === 0) break;
    }

    if (allImages.length === 0) {
      const parts = response.candidates?.[0]?.content?.parts ?? [];
      const rejectionText = parts.find((p) => (p as { text?: string }).text) as { text?: string } | undefined;
      throw new Error(rejectionText?.text || `Model rejected generation for "${word}".`);
    }

    return allImages.slice(0, targetCount);
  } catch (error) {
    console.error(`Gemini generation error for "${word}":`, error);
    throw new Error(getFriendlyApiErrorMessage(error));
  }
};

export const generateStylePreview = async (
  style: ArtStyle,
  word?: string,
  customStylePrompts?: Partial<Record<ArtStyle, string>>,
  customBasePrompt?: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) throw new Error("VITE_GEMINI_API_KEY is not set. Add it to .env in the project root and restart the dev server.");
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const subject = word?.trim() || "apple";
  const base = (customBasePrompt?.trim() || FLASHCARD_BASE_PROMPT).trim();
  const stylePart = getStylePrompt(style, customStylePrompts);
  const prompt = `Generate ONE image of "${subject}".

${base}

Style: ${stylePart}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Style preview failed.");
  } catch (error) {
    console.error("Preview generation error:", error);
    throw new Error(getFriendlyApiErrorMessage(error));
  }
};
