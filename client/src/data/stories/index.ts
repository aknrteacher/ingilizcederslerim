import type { Story } from './types';

export const stories: Story[] = [];

export function getStoryById(id: string): Story | undefined {
  return stories.find((story) => story.id === id);
}

export type { Story, StoryPage, Sentence, WordAnnotation, GrammaticalRole } from './types';
