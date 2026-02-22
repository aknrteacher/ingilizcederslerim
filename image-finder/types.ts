
export enum ArtStyle {
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
  style: ArtStyle;
  imagesPerWord: number;
  customStylePrompts?: Partial<Record<ArtStyle, string>>;
}
