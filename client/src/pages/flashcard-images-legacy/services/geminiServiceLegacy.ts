import { GoogleGenAI } from "@google/genai";
import { LegacyArtStyle } from "../types";
import { getApiKeyPrefix, isGeminiApiKeySet } from "@/pages/flashcard-images/services/geminiService";

export { isGeminiApiKeySet, getApiKeyPrefix };

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
    // ignore
  }
  return msg;
}

/** Original default style lines (each included solid white background). */
export const getDefaultStylePrompt = (style: LegacyArtStyle): string => {
  switch (style) {
    case LegacyArtStyle.Clipart:
      return "Clean, professional 2D clipart style. Bold outlines and vibrant colors. Solid white background, isolated subject.";
    case LegacyArtStyle.Vector:
      return "Modern flat vector illustration. Geometric shapes, clean lines, minimalist aesthetic. Solid white background.";
    case LegacyArtStyle.Cartoon:
      return "Whimsical 3D-style character design. Soft textures, friendly expressions, vibrant saturated colors. Solid white background.";
    case LegacyArtStyle.Comic:
      return "Dynamic comic book art. Strong ink lines, halftone shading, action-oriented composition. Solid white background.";
    case LegacyArtStyle.Realistic:
      return "Photorealistic high-detail shot. Professional studio lighting, sharp focus, 8k resolution, cinematic quality. Solid white background.";
    default:
      return "High-quality professional illustration. Solid white background.";
  }
};

const getStylePrompt = (
  style: LegacyArtStyle,
  customPrompts?: Partial<Record<LegacyArtStyle, string>>
): string => {
  const custom = customPrompts?.[style];
  if (custom?.trim()) return custom.trim();
  return getDefaultStylePrompt(style);
};

const COMPOSITION_RULES = `Composition rules:
- Subject must FILL the frame—large, prominent, occupying 70–80% of the canvas.
- Tight crop, minimal empty space, close-up composition.
- Centered on solid white background.
- NO text, logos, watermarks, or letters.
- Professional quality for educational flashcards.`;

const getPrompt = (
  word: string,
  style: LegacyArtStyle,
  count: number,
  clarification?: string,
  customPrompts?: Partial<Record<LegacyArtStyle, string>>
): string =>
  `Generate exactly ${count} SEPARATE images. Each image must be a single standalone image—do NOT combine multiple subjects into one image, do NOT create a grid, collage, or multi-in-one layout.
Subject: "${word}"
Style: ${getStylePrompt(style, customPrompts)}
${COMPOSITION_RULES}${clarification ? `\nAdditional detail: ${clarification}` : ""}`;

const extractImagesFromResponse = (response: {
  candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string }; text?: string }> } }>;
}): string[] => {
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

export const generateImageOptionsLegacy = async (
  word: string,
  style: LegacyArtStyle,
  clarification?: string,
  imagesPerWord: number = 3,
  customStylePrompts?: Partial<Record<LegacyArtStyle, string>>
): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) throw new Error("VITE_GEMINI_API_KEY is not set. Add it to .env in the project root and restart the dev server.");
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const targetCount = Math.min(4, Math.max(2, imagesPerWord));
  const prompt = getPrompt(word, style, targetCount, clarification, customStylePrompts);
  const allImages: string[] = [];

  try {
    let response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: prompt }] },
    });

    allImages.push(...extractImagesFromResponse(response));

    let retries = 0;
    while (allImages.length < targetCount && retries < 2) {
      retries++;
      const needed = targetCount - allImages.length;
      const retryPrompt = `Generate exactly ${needed} more SEPARATE image(s) of "${word}". ${getStylePrompt(style, customStylePrompts)}. Subject must fill the frame (70-80% of canvas), tight crop, close-up, solid white background, no text. Each image must be standalone—no grid or collage.`;
      const retryResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
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

/** Original style-preview prompt (default sample subject: Magnificent Snowy Owl). */
export const generateStylePreviewLegacy = async (
  style: LegacyArtStyle,
  word?: string,
  customStylePrompts?: Partial<Record<LegacyArtStyle, string>>
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) throw new Error("VITE_GEMINI_API_KEY is not set. Add it to .env in the project root and restart the dev server.");
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const subject = word?.trim() || "Magnificent Snowy Owl";
  const styleLabel = style;
  const stylePart = getStylePrompt(style, customStylePrompts);
  const prompt = `Generate ONE high-quality image of "${subject}" in the "${styleLabel}" style: ${stylePart}. 
Requirements: Subject must FILL the frame (large, 70–80% of canvas), tight crop, minimal empty space. Solid white background, centered, no text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
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
