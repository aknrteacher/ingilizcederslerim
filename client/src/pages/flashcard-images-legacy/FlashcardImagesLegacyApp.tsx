import React, { useState, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import WordInputLegacy from './components/WordInputLegacy';
import SavedGallery from '@/pages/flashcard-images/components/SavedGallery';
import MultiImageSelectorLegacy from './components/MultiImageSelectorLegacy';
import type { SavedImage, WordImageData } from './types';
import { AppState, LegacyArtStyle } from './types';
import {
  generateImageOptionsLegacy,
  isGeminiApiKeySet,
  getApiKeyPrefix,
} from './services/geminiServiceLegacy';

const getSafeFilename = (word: string, dataUrl: string): string => {
  const mimeTypeMatch = dataUrl.match(/data:([^;]+);/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
  const extension = mimeType.split('/')[1] || 'png';
  return word.replace(/[^a-z0-9_.-]/gi, '_') + `.${extension}`;
};

function FlashcardImagesLegacyApp() {
  const [appState, setAppState] = useState<AppState>(AppState.Input);
  const [words, setWords] = useState<string[]>([]);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [imageData, setImageData] = useState<Map<string, WordImageData>>(new Map<string, WordImageData>());
  const [currentGradeUnit, setCurrentGradeUnit] = useState<string | undefined>(undefined);

  const handleWordsSubmit = useCallback(
    async (
      submittedWords: string[],
      style: LegacyArtStyle,
      imagesPerWord: number = 3,
      customStylePrompts?: Partial<Record<LegacyArtStyle, string>>,
      gradeUnit?: string
    ) => {
      const filteredWords = submittedWords.filter((word) => word.trim() !== '');
      if (filteredWords.length === 0) return;

      setWords(filteredWords);
      setSavedImages([]);
      setCurrentGradeUnit(gradeUnit);
      setAppState(AppState.Selecting);

      const initialData = new Map<string, WordImageData>();
      filteredWords.forEach((word) => {
        initialData.set(word, {
          images: [],
          loading: true,
          error: null,
          selectedImageUrl: null,
          clarification: '',
          style,
          imagesPerWord,
          customStylePrompts,
        });
      });
      setImageData(initialData);

      const BATCH_SIZE = 4;
      const batches: string[][] = [];
      for (let i = 0; i < filteredWords.length; i += BATCH_SIZE) {
        batches.push(filteredWords.slice(i, i + BATCH_SIZE));
      }

      for (const batch of batches) {
        const results = await Promise.allSettled(
          batch.map((word) =>
            generateImageOptionsLegacy(word, style, undefined, imagesPerWord, customStylePrompts)
          )
        );
        setImageData((prev) => {
          const newData = new Map<string, WordImageData>(prev);
          batch.forEach((word, i) => {
            const current = newData.get(word);
            if (!current) return;
            const result = results[i];
            if (result.status === 'fulfilled') {
              newData.set(word, { ...current, images: result.value, loading: false, error: null });
            } else {
              console.error(`Failed to generate images for ${word}:`, result.reason);
              newData.set(word, {
                ...current,
                images: [],
                loading: false,
                error: result.reason instanceof Error ? result.reason.message : 'Failed to generate images.',
              });
            }
          });
          return newData;
        });
      }
    },
    []
  );

  const handleClarificationChange = useCallback((word: string, text: string) => {
    setImageData((prev) => {
      const newData = new Map<string, WordImageData>(prev);
      const wordData = newData.get(word);
      if (wordData) {
        newData.set(word, { ...wordData, clarification: text });
      }
      return newData;
    });
  }, []);

  const handleRegenerateForWord = useCallback(async (word: string) => {
    const data = imageData.get(word);
    if (!data) return;

    setImageData((prev) => {
      const newData = new Map<string, WordImageData>(prev);
      const currentData = newData.get(word);
      if (currentData) {
        newData.set(word, { ...currentData, images: [], loading: true, error: null });
      }
      return newData;
    });

    try {
      const newImages = await generateImageOptionsLegacy(
        word,
        data.style,
        data.clarification,
        data.imagesPerWord,
        data.customStylePrompts
      );
      setImageData((prev) => {
        const newData = new Map<string, WordImageData>(prev);
        const currentData = newData.get(word);
        if (currentData) {
          newData.set(word, { ...currentData, images: newImages, loading: false });
        }
        return newData;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate new images.';
      setImageData((prev) => {
        const newData = new Map<string, WordImageData>(prev);
        const currentData = newData.get(word);
        if (currentData) {
          newData.set(word, { ...currentData, loading: false, error: errorMessage });
        }
        return newData;
      });
    }
  }, [imageData]);

  const handleImageSelect = useCallback((word: string, imageUrl: string) => {
    setImageData((prev) => {
      const newData = new Map<string, WordImageData>(prev);
      const wordData = newData.get(word);
      if (wordData) {
        const newSelectedUrl = wordData.selectedImageUrl === imageUrl ? null : imageUrl;
        newData.set(word, { ...wordData, selectedImageUrl: newSelectedUrl });
      }
      return newData;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const selected: SavedImage[] = [];
    imageData.forEach((data: WordImageData, word: string) => {
      if (data.selectedImageUrl) {
        const filename = getSafeFilename(word, data.selectedImageUrl);
        selected.push({ word, imageUrl: data.selectedImageUrl, filename });
      }
    });

    if (selected.length > 0) {
      const zip = new JSZip();
      for (const image of selected) {
        const base64Data = image.imageUrl.split(',')[1];
        if (base64Data) {
          zip.file(image.filename, base64Data, { base64: true });
        }
      }

      try {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        const safeGradeUnit = (currentGradeUnit ?? '').trim().replace(/[^a-zA-Z0-9._-]/g, '_') || undefined;
        link.download = safeGradeUnit ? `${safeGradeUnit}_voc_raw.zip` : 'flashcard_images_legacy.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (err) {
        console.error('Error creating zip file:', err);
      }

      setSavedImages(selected);
      setAppState(AppState.Done);
    }
  }, [imageData, currentGradeUnit]);

  const handleRestart = () => {
    setAppState(AppState.Input);
    setWords([]);
    setSavedImages([]);
    setImageData(new Map<string, WordImageData>());
  };

  const hasSelection = useMemo(() => {
    for (const data of Array.from(imageData.values()) as WordImageData[]) {
      if (data.selectedImageUrl) return true;
    }
    return false;
  }, [imageData]);

  const apiKeySet = isGeminiApiKeySet();

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      {!apiKeySet && (
        <div className="w-full max-w-4xl mb-4 p-4 rounded-xl bg-neutral-800 border border-neutral-600 text-amber-200 text-sm">
          <strong>API key missing.</strong> Add <code className="bg-neutral-900 px-1 rounded">VITE_GEMINI_API_KEY</code> to a{' '}
          <code className="bg-neutral-900 px-1 rounded">.env</code> file in the <strong>project root</strong> (same folder as{' '}
          <code className="bg-neutral-900 px-1 rounded">package.json</code>), then restart the dev server.
        </div>
      )}
      {apiKeySet && (
        <p className="w-full max-w-4xl mb-2 text-neutral-500 text-xs">
          API key loaded (starts with <code className="bg-neutral-900 px-1 rounded">{getApiKeyPrefix()}…</code>). If you changed .env, restart the dev server.
        </p>
      )}
      <header className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-200/90 uppercase tracking-wide">Flashcard Images — Legacy</h1>
        <p className="mt-3 text-neutral-500 text-sm max-w-2xl mx-auto">
          Original prompt pack (five styles + composition block). Use{' '}
          <a href="/admin/flashcard-images" className="text-amber-600 hover:text-amber-400 underline">
            Flashcard Images
          </a>{' '}
          for the current generator.
        </p>
      </header>
      <main className="w-full max-w-5xl flex-grow flex flex-col items-center">
        {appState === AppState.Input && <WordInputLegacy onSubmit={handleWordsSubmit} />}
        {appState === AppState.Selecting && (
          <MultiImageSelectorLegacy
            imageData={imageData}
            words={words}
            onImageSelect={handleImageSelect}
            onRegenerate={handleRegenerateForWord}
            onSave={handleSave}
            hasSelection={hasSelection}
            onClarificationChange={handleClarificationChange}
          />
        )}
        {appState === AppState.Done && <SavedGallery images={savedImages} onRestart={handleRestart} />}
      </main>
      <footer className="w-full max-w-4xl text-center mt-12 py-6 border-t border-neutral-800 text-sm text-neutral-500">
        <p>Gemini 2.5 Flash Image · Legacy prompt templates</p>
      </footer>
    </div>
  );
}

export default FlashcardImagesLegacyApp;
