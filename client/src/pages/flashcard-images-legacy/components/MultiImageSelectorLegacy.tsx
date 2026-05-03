import React from 'react';
import type { WordImageData } from '../types';
import WordImageOptionsLegacy from './WordImageOptionsLegacy';

interface MultiImageSelectorLegacyProps {
  words: string[];
  imageData: Map<string, WordImageData>;
  onImageSelect: (word: string, imageUrl: string) => void;
  onRegenerate: (word: string) => void;
  onSave: () => void;
  hasSelection: boolean;
  onClarificationChange: (word: string, text: string) => void;
}

const MultiImageSelectorLegacy: React.FC<MultiImageSelectorLegacyProps> = ({
  words,
  imageData,
  onImageSelect,
  onRegenerate,
  onSave,
  hasSelection,
  onClarificationChange,
}) => {
  return (
    <div className="w-full max-w-5xl animate-fade-in flex flex-col gap-8">
      {words.map((word) => {
        const data = imageData.get(word);
        if (!data) return null;
        return (
          <WordImageOptionsLegacy
            key={word}
            word={word}
            data={data}
            onImageSelect={onImageSelect}
            onRegenerate={onRegenerate}
            onClarificationChange={onClarificationChange}
          />
        );
      })}
      {words.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onSave}
            disabled={!hasSelection}
            className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 px-12 rounded-xl transition-colors duration-300 disabled:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 text-xl shadow-lg border border-amber-900/50"
          >
            Download Selected Images
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiImageSelectorLegacy;
