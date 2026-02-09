import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Users } from 'lucide-react';
import { toast } from 'sonner';

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
  console.log('[Command] Parsing:', lower);

  // Points: "plus", "add point", "point", "+" (spoken as "plus")
  if (lower === 'plus' || lower === '+' || lower.includes('plus') || 
      (lower.includes('add') && lower.includes('point')) ||
      lower === 'point' || lower === 'points') {
    console.log('[Command] Matched: point');
    return { type: 'point' };
  }

  // Assignments: "assignment", "homework", "home work"
  if (lower.includes('homework') || lower.includes('home work') || 
      (lower.includes('assignment') && !lower.includes('tab'))) {
    console.log('[Command] Matched: assignment');
    return { type: 'assignment' };
  }

  // Tab navigation: "assignments", "participation", "students"
  if (lower.includes('assignment') && lower.includes('tab')) {
    return { type: 'tab', value: 'assignments' };
  }
  if (lower.includes('participation') || lower.includes('participate')) {
    return { type: 'tab', value: 'participation' };
  }
  if (lower.includes('student') && lower.includes('tab')) {
    return { type: 'tab', value: 'students' };
  }

  // Class navigation: "2 - a", "2 a", "grade 2 a", "class 2 a"
  const classMatch = lower.match(/(?:grade\s*)?(\d+)\s*[-]?\s*([a-z])/);
  if (classMatch) {
    console.log('[Command] Matched: class', classMatch[1], classMatch[2]);
    return { type: 'class', value: `${classMatch[1]}-${classMatch[2].toUpperCase()}` };
  }

  // Student name (if it's a name-like string, not a command)
  // Exclude common command words
  const commandWords = ['plus', 'add', 'point', 'points', 'assignment', 'assignments', 'tab', 'class', 'grade', 'participation', 'homework'];
  const isCommand = commandWords.some(word => lower === word || lower.startsWith(word + ' '));
  
  if (!isCommand && lower.length > 1) {
    console.log('[Command] Matched: student', text.trim());
    return { type: 'student', value: text.trim() };
  }

  console.log('[Command] Unknown command');
  return { type: 'unknown' };
}

