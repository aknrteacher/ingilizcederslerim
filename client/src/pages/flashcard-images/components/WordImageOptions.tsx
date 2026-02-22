import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { WordImageData } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';
import RefreshIcon from './icons/RefreshIcon';
import CheckIcon from './icons/CheckIcon';

const MagnifyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

interface WordImageOptionsProps {
  word: string;
  data: WordImageData;
  onImageSelect: (word: string, imageUrl: string) => void;
  onRegenerate: (word: string) => void;
  onClarificationChange: (word: string, text: string) => void;
}

const ImagePlaceholder: React.FC = () => (
  <div className="aspect-square bg-neutral-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-700 animate-pulse"></div>
    <SpinnerIcon className="w-10 h-10 text-neutral-500 animate-spin relative z-10" />
  </div>
);

const WordImageOptions: React.FC<WordImageOptionsProps> = ({ word, data, onImageSelect, onRegenerate, onClarificationChange }) => {
  const { images, loading, error, selectedImageUrl, clarification, style, imagesPerWord = 3 } = data;
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    if (enlargedImage) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [enlargedImage]);

  return (
    <div className="bg-neutral-900 p-8 rounded-3xl shadow-xl border border-neutral-700 w-full animate-fade-in mb-8">
      <div className="flex flex-wrap justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
            {word.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white capitalize tracking-tight">{word}</h2>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="w-2 h-2 rounded-full bg-neutral-400 animate-pulse"></span>
               <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{style} Style</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onRegenerate(word)}
            className="flex items-center gap-2 bg-neutral-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-neutral-600 transition-all border border-neutral-600 disabled:opacity-50 active:scale-95"
            disabled={loading}
          >
            {loading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <RefreshIcon className="w-5 h-5" />}
            Refresh Variations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          <div className="p-5 bg-neutral-800 rounded-2xl border border-neutral-600">
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">
              Refine Description
            </label>
            <input
              type="text"
              value={clarification}
              onChange={(e) => onClarificationChange(word, e.target.value)}
              placeholder="e.g. 'holding a ball'..."
              className="w-full p-3 bg-neutral-800 border border-neutral-600 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 text-sm text-white placeholder:text-neutral-500"
            />
            <p className="text-[10px] text-neutral-500 mt-3 leading-relaxed">
              Updates here will apply when you click "Refresh Variations".
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded-xl text-xs font-medium leading-relaxed">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <div className="md:col-span-8 lg:col-span-9">
          <div className={`grid gap-4 md:gap-6 ${
            imagesPerWord === 2 ? 'grid-cols-2' :
            imagesPerWord === 3 ? 'grid-cols-2 sm:grid-cols-3' :
            'grid-cols-2 lg:grid-cols-4'
          }`}>
            {loading
              ? Array.from({ length: imagesPerWord }).map((_, i) => <ImagePlaceholder key={i} />)
              : images.map((src, index) => {
                  const isSelected = selectedImageUrl === src;
                  return (
                    <div
                      key={index}
                      className={`group relative flex flex-col bg-neutral-800 p-3 rounded-2xl border-4 transition-all duration-300 ${
                        isSelected
                        ? 'border-neutral-400 shadow-2xl scale-[1.03] z-10'
                        : 'border-transparent hover:border-neutral-600 hover:shadow-lg'
                      }`}
                    >
                      <div
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer flex-1 min-h-0"
                        onClick={() => onImageSelect(word, src)}
                      >
                        <img
                          src={src}
                          alt={`${word} variation ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-neutral-500 text-black rounded-full p-1.5 shadow-xl z-20">
                            <CheckIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {!isSelected && (
                          <div className="absolute inset-0 bg-neutral-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl pointer-events-none">
                            <span className="bg-neutral-800 text-white font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">Select</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEnlargedImage(src); }}
                        className="mt-2 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-white transition-colors text-xs"
                        title="Enlarge"
                      >
                        <MagnifyIcon className="w-4 h-4 shrink-0" />
                        <span>Enlarge</span>
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {enlargedImage && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => setEnlargedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image"
        >
          <button
            type="button"
            onClick={() => setEnlargedImage(null)}
            className="absolute top-4 right-4 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium"
            aria-label="Close"
          >
            Close
          </button>
          <img
            src={enlargedImage}
            alt="Enlarged view"
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default WordImageOptions;
