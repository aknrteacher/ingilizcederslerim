import React, { useState } from 'react';
import { ArtStyle } from '../types';
import { generateStylePreview, getDefaultStylePrompt, isGeminiApiKeySet } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';

export type CustomStylePrompts = Partial<Record<ArtStyle, string>>;

interface WordInputProps {
  onSubmit: (words: string[], style: ArtStyle, imagesPerWord: number, customStylePrompts?: CustomStylePrompts) => void;
}

const styles = [
  { id: ArtStyle.Clipart, icon: '🎨', label: 'Clipart' },
  { id: ArtStyle.Cartoon, icon: '🐹', label: 'Cartoon' },
  { id: ArtStyle.Comic, icon: '💥', label: 'Comic' },
  { id: ArtStyle.Realistic, icon: '📸', label: 'Realistic' },
  { id: ArtStyle.Vector, icon: '📐', label: 'Vector' },
];

const WordInput: React.FC<WordInputProps> = ({ onSubmit }) => {
  const [previewWords, setPreviewWords] = useState('');
  const [stylePreviews, setStylePreviews] = useState<Record<ArtStyle, string | null>>({
    [ArtStyle.Clipart]: null,
    [ArtStyle.Vector]: null,
    [ArtStyle.Cartoon]: null,
    [ArtStyle.Comic]: null,
    [ArtStyle.Realistic]: null,
  });
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [words, setWords] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(ArtStyle.Clipart);
  const [imagesPerWord, setImagesPerWord] = useState<number>(3);
  const [customStylePrompts, setCustomStylePrompts] = useState<CustomStylePrompts>({});
  const [editingPromptFor, setEditingPromptFor] = useState<ArtStyle | null>(null);
  const [editingPromptDraft, setEditingPromptDraft] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleGeneratePreviews = async () => {
    const wordsList = previewWords.split(/,|\n/).map(w => w.trim()).filter(Boolean);
    if (wordsList.length === 0) return;

    const sampleWord = wordsList[0];
    setPreviewError(null);
    setIsPreviewLoading(true);
    setStylePreviews({
      [ArtStyle.Clipart]: null,
      [ArtStyle.Vector]: null,
      [ArtStyle.Cartoon]: null,
      [ArtStyle.Comic]: null,
      [ArtStyle.Realistic]: null,
    });

    try {
      const results = await Promise.all(
        styles.map(async ({ id }) => {
          const url = await generateStylePreview(id, sampleWord, customStylePrompts);
          return { style: id, url };
        })
      );
      const next: Record<ArtStyle, string | null> = { ...stylePreviews };
      results.forEach(({ style, url }) => {
        next[style] = url;
      });
      setStylePreviews(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Preview failed.';
      setPreviewError(message);
      console.error(err);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wordsList = words.split(/,|\n/).map(w => w.trim()).filter(Boolean);
    if (wordsList.length > 0) {
      onSubmit(wordsList, selectedStyle, imagesPerWord, customStylePrompts);
    }
  };

  const openPromptEditor = (style: ArtStyle) => {
    setEditingPromptFor(style);
    setEditingPromptDraft(customStylePrompts[style] ?? getDefaultStylePrompt(style));
  };

  const savePromptEdit = () => {
    if (editingPromptFor !== null) {
      const trimmed = editingPromptDraft.trim();
      setCustomStylePrompts((prev) =>
        trimmed ? { ...prev, [editingPromptFor]: trimmed } : { ...prev, [editingPromptFor]: '' }
      );
      setEditingPromptFor(null);
      setEditingPromptDraft('');
    }
  };

  const cancelPromptEdit = () => {
    setEditingPromptFor(null);
    setEditingPromptDraft('');
  };

  return (
    <div className="w-full max-w-6xl space-y-10 animate-fade-in">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-600/50">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Preview Styles</h2>
        <p className="text-slate-400 text-sm mb-6">Enter one or more words to see a preview of each style.</p>
        {previewError && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {previewError}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={previewWords}
            onChange={(e) => setPreviewWords(e.target.value)}
            placeholder="e.g. apple, mountain, dog..."
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-accent focus:border-accent"
          />
          <button
            type="button"
            onClick={handleGeneratePreviews}
            disabled={!previewWords.trim() || isPreviewLoading || !isGeminiApiKeySet()}
            className="px-6 py-3 bg-accent hover:bg-secondary text-slate-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPreviewLoading ? (
              <>
                <SpinnerIcon className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Previews'
            )}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {styles.map(({ id, icon, label }) => (
            <div key={id} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-square bg-slate-800 rounded-xl border border-slate-600 overflow-hidden flex items-center justify-center">
                {isPreviewLoading && !stylePreviews[id] ? (
                  <SpinnerIcon className="w-10 h-10 text-accent animate-spin" />
                ) : stylePreviews[id] ? (
                  <img src={stylePreviews[id]!} alt={label} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-4xl text-slate-500">{icon}</span>
                )}
              </div>
              <span className="text-xs font-medium text-slate-400">{label}</span>
              <button
                type="button"
                onClick={() => openPromptEditor(id)}
                className="text-[10px] font-medium text-accent hover:text-primary px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                {customStylePrompts[id] ? 'Edit prompt •' : 'Edit prompt'}
              </button>
              {editingPromptFor === id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95" onClick={cancelPromptEdit}>
                  <div
                    className="w-full max-w-lg bg-slate-800 p-6 rounded-2xl border border-slate-600 shadow-xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-slate-100">{label} — Edit style prompt</h3>
                    <textarea
                      value={editingPromptDraft}
                      onChange={(e) => setEditingPromptDraft(e.target.value)}
                      className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-sm min-h-[120px] focus:ring-2 focus:ring-accent placeholder:text-slate-500"
                      placeholder="Describe the visual style (e.g. bold outlines, flat colors, white background...)"
                      autoFocus
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={savePromptEdit}
                        className="px-4 py-2 bg-accent text-slate-900 font-bold rounded-xl hover:bg-secondary"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPromptDraft(getDefaultStylePrompt(editingPromptFor!));
                        }}
                        className="px-4 py-2 bg-slate-700 text-slate-200 font-bold rounded-xl hover:bg-slate-600"
                      >
                        Reset to default
                      </button>
                      <button
                        type="button"
                        onClick={cancelPromptEdit}
                        className="px-4 py-2 bg-slate-600 text-slate-200 font-bold rounded-xl hover:bg-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-600/50">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Input Words</h2>
        <p className="text-slate-400 text-sm mb-6">Choose a style and enter your vocabulary. Generate 2, 3, or 4 images per word to pick from.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Images per word</label>
            <div className="flex gap-3 mb-6">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setImagesPerWord(n)}
                  className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${
                    imagesPerWord === n
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {n} images
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 -mt-4 mb-4">2 = 50% fewer calls (simple words). 3 = balanced. 4 = max variety.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Choose style</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedStyle === style.id
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-2xl mb-1">{style.icon}</span>
                  <span className="text-xs font-bold">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">Vocabulary list</label>
            <textarea
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder="Enter words (e.g. fire truck, mountain, curious monkey)..."
              className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder:text-slate-500 min-h-[160px] focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <p className="mt-2 text-xs text-slate-500">Separate with commas or new lines.</p>
          </div>

          <button
            type="submit"
            disabled={!words.trim() || !isGeminiApiKeySet()}
            className="w-full py-4 bg-accent hover:bg-secondary text-slate-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  );
};

export default WordInput;