export default function ClassroomMonitoring() {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState('participation');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [bulkStudentText, setBulkStudentText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const currentWeek = getCurrentWeek();
  const queryClient = useQueryClient();

  // Add debug logging function
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const { isListening, transcript, error, startListening, stopListening, isSupported } = useSpeechRecognition({
    onResult: (text) => {
      addDebugLog(`Heard: "${text}"`);
      const command = parseCommand(text);
      addDebugLog(`Command: ${command.type}${command.value ? ` (${command.value})` : ''}`);
      handleVoiceCommand(command, text);
    },
    continuous: true,
    onStart: () => addDebugLog('Speech recognition started'),
    onError: (err: string) => addDebugLog(`Error: ${err}`),
    onEnd: () => addDebugLog('Speech recognition ended'),
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
    console.log('[Voice] Processing command:', command, 'rawText:', rawText);
    
    if (command.type === 'class' && command.value) {
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
      // Try exact match first, then partial match
      const exactMatch = studentsData?.students.find(
        (s) => s.name.toLowerCase() === command.value!.toLowerCase()
      );
      const partialMatch = studentsData?.students.find(
        (s) => s.name.toLowerCase().includes(command.value!.toLowerCase()) ||
               command.value!.toLowerCase().includes(s.name.toLowerCase())
      );
      const student = exactMatch || partialMatch;
      
      if (student) {
        setSelectedStudent(student);
        toast.success(`✓ Selected student: ${student.name}`);
        console.log('[Voice] Selected student:', student.name);
      } else {
        toast.error(`Student "${command.value}" not found. Available: ${studentsData?.students.map(s => s.name).join(', ') || 'none'}`);
        console.log('[Voice] Student not found. Available students:', studentsData?.students.map(s => s.name));
      }
    } else if (command.type === 'point') {
      if (selectedStudent && selectedClass) {
        console.log('[Voice] Adding participation point for', selectedStudent.name);
        addParticipationMutation.mutate({
          studentId: selectedStudent.id,
          classId: selectedClass.id,
          week: currentWeek,
        });
      } else {
        toast.error('Please select a student first (say the student name)');
      }
    } else if (command.type === 'assignment') {
      if (selectedStudent && selectedClass) {
        console.log('[Voice] Adding assignment point for', selectedStudent.name);
        addAssignmentMutation.mutate({
          studentId: selectedStudent.id,
          classId: selectedClass.id,
          week: currentWeek,
        });
      } else {
        toast.error('Please select a student first (say the student name)');
      }
    } else if (command.type === 'unknown') {
      console.log('[Voice] Unknown command:', rawText);
      // Don't show error for unknown commands, just log
    }
  };

  const addParticipationMutation = useMutation({
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
    mutationFn: async (data: { name: string }) => {
      console.log('Creating class with data:', data);
      const res = await apiRequest('POST', '/api/classroom/classes', data);
      const result = await res.json();
      console.log('Class created successfully:', result);
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
      console.error('Error creating class:', error);
      toast.error(error?.message || 'Failed to create class');
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: { classId: string; name: string }) => {
      console.log('Creating student:', data);
      const res = await apiRequest('POST', '/api/classroom/students', data);
      const result = await res.json();
      console.log('Student created:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/students', selectedClass?.id] });
      setNewStudentName('');
      toast.success('Student added!');
    },
    onError: (error: any) => {
      console.error('Error adding student:', error);
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
          console.error(`Failed to add student ${studentName}:`, error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Classroom Monitoring</h1>
            <p className="text-gray-600 mt-1">Track student participation and assignments</p>
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
          </div>
        </div>

        {/* Large microphone status and transcript display at top */}
        {isListening && (
          <Card className="mb-6 border-2 border-green-500 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <strong className="text-lg text-green-800">🎤 LISTENING...</strong>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebug(!showDebug)}
                >
                  {showDebug ? 'Hide' : 'Show'} Debug
                </Button>
              </div>
              <div className="mt-4 p-4 bg-white rounded border-2 border-green-300 min-h-[60px]">
                {transcript ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Hearing:</div>
                    <div className="text-2xl font-semibold text-gray-900">{transcript}</div>
                  </div>
                ) : (
                  <div className="text-gray-400 italic text-center py-2">
                    <div>Speak now... (waiting for input)</div>
                    <div className="text-xs mt-2 text-gray-500">
                      💡 Speak clearly into your microphone
                    </div>
                  </div>
                )}
              </div>
              
              {/* Debug Panel */}
              {showDebug && (
                <div className="mt-4 p-3 bg-gray-900 text-green-400 rounded text-xs font-mono max-h-40 overflow-y-auto">
                  <div className="text-white mb-2 font-bold">Debug Log:</div>
                  {debugLogs.length > 0 ? (
                    debugLogs.map((log, i) => (
                      <div key={i} className="mb-1">{log}</div>
                    ))
                  ) : (
                    <div className="text-gray-500">No events yet...</div>
                  )}
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-600">
                💡 Say a student name, then "plus" for participation or "assignment" for homework
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {selectedStudent && (
          <div className="mb-4 p-3 bg-purple-100 border border-purple-400 text-purple-700 rounded flex items-center justify-between">
            <div>
              <strong>Selected Student:</strong> {selectedStudent.name}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedStudent(null)}
            >
              Clear
            </Button>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create or Select Class</CardTitle>
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
            
            {classesData?.classes && classesData.classes.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Label className="mb-2 block">Select Existing Class:</Label>
                <div className="flex flex-wrap gap-2">
                  {classesData.classes.map((cls) => (
                    <Button
                      key={cls.id}
                      variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedClass(cls)}
                    >
                      {cls.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedClass ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Add Students
                </CardTitle>
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

                <div className="pt-4 border-t">
                  <Label className="mb-2 block">Students ({studentsData?.students.length || 0})</Label>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {studentsData?.students.map((student) => (
                      <div
                        key={student.id}
                        className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                          selectedStudent?.id === student.id
                            ? 'bg-purple-200 border-2 border-purple-500 font-semibold'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedStudent(student);
                          toast.success(`Selected ${student.name}`);
                        }}
                      >
                        {student.name}
                        {selectedStudent?.id === student.id && (
                          <span className="ml-2 text-purple-600">✓</span>
                        )}
                      </div>
                    ))}
                    {!studentsData?.students.length && (
                      <p className="text-sm text-gray-500">No students yet. Add students above.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Class {selectedClass.name}</CardTitle>
                      <CardDescription>Week of {new Date(currentWeek).toLocaleDateString()}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="participation">Participation</TabsTrigger>
                      <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="participation" className="mt-4">
                      <div className="space-y-2">
                        {studentsData?.students.map((student) => {
                          const participation = participationMap.get(student.id);
                          const points = participation?.points || 0;
                          return (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedStudent(student);
                                addParticipationMutation.mutate({
                                  studentId: student.id,
                                  classId: selectedClass.id,
                                  week: currentWeek,
                                });
                              }}
                            >
                              <span>{student.name}</span>
                              <Badge variant="secondary">{points} points</Badge>
                            </div>
                          );
                        })}
                        {!studentsData?.students.length && (
                          <p className="text-sm text-gray-500 text-center py-8">No students yet. Add students in the left panel.</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assignments" className="mt-4">
                      <div className="space-y-2">
                        {studentsData?.students.map((student) => {
                          const participation = participationMap.get(student.id);
                          const assignments = participation?.assignments || 0;
                          return (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedStudent(student);
                                addAssignmentMutation.mutate({
                                  studentId: student.id,
                                  classId: selectedClass.id,
                                  week: currentWeek,
                                });
                              }}
                            >
                              <span>{student.name}</span>
                              <Badge variant="secondary">{assignments} assignments</Badge>
                            </div>
                          );
                        })}
                        {!studentsData?.students.length && (
                          <p className="text-sm text-gray-500 text-center py-8">No students yet. Add students in the left panel.</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Create a class above or select an existing class to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
