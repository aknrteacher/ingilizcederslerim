// Example story data structure
// This is a template - replace with actual story content

import type { Story } from './types';

export const story3: Story = {
  id: 'story3',
  title: 'The Cat and the Hat',
  titleTurkish: 'Kedi ve Şapka',
  description: 'A fun story about a cat with a special hat.',
  descriptionTurkish: 'Özel bir şapkası olan bir kedi hakkında eğlenceli bir hikaye.',
  thumbnailUrl: '/images/stories/story3/thumbnail.png',
  audioUrl: '/sounds/stories/story3.mp3',
  pages: [
    {
      pageNumber: 1,
      imageUrl: '/images/stories/story3/1.png',
      sentences: [
        {
          english: 'The cat wore a red hat.',
          turkish: 'Kedi kırmızı bir şapka taktı.',
          words: [
            { text: 'The cat', role: 'subject', turkishText: 'Kedi' },
            { text: 'wore', role: 'verb', turkishText: 'taktı' },
            { text: 'a red hat', role: 'object', turkishText: 'kırmızı bir şapka' },
          ],
        },
      ],
    },
  ],
};

