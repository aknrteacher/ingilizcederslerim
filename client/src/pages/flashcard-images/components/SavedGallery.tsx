import React, { useState, useCallback } from 'react';
import type { SavedImage } from '../types';

interface SavedGalleryProps {
  images: SavedImage[];
  onRestart: () => void;
}

const SavedGallery: React.FC<SavedGalleryProps> = ({ images, onRestart }) => {
  const [copied, setCopied] = useState(false);

  const imageListString = images.map(img => `'${img.filename}'`).join(',');

  const handleCopy = useCallback(() => {
    if (imageListString) {
      navigator.clipboard.writeText(imageListString).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }, [imageListString]);

  return (
    <div className="w-full max-w-5xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Download Started!</h2>
        <p className="text-neutral-400 mt-2">Your selected images have been zipped and saved to your computer. Here's a recap of your gallery.</p>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold text-center text-neutral-300 mb-2">HTML Image List</h3>
        <p className="text-center text-neutral-500 mb-4">Copy this list to use in your code.</p>
        <div className="flex justify-center items-center gap-2 max-w-3xl mx-auto">
          <code className="bg-neutral-900 p-3 rounded-lg text-neutral-200 border border-neutral-600 w-full overflow-x-auto whitespace-nowrap">
            {imageListString}
          </code>
          <button
            onClick={handleCopy}
            className={`font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base flex-shrink-0 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-neutral-600 text-white hover:bg-neutral-500'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 p-6 md:p-8 rounded-xl shadow-lg border border-neutral-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {images.map(({ word, imageUrl, filename }) => (
            <div key={word} className="flex flex-col items-center gap-2 group">
              <div className="aspect-square w-full bg-neutral-800 p-2 rounded-lg border border-neutral-600 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Selected image for ${word}`}
                  className="w-full h-full object-contain rounded-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="font-semibold text-neutral-300 capitalize text-center" title={filename}>{word}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="bg-neutral-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-neutral-500 transition-colors duration-300 text-lg"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default SavedGallery;
