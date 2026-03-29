// Content types that can exist for each theme/topic
export type ContentType = 'vocab' | 'matching' | 'crossword' | 'spell-quest' | 'word-pop' | 'catch-that' | 'i-spy' | 'sound-match' | 'memory-flip' | 'word-race' | 'word-snake' | 'stories' | 'songs' | 'exercises' | 'worksheets' | 'crafts';

export interface ContentItem {
  type: ContentType;
  count: number; // 0 = not done (red), 1+ = done (green boxes)
  path?: string;
}

export interface Theme {
  id: string;
  name: string;
  content: ContentItem[];
}

export interface Grade {
  id: string;
  name: string;
  themes: Theme[];
}

export interface Level {
  id: string;
  name: string;
  grades: Grade[];
}

export interface LandingPage {
  id: string;
  /** Human-friendly label for the landing page */
  name: string;
  /** Route path, e.g. "/primary-school" */
  path: string;
  /**
   * Whether this landing page currently exists in the app.
   * Set to false for planned pages so the workflow can show them as missing.
   */
  exists: boolean;
}

// Define what content types are expected for each level
export const preschoolContentTypes: ContentType[] = ['vocab', 'matching', 'crossword', 'spell-quest', 'word-pop', 'catch-that', 'songs'];
export const primaryContentTypes: ContentType[] = ['vocab', 'matching', 'crossword', 'spell-quest', 'word-pop', 'catch-that', 'sound-match', 'memory-flip', 'word-race', 'word-snake', 'stories', 'songs', 'exercises', 'worksheets'];

// High-level landing pages (home + level landings)
// Update this list when you add/remove major landing routes in App.tsx
export const landingPages: LandingPage[] = [
  {
    id: 'home',
    name: 'Main Landing',
    path: '/',
    exists: true,
  },
  {
    id: 'preschool',
    name: 'Pre-school Landing',
    path: '/pre-school',
    exists: true,
  },
  {
    id: 'primary',
    name: 'Primary School Landing',
    path: '/primary-school',
    exists: true,
  },
  {
    id: 'secondary',
    name: 'Secondary School Landing',
    path: '/secondary-school',
    exists: true,
  },
  {
    id: 'highschool',
    name: 'High School Landing',
    path: '/high-school',
    exists: true,
  },
  {
    id: 'university',
    name: 'University Landing',
    path: '/university',
    exists: true,
  },
  {
    id: 'business',
    name: 'Business English Landing',
    path: '/business-english',
    exists: true,
  },
];

