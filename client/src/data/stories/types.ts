// Story data types and interfaces

export type GrammaticalRole = 'subject' | 'object' | 'time' | 'verb' | 'adjective' | 'other';

export interface WordAnnotation {
  text: string;
  role: GrammaticalRole;
  turkishText: string; // Corresponding Turkish word/phrase
}

export interface Sentence {
  english: string;
  turkish: string;
  words: WordAnnotation[]; // For color coding
}

export interface StoryPage {
  pageNumber: number;
  imageUrl: string;
  sentences: Sentence[];
  audioUrl?: string; // Optional per-page audio
  audioStartTime?: number; // Start time in seconds for full audio sync (optional)
  audioEndTime?: number; // End time in seconds for full audio sync (optional)
}

export interface Story {
  id: string;
  title: string;
  titleTurkish: string;
  description?: string;
  descriptionTurkish?: string;
  thumbnailUrl: string;
  pages: StoryPage[];
  audioUrl?: string; // Full story audio
}

