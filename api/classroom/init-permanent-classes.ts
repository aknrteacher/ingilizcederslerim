// API endpoint to initialize permanent classes: 2a, 3a, 4a, 4b
// Each class will have one student named "test"
/// <reference types="node" />

// Simple UUID generator
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Generate URL-safe monitor code from class name
function generateMonitorCode(className: string): string {
  return className.toLowerCase().replace(/[^a-z0-9]/g, '');
}

interface Class {
  id: string;
  name: string;
  monitorCode: string;
  createdAt: Date;
}

interface Student {
  id: string;
  classId: string;
  name: string;
  createdAt: Date;
}

// Global storage (shared across all API endpoints in the same runtime)
declare global {
  var __classesStorage: Map<string, Class> | undefined;
  var __studentsStorage: Map<string, Student> | undefined;
}

const getClassesMap = (): Map<string, Class> => {
  if (!global.__classesStorage) {
    global.__classesStorage = new Map<string, Class>();
  }
  return global.__classesStorage;
};

const getStudentsMap = (): Map<string, Student> => {
  if (!global.__studentsStorage) {
    global.__studentsStorage = new Map<string, Student>();
  }
  return global.__studentsStorage;
};

export default async function handler(req: any, res: any) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed. Use POST to initialize classes.' });
    }

    const classesMap = getClassesMap();
    const studentsMap = getStudentsMap();

    const permanentClasses = ['2a', '3a', '4a', '4b'];
    const createdClasses: Class[] = [];
    const createdStudents: Student[] = [];

    for (const className of permanentClasses) {
      // Check if class already exists
      const existingClass = Array.from(classesMap.values()).find(
        c => c.name.toLowerCase() === className.toLowerCase()
      );

      if (existingClass) {
        console.log(`[init] Class "${className}" already exists, skipping creation`);
        createdClasses.push(existingClass);
        
        // Check if student "test" exists for this class
        const existingTestStudent = Array.from(studentsMap.values()).find(
          s => s.classId === existingClass.id && s.name.toLowerCase() === 'test'
        );

        if (!existingTestStudent) {
          // Create test student
          const studentId = generateId();
          const student: Student = {
            id: studentId,
            classId: existingClass.id,
            name: 'test',
            createdAt: new Date(),
          };
          studentsMap.set(studentId, student);
          createdStudents.push(student);
          console.log(`[init] Created test student for class "${className}"`);
        } else {
          console.log(`[init] Test student already exists for class "${className}"`);
          createdStudents.push(existingTestStudent);
        }
      } else {
        // Create new class
        const classId = generateId();
        const monitorCode = generateMonitorCode(className);
        const classObj: Class = {
          id: classId,
          name: className,
          monitorCode,
          createdAt: new Date(),
        };
        classesMap.set(classId, classObj);
        createdClasses.push(classObj);
        console.log(`[init] Created class "${className}" with monitor code "${monitorCode}"`);

        // Create test student for this class
        const studentId = generateId();
        const student: Student = {
          id: studentId,
          classId: classId,
          name: 'test',
          createdAt: new Date(),
        };
        studentsMap.set(studentId, student);
        createdStudents.push(student);
        console.log(`[init] Created test student for class "${className}"`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Initialized ${createdClasses.length} classes and ${createdStudents.length} students`,
      classes: createdClasses.map(c => ({
        id: c.id,
        name: c.name,
        monitorCode: c.monitorCode,
      })),
      students: createdStudents.map(s => ({
        id: s.id,
        classId: s.classId,
        name: s.name,
      })),
    });
  } catch (error: any) {
    console.error('[init] Error initializing classes:', error);
    return res.status(500).json({
      message: error?.message || 'Internal server error',
    });
  }
}
