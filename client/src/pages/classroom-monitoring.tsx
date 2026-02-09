import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Plus, CheckCircle2, XCircle, Users, BookOpen, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
  createdAt: string;
}

interface Student {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
}

interface Participation {
  id: string;
  studentId: string;
  classId: string;
  week: string;
  points: number;
  assignments: number;
  createdAt: string;
  updatedAt: string;
}

// Get current week in YYYY-MM-DD format (Monday of current week)
function getCurrentWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Parse voice commands
function parseCommand(text: string): {
  type: 'class' | 'tab' | 'student' | 'point' | 'assignment' | 'unknown';
  value?: string;
} {
  const lower = text.toLowerCase().trim();

  // Class navigation: "2 - a", "2 a", "grade 2 a", "class 2 a"
  const classMatch = lower.match(/(?:grade\s*)?(\d+)\s*[-]?\s*([a-z])/);
  if (classMatch) {
    return { type: 'class', value: `${classMatch[1]}-${classMatch[2].toUpperCase()}` };
  }

  // Tab navigation: "assignments", "participation", "students"
  if (lower.includes('assignment')) {
    return { type: 'tab', value: 'assignments' };
  }
  if (lower.includes('participation') || lower.includes('participate')) {
    return { type: 'tab', value: 'participation' };
  }
  if (lower.includes('student')) {
    return { type: 'tab', value: 'students' };
  }

  // Points: "plus", "add point", "point"
  if (lower.includes('plus') || (lower.includes('add') && lower.includes('point'))) {
    return { type: 'point' };
  }

  // Assignments: "assignment", "homework"
  if (lower.includes('homework') || (lower.includes('assignment') && !lower.includes('tab'))) {
    return { type: 'assignment' };
  }

  // Student name (if it's a name-like string, not a command)
  if (lower.length > 2 && !lower.match(/^(plus|add|point|assignment|tab|class|grade)/)) {
    return { type: 'student', value: text.trim() };
  }

  return { type: 'unknown' };
}

