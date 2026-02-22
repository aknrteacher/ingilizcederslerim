# Flashcard Images (Image Finder)

This feature generates flashcard images from vocabulary words using **Gemini 2.5 Flash Image**.

## Setup

1. **API key**: Create a `.env` file in the **project root** (same folder as `package.json`) with:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

## Usage

- Open **/flashcard-images** in the app (e.g. `http://localhost:5000/flashcard-images`).
- Enter words, choose a style (Clipart, Cartoon, Comic, Realistic, Vector), then generate.
- Select one image per word and download as a ZIP.

## Integrated from

Originally the standalone "image finder" app on the desktop; merged into Ingilizce Derslerim.