export const workflowData: Level[] = [
  {
    id: 'preschool',
    name: 'PRE-SCHOOL',
    grades: [
      {
        id: 'preschool-topics',
        name: 'TOPICS',
        themes: [
          {
            id: 'alphabet',
            name: 'Alphabet',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'numbers',
            name: 'Numbers',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'colours',
            name: 'Colours',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'greetings',
            name: 'Greetings',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'actions',
            name: 'Actions',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'ourbody',
            name: 'Our Body',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'ourclassroom',
            name: 'Our Classroom',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'things',
            name: 'Things',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'people',
            name: 'People',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'animals',
            name: 'Animals',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'aroundus',
            name: 'Around Us',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
          {
            id: 'food',
            name: 'Food',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'crafts', count: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'primary',
    name: 'PRIMARY SCHOOL',
    grades: [
      {
        id: 'grade2',
        name: 'GRADE 2',
        themes: [
          {
            id: 'theme1',
            name: 'Theme 1: School Life',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 2 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 1 },
            ],
          },
          {
            id: 'theme2',
            name: 'Theme 2: Classroom Life',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'theme3',
            name: 'Theme 3: Personal Life',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'theme4',
            name: 'Theme 4: Family Life',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'theme5',
            name: 'Theme 5: Homes, Houses, Neighbourhoods',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'theme6',
            name: 'Theme 6: Life in the City and the World',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade3',
        name: 'GRADE 3',
        themes: [
          {
            id: 'g3-theme1',
            name: 'Unit 1: Greeting',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme2',
            name: 'Unit 2: My Family',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme3',
            name: 'Unit 3: People I Love',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme4',
            name: 'Unit 4: Feelings',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme6',
            name: 'Unit 6: My House',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme7',
            name: 'Unit 7: In My City',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme8',
            name: 'Unit 8: Transportation',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme9',
            name: 'Unit 9: Weather',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g3-theme10',
            name: 'Unit 10: Nature',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 1 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade4',
        name: 'GRADE 4',
        themes: [
          {
            id: 'g4-theme1',
            name: 'Unit 1: Classroom Rules',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 0 },
              { type: 'word-race', count: 0 },
              { type: 'word-snake', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme2',
            name: 'Unit 2: Nationality',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 0 },
              { type: 'word-race', count: 0 },
              { type: 'word-snake', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme3',
            name: 'Unit 3: Cartoon Characters',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 0 },
              { type: 'word-race', count: 0 },
              { type: 'word-snake', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme4',
            name: 'Unit 4: Free Time',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 0 },
              { type: 'word-race', count: 0 },
              { type: 'word-snake', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme5',
            name: 'Unit 5: My Day',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 0 },
              { type: 'word-race', count: 0 },
              { type: 'word-snake', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme6',
            name: 'Unit 6: Fun with Science',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme7',
            name: 'Unit 7: Jobs',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme8',
            name: 'Unit 8: My Clothes',
            content: [
              { type: 'vocab', count: 1 },
              { type: 'matching', count: 1 },
              { type: 'crossword', count: 1 },
              { type: 'spell-quest', count: 1 },
              { type: 'word-pop', count: 1 },
              { type: 'catch-that', count: 1 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 1 },
              { type: 'word-race', count: 1 },
              { type: 'word-snake', count: 1 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme9',
            name: 'Unit 9: My Friends',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 0 },
              { type: 'word-race', count: 0 },
              { type: 'word-snake', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
          {
            id: 'g4-theme10',
            name: 'Unit 10: Food and Drinks',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'sound-match', count: 0 },
              { type: 'memory-flip', count: 0 },
              { type: 'word-race', count: 0 },
              { type: 'word-snake', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'secondary',
    name: 'SECONDARY SCHOOL',
    grades: [
      {
        id: 'grade5',
        name: 'GRADE 5',
        themes: [
          {
            id: 'g5-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade6',
        name: 'GRADE 6',
        themes: [
          {
            id: 'g6-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade7',
        name: 'GRADE 7',
        themes: [
          {
            id: 'g7-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade8',
        name: 'GRADE 8',
        themes: [
          {
            id: 'g8-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'highschool',
    name: 'HIGH SCHOOL',
    grades: [
      {
        id: 'grade9',
        name: 'GRADE 9',
        themes: [
          {
            id: 'g9-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade10',
        name: 'GRADE 10',
        themes: [
          {
            id: 'g10-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade11',
        name: 'GRADE 11',
        themes: [
          {
            id: 'g11-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
      {
        id: 'grade12',
        name: 'GRADE 12',
        themes: [
          {
            id: 'g12-theme1',
            name: 'Theme 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'university',
    name: 'UNIVERSITY',
    grades: [
      {
        id: 'uni-general',
        name: 'GENERAL ENGLISH',
        themes: [
          {
            id: 'uni-general-1',
            name: 'Unit 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'business',
    name: 'BUSINESS ENGLISH',
    grades: [
      {
        id: 'business-general',
        name: 'GENERAL',
        themes: [
          {
            id: 'business-1',
            name: 'Unit 1',
            content: [
              { type: 'vocab', count: 0 },
              { type: 'matching', count: 0 },
              { type: 'crossword', count: 0 },
              { type: 'spell-quest', count: 0 },
              { type: 'word-pop', count: 0 },
              { type: 'catch-that', count: 0 },
              { type: 'songs', count: 0 },
              { type: 'stories', count: 0 },
              { type: 'exercises', count: 0 },
              { type: 'worksheets', count: 0 },
            ],
          },
        ],
      },
    ],
  },
];

// Helper to get content label
export const contentLabels: Record<ContentType, string> = {
  'vocab': 'VOC',
  'matching': 'MAT',
  'crossword': 'CRO',
  'spell-quest': 'SPE',
  'word-pop': 'POP',
  'catch-that': 'CAT',
  'i-spy': 'SPY',
  'sound-match': 'SND',
  'memory-flip': 'MEM',
  'word-race': 'RAC',
  'word-snake': 'SNA',
  'stories': 'STR',
  'songs': 'SNG',
  'exercises': 'EXE',
  'worksheets': 'WRK',
  'crafts': 'CRF',
};

// Game content types (for grouping)
export const gameContentTypes: ContentType[] = [
  'matching', 'crossword', 'spell-quest', 'word-pop', 'catch-that', 'i-spy',
  'sound-match', 'memory-flip', 'word-race', 'word-snake'
];

// Non-game content types
export const nonGameContentTypes: ContentType[] = ['vocab', 'songs', 'stories', 'exercises', 'worksheets', 'crafts'];

// Calculate statistics (games counted as 1 item)
export function getWorkflowStats() {
  let totalContent = 0;
  let completedContent = 0;

  workflowData.forEach(level => {
    level.grades.forEach(grade => {
      grade.themes.forEach(theme => {
        // Separate games from non-games
        const games = theme.content.filter(c => gameContentTypes.includes(c.type));
        const nonGames = theme.content.filter(c => !gameContentTypes.includes(c.type));
        
        // Count games as 1 item if any game types exist
        if (games.length > 0) {
          totalContent++;
          const gamesCompleted = games.reduce((sum, g) => sum + g.count, 0);
          if (gamesCompleted > 0) completedContent++;
        }
        
        // Count non-games individually
        nonGames.forEach(item => {
          totalContent++;
          if (item.count > 0) completedContent++;
        });
      });
    });
  });

  return { totalContent, completedContent, percentage: Math.round((completedContent / totalContent) * 100) };
}
