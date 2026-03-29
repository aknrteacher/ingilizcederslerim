import { useState } from 'react';
import { NoIndex } from '@/components/NoIndex';
import { Link } from 'wouter';
import { useThemeNotes } from '@/hooks/useThemeNotes';

const LEGEND = [
  { c: 'c1', label: 'Greetings & Introductions' },
  { c: 'c2', label: 'Numbers' },
  { c: 'c3', label: 'Classroom, Instructions & Permission' },
  { c: 'c4', label: 'Colors' },
  { c: 'c5', label: 'Possession (have/has got)' },
  { c: 'c6', label: 'Family' },
  { c: 'c7', label: 'Body, Physical Description & Shapes' },
  { c: 'c8', label: 'Abilities (can/can\'t)' },
  { c: 'c9', label: 'House & Rooms' },
  { c: 'c10', label: 'Prepositions & Location' },
  { c: 'c11', label: 'Feelings & Suggestions (Let\'s)' },
  { c: 'c12', label: 'Quantity (How many / there is/are)' },
  { c: 'c13', label: 'Weather' },
  { c: 'c14', label: 'City, Places & Transportation' },
  { c: 'c15', label: 'Likes, Dislikes, Animals & Nature' },
  { c: 'c16', label: 'Daily Routines & Time' },
  { c: 'c17', label: 'Countries & Nationality' },
  { c: 'c18', label: 'Clothes & Seasons' },
  { c: 'c19', label: 'Food & Offers' },
  { c: 'c20', label: 'Jobs' },
  { c: 'c21', label: 'Alphabet & Spelling' },
  { c: 'c22', label: 'Days of the Week' },
  { c: 'c23', label: 'Apologies & Social Language' },
];

// Pre-School & Grade 1 topics (from word map structure)
const PRESCHOOL_GRADE1 = [
  { unit: 'Alphabet', tags: [{ c: 'c21', text: 'Alphabet & Spelling' }] },
  { unit: 'Numbers', tags: [{ c: 'c2', text: 'Numbers 1-10' }] },
  { unit: 'Colours', tags: [{ c: 'c4', text: 'Colors' }] },
  { unit: 'Greetings', tags: [{ c: 'c1', text: 'Greetings & Introductions' }, { c: 'c23', text: 'Apologies & Social Language' }] },
  { unit: 'Actions', tags: [{ c: 'c8', text: 'Abilities (can/can\'t)' }] },
  { unit: 'Our Body', tags: [{ c: 'c7', text: 'Body & Physical Description' }] },
  { unit: 'Our Classroom', tags: [{ c: 'c3', text: 'Classroom & Instructions' }] },
  { unit: 'Things', tags: [{ c: 'c15', text: 'Likes & Objects' }] },
  { unit: 'People', tags: [{ c: 'c6', text: 'Family' }] },
  { unit: 'Animals', tags: [{ c: 'c15', text: 'Animals & Nature' }] },
  { unit: 'Around Us', tags: [{ c: 'c9', text: 'House & Nature' }, { c: 'c13', text: 'Weather' }, { c: 'c15', text: 'Nature' }] },
  { unit: 'Food', tags: [{ c: 'c19', text: 'Food & Offers' }] },
];

