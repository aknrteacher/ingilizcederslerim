import { GoogleGenAI } from "@google/genai";
import { ArtStyle } from "../types";

/** Use this in the UI to show a message when the key is missing. Vite only loads .env at startup. */
export const isGeminiApiKeySet = (): boolean =>
  !!import.meta.env.VITE_GEMINI_API_KEY?.trim?.();

export const getDefaultStylePrompt = (style: ArtStyle): string => {
  switch (style) {
    case ArtStyle.Clipart:
      return "Clean, professional 2D clipart style. Bold outlines and vibrant colors. Solid white background, isolated subject.";
    case ArtStyle.Vector:
      return "Modern flat vector illustration. Geometric shapes, clean lines, minimalist aesthetic. Solid white background.";
    case ArtStyle.Cartoon:
      return "Whimsical 3D-style character design. Soft textures, friendly expressions, vibrant saturated colors. Solid white background.";
    case ArtStyle.Comic:
      return "Dynamic comic book art. Strong ink lines, halftone shading, action-oriented composition. Solid white background.";
    case ArtStyle.Realistic:
      return "Photorealistic high-detail shot. Professional studio lighting, sharp focus, 8k resolution, cinematic quality. Solid white background.";
    default:
      return "High-quality professional illustration. Solid white background.";
  }
};

const getStylePrompt = (style: ArtStyle, customPrompts?: Partial<Record<ArtStyle, string>>): string => {
  const custom = customPrompts?.[style];
  if (custom?.trim()) return custom.trim();
  return getDefaultStylePrompt(style);
};

const getPrompt = (word: string, style: ArtStyle, count: number, clarification?: string, customPrompts?: Partial<Record<ArtStyle, string>>): string => {
  return `Generate exactly ${count} SEPARATE images. Each image must be a single standalone image—do NOT combine multiple subjects into one image, do NOT create a grid, collage, or multi-in-one layout.

Subject: "${word}"
Style: ${getStylePrompt(style, customPrompts)}

Composition rules:
- Subject must FILL the frame—large, prominent, occupying 70–80% of the canvas.
- Tight crop, minimal empty space, close-up composition.
- Centered on solid white background.
- NO text, logos, watermarks, or letters.
- Professional quality for educational flashcards.
${clarification ? `Additional detail: ${clarification}` : ''}`;
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
  customStylePrompts?: Partial<Record<ArtStyle, string>>
): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) throw new Error("VITE_GEMINI_API_KEY is not set. Add it to .env in the project root and restart the dev server.");
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const targetCount = Math.min(4, Math.max(2, imagesPerWord));
  const prompt = getPrompt(word, style, targetCount, clarification, customStylePrompts);
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
      const retryPrompt = `Generate exactly ${needed} more SEPARATE image(s) of "${word}". ${getStylePrompt(style, customStylePrompts)}. Subject must fill the frame (70–80% of canvas), tight crop, close-up, solid white background, no text. Each image must be standalone—no grid or collage.`;
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
    throw error;
  }
};

export const generateStylePreview = async (style: ArtStyle, word?: string, customStylePrompts?: Partial<Record<ArtStyle, string>>): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) throw new Error("VITE_GEMINI_API_KEY is not set. Add it to .env in the project root and restart the dev server.");
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const subject = word?.trim() || "Magnificent Snowy Owl";
  const prompt = `Generate ONE high-quality image of "${subject}" in the "${style}" style: ${getStylePrompt(style, customStylePrompts)}. 
Requirements: Subject must FILL the frame (large, 70–80% of canvas), tight crop, minimal empty space. Solid white background, centered, no text.`;

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
    throw error;
  }
};
