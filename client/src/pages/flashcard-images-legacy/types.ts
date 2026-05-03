/** Five styles from the original flashcard image generator (before Animation split + extended prompts). */
export enum LegacyArtStyle {
  Clipart = 'Clipart',
  Vector = 'Vector',
  Cartoon = 'Cartoon',
  Comic = 'Comic',
  Realistic = 'Realistic',
}

export interface SavedImage {
  word: string;
  imageUrl: string;
  filename: string;
}

export enum AppState {
  Input = 'INPUT',
  Selecting = 'SELECTING',
  Done = 'DONE',
}

export interface WordImageData {
  images: string[];
  loading: boolean;
  error: string | null;
  selectedImageUrl: string | null;
  clarification: string;
  style: LegacyArtStyle;
  imagesPerWord: number;
  customStylePrompts?: Partial<Record<LegacyArtStyle, string>>;
}