const GRADE2 = [
  { unit: 'Theme 1: School Life', tags: [{ c: 'c1', text: 'Greetings & Introductions' }, { c: 'c21', text: 'Alphabet & Spelling' }, { c: 'c22', text: 'Days of the Week' }, { c: 'c10', text: 'Prepositions (in)' }, { c: 'c3', text: 'Classroom Instructions' }] },
  { unit: 'Theme 2: Classroom Life', tags: [{ c: 'c2', text: 'Numbers 1-20' }, { c: 'c4', text: 'Colors' }, { c: 'c12', text: 'Quantity (How many)' }, { c: 'c5', text: 'Possession (my, his, her...)' }, { c: 'c3', text: 'Permission (Can I...?)' }] },
  { unit: 'Theme 3: Personal Life', tags: [{ c: 'c7', text: 'Body & Physical Description' }, { c: 'c5', text: 'Possession (have got)' }, { c: 'c13', text: 'Weather' }, { c: 'c22', text: 'Days of the Week' }, { c: 'c18', text: 'Clothes' }] },
  { unit: 'Theme 4: Family Life', tags: [{ c: 'c6', text: 'Family' }, { c: 'c7', text: 'Physical Description' }, { c: 'c5', text: 'Possession (has got)' }] },
  { unit: 'Theme 5: Homes, Houses, Neighbourhoods', tags: [{ c: 'c9', text: 'House & Rooms' }, { c: 'c10', text: 'Prepositions (in, on, under)' }, { c: 'c5', text: 'Possession (have got)' }, { c: 'c15', text: 'Animals (pets)' }] },
  { unit: 'Theme 6: Life in the City', tags: [{ c: 'c15', text: 'Likes & Dislikes (food)' }, { c: 'c5', text: 'Possession' }, { c: 'c19', text: 'Food & Offers' }] },
];

const GRADE3 = [
  { unit: 'Unit 1: Greeting', tags: [{ c: 'c1', text: 'Greetings & Introductions', rec: true }, { c: 'c21', text: 'Alphabet & Spelling', rec: true }, { c: 'c2', text: 'Numbers 1-20', rec: true }] },
  { unit: 'Unit 2: My Family', tags: [{ c: 'c6', text: 'Family', rec: true }] },
  { unit: 'Unit 3: People I Love', tags: [{ c: 'c7', text: 'Physical Description', rec: true }, { c: 'c8', text: 'Abilities (can/can\'t)' }] },
  { unit: 'Unit 4: Feelings', tags: [{ c: 'c11', text: 'Feelings & Suggestions (Let\'s)' }] },
  { unit: 'Unit 5: Toys and Games', tags: [{ c: 'c12', text: 'Quantity (How many/there are)', rec: true }, { c: 'c4', text: 'Colors', rec: true }, { c: 'c5', text: 'Possession (have got)', rec: true }] },
  { unit: 'Unit 6: My House', tags: [{ c: 'c7', text: 'Shapes' }, { c: 'c9', text: 'House & Rooms', rec: true }, { c: 'c10', text: 'Prepositions (in, on, under)', rec: true }, { c: 'c5', text: 'Possession', rec: true }] },
  { unit: 'Unit 7: In My City', tags: [{ c: 'c14', text: 'City & Places' }, { c: 'c23', text: 'Apologies & Social Language' }, { c: 'c10', text: 'Location', rec: true }] },
  { unit: 'Unit 8: Transportation', tags: [{ c: 'c14', text: 'Transportation' }, { c: 'c10', text: 'Location', rec: true }] },
  { unit: 'Unit 9: Weather', tags: [{ c: 'c13', text: 'Weather', rec: true }] },
  { unit: 'Unit 10: Nature', tags: [{ c: 'c15', text: 'Likes & Dislikes', rec: true }, { c: 'c15', text: 'Animals & Nature' }, { c: 'c12', text: 'There is/are', rec: true }] },
];

