import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Download, Plus, Users, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import 'jspdf-autotable';

interface Class {
  id: string;
  name: string;
  monitorCode: string;
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
  const [mode, setMode] = useState<'admin' | 'mobile' | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [centeredStudentId, setCenteredStudentId] = useState<string | null>(null);
  const [studentScores, setStudentScores] = useState<Map<string, StudentScore>>(new Map());
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const studentRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  
  // Store all category scores separately (studentId -> category -> scores[])
  const [allCategoryScores, setAllCategoryScores] = useState<Map<string, Map<Category, number[]>>>(new Map());
  
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

  const deleteClassMutation = useMutation({
    mutationFn: async (classId: string) => {
      const res = await apiRequest('DELETE', `/api/classroom/classes?id=${classId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/classes'] });
      if (selectedClass) {
        setSelectedClass(null);
      }
      toast.success('Class deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete class');
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const res = await apiRequest('DELETE', `/api/classroom/students?id=${studentId}`, {});
      return res.json();
    },
    onSuccess: () => {
      if (selectedClass) {
        queryClient.invalidateQueries({ queryKey: ['/api/classroom/students', selectedClass.id] });
      }
      toast.success('Student deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete student');
    },
  });

  const seedTestDataMutation = useMutation({
    mutationFn: async () => {
      const testClasses = [
        { name: '2-A' },
        { name: '3-B' },
        { name: '4-C' },
      ];
      const testStudents = [
        ['Ali Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Şahin', 'Can Öztürk'],
        ['Elif Arslan', 'Burak Çelik', 'Deniz Yıldız', 'Fatma Aydın', 'Gökhan Doğan'],
        ['Hülya Kılıç', 'İbrahim Yücel', 'Jale Özdemir', 'Kemal Avcı', 'Leyla Çınar'],
      ];

      const createdClasses: Class[] = [];
      
      // Create classes
      for (const cls of testClasses) {
        const res = await apiRequest('POST', '/api/classroom/classes', cls);
        const result = await res.json();
        if (result.class) {
          createdClasses.push(result.class);
        }
      }

      // Create students for each class
      for (let i = 0; i < createdClasses.length; i++) {
        const classObj = createdClasses[i];
        const students = testStudents[i];
        for (const studentName of students) {
          await apiRequest('POST', '/api/classroom/students', {
            classId: classObj.id,
            name: studentName,
          });
        }
      }

      return { classes: createdClasses };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/classes'] });
      toast.success('Test data created successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to create test data');
    },
  });

  const handleDeleteClass = (classToDelete: Class) => {
    if (window.confirm(`Are you sure you want to delete class "${classToDelete.name}"?\n\nThis will also delete all students in this class. This action cannot be undone.`)) {
      deleteClassMutation.mutate(classToDelete.id);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    if (window.confirm(`Are you sure you want to delete student "${student.name}"?\n\nThis action cannot be undone.`)) {
      deleteStudentMutation.mutate(student.id);
    }
  };

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

  // Load saved scores when class/category changes
  useEffect(() => {
    if (selectedClass && selectedCategory && studentsData?.students) {
      const loadScores = async () => {
        try {
          const res = await fetch(`/api/classroom/scores?classId=${selectedClass.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.scores && Object.keys(data.scores).length > 0) {
              // Update allCategoryScores from saved data
              const updatedAllScores = new Map<string, Map<Category, number[]>>();
              studentsData.students.forEach(student => {
                const studentScoresData = data.scores[student.id];
                if (studentScoresData) {
                  updatedAllScores.set(student.id, new Map());
                  CATEGORIES.forEach(cat => {
                    const catScores = studentScoresData[cat.value] || new Array(cat.maxSquares).fill(0);
                    updatedAllScores.get(student.id)!.set(cat.value, catScores);
                  });
                }
              });
              if (updatedAllScores.size > 0) {
                setAllCategoryScores(updatedAllScores);
              }
            }
          }
        } catch (error) {
          console.error('Error loading scores:', error);
        }
      };
      loadScores();
    }
  }, [selectedClass, selectedCategory, studentsData?.students]);

  // Mobile mode functions - load scores for selected category
  useEffect(() => {
    if (mode === 'mobile' && selectedClass && selectedCategory && studentsData?.students) {
      const category = CATEGORIES.find(c => c.value === selectedCategory);
      if (!category) return;

      // Load existing scores for this category if available
      const newScores = new Map<string, StudentScore>();
      studentsData.students.forEach(student => {
        const existingAllScores = allCategoryScores.get(student.id);
        const existingForCategory = existingAllScores?.get(selectedCategory);
        
        newScores.set(student.id, {
          studentId: student.id,
          studentName: student.name,
          scores: existingForCategory || new Array(category.maxSquares).fill(0),
        });
      });
      setStudentScores(newScores);
      setCurrentStudentIndex(0);
    }
  }, [mode, selectedClass, selectedCategory, studentsData?.students, allCategoryScores]);

  // Removed useEffect - we update allCategoryScores directly in handleSwipeEnd to prevent flickering

  // Detect centered student on scroll (only in mobile mode with category selected)
  // Use IntersectionObserver for better performance and to avoid flickering
  useEffect(() => {
    if (mode !== 'mobile' || !selectedCategory || !studentsData?.students.length) {
      setCenteredStudentId(null);
      return;
    }
    
    let scrollTimeout: NodeJS.Timeout;
    const viewportCenter = window.innerHeight / 2;
    const threshold = 250; // Increased threshold for better detection, especially for first student

    const checkCentered = () => {
      interface ClosestStudent {
        id: string;
        distance: number;
      }
      let closestStudent: ClosestStudent | null = null;

      for (const student of studentsData.students) {
        const element = studentRefs.current.get(student.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);
          
          if (closestStudent === null || distance < closestStudent.distance) {
            closestStudent = { id: student.id, distance };
          }
        }
      }

      if (closestStudent !== null && closestStudent.distance < threshold) {
        setCenteredStudentId(prev => {
          // Only update if different to prevent unnecessary re-renders
          if (prev !== closestStudent!.id) {
            return closestStudent!.id;
          }
          return prev;
        });
      } else {
        setCenteredStudentId(prev => prev !== null ? null : prev);
      }
    };

    // Throttled scroll handler using requestAnimationFrame for smooth performance
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkCentered, 100);
      });
    };

    // Check multiple times on mount to catch first student (Android Chrome needs delays)
    checkCentered();
    const initialCheck1 = setTimeout(checkCentered, 100);
    const initialCheck2 = setTimeout(checkCentered, 300);
    const initialCheck3 = setTimeout(checkCentered, 600);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkCentered);
    
    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(initialCheck1);
      clearTimeout(initialCheck2);
      clearTimeout(initialCheck3);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkCentered);
    };
  }, [mode, selectedCategory, studentsData?.students]);

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

      // Update scores without causing flicker
      setStudentScores(prev => {
        const updated = new Map(prev);
        updated.set(studentId, {
          ...score,
          scores: newScores,
        });
        return updated;
      });
      
      // Update allCategoryScores immediately to prevent re-render flicker
      setAllCategoryScores(prev => {
        const updated = new Map(prev);
        if (!updated.has(studentId)) {
          updated.set(studentId, new Map());
        }
        updated.get(studentId)!.set(selectedCategory!, newScores);
        return updated;
      });
    }

    setSwipeStart(null);
  };


  const handleSaveScores = async () => {
    if (!selectedClass || !selectedCategory || !studentsData?.students.length) {
      toast.error('No data to save');
      return;
    }

    try {
      // First, update allCategoryScores with current studentScores for selected category
      const updatedAllScores = new Map(allCategoryScores);
      studentsData.students.forEach(student => {
        const currentScore = studentScores.get(student.id);
        if (currentScore) {
          if (!updatedAllScores.has(student.id)) {
            updatedAllScores.set(student.id, new Map());
          }
          updatedAllScores.get(student.id)!.set(selectedCategory, currentScore.scores);
        }
      });
      setAllCategoryScores(updatedAllScores);

      // Collect all scores for all categories
      const scoresData: Record<string, Record<string, number[]>> = {};
      studentsData.students.forEach(student => {
        scoresData[student.id] = {};
        const studentAllScores = updatedAllScores.get(student.id);
        CATEGORIES.forEach(cat => {
          if (studentAllScores && studentAllScores.has(cat.value)) {
            scoresData[student.id][cat.value] = studentAllScores.get(cat.value)!;
          } else {
            scoresData[student.id][cat.value] = new Array(cat.maxSquares).fill(0);
          }
        });
      });

      const res = await fetch('/api/classroom/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: selectedClass.id,
          scores: scoresData,
        }),
      });
      
      const result = await res.json();
      if (res.ok) {
        toast.success('Scores saved!');
      } else {
        throw new Error(result.message || 'Failed to save');
      }
    } catch (error: any) {
      console.error('Error saving scores:', error);
      toast.error(error?.message || 'Failed to save scores');
    }
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

  const exportFullTableToPDF = () => {
    if (!selectedClass || !studentsData?.students.length) return;

    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text(`${selectedClass.name} - Complete Evaluation`, 14, 15);

    // Prepare headers
    const headers = ['Student Name', ...CATEGORIES.map(cat => cat.label)];

    // Prepare table data
    const tableData: any[] = [];
    studentsData.students.forEach(student => {
      const row: any[] = [student.name];
      CATEGORIES.forEach(cat => {
        const studentAllScores = allCategoryScores.get(student.id);
        const catScores = studentAllScores?.get(cat.value) || new Array(cat.maxSquares).fill(0);
        const plusCount = catScores.filter(s => s === 1).length;
        const minusCount = catScores.filter(s => s === -1).length;
        row.push(`${plusCount > 0 ? '✓'.repeat(plusCount) : ''}${minusCount > 0 ? '✗'.repeat(minusCount) : ''}${plusCount === 0 && minusCount === 0 ? '-' : ''}`);
      });
      tableData.push(row);
    });

    // @ts-ignore
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 50 },
      },
      didParseCell: (data: any) => {
        if (data.row.index === 0) return; // Skip header
        const colIndex = data.column.index;
        if (colIndex > 0) {
          const value = data.cell.text[0] || '';
          if (value.includes('✓')) {
            data.cell.styles.textColor = [34, 197, 94]; // Green
            data.cell.styles.fontStyle = 'bold';
          } else if (value.includes('✗')) {
            data.cell.styles.textColor = [239, 68, 68]; // Red
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });

    const fileName = `${selectedClass.name}_Complete_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('PDF exported successfully!');
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
          if (s === 1) row.push('✓');
          else if (s === -1) row.push('✗');
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
                      <div key={cls.id} className="relative group">
                        <Button
                          variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                          size="lg"
                          className="h-20 text-lg w-full"
                          onClick={() => setSelectedClass(cls)}
                        >
                          {cls.name}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(cls);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(!classesData?.classes || classesData.classes.length === 0) && (
                      <div className="col-span-full text-center text-gray-500 py-8">
                        No classes yet. Create one above.
                      </div>
                    )}
                  </div>
                  {(!classesData?.classes || classesData.classes.length === 0) && (
                    <div className="mt-4 text-center">
                      <Button
                        onClick={() => seedTestDataMutation.mutate()}
                        variant="outline"
                        disabled={seedTestDataMutation.isPending}
                      >
                        {seedTestDataMutation.isPending ? 'Creating...' : '🎲 Create Test Data (3 classes, 5 students each)'}
                      </Button>
                    </div>
                  )}
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

            {/* Export Full Table */}
            <Card>
              <CardHeader>
                <CardTitle>Export Full Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => exportFullTableToPDF()}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Complete Table to PDF
                </Button>
                {selectedClass?.monitorCode && (
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <div className="text-sm font-semibold text-blue-900">Monitor Code:</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">{selectedClass.monitorCode}</div>
                    <div className="text-xs text-blue-700 mt-1">
                      Parents can view at: /{selectedClass.monitorCode}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Data Table - Enhanced Visuals with Gradients and Animations */}
          <Card className="shadow-2xl border-2 border-blue-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <CardTitle className="text-2xl font-bold relative z-10 flex items-center gap-2">
                <span>📊 Current Data - {selectedClass.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-gradient-to-br from-gray-50 to-white">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
                      <th className="border-2 border-gray-300 p-4 text-left font-bold text-gray-800 text-lg">Student Name</th>
                      {CATEGORIES.map((cat) => (
                        <th key={cat.value} className="border-2 border-gray-300 p-4 text-center font-bold text-gray-800">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-base">{cat.label}</span>
                            <span className="text-xs text-gray-600 font-normal bg-gray-200 px-2 py-0.5 rounded-full">({cat.maxSquares})</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentsData?.students.map((student, idx) => (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="border-2 border-gray-200 p-4 font-semibold">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-800 text-lg">{student.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-all"
                              onClick={() => handleDeleteStudent(student)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        {CATEGORIES.map((cat) => {
                          const studentAllScores = allCategoryScores.get(student.id);
                          const catScores = studentAllScores?.get(cat.value) || new Array(cat.maxSquares).fill(0);
                          const plusCount = catScores.filter(s => s === 1).length;
                          const minusCount = catScores.filter(s => s === -1).length;
                          return (
                            <td key={cat.value} className="border-2 border-gray-200 p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {plusCount > 0 && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 rounded-full shadow-sm border border-green-300">
                                    <span className="text-green-700 font-bold text-xl">✓</span>
                                    <span className="text-green-700 font-semibold text-sm">{plusCount}</span>
                                  </div>
                                )}
                                {minusCount > 0 && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-red-100 to-rose-100 px-3 py-1.5 rounded-full shadow-sm border border-red-300">
                                    <span className="text-red-700 font-bold text-xl">✗</span>
                                    <span className="text-red-700 font-semibold text-sm">{minusCount}</span>
                                  </div>
                                )}
                                {plusCount === 0 && minusCount === 0 && (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {(!studentsData?.students || studentsData.students.length === 0) && (
                      <tr>
                        <td colSpan={CATEGORIES.length + 1} className="border-2 border-gray-200 p-12 text-center text-gray-500 text-lg">
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="max-w-md mx-auto">
            {selectedClass?.monitorCode && (
              <div className="text-center mb-2">
                <div className="text-xs text-gray-500">Monitor Code:</div>
                <div className="text-sm font-mono font-bold text-blue-600">{selectedClass.monitorCode}</div>
              </div>
            )}
            <div className="flex items-center justify-between">
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
        </div>

        {/* Scrollable Student List - SUPER SIMPLE */}
        <div className="pb-24">
          {studentsData?.students.map((student) => {
            const isCentered = centeredStudentId === student.id;
            const score = studentScores.get(student.id);
            const plusCount = score ? score.scores.filter(s => s === 1).length : 0;
            const minusCount = score ? score.scores.filter(s => s === -1).length : 0;

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
                className="max-w-md mx-auto py-12 px-4"
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
                <div className="text-center">
                  <div className={`text-6xl font-bold ${isCentered ? 'text-blue-600' : 'text-black'}`}>
                    {student.name}
                  </div>
                  {isCentered && (
                    <div className="text-base text-gray-600 mt-2">
                      Swipe right for +, left for -
                    </div>
                  )}
                  {(plusCount > 0 || minusCount > 0) && (
                    <div className="text-lg mt-3">
                      {plusCount > 0 && <span className="text-green-600">✓{plusCount}</span>}
                      {minusCount > 0 && <span className="text-red-600 ml-4">✗{minusCount}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Bottom Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-10">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleSaveScores}
              className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              💾 Save Scores
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
