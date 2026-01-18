import { ColorCodedText } from './ColorCodedText';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoryPage as StoryPageType } from '@/data/stories/types';

interface StoryPageProps {
  page: StoryPageType;
  className?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  showNavigation?: boolean;
}

export function StoryPage({ 
  page, 
  className, 
  onPrevious, 
  onNext, 
  canGoPrevious = false, 
  canGoNext = false,
  showNavigation = true 
}: StoryPageProps) {
  return (
    <div className={cn('flex flex-col h-full relative', className)}>
      {/* Story Image with Navigation Overlay */}
      <div className="flex-shrink-0 mb-4 relative">
        <div className="relative">
          <img
            src={page.imageUrl}
            alt={`Page ${page.pageNumber}`}
            className="w-full h-auto rounded-lg shadow-md object-contain max-h-[400px] pointer-events-none"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          
          {/* Clickable Left Section for Previous */}
          {showNavigation && canGoPrevious && onPrevious && (
            <div
              onClick={onPrevious}
              className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer hover:bg-black/5 transition-colors"
              aria-label="Previous page"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPrevious();
                }
              }}
            />
          )}

          {/* Clickable Right Section for Next */}
          {showNavigation && canGoNext && onNext && (
            <div
              onClick={onNext}
              className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer hover:bg-black/5 transition-colors"
              aria-label="Next page"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNext();
                }
              }}
            />
          )}
        </div>
        
        {/* Page Number Overlay - Bottom Center */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-background/95 backdrop-blur-sm px-4 py-2 rounded-t-lg border-t border-x shadow-lg">
            <span className="text-sm font-semibold text-foreground">
              Page {page.pageNumber}
            </span>
          </div>
        </div>
        
        {/* Navigation Buttons Overlay - Always Visible */}
        {showNavigation && (
          <>
            {/* Left Button */}
            {canGoPrevious && onPrevious && (
              <Button
                variant="outline"
                size="icon"
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm hover:bg-background border-2 shadow-lg h-12 w-12"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-7 w-7" />
              </Button>
            )}

            {/* Right Button */}
            {canGoNext && onNext && (
              <Button
                variant="outline"
                size="icon"
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-sm hover:bg-background border-2 shadow-lg h-12 w-12"
                aria-label="Next page"
              >
                <ChevronRight className="h-7 w-7" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Sentences */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {page.sentences.map((sentence, index) => (
          <ColorCodedText key={index} sentence={sentence} />
        ))}
      </div>
    </div>
  );
}

