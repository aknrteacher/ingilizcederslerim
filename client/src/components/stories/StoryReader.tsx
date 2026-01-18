import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { StoryPage } from './StoryPage';
import { StoryAudioPlayer } from './StoryAudioPlayer';
import { ColorCodedText } from './ColorCodedText';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Story } from '@/data/stories/types';

interface StoryReaderProps {
  story: Story;
}

export function StoryReader({ story }: StoryReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioSyncEnabledRef = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Re-enable audio sync after manual navigation
  const reEnableSync = () => {
    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    // Temporarily disable sync
    audioSyncEnabledRef.current = false;
    // Re-enable sync after 2 seconds
    syncTimeoutRef.current = setTimeout(() => {
      audioSyncEnabledRef.current = true;
    }, 2000);
  };

  // Always show 2 pages side by side (book-like)
  const goToPreviousPage = () => {
    playPageTurnSound();
    setCurrentPageIndex((prev) => Math.max(0, prev - 2));
    reEnableSync(); // Temporarily disable, then re-enable after delay
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
    reEnableSync(); // Temporarily disable, then re-enable after delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

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

  // Calculate which sentence is currently being read on a page
  const getCurrentSentenceIndex = (page: typeof story.pages[0], audioTime: number): number | null => {
    if (!page.audioStartTime || !page.audioEndTime) return null;
    if (audioTime < page.audioStartTime || audioTime >= page.audioEndTime) return null;
    
    const pageDuration = page.audioEndTime - page.audioStartTime;
    const timeIntoPage = audioTime - page.audioStartTime;
    const sentenceCount = page.sentences.length;
    
    if (sentenceCount === 0) return null;
    
    // Estimate which sentence is being read by dividing page duration evenly
    const estimatedSentenceIndex = Math.floor((timeIntoPage / pageDuration) * sentenceCount);
    return Math.min(estimatedSentenceIndex, sentenceCount - 1);
  };

  // Audio synchronization - auto-advance pages based on audio timing
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
      {/* Back Button */}
      <div className="mb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/primary-school/stories">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Hikayelere Dön
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hikaye listesine geri dön</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Audio Player */}
      {story.audioUrl && (
        <div className="mb-6">
          <StoryAudioPlayer 
            audioUrl={story.audioUrl} 
            playbackRate={story.id === 'story2' ? 0.7 : 0.8}
            onTimeUpdate={setAudioCurrentTime}
          />
        </div>
      )}

      {/* Book Pages - Always 2 pages side by side, no gap */}
      <div className="flex-1 flex flex-col mb-6">
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
                  showSentences={false}
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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center mt-6">
              <div className="text-sm text-muted-foreground">
                Sayfa {currentPageIndex + 1} - {Math.min(currentPageIndex + displayPages.length, story.pages.length)} / {story.pages.length}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gösterilen sayfa numaraları</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* English Text and Translations - Below Book Pages */}
      <div className="space-y-4">
        {displayPages.map((page) => {
          const currentSentenceIndex = getCurrentSentenceIndex(page, audioCurrentTime);
          
          return (
            <div key={page.pageNumber} className="bg-card border rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Sayfa {page.pageNumber} - Metin ve Çeviriler
              </h3>
              <div className="space-y-4">
                {page.sentences.map((sentence, index) => (
                  <ColorCodedText 
                    key={index} 
                    sentence={sentence} 
                    isHighlighted={currentSentenceIndex === index}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

