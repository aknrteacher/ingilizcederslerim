import { useState, useEffect, useRef } from 'react';
import { StoryPage } from './StoryPage';
import { StoryAudioPlayer } from './StoryAudioPlayer';
import { cn } from '@/lib/utils';
import type { Story } from '@/data/stories/types';

// Speech Recognition types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface StoryReaderProps {
  story: Story;
}

export function StoryReader({ story }: StoryReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioSyncEnabledRef = useRef(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastPageDetectedRef = useRef<number | null>(null);

  // Play page turn sound effect
  const playPageTurnSound = () => {
    try {
      // Try to play a page turn sound - using flip.mp3 as it's similar to page turning
      // If the file doesn't exist, it will fail silently
      const audio = new Audio('/sounds/flip.mp3');
      audio.volume = 0.3; // Lower volume so it's not too loud
      audio.play().catch(() => {
        // Silently fail if sound can't play (e.g., file doesn't exist or autoplay blocked)
      });
    } catch (e) {
      // Silently fail if audio creation fails
    }
  };

  // Always show 2 pages side by side (book-like)
  const goToPreviousPage = () => {
    playPageTurnSound();
    setCurrentPageIndex((prev) => Math.max(0, prev - 2));
    audioSyncEnabledRef.current = false; // Disable sync when manually navigating
  };

  const goToNextPage = () => {
    playPageTurnSound();
    const maxIndex = story.pages.length - 1;
    setCurrentPageIndex((prev) => {
      const next = Math.min(maxIndex, prev + 2);
      // If we're at an odd page, show it on the left
      if (next === maxIndex && next % 2 === 0) {
        return Math.max(0, next - 1);
      }
      return next;
    });
    audioSyncEnabledRef.current = false; // Disable sync when manually navigating
  };

  // Get pages to display - always show 2 pages
  const getDisplayPages = () => {
    const pages: typeof story.pages = [];
    
    // Always show 2 pages
    if (currentPageIndex < story.pages.length) {
      pages.push(story.pages[currentPageIndex]);
    }
    
    if (currentPageIndex + 1 < story.pages.length) {
      pages.push(story.pages[currentPageIndex + 1]);
    } else {
      // If odd number of pages, show last page on left, empty on right
      // (already handled by pushing only one page)
    }
    
    return pages;
  };

  const displayPages = getDisplayPages();
  const canGoPrevious = currentPageIndex > 0;
  const canGoNext = currentPageIndex + 2 < story.pages.length;

  // Speech Recognition for "Page X" detection
  useEffect(() => {
    if (!story.audioUrl) return;

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .toLowerCase();

      // Look for "page" followed by a number
      const pageMatch = transcript.match(/page\s+(\d+)/i);
      if (pageMatch) {
        const pageNumber = parseInt(pageMatch[1], 10);
        
        // Only navigate if it's a different page and sync is enabled
        if (
          pageNumber !== lastPageDetectedRef.current &&
          pageNumber >= 1 &&
          pageNumber <= story.pages.length &&
          audioSyncEnabledRef.current
        ) {
          lastPageDetectedRef.current = pageNumber;
          
          // Convert page number (1-based) to page index (0-based)
          const targetPageIndex = pageNumber - 1;
          
          // Find the correct page pair to show (always show 2 pages)
          // If target is odd, show it on the left (with previous page on right if exists)
          // If target is even, show it on the right (with previous page on left)
          let targetIndex: number;
          if (targetPageIndex % 2 === 0) {
            // Even index (0, 2, 4...) - show on left
            targetIndex = targetPageIndex;
          } else {
            // Odd index (1, 3, 5...) - show on right, so left page is previous
            targetIndex = Math.max(0, targetPageIndex - 1);
          }

          if (targetIndex !== currentPageIndex && targetIndex >= 0 && targetIndex < story.pages.length) {
            setCurrentPageIndex(targetIndex);
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      // Restart recognition if audio sync is enabled
      if (audioSyncEnabledRef.current && story.audioUrl) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore errors when restarting
        }
      }
    };

    recognitionRef.current = recognition;

    // Start recognition
    try {
      recognition.start();
    } catch (e) {
      console.log('Could not start speech recognition:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
        recognitionRef.current = null;
      }
    };
  }, [story.audioUrl, story.pages.length, currentPageIndex]);

  // Audio synchronization - auto-advance pages based on audio timing (fallback)
  useEffect(() => {
    if (!story.audioUrl || !audioSyncEnabledRef.current) return;

    story.pages.forEach((page, index) => {
      if (page.audioStartTime !== undefined && page.audioEndTime !== undefined) {
        if (
          audioCurrentTime >= page.audioStartTime &&
          audioCurrentTime < page.audioEndTime
        ) {
          // Find the correct page pair to show (always show 2 pages)
          const targetIndex = index % 2 === 0 ? index : Math.max(0, index - 1);
          if (targetIndex !== currentPageIndex && targetIndex >= 0 && targetIndex < story.pages.length) {
            setCurrentPageIndex(targetIndex);
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioCurrentTime]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPageIndex, story.pages.length]);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      {/* Story Title */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">{story.title}</h1>
        <p className="text-muted-foreground">{story.titleTurkish}</p>
      </div>

      {/* Audio Player */}
      {story.audioUrl && (
        <div className="mb-6">
          <StoryAudioPlayer 
            audioUrl={story.audioUrl} 
            playbackRate={0.8}
            onTimeUpdate={setAudioCurrentTime}
          />
        </div>
      )}

      {/* Book Pages - Always 2 pages side by side, no gap */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-1 gap-0">
          {displayPages.map((page, displayIndex) => {
            const isLeftPage = displayIndex === 0;
            const isRightPage = displayIndex === 1;
            const actualPageIndex = currentPageIndex + displayIndex;
            
            return (
              <div
                key={page.pageNumber}
                className={cn(
                  'flex-1 bg-card border rounded-lg p-6 shadow-lg min-h-[600px]',
                  isLeftPage && 'rounded-r-none border-r-0',
                  isRightPage && 'rounded-l-none'
                )}
              >
                <StoryPage 
                  page={page} 
                  onPrevious={isLeftPage ? goToPreviousPage : undefined}
                  onNext={isRightPage ? goToNextPage : isLeftPage && !displayPages[1] ? goToNextPage : undefined}
                  canGoPrevious={isLeftPage ? canGoPrevious : false}
                  canGoNext={isRightPage || (isLeftPage && !displayPages[1]) ? canGoNext : false}
                  showNavigation={true}
                />
              </div>
            );
          })}
          
          {/* Empty right page if odd number of pages */}
          {displayPages.length === 1 && (
            <div className="flex-1 bg-card border border-l-0 rounded-lg rounded-l-none p-6 shadow-lg min-h-[600px]">
              {/* Empty page */}
            </div>
          )}
        </div>

        {/* Page Indicator */}
        <div className="flex items-center justify-center mt-6">
          <div className="text-sm text-muted-foreground">
            Page {currentPageIndex + 1} - {Math.min(currentPageIndex + displayPages.length, story.pages.length)} of {story.pages.length}
          </div>
        </div>
      </div>
    </div>
  );
}

