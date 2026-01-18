// Export all stories
import { story1 } from './story1';
import { story2 } from './story2';
import { story3 } from './story3';
import type { Story } from './types';

export const stories: Story[] = [story1, story2, story3];

export function getStoryById(id: string): Story | undefined {
  return stories.find((story) => story.id === id);
}

export { story1, story2, story3 };
export type { Story, StoryPage, Sentence, WordAnnotation, GrammaticalRole } from './types';

