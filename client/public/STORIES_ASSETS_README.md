# Stories Assets Structure

This document describes the file structure for story assets (images and audio files).

## Directory Structure

```
public/
├── images/
│   └── stories/
│       ├── story1/
│       │   ├── thumbnail.png          # Story thumbnail (for menu/landing page)
│       │   ├── book 1-01.png          # Page 1 illustration
│       │   ├── book 1-02.png          # Page 2 illustration
│       │   └── ...                    # Additional pages (book 1-03.png, book 1-04.png, etc.)
│       ├── story2/
│       │   ├── thumbnail.png
│       │   ├── page1.png
│       │   └── ...
│       └── story3/
│           ├── thumbnail.png
│           ├── page1.png
│           └── ...
└── sounds/
    └── stories/
        ├── story1.mp3                 # Full story audio
        ├── story2.mp3
        └── story3.mp3
```

## File Naming Conventions

### Images
- **Thumbnails**: `thumbnail.png` - Used in story cards and menus
- **Page Images**: `book 1-01.png`, `book 1-02.png`, `book 1-03.png`, etc. - Story page illustrations (format: `book [number]-[page number].png`)
- **Format**: PNG, JPG, or WebP are all supported
- **Recommended Size**: 
  - Thumbnails: 400x300px or 16:9 aspect ratio
  - Page images: 800x600px or similar, maintain aspect ratio

### Audio Files
- **Format**: MP3 (required)
- **Naming**: `story1.mp3`, `story2.mp3`, etc.
- **Quality**: 128kbps or higher recommended for good quality

## Adding New Stories

1. Create a new directory under `public/images/stories/` (e.g., `story4/`)
2. Add thumbnail and page images following the naming convention
3. Add audio file to `public/sounds/stories/` (e.g., `story4.mp3`)
4. Create a new story data file in `client/src/data/stories/story4.ts`
5. Update `client/src/data/stories/index.ts` to export the new story

## Image Paths in Story Data

When creating story data files, use these path patterns:

```typescript
{
  thumbnailUrl: '/images/stories/story1/thumbnail.png',
  pages: [
    {
      imageUrl: '/images/stories/story1/book 1-01.png',
      // ...
    }
  ],
  audioUrl: '/sounds/stories/story1.mp3'
}
```

## Notes

- All paths are relative to the `public/` directory
- Images will be automatically optimized by Vite during build
- Audio files should be optimized for web (compressed but good quality)
- Missing images will gracefully hide (no broken image icons)
- Missing audio will simply not show the audio player

