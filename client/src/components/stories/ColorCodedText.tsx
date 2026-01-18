import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Sentence, GrammaticalRole, WordAnnotation } from '@/data/stories/types';

interface ColorCodedTextProps {
  sentence: Sentence;
  className?: string;
}

const roleColors: Record<GrammaticalRole, { english: string; turkish: string }> = {
  subject: { english: 'text-red-500', turkish: 'text-red-500' },
  object: { english: 'text-green-500', turkish: 'text-green-500' },
  time: { english: 'text-blue-500', turkish: 'text-blue-500' },
  verb: { english: 'text-orange-500', turkish: 'text-orange-500' },
  adjective: { english: 'text-purple-500', turkish: 'text-purple-500' },
  other: { english: 'text-foreground', turkish: 'text-foreground' },
};

// Helper function to render colored text based on annotations
function renderColoredText(
  text: string,
  words: Sentence['words'],
  isEnglish: boolean
): React.ReactNode[] {
  if (words.length === 0) {
    return [<span key="full">{text}</span>];
  }

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  // Create a list of matches with their positions
  const matches: Array<{ word: WordAnnotation; index: number; length: number }> = [];

  words.forEach((word) => {
    const searchText = isEnglish ? word.text : word.turkishText;
    const index = text.toLowerCase().indexOf(searchText.toLowerCase());
    if (index !== -1) {
      matches.push({
        word,
        index,
        length: searchText.length,
      });
    }
  });

  // Sort matches by position
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches (keep the first one)
  const nonOverlappingMatches: typeof matches = [];
  matches.forEach((match) => {
    const overlaps = nonOverlappingMatches.some(
      (existing) =>
        (match.index >= existing.index &&
          match.index < existing.index + existing.length) ||
        (existing.index >= match.index &&
          existing.index < match.index + match.length)
    );
    if (!overlaps) {
      nonOverlappingMatches.push(match);
    }
  });

  // Render text with colored segments
  nonOverlappingMatches.forEach((match, matchIndex) => {
    // Add text before the match
    if (match.index > lastIndex) {
      elements.push(
        <span key={`before-${matchIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add the colored match
    const role = match.word.role;
    const colorClass = isEnglish
      ? roleColors[role].english
      : roleColors[role].turkish;

    elements.push(
      <span
        key={`word-${matchIndex}`}
        className={cn('font-semibold', colorClass)}
      >
        {text.substring(match.index, match.index + match.length)}
      </span>
    );

    lastIndex = match.index + match.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(<span key="after">{text.substring(lastIndex)}</span>);
  }

  return elements.length > 0 ? elements : [<span key="full">{text}</span>];
}

export function ColorCodedText({ sentence, className }: ColorCodedTextProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  const handleClick = () => {
    setShowTranslation(!showTranslation);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* English sentence - clickable */}
      <div
        onClick={handleClick}
        className="cursor-pointer hover:bg-accent/50 rounded-lg p-3 transition-colors"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <p className="text-lg leading-relaxed">
          {renderColoredText(sentence.english, sentence.words, true)}
        </p>
      </div>

      {/* Turkish translation - revealed on click */}
      {showTranslation && (
        <div
          className="bg-muted/50 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <p className="text-lg leading-relaxed text-muted-foreground">
            {renderColoredText(sentence.turkish, sentence.words, false)}
          </p>
        </div>
      )}
    </div>
  );
}

