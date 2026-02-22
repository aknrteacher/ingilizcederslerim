import React from 'react';
import type { WordImageData } from '../types';
import WordImageOptions from './WordImageOptions';

interface MultiImageSelectorProps {
  words: string[];
  imageData: Map<string, WordImageData>;
  onImageSelect: (word: string, imageUrl: string) => void;
  onRegenerate: (word: string) => void;
  onSave: () => void;
  hasSelection: boolean;
  onClarificationChange: (word: string, text: string) => void;
}

const MultiImageSelector: React.FC<MultiImageSelectorProps> = ({
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
      {words.map(word => {
        const data = imageData.get(word);
        if (!data) return null;
        return (
          <WordImageOptions
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
            className="bg-accent text-slate-900 font-bold py-3 px-12 rounded-xl hover:bg-secondary transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed text-xl shadow-lg"
          >
            Download Selected Images
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiImageSelector;
