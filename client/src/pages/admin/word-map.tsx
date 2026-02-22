import { useState, useMemo } from 'react';
import { NoIndex } from '@/components/NoIndex';
import { Link } from 'wouter';
import { wordMapData, getTotalWordCount, getUniqueWords } from '@/data/wordMap';

type WordStatus = 'unique' | 'same-grade' | 'same-level' | 'different-level';

interface WordOccurrence {
  levelId: string;
  levelName: string;
  gradeId: string;
  gradeName: string;
  themeId: string;
  themeName: string;
  themeIndex: number;
}

interface ThemeStats {
  total: number;
  unique: number;
  sameGrade: number;
  sameLevel: number;
  differentLevel: number;
}

export default function WordMapPage() {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());
  const [expandedStats, setExpandedStats] = useState<Set<string>>(new Set());
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    window.location.href = '/';
  };

  const { wordAllOccurrences, themeIndexMap, levelStats, gradeStats, themeStats } = useMemo(() => {
    const allOccurrences = new Map<string, WordOccurrence[]>();
    const themeIndices = new Map<string, number>();
    const levelStatsMap = new Map<string, { total: number; unique: Set<string> }>();
    const gradeStatsMap = new Map<string, { total: number; unique: Set<string> }>();
    const themeStatsMap = new Map<string, ThemeStats>();
    let themeIndex = 0;

    wordMapData.forEach((level) => {
      levelStatsMap.set(level.id, { total: 0, unique: new Set() });
      
      level.grades.forEach((grade) => {
        gradeStatsMap.set(grade.id, { total: 0, unique: new Set() });
        
        grade.themes.forEach((theme) => {
          themeIndices.set(theme.id, themeIndex);
          
          theme.words.forEach((word) => {
            const wordLower = word.word.toLowerCase();
            
            if (!allOccurrences.has(wordLower)) {
              allOccurrences.set(wordLower, []);
            }
            allOccurrences.get(wordLower)!.push({
              levelId: level.id,
              levelName: level.name,
              gradeId: grade.id,
              gradeName: grade.name,
              themeId: theme.id,
              themeName: theme.name,
              themeIndex,
            });

            const levelStat = levelStatsMap.get(level.id)!;
            levelStat.total++;
            levelStat.unique.add(wordLower);

            const gradeStat = gradeStatsMap.get(grade.id)!;
            gradeStat.total++;
            gradeStat.unique.add(wordLower);
          });
          themeIndex++;
        });
      });
    });

    wordMapData.forEach((level) => {
      level.grades.forEach((grade) => {
        grade.themes.forEach((theme) => {
          const currentThemeIndex = themeIndices.get(theme.id) ?? 0;
          const stats: ThemeStats = {
            total: theme.words.length,
            unique: 0,
            sameGrade: 0,
            sameLevel: 0,
            differentLevel: 0,
          };

          theme.words.forEach((word) => {
            const wordLower = word.word.toLowerCase();
            const occurrences = allOccurrences.get(wordLower) || [];
            const previousOccurrences = occurrences.filter(occ => occ.themeIndex < currentThemeIndex);

            if (previousOccurrences.length === 0) {
              stats.unique++;
            } else {
              // Priority rule: same-grade (GREEN) > same-level (YELLOW) > different-level (BLUE)
              // Check if word appears in same grade (highest priority)
              const hasSameGrade = previousOccurrences.some(occ => occ.gradeId === grade.id);
              if (hasSameGrade) {
                stats.sameGrade++;
              } else {
                // Check if word appears in same level but different grade
                const hasSameLevel = previousOccurrences.some(occ => occ.levelId === level.id && occ.gradeId !== grade.id);
                if (hasSameLevel) {
                  stats.sameLevel++;
                } else {
                  // Otherwise it's in a different level
                  stats.differentLevel++;
                }
              }
            }
          });

          themeStatsMap.set(theme.id, stats);
        });
      });
    });

    return { 
      wordAllOccurrences: allOccurrences, 
      themeIndexMap: themeIndices,
      levelStats: levelStatsMap,
      gradeStats: gradeStatsMap,
      themeStats: themeStatsMap,
    };
  }, []);

  const getWordInfo = (
    wordText: string,
    currentLevelId: string,
    currentGradeId: string,
    currentThemeId: string
  ): { status: WordStatus; previousOccurrences: WordOccurrence[] } => {
    const wordLower = wordText.toLowerCase();
    const allOccurrences = wordAllOccurrences.get(wordLower) || [];
    const currentThemeIndex = themeIndexMap.get(currentThemeId) ?? 0;

    const previousOccurrences = allOccurrences.filter(
      occ => occ.themeIndex < currentThemeIndex
    );

    if (previousOccurrences.length === 0) {
      return { status: 'unique', previousOccurrences: [] };
    }

    // Priority rule: Check all previous occurrences and find the highest priority match
    // Priority order: same-grade (GREEN) > same-level (YELLOW) > different-level (BLUE)
    
    // Check if word appears in same grade (highest priority - GREEN)
    const sameGradeOccurrences = previousOccurrences.filter(
      occ => occ.gradeId === currentGradeId
    );
    if (sameGradeOccurrences.length > 0) {
      return { status: 'same-grade', previousOccurrences: sameGradeOccurrences };
    }

    // Check if word appears in same level but different grade (YELLOW)
    const sameLevelOccurrences = previousOccurrences.filter(
      occ => occ.levelId === currentLevelId && occ.gradeId !== currentGradeId
    );
    if (sameLevelOccurrences.length > 0) {
      return { status: 'same-level', previousOccurrences: sameLevelOccurrences };
    }

    // Otherwise it's in a different level (BLUE)
    return { status: 'different-level', previousOccurrences };
  };

  const handleCopyWord = async (word: string, occurrences: WordOccurrence[]) => {
    const locations = occurrences.map(occ => 
      `${occ.levelName} > ${occ.gradeName} > ${occ.themeName}`
    );
    const text = occurrences.length > 0 
      ? `"${word}" previously in:\n${locations.join('\n')}`
      : `"${word}" - First occurrence`;
    await navigator.clipboard.writeText(text);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const toggleStats = (themeId: string) => {
    const newSet = new Set(expandedStats);
    newSet.has(themeId) ? newSet.delete(themeId) : newSet.add(themeId);
    setExpandedStats(newSet);
  };

  const toggleNotes = (themeId: string) => {
    const newSet = new Set(expandedNotes);
    newSet.has(themeId) ? newSet.delete(themeId) : newSet.add(themeId);
    setExpandedNotes(newSet);
  };

  const StatusBox = ({ 
    status, 
    word, 
    occurrences 
  }: { 
    status: WordStatus; 
    word: string;
    occurrences: WordOccurrence[];
  }) => {
    const tooltipText = occurrences.length > 0 
      ? occurrences.map(occ => `${occ.levelName} > ${occ.gradeName} > ${occ.themeName}`).join('\n')
      : 'First occurrence';

    const baseClasses = "inline-flex items-center justify-center w-2.5 h-2.5 rounded-sm mr-1.5 flex-shrink-0 cursor-pointer transition-transform hover:scale-125";
    
    if (status === 'unique') {
      return <span className={`${baseClasses} border border-neutral-700`} title="First occurrence" />;
    }
    if (status === 'different-level') {
      return (
        <span 
          className={`${baseClasses} bg-blue-500`}
          title={tooltipText}
          onClick={() => handleCopyWord(word, occurrences)}
        />
      );
    }
    if (status === 'same-level') {
      return (
        <span 
          className={`${baseClasses} bg-yellow-500`}
          title={tooltipText}
          onClick={() => handleCopyWord(word, occurrences)}
        />
      );
    }
    if (status === 'same-grade') {
      return (
        <span 
          className={`${baseClasses} bg-green-500 text-[7px] font-bold text-white leading-none`}
          title={tooltipText}
          onClick={() => handleCopyWord(word, occurrences)}
        >
          +
        </span>
      );
    }
    return null;
  };

  const toggleLevel = (levelId: string) => {
    const newSet = new Set(expandedLevels);
    newSet.has(levelId) ? newSet.delete(levelId) : newSet.add(levelId);
    setExpandedLevels(newSet);
  };

  const toggleGrade = (gradeId: string) => {
    const newSet = new Set(expandedGrades);
    newSet.has(gradeId) ? newSet.delete(gradeId) : newSet.add(gradeId);
    setExpandedGrades(newSet);
  };

  const toggleTheme = (themeId: string) => {
    const newSet = new Set(expandedThemes);
    newSet.has(themeId) ? newSet.delete(themeId) : newSet.add(themeId);
    setExpandedThemes(newSet);
  };

  const expandLevel = (levelId: string) => {
    const level = wordMapData.find(l => l.id === levelId);
    if (!level) return;

    const newLevels = new Set(expandedLevels);
    const newGrades = new Set(expandedGrades);
    const newThemes = new Set(expandedThemes);

    newLevels.add(levelId);
    level.grades.forEach(grade => {
      newGrades.add(grade.id);
      grade.themes.forEach(theme => newThemes.add(theme.id));
    });

    setExpandedLevels(newLevels);
    setExpandedGrades(newGrades);
    setExpandedThemes(newThemes);
  };

  const expandAll = () => {
    const newLevels = new Set<string>();
    const newGrades = new Set<string>();
    const newThemes = new Set<string>();

    wordMapData.forEach(level => {
      newLevels.add(level.id);
      level.grades.forEach(grade => {
        newGrades.add(grade.id);
        grade.themes.forEach(theme => newThemes.add(theme.id));
      });
    });

    setExpandedLevels(newLevels);
    setExpandedGrades(newGrades);
    setExpandedThemes(newThemes);
  };

  const collapseAll = () => {
    setExpandedLevels(new Set());
    setExpandedGrades(new Set());
    setExpandedThemes(new Set());
    setExpandedStats(new Set());
    setExpandedNotes(new Set());
  };

  const isAllExpanded = expandedLevels.size === wordMapData.length;
  const totalWords = getTotalWordCount();
  const uniqueWords = getUniqueWords();

  return (
    <>
      <NoIndex />
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02),transparent_40%)]"></div>
        
        {copiedWord && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg z-50 animate-pulse">
            Copied "{copiedWord}" info!
          </div>
        )}
        
        <header className="relative border-b border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-12">
              <h1 className="text-sm font-bold text-white uppercase tracking-wider">WORD MAP</h1>
              
              <div className="flex items-center gap-3">
                <Link href="/admin" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">ADMIN</Link>
                <a href="/" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">SITE</a>
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">LOGOUT</button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-3">
              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg px-3 py-1.5">
                <span className="text-neutral-500 text-[10px] uppercase tracking-wide mr-2">Total</span>
                <span className="text-white text-sm font-bold">{totalWords}</span>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg px-3 py-1.5">
                <span className="text-neutral-500 text-[10px] uppercase tracking-wide mr-2">Unique</span>
                <span className="text-white text-sm font-bold">{uniqueWords.length}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] text-neutral-500 uppercase">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-sm" /> diff level
              </span>
              <span className="flex items-center gap-1" title="Word was already in an earlier grade (e.g. 3rd grade when viewing 4th)">
                <span className="inline-block w-2.5 h-2.5 bg-yellow-500 rounded-sm" /> earlier grade
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-2.5 h-2.5 bg-green-500 rounded-sm text-[6px] font-bold text-white">+</span> same grade
              </span>
            </div>

            <button
              onClick={isAllExpanded ? collapseAll : expandAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] uppercase tracking-wide rounded-lg transition-colors"
            >
              {isAllExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}
            </button>
          </div>

          {/* Word Map Tree */}
          <div className="space-y-1.5">
            {wordMapData.map((level) => {
              const levelStat = levelStats.get(level.id);
              const showBoxes = level.id !== 'preschool';
              const showExtras = level.id !== 'preschool';
              
              return (
                <div key={level.id} className="bg-neutral-900/30 border border-neutral-800/50 rounded-lg overflow-hidden">
                  {/* Level Header */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleLevel(level.id)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 hover:bg-neutral-800/30 transition-colors text-left"
                    >
                      <span className={`text-neutral-500 transition-transform ${expandedLevels.has(level.id) ? 'rotate-90' : ''}`}>
                        ›
                      </span>
                      <span className="text-white text-xs font-medium uppercase tracking-wide">{level.name}</span>
                      <span className="text-neutral-600 text-[10px] ml-auto">{levelStat?.total}/{levelStat?.unique.size}</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); expandLevel(level.id); }}
                      className="px-2 py-1 mr-2 text-[10px] text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors uppercase"
                    >
                      Expand
                    </button>
                  </div>

                  {/* Grades */}
                  {expandedLevels.has(level.id) && (
                    <div className="border-t border-neutral-800/50">
                      {level.grades.map((grade) => {
                        const gradeStat = gradeStats.get(grade.id);
                        
                        return (
                          <div key={grade.id} className="border-b border-neutral-800/30 last:border-b-0">
                            <button
                              onClick={() => toggleGrade(grade.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-neutral-800/20 transition-colors text-left"
                            >
                              <span className={`text-neutral-600 transition-transform ${expandedGrades.has(grade.id) ? 'rotate-90' : ''}`}>
                                ›
                              </span>
                              <span className="text-neutral-300 text-xs uppercase tracking-wide">{grade.name}</span>
                              <span className="text-neutral-600 text-[10px] ml-auto">
                                {gradeStat?.total}/{gradeStat?.unique.size} · {grade.themes.length} themes
                              </span>
                            </button>

                            {/* Themes */}
                            {expandedGrades.has(grade.id) && (
                              <div className="bg-neutral-950/30">
                                {grade.themes.map((theme) => {
                                  const stats = themeStats.get(theme.id);
                                  const isStatsExpanded = expandedStats.has(theme.id);
                                  const isNotesExpanded = expandedNotes.has(theme.id);
                                  const hasNotes = !!theme.notes;
                                  
                                  return (
                                    <div key={theme.id} className="border-t border-neutral-800/20">
                                      {/* Theme Header */}
                                      <div className="flex items-center">
                                        <button
                                          onClick={() => toggleTheme(theme.id)}
                                          className="flex-1 flex items-center gap-2 px-3 py-1.5 pl-14 hover:bg-neutral-800/20 transition-colors text-left"
                                        >
                                          <span className={`text-neutral-600 transition-transform ${expandedThemes.has(theme.id) ? 'rotate-90' : ''}`}>
                                            ›
                                          </span>
                                          <span className="text-neutral-400 text-[11px] uppercase tracking-wide">{theme.name}</span>
                                          <span className="text-neutral-600 text-[10px] ml-auto">{theme.words.length}</span>
                                        </button>
                                        {showExtras && (
                                          <div className="flex items-center gap-1 mr-2 text-[10px] uppercase">
                                            {hasNotes && (
                                              <button
                                                onClick={(e) => { e.stopPropagation(); toggleNotes(theme.id); }}
                                                className={`px-2 py-1 rounded transition-colors ${
                                                  isNotesExpanded 
                                                    ? 'text-white bg-neutral-700' 
                                                    : 'text-blue-400 hover:text-white hover:bg-neutral-800'
                                                }`}
                                              >
                                                Notes
                                              </button>
                                            )}
                                            <button
                                              onClick={(e) => { e.stopPropagation(); toggleStats(theme.id); }}
                                              className={`px-2 py-1 rounded transition-colors ${isStatsExpanded ? 'text-white bg-neutral-700' : 'text-neutral-600 hover:text-white hover:bg-neutral-800'}`}
                                            >
                                              Stats
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {/* Notes Panel */}
                                      {showExtras && isNotesExpanded && hasNotes && (
                                        <div className="bg-neutral-900/50 border-y border-neutral-800/30 px-3 py-3 pl-20">
                                          <pre className="text-neutral-300 text-[11px] whitespace-pre-wrap font-sans leading-relaxed">
                                            {theme.notes}
                                          </pre>
                                        </div>
                                      )}

                                      {/* Stats Panel */}
                                      {showExtras && isStatsExpanded && stats && (
                                        <div className="bg-neutral-900/50 border-y border-neutral-800/30 px-3 py-2 pl-20">
                                          <div className="grid grid-cols-4 gap-3 text-[10px]">
                                            <div className="bg-neutral-800/50 rounded px-2 py-1.5">
                                              <div className="text-neutral-500 uppercase tracking-wide">New</div>
                                              <div className="text-white font-bold text-sm">{stats.unique}</div>
                                            </div>
                                            <div className="bg-neutral-800/50 rounded px-2 py-1.5">
                                              <div className="flex items-center gap-1 text-blue-400 uppercase">
                                                <span className="w-2 h-2 bg-blue-500 rounded-sm" />
                                                Diff Level
                                              </div>
                                              <div className="text-white font-bold text-sm">{stats.differentLevel}</div>
                                            </div>
                                            <div className="bg-neutral-800/50 rounded px-2 py-1.5">
                                              <div className="flex items-center gap-1 text-yellow-400 uppercase">
                                                <span className="w-2 h-2 bg-yellow-500 rounded-sm" />
                                                Same Level
                                              </div>
                                              <div className="text-white font-bold text-sm">{stats.sameLevel}</div>
                                            </div>
                                            <div className="bg-neutral-800/50 rounded px-2 py-1.5">
                                              <div className="flex items-center gap-1 text-green-400 uppercase">
                                                <span className="w-2 h-2 bg-green-500 rounded-sm" />
                                                Same Grade
                                              </div>
                                              <div className="text-white font-bold text-sm">{stats.sameGrade}</div>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Words Table */}
                                      {expandedThemes.has(theme.id) && (
                                        <div className="bg-neutral-950/50 px-3 py-2 pl-20">
                                          <table className="w-full">
                                            <tbody>
                                              {Array.from({ length: Math.ceil(theme.words.length / 5) }, (_, rowIndex) => (
                                                <tr key={rowIndex}>
                                                  {theme.words.slice(rowIndex * 5, (rowIndex + 1) * 5).map((word, colIndex) => {
                                                    const { status, previousOccurrences } = getWordInfo(
                                                      word.word, level.id, grade.id, theme.id
                                                    );
                                                    
                                                    return (
                                                      <td 
                                                        key={`${theme.id}-${rowIndex}-${colIndex}`}
                                                        className="text-[11px] text-neutral-300 py-0.5 pr-3"
                                                      >
                                                        <span className="flex items-center">
                                                          {showBoxes && (
                                                            <StatusBox 
                                                              status={status} 
                                                              word={word.word}
                                                              occurrences={previousOccurrences}
                                                            />
                                                          )}
                                                          {word.word}
                                                        </span>
                                                      </td>
                                                    );
                                                  })}
                                                  {rowIndex === Math.ceil(theme.words.length / 5) - 1 && 
                                                    Array.from({ length: 5 - (theme.words.length % 5 || 5) }, (_, i) => (
                                                      <td key={`empty-${i}`} className="py-0.5 pr-3"></td>
                                                    ))
                                                  }
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {wordMapData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-xs uppercase">No words added yet.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
