# LinguaLearn - English Learning Platform

## Overview

LinguaLearn is an interactive English learning platform designed for Turkish-speaking students across multiple educational levels (pre-school through business English). The application provides vocabulary flashcards, educational games (matching, crossword, spell quest, word pop), and structured learning paths organized by grade level and thematic units.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for theme management
- **Styling**: Tailwind CSS v4 with CSS variables for theming, custom CSS modules for game components
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for game animations, canvas-confetti for celebration effects

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Development**: tsx for TypeScript execution, Vite dev server with HMR
- **Production**: esbuild bundles server code, Vite builds client assets

### Project Structure
```
client/src/
├── components/     # Reusable UI components (Layout, Sidebar, Header)
├── pages/          # Route pages (vocabulary cards, games)
├── styles/         # CSS modules for specific games
├── context/        # React Context providers (ThemeContext)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and query client

server/
├── index.ts        # Express server entry point
├── routes.ts       # API route registration
├── storage.ts      # Data storage interface (currently in-memory)
├── static.ts       # Static file serving for production
├── vite.ts         # Vite dev server integration

shared/
└── schema.ts       # Drizzle ORM schema and Zod validation
```

### Content Organization
Educational content follows a hierarchical structure:
- **Level** (pre-school, primary-school, etc.)
- **Grade** (grade-2, grade-3, etc.)
- **Theme/Unit** (theme-1, unit-1, etc.)
- **Activity Type** (vocab, matching-game, crossword, spell-quest, word-pop)

### Theming System
Dynamic theme switching based on URL path with level-specific color schemes:
- Pre-school: Amber/yellow tones
- Primary school: Blue tones
- Secondary/high school: Orange/green tones

## External Dependencies

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Driver**: @neondatabase/serverless for Neon PostgreSQL
- **Current State**: Schema defined but storage uses in-memory implementation; database integration ready when DATABASE_URL is provided

### Third-Party Services
- **Fonts**: Google Fonts (Inter, Libre Baskerville)
- **Confetti**: canvas-confetti library for celebration animations

### Key NPM Dependencies
- React ecosystem: react, react-dom, wouter, @tanstack/react-query
- UI: @radix-ui components, shadcn/ui, lucide-react icons
- Styling: tailwindcss, class-variance-authority, clsx
- Animation: framer-motion, canvas-confetti
- Server: express, drizzle-orm, zod
- Build: vite, esbuild, tsx

### Static Assets
- Vocabulary images stored in `/client/public/images/` organized by topic
- Sound effects in `/client/public/sounds/` for game feedback
- Hatchling character images for game rewards