import React, { useState, useEffect } from 'react';
import { ArtStyle } from '../types';
import { generateStylePreview, getDefaultStylePrompt, getDefaultBasePrompt, isGeminiApiKeySet } from '../services/geminiService';
import SpinnerIcon from './icons/SpinnerIcon';

const GLOBAL_PROMPT_STORAGE_KEY = 'flashcard-global-base-prompt';

export type CustomStylePrompts = Partial<Record<ArtStyle, string>>;

interface WordInputProps {
  onSubmit: (words: string[], style: ArtStyle, imagesPerWord: number, customStylePrompts?: CustomStylePrompts, customBasePrompt?: string, gradeUnit?: string) => void;
}

const STYLE_IMAGE_BASE = '/images/flashcard-styles';
const styles: { id: ArtStyle; label: string; imageSrc: string }[] = [
  { id: ArtStyle.Clipart, label: 'Clipart', imageSrc: `${STYLE_IMAGE_BASE}/clipart.png` },
  { id: ArtStyle.Cartoon, label: 'Cartoon', imageSrc: `${STYLE_IMAGE_BASE}/cartoon.png` },
  { id: ArtStyle.Animation, label: 'Animation', imageSrc: `${STYLE_IMAGE_BASE}/animation.png` },
  { id: ArtStyle.Comics, label: 'Comics', imageSrc: `${STYLE_IMAGE_BASE}/comics.png` },
  { id: ArtStyle.Vector, label: 'Vector', imageSrc: `${STYLE_IMAGE_BASE}/vector.png` },
  { id: ArtStyle.Realistic, label: 'Realistic', imageSrc: `${STYLE_IMAGE_BASE}/realistic.png` },
];

