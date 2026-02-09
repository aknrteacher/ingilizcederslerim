import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Download, Plus, Users, Upload } from 'lucide-react';
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

export default function InClass() {
  const [mode, setMode] = useState<'admin' | 'mobile'>('admin');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [centeredStudentId, setCenteredStudentId] = useState<string | null>(null);
  const [studentScores, setStudentScores] = useState<Map<string, StudentScore>>(new Map());
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const studentRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  
  // Admin mode states
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [bulkStudentText, setBulkStudentText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const queryClient = useQueryClient();

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

  // Mutations
  const createClassMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiRequest('POST', '/api/classroom/classes', data);
      const result = await res.json();
      if (result.class) {
        setSelectedClass(result.class);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/classes'] });
      setNewClassName('');
      toast.success('Class created!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create class');
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: { classId: string; name: string }) => {
      const res = await apiRequest('POST', '/api/classroom/students', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/students', selectedClass?.id] });
      setNewStudentName('');
      toast.success('Student added!');
    },
    onError: (error: any) => {
      toast.error('Failed to add student');
    },
  });

  const handleCreateClass = () => {
    const trimmedName = newClassName.trim();
    if (!trimmedName) {
      toast.error('Please enter a class name');
      return;
    }
    createClassMutation.mutate({ name: trimmedName });
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !selectedClass) {
      toast.error('Please enter student name');
      return;
    }
    createStudentMutation.mutate({
      classId: selectedClass.id,
      name: newStudentName.trim(),
    });
  };

  const parseBulkStudents = (text: string): string[] => {
    const lines = text.split('\n');
    const students: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^\d+[.\s\t]+(.+)$/);
      if (match) {
        students.push(match[1].trim());
      } else {
        students.push(trimmed);
      }
    }
    return students.filter(name => name.length > 0);
  };

  const handleBulkImport = async () => {
    if (!bulkStudentText.trim() || !selectedClass) {
      toast.error('Please paste student list');
      return;
    }

    const students = parseBulkStudents(bulkStudentText);
    if (students.length === 0) {
      toast.error('No valid students found in the text');
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const studentName of students) {
        try {
          const res = await apiRequest('POST', '/api/classroom/students', {
            classId: selectedClass.id,
            name: studentName,
          });
          await res.json();
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/students', selectedClass.id] });
      setBulkStudentText('');
      
      if (errorCount === 0) {
        toast.success(`Successfully imported ${successCount} student(s)!`);
      } else {
        toast.warning(`Imported ${successCount} student(s), ${errorCount} failed`);
      }
    } catch (error) {
      toast.error('Failed to import students');
    } finally {
      setIsImporting(false);
    }
  };

  // Mobile mode functions
  useEffect(() => {
    if (mode === 'mobile' && selectedClass && selectedCategory && studentsData?.students) {
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
  }, [mode, selectedClass, selectedCategory, studentsData]);

  const currentStudent = studentsData?.students[currentStudentIndex];
  const currentScore = currentStudent ? studentScores.get(currentStudent.id) : null;
  const category = selectedCategory ? CATEGORIES.find(c => c.value === selectedCategory) : null;

  const getCurrentSquareIndex = (): number => {
    if (!currentScore || !category) return 0;
    const firstEmpty = currentScore.scores.findIndex(s => s === 0);
    return firstEmpty !== -1 ? firstEmpty : category.maxSquares - 1;
  };

  // Play sound effect
  const playSound = (type: 'plus' | 'minus') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'plus') {
        oscillator.frequency.value = 800; // Higher pitch for plus
        oscillator.type = 'sine';
      } else {
        oscillator.frequency.value = 400; // Lower pitch for minus
        oscillator.type = 'sawtooth';
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Sound not supported, continue silently
    }
  };

  const handleSwipeStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setSwipeStart({ x: clientX, y: clientY });
  };

  const handleSwipeEnd = (e: React.TouchEvent | React.MouseEvent, studentId: string) => {
    if (!swipeStart || !category) return;

    const student = studentsData?.students.find(s => s.id === studentId);
    if (!student) return;

    const score = studentScores.get(studentId);
    if (!score) return;

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const deltaX = clientX - swipeStart.x;
    const deltaY = clientY - swipeStart.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY && absDeltaX > 50) {
      const firstEmpty = score.scores.findIndex(s => s === 0);
      const squareIndex = firstEmpty !== -1 ? firstEmpty : category.maxSquares - 1;
      const newScores = [...score.scores];
      
      if (deltaX > 0) {
        // Swipe right = plus
        newScores[squareIndex] = 1;
        playSound('plus');
        toast.success('✓ Plus added', { duration: 500 });
      } else {
        // Swipe left = minus
        newScores[squareIndex] = -1;
        playSound('minus');
        toast.error('✗ Minus added', { duration: 500 });
      }

      setStudentScores(prev => {
        const updated = new Map(prev);
        updated.set(studentId, {
          ...score,
          scores: newScores,
        });
        return updated;
      });
    }

    setSwipeStart(null);
  };

  const handleSquareClick = (index: number, value: number) => {
    if (!currentStudent || !currentScore) return;
    
    const newScores = [...currentScore.scores];
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

  const exportToPDF = (categoryToExport?: Category) => {
    const exportCategory = categoryToExport || selectedCategory;
    if (!selectedClass || !exportCategory) return;

    const cat = CATEGORIES.find(c => c.value === exportCategory);
    if (!cat) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${selectedClass.name} - ${cat.label}`, 14, 20);

    const tableData: any[] = [];
    const headers = ['Student Name', ...Array.from({ length: cat.maxSquares }, (_, i) => (i + 1).toString())];

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
        row.push(...new Array(cat.maxSquares).fill(''));
      }
      tableData.push(row);
    });

    // @ts-ignore
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
        if (data.row.index === 0) return;
        const colIndex = data.column.index;
        if (colIndex > 0) {
          const value = data.cell.text[0];
          if (value === '+') {
            data.cell.styles.fillColor = [200, 255, 200];
          } else if (value === '-') {
            data.cell.styles.fillColor = [255, 200, 200];
          }
        }
      },
    });

    const fileName = `${selectedClass.name}_${cat.label}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('PDF exported successfully!');
  };

  // Mode Selection Screen
  if (!mode || (mode === 'admin' && !selectedClass)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 mt-8">In-Class Management</h1>
          
          {/* Mode Selection */}
          {!mode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setMode('admin')}>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">A - Admin Mode</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Add classes, students, and manage data</p>
                  <p className="text-sm text-gray-500">For PC use</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setMode('mobile')}>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">B - Classroom Mode</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Quick scoring with swipe gestures</p>
                  <p className="text-sm text-gray-500">For mobile use</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Admin Mode - Class Selection */}
          {mode === 'admin' && (
            <div>
              <div className="mb-6">
                <Button variant="outline" onClick={() => setMode(null)} className="mb-4">
                  ← Back to Mode Selection
                </Button>
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label htmlFor="newClassName">Class Name</Label>
                        <Input
                          id="newClassName"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder="e.g., 2-A, Math 101"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCreateClass();
                            }
                          }}
                        />
                      </div>
                      <Button 
                        onClick={handleCreateClass} 
                        disabled={createClassMutation.isPending || !newClassName.trim()}
                      >
                        {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Select Class to Manage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {classesData?.classes.map((cls) => (
                      <Button
                        key={cls.id}
                        variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                        size="lg"
                        className="h-20 text-lg"
                        onClick={() => setSelectedClass(cls)}
                      >
                        {cls.name}
                      </Button>
                    ))}
                    {(!classesData?.classes || classesData.classes.length === 0) && (
                      <div className="col-span-full text-center text-gray-500 py-8">
                        No classes yet. Create one above.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ADMIN MODE - Full Management Interface
  if (mode === 'admin' && selectedClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setSelectedClass(null)} className="mb-4">
              ← Back to Class Selection
            </Button>
            <h1 className="text-3xl font-bold">{selectedClass.name} - Admin Mode</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Add Students */}
            <Card>
              <CardHeader>
                <CardTitle>Add Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="studentName">Add Single Student</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="studentName"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Student name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddStudent();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleAddStudent}
                      disabled={!newStudentName.trim() || createStudentMutation.isPending}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bulkStudents">Bulk Import Students</Label>
                  <Textarea
                    id="bulkStudents"
                    value={bulkStudentText}
                    onChange={(e) => setBulkStudentText(e.target.value)}
                    placeholder={`01\tJohn Doe
02\tJane Smith
03\tBob Johnson
...`}
                    rows={8}
                    className="font-mono text-sm mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {bulkStudentText ? `${parseBulkStudents(bulkStudentText).length} student(s) detected` : 'Paste your student list above'}
                  </p>
                  <Button 
                    onClick={handleBulkImport} 
                    className="w-full mt-2"
                    disabled={isImporting || !bulkStudentText.trim()}
                  >
                    {isImporting ? 'Importing...' : `Import ${parseBulkStudents(bulkStudentText).length} Student(s)`}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export to PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat.value}
                      onClick={() => exportToPDF(cat.value)}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export {cat.label} ({cat.maxSquares} squares)
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Data - {selectedClass.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Student Name</th>
                      {CATEGORIES.map((cat) => (
                        <th key={cat.value} className="border p-2 text-center">
                          {cat.label}
                          <br />
                          <span className="text-xs text-gray-500">({cat.maxSquares} squares)</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData?.students.map((student) => (
                      <tr key={student.id}>
                        <td className="border p-2 font-semibold">{student.name}</td>
                        {CATEGORIES.map((cat) => {
                          const score = studentScores.get(student.id);
                          const scores = score?.scores || new Array(cat.maxSquares).fill(0);
                          return (
                            <td key={cat.value} className="border p-2">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {scores.map((s, i) => (
                                  <div
                                    key={i}
                                    className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                                      s === 1
                                        ? 'bg-green-500 text-white'
                                        : s === -1
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 border border-gray-300'
                                    }`}
                                  >
                                    {s === 1 ? '+' : s === -1 ? '−' : ''}
                                  </div>
                                ))}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {(!studentsData?.students || studentsData.students.length === 0) && (
                      <tr>
                        <td colSpan={CATEGORIES.length + 1} className="border p-8 text-center text-gray-500">
                          No students yet. Add students above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // MOBILE MODE - Classroom Interface
  if (mode === 'mobile') {
    // Step 1: Select Class
    if (!selectedClass) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-md mx-auto">
            <Button variant="ghost" onClick={() => setMode(null)} className="mb-4">
              ← Back
            </Button>
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

    // Step 3: Student Scoring - Continuous Scrollable List
    if (!category) return null;

    // Detect centered student on scroll
    useEffect(() => {
      const handleScroll = () => {
        const viewportCenter = window.innerHeight / 2;
        let closestStudent: { id: string; distance: number } | null = null;

        studentsData?.students.forEach(student => {
          const element = studentRefs.current.get(student.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - elementCenter);
            
            if (!closestStudent || distance < closestStudent.distance) {
              closestStudent = { id: student.id, distance };
            }
          }
        });

        if (closestStudent && closestStudent.distance < 100) {
          setCenteredStudentId(closestStudent.id);
        }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check on mount
      return () => window.removeEventListener('scroll', handleScroll);
    }, [studentsData]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
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
            <div className="w-12" />
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            Scroll to find student, swipe when centered
          </div>
        </div>

        {/* Scrollable Student List */}
        <div className="pb-32">
          {studentsData?.students.map((student, index) => {
            const score = studentScores.get(student.id);
            const isCentered = centeredStudentId === student.id;
            const squareIndex = score ? score.scores.findIndex(s => s === 0) : 0;
            const activeSquareIndex = squareIndex !== -1 ? squareIndex : (category.maxSquares - 1);

            return (
              <div
                key={student.id}
                ref={(el) => {
                  if (el) {
                    studentRefs.current.set(student.id, el);
                  } else {
                    studentRefs.current.delete(student.id);
                  }
                }}
                className={`max-w-md mx-auto p-4 transition-all ${
                  isCentered ? 'scale-105 z-20' : 'scale-100'
                }`}
                onTouchStart={(e) => {
                  if (isCentered) handleSwipeStart(e);
                }}
                onTouchEnd={(e) => {
                  if (isCentered) handleSwipeEnd(e, student.id);
                }}
                onMouseDown={(e) => {
                  if (isCentered) handleSwipeStart(e);
                }}
                onMouseUp={(e) => {
                  if (isCentered) handleSwipeEnd(e, student.id);
                }}
              >
                <Card className={`${isCentered ? 'ring-4 ring-blue-400 shadow-xl' : ''}`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`text-4xl font-bold mb-2 ${isCentered ? 'text-blue-600' : ''}`}>
                        {student.name}
                      </div>
                      {isCentered && (
                        <div className="text-lg text-gray-600 mb-2">
                          👆 Swipe right for +, left for -
                        </div>
                      )}
                    </div>

                    {/* Squares Grid */}
                    <div className="grid grid-cols-6 gap-2">
                      {score?.scores.map((value, idx) => (
                        <div
                          key={idx}
                          className={`aspect-square rounded-lg border-2 font-bold text-lg flex items-center justify-center ${
                            idx === activeSquareIndex && isCentered
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
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Fixed Bottom Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-10">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => exportToPDF()}
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

  return null;
}
