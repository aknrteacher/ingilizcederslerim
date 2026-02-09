import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Download, Plus, Minus, Check } from 'lucide-react';
import { toast } from 'sonner';
// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import 'jspdf-autotable';

interface Class {
  id: string;
  name: string;
  createdAt: string;
}

interface Student {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
}

type Category = 'assignments' | 'participation' | 'attitude' | 'project' | 'trivia' | 'advancement';

interface StudentScore {
  studentId: string;
  studentName: string;
  scores: number[]; // Array of -1 (minus), 0 (empty), or 1 (plus)
}

const CATEGORIES: { value: Category; label: string; maxSquares: number }[] = [
  { value: 'assignments', label: 'Assignments', maxSquares: 18 },
  { value: 'participation', label: 'Participation', maxSquares: 18 },
  { value: 'attitude', label: 'Attitude', maxSquares: 18 },
  { value: 'project', label: 'Project', maxSquares: 5 },
  { value: 'trivia', label: 'Trivia', maxSquares: 5 },
  { value: 'advancement', label: 'Advancement', maxSquares: 5 },
];

export default function ClassroomMobile() {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [studentScores, setStudentScores] = useState<Map<string, StudentScore>>(new Map());
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);

  // Fetch classes
  const { data: classesData } = useQuery<{ classes: Class[] }>({
    queryKey: ['/api/classroom/classes'],
  });

  // Fetch students for selected class
  const { data: studentsData } = useQuery<{ students: Student[] }>({
    queryKey: ['/api/classroom/students', selectedClass?.id],
    queryFn: async () => {
      if (!selectedClass?.id) return { students: [] };
      const res = await fetch(`/api/classroom/students?classId=${selectedClass.id}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
      return res.json();
    },
    enabled: !!selectedClass,
  });

  // Initialize student scores when class/category changes
  useEffect(() => {
    if (selectedClass && selectedCategory && studentsData?.students) {
      const category = CATEGORIES.find(c => c.value === selectedCategory);
      if (!category) return;

      const newScores = new Map<string, StudentScore>();
      studentsData.students.forEach(student => {
        const existing = studentScores.get(student.id);
        newScores.set(student.id, {
          studentId: student.id,
          studentName: student.name,
          scores: existing?.scores || new Array(category.maxSquares).fill(0),
        });
      });
      setStudentScores(newScores);
      setCurrentStudentIndex(0);
    }
  }, [selectedClass, selectedCategory, studentsData]);

  const currentStudent = studentsData?.students[currentStudentIndex];
  const currentScore = currentStudent ? studentScores.get(currentStudent.id) : null;
  const category = selectedCategory ? CATEGORIES.find(c => c.value === selectedCategory) : null;

  // Find next empty square or last square
  const getCurrentSquareIndex = (): number => {
    if (!currentScore || !category) return 0;
    const firstEmpty = currentScore.scores.findIndex(s => s === 0);
    return firstEmpty !== -1 ? firstEmpty : category.maxSquares - 1;
  };

  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setSwipeStart({ x: clientX, y: clientY });
  };

  const handleSwipeEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swipeStart || !currentStudent || !category || !currentScore) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const deltaX = clientX - swipeStart.x;
    const deltaY = clientY - swipeStart.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only process horizontal swipes (more horizontal than vertical)
    if (absDeltaX > absDeltaY && absDeltaX > 50) {
      const squareIndex = getCurrentSquareIndex();
      const newScores = [...currentScore.scores];
      
      if (deltaX > 0) {
        // Swipe right = plus (green)
        newScores[squareIndex] = 1;
        toast.success('✓ Plus added', { duration: 500 });
      } else {
        // Swipe left = minus (red)
        newScores[squareIndex] = -1;
        toast.error('✗ Minus added', { duration: 500 });
      }

      setStudentScores(prev => {
        const updated = new Map(prev);
        updated.set(currentStudent.id, {
          ...currentScore,
          scores: newScores,
        });
        return updated;
      });
    }

    setSwipeStart(null);
  };

  const handleNextStudent = () => {
    if (studentsData?.students && currentStudentIndex < studentsData.students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    }
  };

  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
    }
  };

  const handleSquareClick = (index: number, value: number) => {
    if (!currentStudent || !currentScore) return;
    
    const newScores = [...currentScore.scores];
    // Cycle: 0 -> 1 -> -1 -> 0
    if (value === 0) {
      newScores[index] = 1;
    } else if (value === 1) {
      newScores[index] = -1;
    } else {
      newScores[index] = 0;
    }

    setStudentScores(prev => {
      const updated = new Map(prev);
      updated.set(currentStudent.id, {
        ...currentScore,
        scores: newScores,
      });
      return updated;
    });
  };

  const exportToPDF = () => {
    if (!selectedClass || !selectedCategory || !category) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${selectedClass.name} - ${category.label}`, 14, 20);

    // Prepare table data
    const tableData: any[] = [];
    const headers = ['Student Name', ...Array.from({ length: category.maxSquares }, (_, i) => (i + 1).toString())];

    studentsData?.students.forEach(student => {
      const score = studentScores.get(student.id);
      const row = [student.name];
      if (score) {
        score.scores.forEach(s => {
          if (s === 1) row.push('+');
          else if (s === -1) row.push('-');
          else row.push('');
        });
      } else {
        row.push(...new Array(category.maxSquares).fill(''));
      }
      tableData.push(row);
    });

    // @ts-ignore - jsPDF autotable plugin
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 60 },
      },
      didParseCell: (data: any) => {
        if (data.row.index === 0) return; // Skip header
        const colIndex = data.column.index;
        if (colIndex > 0) {
          const value = data.cell.text[0];
          if (value === '+') {
            data.cell.styles.fillColor = [200, 255, 200]; // Light green
          } else if (value === '-') {
            data.cell.styles.fillColor = [255, 200, 200]; // Light red
          }
        }
      },
    });

    const fileName = `${selectedClass.name}_${category.label}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('PDF exported successfully!');
  };

  // Step 1: Select Class
  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 mt-8">Select Class</h1>
          <div className="space-y-4">
            {classesData?.classes.slice(0, 4).map((cls) => (
              <Button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="w-full h-20 text-2xl font-bold"
                size="lg"
              >
                {cls.name}
              </Button>
            ))}
            {(!classesData?.classes || classesData.classes.length === 0) && (
              <div className="text-center text-gray-500 text-xl py-8">
                No classes available. Please add classes first.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select Category
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6 mt-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setSelectedClass(null)}
              className="text-2xl"
            >
              ←
            </Button>
            <h1 className="text-4xl font-bold flex-1 text-center">{selectedClass.name}</h1>
          </div>
          <h2 className="text-3xl font-bold text-center mb-8">Select Category</h2>
          <div className="space-y-4">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className="w-full h-16 text-xl font-bold"
                size="lg"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Student Scoring
  if (!currentStudent || !category) return null;

  const squareIndex = getCurrentSquareIndex();
  const progress = ((currentStudentIndex + 1) / (studentsData?.students.length || 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setSelectedCategory(null)}
            className="text-2xl"
          >
            ←
          </Button>
          <div className="text-center flex-1">
            <div className="text-xl font-bold">{selectedClass.name}</div>
            <div className="text-lg text-gray-600">{category.label}</div>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </div>
        <div className="max-w-md mx-auto mt-2">
          <div className="bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600 mt-1">
            {currentStudentIndex + 1} / {studentsData?.students.length || 0}
          </div>
        </div>
      </div>

      {/* Student Card - Swipeable */}
      <div className="p-4 max-w-md mx-auto">
        <Card
          className="touch-none select-none"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          onMouseDown={handleSwipeStart}
          onMouseUp={handleSwipeEnd}
        >
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold mb-2">{currentStudent.name}</div>
              <div className="text-lg text-gray-600">Swipe right for +, left for -</div>
            </div>

            {/* Squares Grid */}
            <div className="grid grid-cols-6 gap-2 mb-6">
              {currentScore?.scores.map((value, index) => (
                <button
                  key={index}
                  onClick={() => handleSquareClick(index, value)}
                  className={`aspect-square rounded-lg border-2 font-bold text-lg transition-all ${
                    index === squareIndex
                      ? 'ring-4 ring-blue-400 ring-offset-2'
                      : ''
                  } ${
                    value === 1
                      ? 'bg-green-500 border-green-600 text-white'
                      : value === -1
                      ? 'bg-red-500 border-red-600 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  {value === 1 ? '+' : value === -1 ? '−' : ''}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <Button
                onClick={handlePrevStudent}
                disabled={currentStudentIndex === 0}
                className="flex-1 h-16 text-xl"
                size="lg"
              >
                <ChevronLeft className="w-6 h-6 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNextStudent}
                disabled={currentStudentIndex === (studentsData?.students.length || 0) - 1}
                className="flex-1 h-16 text-xl"
                size="lg"
              >
                Next
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save/Export Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <Button
            onClick={exportToPDF}
            className="w-full h-16 text-xl font-bold"
            size="lg"
          >
            <Download className="w-6 h-6 mr-2" />
            Save & Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
