import { useState, useMemo } from 'react';
import { NoIndex } from '@/components/NoIndex';
import { Link } from 'wouter';
import { workflowData, getWorkflowStats, gameContentTypes, ContentItem, landingPages } from '@/data/workflowData';

export default function WorkflowPage() {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());

  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    window.location.href = '/';
  };

  const stats = useMemo(() => getWorkflowStats(), []);

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
    const level = workflowData.find(l => l.id === levelId);
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

    workflowData.forEach(level => {
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
  };

  const isAllExpanded = expandedLevels.size === workflowData.length;

  // Calculate level/grade stats
  const getLevelStats = (levelId: string) => {
    const level = workflowData.find(l => l.id === levelId);
    if (!level) return { total: 0, done: 0 };
    let total = 0, done = 0;
    level.grades.forEach(g => g.themes.forEach(t => t.content.forEach(c => {
      total++;
      if (c.count > 0) done++;
    })));
    return { total, done };
  };

  const getGradeStats = (gradeId: string) => {
    for (const level of workflowData) {
      const grade = level.grades.find(g => g.id === gradeId);
      if (grade) {
        let total = 0, done = 0;
        grade.themes.forEach(t => t.content.forEach(c => {
          total++;
          if (c.count > 0) done++;
        }));
        return { total, done };
      }
    }
    return { total: 0, done: 0 };
  };

  const getThemeStats = (themeId: string) => {
    for (const level of workflowData) {
      for (const grade of level.grades) {
        const theme = grade.themes.find(t => t.id === themeId);
        if (theme) {
          let total = 0, done = 0;
          theme.content.forEach(c => {
            total++;
            if (c.count > 0) done++;
          });
          return { total, done };
        }
      }
    }
    return { total: 0, done: 0 };
  };

  // Group content into categories
  const groupContent = (content: ContentItem[]) => {
    const vocab = content.find(c => c.type === 'vocab');
    const songs = content.find(c => c.type === 'songs');
    const stories = content.find(c => c.type === 'stories');
    const exercises = content.find(c => c.type === 'exercises');
    const worksheets = content.find(c => c.type === 'worksheets');
    const crafts = content.find(c => c.type === 'crafts');
    
    // Check if there are any game types in content
    const hasGames = content.some(c => gameContentTypes.includes(c.type));
    
    // Count games
    const gameCount = content
      .filter(c => gameContentTypes.includes(c.type))
      .reduce((sum, c) => sum + c.count, 0);
    
    return { vocab, songs, stories, exercises, worksheets, crafts, hasGames, gameCount };
  };

  const ContentBox = ({ label, count, isGame = false }: { label: string; count: number; isGame?: boolean }) => {
    if (isGame) {
      // Game box with count
      if (count === 0) {
        return (
          <span 
            className="inline-flex items-center justify-center px-2 h-5 bg-red-600/80 text-[8px] font-bold text-white rounded mr-1"
            title="Games: None done"
          >
            GM
          </span>
        );
      }
      return (
        <span 
          className="inline-flex items-center justify-center px-2 h-5 bg-green-600/80 text-[8px] font-bold text-white rounded mr-1"
          title={`Games: ${count} done`}
        >
          GM{count}
        </span>
      );
    }
    
    // Regular content box
    if (count === 0) {
      return (
        <span 
          className="inline-flex items-center justify-center w-8 h-5 bg-red-600/80 text-[8px] font-bold text-white rounded mr-1"
          title={`${label}: Not done`}
        >
          {label}
        </span>
      );
    }
    return (
      <span 
        className="inline-flex items-center justify-center w-8 h-5 bg-green-600/80 text-[8px] font-bold text-white rounded mr-1"
        title={`${label}: Done`}
      >
        {label}
      </span>
    );
  };

  return (
    <>
      <NoIndex />
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02),transparent_40%)]"></div>
        
        <header className="relative border-b border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-12">
              <h1 className="text-sm font-bold text-white uppercase tracking-wider">WORKFLOW</h1>
              
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
                <span className="text-neutral-500 text-[10px] uppercase tracking-wide mr-2">Progress</span>
                <span className="text-white text-sm font-bold">{stats.completedContent}/{stats.totalContent}</span>
                <span className="text-neutral-500 text-[10px] ml-1">({stats.percentage}%)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] text-neutral-500 uppercase">
              <span className="flex items-center gap-1">
                <span className="inline-block w-4 h-3 bg-green-600/80 rounded" /> done
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-4 h-3 bg-red-600/80 rounded" /> not done
              </span>
            </div>

            <button
              onClick={isAllExpanded ? collapseAll : expandAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] uppercase tracking-wide rounded-lg transition-colors"
            >
              {isAllExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}
            </button>
          </div>

          {/* Workflow Tree */}
          <div className="space-y-1.5">
            {workflowData.map((level) => {
              const levelStat = getLevelStats(level.id);
              const levelLanding = landingPages.find(lp => lp.id === level.id);
              
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
                      <span className={`text-xs font-medium uppercase tracking-wide ${levelStat.done === 0 ? 'text-red-500' : 'text-white'}`}>{level.name}</span>
                      {levelLanding && (
                        <span
                          className={`ml-2 inline-flex items-center justify-center px-1.5 h-5 text-[9px] font-semibold rounded border ${
                            levelLanding.exists
                              ? 'border-green-500/70 text-green-400'
                              : 'border-red-500/70 text-red-400'
                          }`}
                          title={`${levelLanding.exists ? 'Landing exists' : 'Landing missing'} · ${levelLanding.path}`}
                        >
                          LP
                        </span>
                      )}
                      <span className="text-neutral-600 text-[10px] ml-auto">{levelStat.done}/{levelStat.total}</span>
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
                        const gradeStat = getGradeStats(grade.id);
                        
                        return (
                          <div key={grade.id} className="border-b border-neutral-800/30 last:border-b-0">
                            <button
                              onClick={() => toggleGrade(grade.id)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-neutral-800/20 transition-colors text-left"
                            >
                              <span className={`text-neutral-600 transition-transform ${expandedGrades.has(grade.id) ? 'rotate-90' : ''}`}>
                                ›
                              </span>
                              <span className={`text-xs uppercase tracking-wide ${gradeStat.done === 0 ? 'text-red-500' : 'text-neutral-300'}`}>{grade.name}</span>
                              <span className="text-neutral-600 text-[10px] ml-auto">
                                {gradeStat.done}/{gradeStat.total} · {grade.themes.length} themes
                              </span>
                            </button>

                            {/* Themes */}
                            {expandedGrades.has(grade.id) && (
                              <div className="bg-neutral-950/30">
                                {grade.themes.map((theme) => {
                                  const themeStat = getThemeStats(theme.id);
                                  
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
                                          <span className={`text-[11px] uppercase tracking-wide ${themeStat.done === 0 ? 'text-red-500' : 'text-neutral-400'}`}>{theme.name}</span>
                                          <span className="text-neutral-600 text-[10px] ml-auto">{themeStat.done}/{themeStat.total}</span>
                                        </button>
                                      </div>

                                      {/* Content Items */}
                                      {expandedThemes.has(theme.id) && (
                                        <div className="bg-neutral-950/50 px-3 py-2 pl-20">
                                          <div className="flex flex-wrap gap-1">
                                            {(() => {
                                              const grouped = groupContent(theme.content);
                                              return (
                                                <>
                                                  {grouped.vocab && <ContentBox label="VOC" count={grouped.vocab.count} />}
                                                  {grouped.hasGames && <ContentBox label="GM" count={grouped.gameCount} isGame={true} />}
                                                  {grouped.songs && <ContentBox label="SNG" count={grouped.songs.count} />}
                                                  {grouped.stories && <ContentBox label="STR" count={grouped.stories.count} />}
                                                  {grouped.crafts && <ContentBox label="CRF" count={grouped.crafts.count} />}
                                                  {grouped.exercises && <ContentBox label="EXE" count={grouped.exercises.count} />}
                                                  {grouped.worksheets && <ContentBox label="WRK" count={grouped.worksheets.count} />}
                                                </>
                                              );
                                            })()}
                                          </div>
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
        </main>
      </div>
    </>
  );
}
