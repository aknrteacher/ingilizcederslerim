// Example story data structure
// This is a template - replace with actual story content

import type { Story } from './types';

export const story2: Story = {
  id: 'story2',
  title: 'The Three Little Pigs',
  titleTurkish: 'Üç Küçük Domuz',
  description: 'A classic tale about three pigs and a wolf.',
  descriptionTurkish: 'Üç domuz ve bir kurt hakkında klasik bir hikaye.',
  thumbnailUrl: '/images/stories/story2/thumbnail.png',
  audioUrl: '/sounds/stories/story2.mp3',
  pages: [
    {
      pageNumber: 1,
      imageUrl: '/images/stories/story2/1.png',
      sentences: [
        {
          english: 'There were three little pigs.',
          turkish: 'Üç küçük domuz vardı.',
          words: [
            { text: 'There were', role: 'verb', turkishText: 'vardı' },
            { text: 'three little pigs', role: 'subject', turkishText: 'üç küçük domuz' },
          ],
        },
      ],
    },
  ],
};