const GRADE4 = [
  { unit: 'Unit 1: Classroom Rules', tags: [{ c: 'c3', text: 'Classroom & Permission', rec: true }, { c: 'c2', text: 'Numbers 1-50', rec: true }, { c: 'c3', text: 'Instructions', rec: true }] },
  { unit: 'Unit 2: Nationality', tags: [{ c: 'c17', text: 'Countries & Nationality' }, { c: 'c10', text: 'Location (north/south/east/west)', rec: true }] },
  { unit: 'Unit 3: Cartoon Characters', tags: [{ c: 'c8', text: 'Abilities (can/can\'t)', rec: true }, { c: 'c5', text: 'Possession (whose, his/her)', rec: true }] },
  { unit: 'Unit 4: Free Time', tags: [{ c: 'c15', text: 'Likes & Dislikes', rec: true }, { c: 'c10', text: 'Asking for Clarification' }] },
  { unit: 'Unit 5: My Day', tags: [{ c: 'c16', text: 'Daily Routines & Time' }, { c: 'c22', text: 'Days of the Week', rec: true }] },
  { unit: 'Unit 6: Fun with Science', tags: [{ c: 'c3', text: 'Instructions', rec: true }, { c: 'c10', text: 'Prepositions (in front of, behind, near)', rec: true }] },
  { unit: 'Unit 7: Jobs', tags: [{ c: 'c20', text: 'Jobs' }, { c: 'c15', text: 'Likes', rec: true }] },
  { unit: 'Unit 8: My Clothes', tags: [{ c: 'c13', text: 'Weather', rec: true }, { c: 'c18', text: 'Clothes & Seasons', rec: true }, { c: 'c3', text: 'Making Requests (borrow)' }] },
  { unit: 'Unit 9: My Friends', tags: [{ c: 'c7', text: 'Physical Description', rec: true }, { c: 'c5', text: 'Possession (have/has)', rec: true }] },
  { unit: 'Unit 10: Food and Drinks', tags: [{ c: 'c19', text: 'Food & Offers', rec: true }, { c: 'c11', text: 'Basic Needs & Feelings' }] },
];

const colorClasses: Record<string, string> = {
  c1: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200',
  c2: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  c3: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
  c4: 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200',
  c5: 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200',
  c6: 'bg-pink-100 text-pink-900 dark:bg-pink-900/40 dark:text-pink-200',
  c7: 'bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-200',
  c8: 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200',
  c9: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200',
  c10: 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200',
  c11: 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200',
  c12: 'bg-lime-100 text-lime-900 dark:bg-lime-900/40 dark:text-lime-200',
  c13: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200',
  c14: 'bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-200',
  c15: 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200',
  c16: 'bg-red-200/80 text-red-950 dark:bg-red-800/40 dark:text-red-100',
  c17: 'bg-green-200/80 text-green-950 dark:bg-green-800/40 dark:text-green-100',
  c18: 'bg-indigo-200/80 text-indigo-950 dark:bg-indigo-800/40 dark:text-indigo-100',
  c19: 'bg-yellow-200/80 text-yellow-950 dark:bg-yellow-800/40 dark:text-yellow-100',
  c20: 'bg-pink-200/80 text-pink-950 dark:bg-pink-800/40 dark:text-pink-100',
  c21: 'bg-sky-200/80 text-sky-950 dark:bg-sky-800/40 dark:text-sky-100',
  c22: 'bg-indigo-200/80 text-indigo-950 dark:bg-indigo-800/40 dark:text-indigo-100',
  c23: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700/50 dark:text-neutral-200',
};

function Tag({ c, text, rec, selectedTopic, onTopicClick }: { c: string; text: string; rec?: boolean; selectedTopic?: string | null; onTopicClick?: (c: string) => void }) {
  const cls = colorClasses[c] || 'bg-neutral-200 text-neutral-800';
  const isSelected = selectedTopic === c;
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => onTopicClick?.(c)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTopicClick?.(c)}
      className={`inline-block px-2.5 py-1 mr-2 mb-1.5 rounded text-[11px] font-medium cursor-pointer select-none transition-opacity ${cls} ${rec ? 'border border-dashed border-neutral-500/50' : ''} ${isSelected ? 'animate-topic-blink ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : ''}`}
    >
      {text}{rec ? ' ↻' : ''}
    </span>
  );
}

function LegendSwatch({ c, isSelected }: { c: string; isSelected?: boolean }) {
  const cls = colorClasses[c] || 'bg-neutral-300';
  return <span className={`inline-block w-4 h-4 rounded flex-shrink-0 ${cls} ${isSelected ? 'animate-topic-blink ring-2 ring-white ring-offset-1 ring-offset-neutral-900' : ''}`} />;
}