const WordInput: React.FC<WordInputProps> = ({ onSubmit }) => {
  const [previewWords, setPreviewWords] = useState('');
  const [stylePreviews, setStylePreviews] = useState<Record<ArtStyle, string | null>>({
    [ArtStyle.Clipart]: null,
    [ArtStyle.Cartoon]: null,
    [ArtStyle.Animation]: null,
    [ArtStyle.Vector]: null,
    [ArtStyle.Comics]: null,
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
  const [styleImageFailed, setStyleImageFailed] = useState<Set<ArtStyle>>(new Set());
  const [customBasePrompt, setCustomBasePrompt] = useState('');
  const [editingGlobalPrompt, setEditingGlobalPrompt] = useState(false);
  const [globalPromptDraft, setGlobalPromptDraft] = useState('');
  const [gradeUnit, setGradeUnit] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GLOBAL_PROMPT_STORAGE_KEY);
      if (saved != null) setCustomBasePrompt(saved);
    } catch {
      // ignore
    }
  }, []);

  const handleGeneratePreviews = async () => {
    const wordsList = previewWords.split(/,|\n/).map(w => w.trim()).filter(Boolean);
    if (wordsList.length === 0) return;

    const sampleWord = wordsList[0];
    setPreviewError(null);
    setIsPreviewLoading(true);
    setStylePreviews({
      [ArtStyle.Clipart]: null,
      [ArtStyle.Cartoon]: null,
      [ArtStyle.Animation]: null,
      [ArtStyle.Vector]: null,
      [ArtStyle.Comics]: null,
      [ArtStyle.Realistic]: null,
    });

    try {
      const baseForPreview = customBasePrompt.trim() || undefined;
      const results = await Promise.all(
        styles.map(async ({ id }) => {
          const url = await generateStylePreview(id, sampleWord, customStylePrompts, baseForPreview);
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
      onSubmit(wordsList, selectedStyle, imagesPerWord, customStylePrompts, customBasePrompt.trim() || undefined, gradeUnit.trim() || undefined);
    }
  };

  const openGlobalPromptEditor = () => {
    setGlobalPromptDraft(customBasePrompt || getDefaultBasePrompt());
    setEditingGlobalPrompt(true);
  };

  const saveGlobalPromptEdit = () => {
    const trimmed = globalPromptDraft.trim();
    setCustomBasePrompt(trimmed);
    try {
      if (trimmed) localStorage.setItem(GLOBAL_PROMPT_STORAGE_KEY, trimmed);
      else localStorage.removeItem(GLOBAL_PROMPT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setEditingGlobalPrompt(false);
    setGlobalPromptDraft('');
  };

  const cancelGlobalPromptEdit = () => {
    setEditingGlobalPrompt(false);
    setGlobalPromptDraft('');
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
    <>
      {editingGlobalPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" onClick={cancelGlobalPromptEdit}>
          <div
            className="w-full max-w-2xl bg-neutral-900 p-6 rounded-2xl border border-neutral-700 shadow-xl space-y-4 max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Edit global base prompt</h3>
            <p className="text-neutral-400 text-sm">This prompt is used for all styles. Style-specific text is added after it.</p>
            <textarea
              value={globalPromptDraft}
              onChange={(e) => setGlobalPromptDraft(e.target.value)}
              className="w-full p-4 bg-neutral-800 border border-neutral-600 rounded-xl text-white text-sm min-h-[140px] focus:ring-2 focus:ring-neutral-500 placeholder:text-neutral-500 flex-1 resize-y"
              placeholder={getDefaultBasePrompt()}
              autoFocus
            />
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={saveGlobalPromptEdit}
                className="px-4 py-2 bg-neutral-600 text-white font-bold rounded-xl hover:bg-neutral-500"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setGlobalPromptDraft(getDefaultBasePrompt())}
                className="px-4 py-2 bg-neutral-700 text-white font-bold rounded-xl hover:bg-neutral-600"
              >
                Reset to default
              </button>
              <button
                type="button"
                onClick={cancelGlobalPromptEdit}
                className="px-4 py-2 bg-neutral-700 text-neutral-300 font-bold rounded-xl hover:bg-neutral-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-6xl space-y-10 animate-fade-in">
      <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-700">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Preview Styles</h2>
            <p className="text-neutral-400 text-sm">Enter one or more words to see a preview of each style.</p>
          </div>
          <button
            type="button"
            onClick={openGlobalPromptEditor}
            className="text-sm font-medium text-neutral-400 hover:text-white px-3 py-2 rounded-lg border border-neutral-600 hover:border-neutral-500 transition-colors"
          >
            {customBasePrompt ? 'Edit global prompt •' : 'Edit global prompt'}
          </button>
        </div>
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
            className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-xl text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
          />
          <button
            type="button"
            onClick={handleGeneratePreviews}
            disabled={!previewWords.trim() || isPreviewLoading || !isGeminiApiKeySet()}
            className="px-6 py-3 bg-neutral-600 hover:bg-neutral-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {styles.map(({ id, label, imageSrc }) => (
            <div key={id} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-square bg-neutral-800 rounded-xl border border-neutral-600 overflow-hidden flex items-center justify-center">
                {isPreviewLoading && !stylePreviews[id] ? (
                  <SpinnerIcon className="w-10 h-10 text-neutral-400 animate-spin" />
                ) : stylePreviews[id] ? (
                  <img src={stylePreviews[id]!} alt={label} className="w-full h-full object-contain p-2" />
                ) : styleImageFailed.has(id) ? (
                  <span className="text-neutral-500 text-sm text-center p-2">{label}</span>
                ) : (
                  <img
                    src={imageSrc}
                    alt={label}
                    className="w-full h-full object-contain p-2"
                    onError={() => setStyleImageFailed((prev) => new Set(prev).add(id))}
                  />
                )}
              </div>
              <span className="text-xs font-medium text-neutral-400">{label}</span>
              <button
                type="button"
                onClick={() => openPromptEditor(id)}
                className="text-[10px] font-medium text-neutral-400 hover:text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                {customStylePrompts[id] ? 'Edit prompt •' : 'Edit prompt'}
              </button>
              {editingPromptFor === id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95" onClick={cancelPromptEdit}>
                  <div
                    className="w-full max-w-lg bg-neutral-900 p-6 rounded-2xl border border-neutral-700 shadow-xl space-y-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-bold text-white">{label} — Edit style prompt</h3>
                    <textarea
                      value={editingPromptDraft}
                      onChange={(e) => setEditingPromptDraft(e.target.value)}
                      className="w-full p-4 bg-neutral-800 border border-neutral-600 rounded-xl text-white text-sm min-h-[120px] focus:ring-2 focus:ring-neutral-500 placeholder:text-neutral-500"
                      placeholder="Describe the visual style (e.g. bold outlines, flat colors, white background...)"
                      autoFocus
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={savePromptEdit}
                        className="px-4 py-2 bg-neutral-600 text-white font-bold rounded-xl hover:bg-neutral-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPromptDraft(getDefaultStylePrompt(editingPromptFor!));
                        }}
                        className="px-4 py-2 bg-neutral-700 text-white font-bold rounded-xl hover:bg-neutral-600"
                      >
                        Reset to default
                      </button>
                      <button
                        type="button"
                        onClick={cancelPromptEdit}
                        className="px-4 py-2 bg-neutral-600 text-neutral-200 font-bold rounded-xl hover:bg-neutral-500"
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

      <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-700">
        <h2 className="text-2xl font-bold text-white mb-2">Input Words</h2>
        <p className="text-neutral-400 text-sm mb-6">Choose a style and enter your vocabulary. Generate 2, 3, or 4 images per word to pick from.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-3">Grade, Unit</label>
            <input
              type="text"
              value={gradeUnit}
              onChange={(e) => setGradeUnit(e.target.value)}
              placeholder="e.g. 2.6"
              className="w-full max-w-[8rem] px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-xl text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 text-sm"
            />
            <p className="text-xs text-neutral-500 mt-1">Zip file will be named: <code className="bg-neutral-800 px-1 rounded">{gradeUnit.trim() || '2.6'}_voc_raw.zip</code></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-3">Images per word</label>
            <div className="flex gap-3 mb-6">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setImagesPerWord(n)}
                  className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${
                    imagesPerWord === n
                      ? 'border-neutral-400 bg-neutral-700 text-white'
                      : 'border-neutral-600 text-neutral-400 hover:border-neutral-500'
                  }`}
                >
                  {n} images
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-500 -mt-4 mb-4">2 = 50% fewer calls (simple words). 3 = balanced. 4 = max variety.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-3">Choose style</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all overflow-hidden ${
                    selectedStyle === style.id
                      ? 'border-neutral-400 bg-neutral-700 text-white'
                      : 'border-neutral-600 text-neutral-400 hover:border-neutral-500 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-neutral-800 mb-2 flex items-center justify-center min-h-[48px]">
                    <img src={style.imageSrc} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <span className="text-xs font-bold">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-3">Vocabulary list</label>
            <textarea
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder="Enter words (e.g. fire truck, mountain, curious monkey)..."
              className="w-full p-4 bg-neutral-800 border border-neutral-600 rounded-xl text-white placeholder:text-neutral-500 min-h-[160px] focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            />
            <p className="mt-2 text-xs text-neutral-500">Separate with commas or new lines.</p>
          </div>

          <button
            type="submit"
            disabled={!words.trim() || !isGeminiApiKeySet()}
            className="w-full py-4 bg-neutral-600 hover:bg-neutral-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Generate
          </button>
        </form>
      </div>
      </div>
    </>
  );
};

export default WordInput;