export default function ClassroomMonitoring() {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState('participation');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('');
  const [newClassSection, setNewClassSection] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isBulkImport, setIsBulkImport] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [bulkStudentText, setBulkStudentText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const currentWeek = getCurrentWeek();
  const queryClient = useQueryClient();

  const { isListening, transcript, error, startListening, stopListening, clearTranscript, isSupported } = useSpeechRecognition({
    onResult: (text) => {
      const command = parseCommand(text);
      handleVoiceCommand(command, text);
    },
    continuous: true,
  });

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

  // Fetch participation for selected class
  const { data: participationData } = useQuery<{ participation: Participation[] }>({
    queryKey: [`/api/classroom/participation/${selectedClass?.id}/${currentWeek}`],
    enabled: !!selectedClass,
  });

  const participationMap = useMemo(() => {
    const map = new Map<string, Participation>();
    if (participationData?.participation) {
      participationData.participation.forEach((p) => {
        map.set(p.studentId, p);
      });
    }
    return map;
  }, [participationData]);

  const handleVoiceCommand = async (command: { type: string; value?: string }, rawText: string) => {
    if (command.type === 'class' && command.value) {
      // Find class by name
      const cls = classesData?.classes.find(
        (c) => c.name.toLowerCase() === command.value.toLowerCase()
      );
      if (cls) {
        setSelectedClass(cls);
        toast.success(`Opened class ${cls.name}`);
      } else {
        toast.error(`Class ${command.value} not found`);
      }
    } else if (command.type === 'tab' && command.value) {
      setActiveTab(command.value);
      toast.success(`Switched to ${command.value} tab`);
    } else if (command.type === 'student' && command.value && selectedClass) {
      // Find student by name
      const student = studentsData?.students.find(
        (s) => s.name.toLowerCase().includes(command.value!.toLowerCase())
      );
      if (student) {
        setSelectedStudent(student);
        toast.success(`Selected student ${student.name}`);
      } else {
        toast.error(`Student ${command.value} not found`);
      }
    } else if (command.type === 'point' && selectedStudent && selectedClass) {
      // Add participation point
      addPointMutation.mutate({
        studentId: selectedStudent.id,
        classId: selectedClass.id,
        week: currentWeek,
      });
    } else if (command.type === 'assignment' && selectedStudent && selectedClass) {
      // Add assignment point
      addAssignmentMutation.mutate({
        studentId: selectedStudent.id,
        classId: selectedClass.id,
        week: currentWeek,
      });
    }
  };

  const addPointMutation = useMutation({
    mutationFn: async (data: { studentId: string; classId: string; week: string }) => {
      const res = await apiRequest('POST', '/api/classroom/participation/point', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/classroom/participation/${selectedClass?.id}/${currentWeek}`] });
      toast.success('Participation point added!');
      setSelectedStudent(null);
    },
  });

  const addAssignmentMutation = useMutation({
    mutationFn: async (data: { studentId: string; classId: string; week: string }) => {
      const res = await apiRequest('POST', '/api/classroom/participation/assignment', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/classroom/participation/${selectedClass?.id}/${currentWeek}`] });
      toast.success('Assignment point added!');
      setSelectedStudent(null);
    },
  });

  const createClassMutation = useMutation({
    mutationFn: async (data: { name: string; grade: number; section: string }) => {
      console.log('Creating class with data:', data);
      try {
        const res = await apiRequest('POST', '/api/classroom/classes', data);
        const result = await res.json();
        console.log('Class created successfully:', result);
        return result;
      } catch (error: any) {
        console.error('API request failed:', error);
        console.error('Request URL:', '/api/classroom/classes');
        console.error('Request data:', data);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/classes'] });
      setIsCreatingClass(false);
      setNewClassName('');
      setNewClassGrade('');
      setNewClassSection('');
      toast.success('Class created!');
    },
    onError: (error: any) => {
      console.error('Error creating class:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response,
      });
      const errorMessage = error?.message || error?.response?.message || 'Failed to create class. Please check the browser console (F12) for details.';
      toast.error(errorMessage);
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: { classId: string; name: string }) => {
      const res = await apiRequest('POST', '/api/classroom/students', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/students', selectedClass?.id] });
      setIsAddingStudent(false);
      setNewStudentName('');
      toast.success('Student added!');
    },
  });

  const handleCreateClass = () => {
    const trimmedName = newClassName.trim();
    const trimmedGrade = newClassGrade.trim();
    const trimmedSection = newClassSection.trim();
    
    if (!trimmedName || !trimmedGrade || !trimmedSection) {
      toast.error('Please fill all fields');
      return;
    }
    
    const grade = parseInt(trimmedGrade);
    if (isNaN(grade) || grade < 1 || grade > 12) {
      toast.error('Please enter a valid grade (1-12)');
      return;
    }
    
    if (trimmedSection.length !== 1 || !/^[A-Z]$/i.test(trimmedSection)) {
      toast.error('Section must be a single letter (A-Z)');
      return;
    }
    
    createClassMutation.mutate({
      name: trimmedName,
      grade,
      section: trimmedSection.toUpperCase(),
    });
  };

  const handleAddStudent = () => {
    if (!newStudentName || !selectedClass) {
      toast.error('Please enter student name');
      return;
    }
    createStudentMutation.mutate({
      classId: selectedClass.id,
      name: newStudentName,
    });
  };

  // Parse bulk student text (format: "01	name surname" or "01 name surname")
  const parseBulkStudents = (text: string): string[] => {
    const lines = text.split('\n');
    const students: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue; // Skip empty lines
      
      // Match patterns like:
      // "01	name surname"
      // "01 name surname"
      // "1. name surname"
      // "1 name surname"
      // Or just "name surname" if no number
      const match = trimmed.match(/^\d+[.\s\t]+(.+)$/);
      if (match) {
        students.push(match[1].trim());
      } else {
        // If no number prefix, use the whole line as name
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
      // Import students one by one
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
          console.error(`Failed to add student ${studentName}:`, error);
        }
      }

      // Refresh students list
      queryClient.invalidateQueries({ queryKey: [`/api/classroom/students?classId=${selectedClass.id}`] });
      
      setIsBulkImport(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classroom Monitoring</h1>
            <p className="text-gray-600 mt-1">Track student participation and assignments with voice commands</p>
          </div>
          
          <div className="flex items-center gap-4">
            {isSupported ? (
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? 'destructive' : 'default'}
                size="lg"
                className="gap-2"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Voice Input
                  </>
                )}
              </Button>
            ) : (
              <Badge variant="secondary">Speech recognition not supported</Badge>
            )}
            
            <Dialog open={isCreatingClass} onOpenChange={setIsCreatingClass}>
              <DialogTrigger asChild>
                <Button variant="outline">Create Class</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                  <DialogDescription>Add a new class to monitor</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="className">Class Name (e.g., 2-A)</Label>
                    <Input
                      id="className"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="2-A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classGrade">Grade</Label>
                    <Input
                      id="classGrade"
                      type="number"
                      value={newClassGrade}
                      onChange={(e) => setNewClassGrade(e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="classSection">Section</Label>
                    <Input
                      id="classSection"
                      value={newClassSection}
                      onChange={(e) => setNewClassSection(e.target.value.toUpperCase())}
                      placeholder="A"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateClass();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={handleCreateClass} 
                    className="w-full"
                    disabled={createClassMutation.isPending}
                    type="button"
                  >
                    {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
                  </Button>
                  {createClassMutation.isError && (
                    <p className="text-sm text-red-600 mt-2">
                      {createClassMutation.error?.message || 'Failed to create class. Please try again.'}
                    </p>
                  )}
                  {createClassMutation.isError && (
                    <p className="text-sm text-red-600">
                      {createClassMutation.error?.message || 'Failed to create class'}
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {transcript && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <strong>Heard:</strong> {transcript}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Classes Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {classesData?.classes.map((cls) => (
                  <Button
                    key={cls.id}
                    variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedClass(cls)}
                  >
                    {cls.name}
                  </Button>
                ))}
                {!classesData?.classes.length && (
                  <p className="text-sm text-gray-500">No classes yet. Create one to get started.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedClass ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Class {selectedClass.name}</CardTitle>
                      <CardDescription>Week of {new Date(currentWeek).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Add Student</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Student</DialogTitle>
                            <DialogDescription>Add a new student to {selectedClass.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="studentName">Student Name</Label>
                              <Input
                                id="studentName"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="John Doe"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddStudent();
                                  }
                                }}
                              />
                            </div>
                            <Button onClick={handleAddStudent} className="w-full">
                              Add Student
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isBulkImport} onOpenChange={setIsBulkImport}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Bulk Import
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Bulk Import Students</DialogTitle>
                            <DialogDescription>
                              Paste your student list. Format: one student per line, with optional number prefix.
                              <br />
                              <span className="text-xs text-gray-500">
                                Example: "01	name surname" or "01 name surname" or just "name surname"
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="bulkStudents">Student List</Label>
                              <Textarea
                                id="bulkStudents"
                                value={bulkStudentText}
                                onChange={(e) => setBulkStudentText(e.target.value)}
                                placeholder={`01\tJohn Doe
02\tJane Smith
03\tBob Johnson
...`}
                                rows={12}
                                className="font-mono text-sm"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {bulkStudentText ? `${parseBulkStudents(bulkStudentText).length} student(s) detected` : 'Paste your student list above'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleBulkImport} 
                                className="flex-1"
                                disabled={isImporting || !bulkStudentText.trim()}
                              >
                                {isImporting ? 'Importing...' : `Import ${parseBulkStudents(bulkStudentText).length} Student(s)`}
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  setBulkStudentText('');
                                }}
                                disabled={isImporting}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="participation">Participation</TabsTrigger>
                      <TabsTrigger value="assignments">Assignments</TabsTrigger>
                      <TabsTrigger value="students">Students</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="participation" className="mt-4">
                      <div className="space-y-2">
                        {studentsData?.students.map((student) => {
                          const participation = participationMap.get(student.id);
                          return (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{student.name}</span>
                                {selectedStudent?.id === student.id && (
                                  <Badge variant="secondary">Selected</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {participation?.points || 0} points
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                        {!studentsData?.students.length && (
                          <p className="text-sm text-gray-500 text-center py-8">
                            No students in this class. Add students to start tracking.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assignments" className="mt-4">
                      <div className="space-y-2">
                        {studentsData?.students.map((student) => {
                          const participation = participationMap.get(student.id);
                          return (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{student.name}</span>
                                {selectedStudent?.id === student.id && (
                                  <Badge variant="secondary">Selected</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {participation?.assignments || 0} assignments
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                        {!studentsData?.students.length && (
                          <p className="text-sm text-gray-500 text-center py-8">
                            No students in this class. Add students to start tracking.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="students" className="mt-4">
                      <div className="space-y-2">
                        {studentsData?.students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <span className="font-medium">{student.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {participationMap.get(student.id)?.points || 0} pts
                              </Badge>
                              <Badge variant="outline">
                                {participationMap.get(student.id)?.assignments || 0} asgn
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {!studentsData?.students.length && (
                          <p className="text-sm text-gray-500 text-center py-8">
                            No students in this class. Add students to start tracking.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {selectedStudent && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">Selected: {selectedStudent.name}</p>
                          <p className="text-sm text-blue-700">Say "plus" to add participation point, or "assignment" to add assignment</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              addPointMutation.mutate({
                                studentId: selectedStudent.id,
                                classId: selectedClass.id,
                                week: currentWeek,
                              });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Point
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              addAssignmentMutation.mutate({
                                studentId: selectedStudent.id,
                                classId: selectedClass.id,
                                week: currentWeek,
                              });
                            }}
                          >
                            <BookOpen className="w-4 h-4 mr-1" />
                            Add Assignment
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedStudent(null)}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">Select a class to start monitoring</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
