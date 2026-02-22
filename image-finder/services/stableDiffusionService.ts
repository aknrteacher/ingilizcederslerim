import { ArtStyle } from "../types";

/** Base path for SD API - Vite dev server proxies /sd-api to local SD WebUI (localhost:7860). */
const API_BASE = "/sd-api";

const getStylePrompt = (style: ArtStyle): string => {
  switch (style) {
    case ArtStyle.Clipart:
      return "clipart style, clean vector, professional, bold outlines, vibrant colors, solid white background, isolated subject";
    case ArtStyle.Vector:
      return "flat vector illustration, minimalist, geometric shapes, clean lines, solid white background";
    case ArtStyle.Cartoon:
      return "whimsical 3D cartoon style, soft textures, friendly, vibrant saturated colors, solid white background";
    case ArtStyle.Comic:
      return "comic book art, strong ink lines, halftone shading, dynamic composition, solid white background";
    case ArtStyle.Realistic:
      return "photorealistic, high detail, professional studio lighting, sharp focus, 8k, cinematic, solid white background";
    default:
      return "high quality professional illustration, solid white background";
  }
};

const buildPrompt = (
  word: string,
  style: ArtStyle,
  clarification?: string
): string => {
  const stylePart = getStylePrompt(style);
  const base = `${word}, ${stylePart}, no text, no logos, no watermarks, centered, educational flashcard`;
  return clarification ? `${base}, ${clarification}` : base;
};

const NEGATIVE_PROMPT =
  "text, letters, words, watermark, logo, signature, blurry, low quality, distorted, deformed";

interface Txt2ImgResponse {
  images: string[];
  parameters?: Record<string, unknown>;
  info?: string;
}

const callTxt2Img = async (
  prompt: string,
  batchSize: number = 4
): Promise<string[]> => {
  const url = `${API_BASE}/sdapi/v1/txt2img`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      negative_prompt: NEGATIVE_PROMPT,
      steps: 25,
      width: 512,
      height: 512,
      batch_size: batchSize,
      cfg_scale: 7,
      sampler_name: "Euler a",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Stable Diffusion API error (${response.status}): ${
        text || response.statusText
      }. Make sure the WebUI is running with --api (e.g. localhost:7860).`
    );
  }

  const data: Txt2ImgResponse = await response.json();
  if (!data.images || data.images.length === 0) {
    throw new Error("No images returned from Stable Diffusion.");
  }

  return data.images.map(
    (img) => `data:image/png;base64,${img}`
  );
};

export const generateImageOptions = async (
  word: string,
  style: ArtStyle,
  clarification?: string
): Promise<string[]> => {
  const prompt = buildPrompt(word, style, clarification);

  try {
    return await callTxt2Img(prompt, 4);
  } catch (error) {
    console.error(`Stable Diffusion generation error for "${word}":`, error);
    throw error;
  }
};

export const generateStylePreview = async (style: ArtStyle): Promise<string> => {
  const testWord = "Magnificent Snowy Owl";
  const prompt = buildPrompt(testWord, style);

  try {
    const images = await callTxt2Img(prompt, 1);
    return images[0];
  } catch (error) {
    console.error("Style preview generation error:", error);
    throw error;
  }
};