function UnitRow({
  noteKey,
  row,
  TagComponent,
  selectedTopic,
  onTopicClick,
}: {
  noteKey: string;
  row: { unit: string; tags: { c: string; text: string; rec?: boolean }[] };
  TagComponent: React.ComponentType<{ c: string; text: string; rec?: boolean; selectedTopic?: string | null; onTopicClick?: (c: string) => void }>;
  selectedTopic?: string | null;
  onTopicClick?: (c: string) => void;
}) {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [note, setNote] = useThemeNotes(noteKey);

  const handleNoteBlur = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  return (
    <>
      <tr className="border-t border-neutral-800/30 hover:bg-neutral-800/20">
        <td className="py-2.5 px-3 text-white text-xs font-medium">{row.unit}</td>
        <td className="py-2.5 px-3">
          {row.tags.map((t) => (
            <TagComponent key={`${row.unit}-${t.text}-${t.c}`} c={t.c} text={t.text} rec={t.rec} selectedTopic={selectedTopic} onTopicClick={onTopicClick} />
          ))}
        </td>
        <td className="py-2.5 px-3 w-24">
          <button
            onClick={() => setNotesExpanded((v) => !v)}
            className={`px-2 py-1 text-[10px] uppercase rounded transition-colors ${
              notesExpanded ? 'text-white bg-neutral-700' : 'text-blue-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Notes
          </button>
        </td>
      </tr>
      {notesExpanded && (
        <tr>
          <td colSpan={3} className="bg-neutral-900/50 border-t-0 px-3 py-3">
            <div className="pl-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleNoteBlur}
                placeholder="Add notes for this unit..."
                className="w-full min-h-[80px] bg-neutral-800/50 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-300 text-[11px] font-sans leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-neutral-600 placeholder-neutral-500"
              />
              {savedFeedback && (
                <span className="text-[10px] text-green-400 mt-1.5 block">Saved</span>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const LEVELS = [
  { id: 'preschool', name: 'Pre-School & Grade 1', grades: [{ id: 'preschool-topics', name: 'Topics', rows: PRESCHOOL_GRADE1 }] },
  { id: 'primary', name: 'Primary School', grades: [{ id: 'grade-2', name: 'Grade 2', rows: GRADE2 }, { id: 'grade-3', name: 'Grade 3', rows: GRADE3 }, { id: 'grade-4', name: 'Grade 4', rows: GRADE4 }] },
];

export default function LearningAreasMapPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set());

  const handleTopicClick = (c: string) => {
    setSelectedTopic((prev) => (prev === c ? null : c));
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      next.has(levelId) ? next.delete(levelId) : next.add(levelId);
      return next;
    });
  };

  const toggleGrade = (gradeId: string) => {
    setExpandedGrades((prev) => {
      const next = new Set(prev);
      next.has(gradeId) ? next.delete(gradeId) : next.add(gradeId);
      return next;
    });
  };

  const expandAll = () => {
    const levels = new Set(LEVELS.map((l) => l.id));
    const grades = new Set<string>();
    LEVELS.forEach((l) => l.grades.forEach((g) => grades.add(g.id)));
    setExpandedLevels(levels);
    setExpandedGrades(grades);
  };

  const collapseAll = () => {
    setExpandedLevels(new Set());
    setExpandedGrades(new Set());
  };

  const isAllExpanded = expandedLevels.size === LEVELS.length && expandedGrades.size === LEVELS.reduce((acc, l) => acc + l.grades.length, 0);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    window.location.href = '/';
  };

  return (
    <>
      <NoIndex />
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02),transparent_40%)]" />

        <header className="relative border-b border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-12">
              <h1 className="text-sm font-bold text-white uppercase tracking-wider">LEARNING AREAS MAP</h1>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">ADMIN</Link>
                <a href="/" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">SITE</a>
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">LOGOUT</button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-neutral-500 text-[11px] uppercase tracking-wide">
              Grammar, functions & skills from Pre-School through Grade 4 — Similar topics share the same color. <strong>↻</strong> = Recurring (builds on earlier grade)
            </p>
            <button
              onClick={isAllExpanded ? collapseAll : expandAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] uppercase tracking-wide rounded-lg transition-colors"
            >
              {isAllExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}
            </button>
          </div>

          {/* Legend */}
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-4 mb-6">
            <h2 className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-3">COLOR LEGEND — Click a topic to highlight it across the page</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {LEGEND.map((item) => (
                <button
                  key={item.c}
                  type="button"
                  onClick={() => handleTopicClick(item.c)}
                  className={`flex items-center gap-2 text-[11px] text-neutral-300 text-left rounded px-2 py-1.5 -mx-2 -my-1.5 transition-colors hover:bg-neutral-800/50 hover:text-white ${selectedTopic === item.c ? 'bg-neutral-800/70 text-white' : ''}`}
                >
                  <LegendSwatch c={item.c} isSelected={selectedTopic === item.c} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Levels & Grades - Collapsible */}
          <div className="space-y-1.5">
            {LEVELS.map((level) => (
              <div key={level.id} className="bg-neutral-900/30 border border-neutral-800/50 rounded-lg overflow-hidden">
                {/* Level Header */}
                <button
                  onClick={() => toggleLevel(level.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-800/30 transition-colors text-left"
                >
                  <span className={`text-neutral-500 transition-transform ${expandedLevels.has(level.id) ? 'rotate-90' : ''}`}>›</span>
                  <span className="text-white text-xs font-medium uppercase tracking-wide">{level.name}</span>
                  <span className="text-neutral-600 text-[10px] ml-auto">{level.grades.length} grade{level.grades.length > 1 ? 's' : ''}</span>
                </button>

                {/* Grades */}
                {expandedLevels.has(level.id) && (
                  <div className="border-t border-neutral-800/50">
                    {level.grades.map((grade) => (
                      <div key={grade.id} className="border-b border-neutral-800/30 last:border-b-0">
                        <button
                          onClick={() => toggleGrade(grade.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 pl-8 hover:bg-neutral-800/20 transition-colors text-left"
                        >
                          <span className={`text-neutral-600 transition-transform ${expandedGrades.has(grade.id) ? 'rotate-90' : ''}`}>›</span>
                          <span className="text-neutral-300 text-xs uppercase tracking-wide">{grade.name}</span>
                          <span className="text-neutral-600 text-[10px] ml-auto">{grade.rows.length} unit{grade.rows.length !== 1 ? 's' : ''}</span>
                        </button>

                        {expandedGrades.has(grade.id) && (
                          <div className="bg-neutral-950/30">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-neutral-800/50">
                                  <th className="text-left py-2.5 px-3 text-[10px] text-neutral-400 uppercase tracking-wider w-[22%]">Unit / Theme</th>
                                  <th className="text-left py-2.5 px-3 text-[10px] text-neutral-400 uppercase tracking-wider">Learning Areas</th>
                                  <th className="text-left py-2.5 px-3 text-[10px] text-neutral-400 uppercase tracking-wider w-24">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {grade.rows.map((row) => (
                                  <UnitRow
                                    key={row.unit}
                                    noteKey={grade.id === 'preschool-topics' ? `la-preschool-${row.unit}` : `la-${grade.id.replace('grade-', 'grade')}-${row.unit}`}
                                    row={row}
                                    TagComponent={Tag}
                                    selectedTopic={selectedTopic}
                                    onTopicClick={handleTopicClick}
                                  />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-neutral-500 text-[11px] mt-4 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
            <strong>Recurring (↻)</strong> = This learning area was introduced in an earlier grade; the current unit builds on or extends it.
          </p>
        </main>
      </div>
    </>
  );
}
