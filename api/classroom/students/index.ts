// Vercel serverless function for students API
// Handles both POST /api/classroom/students and GET /api/classroom/students?classId=xxx
import { z } from 'zod';

// Define schema inline to avoid import issues
const insertStudentSchema = z.object({
  classId: z.string().min(1),
  name: z.string().min(1),
});

// Simple UUID generator (no external dependencies)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Inline storage - shared storage for this function
interface Student {
  id: string;
  classId: string;
  name: string;
  createdAt: Date;
}

// Global storage (shared across all invocations in the same container)
declare global {
  var __studentsStorage: Map<string, Student> | undefined;
}

const getStudentsMap = (): Map<string, Student> => {
  if (!global.__studentsStorage) {
    global.__studentsStorage = new Map<string, Student>();
  }
  return global.__studentsStorage;
};

const storage = {
  getStudentsByClass: async (classId: string): Promise<Student[]> => {
    const studentsMap = getStudentsMap();
    console.log(`[index.ts] Getting students for class ${classId}, total students: ${studentsMap.size}`);
    const students = Array.from(studentsMap.values()).filter(
      (student) => student.classId === classId,
    );
    console.log(`[index.ts] Found ${students.length} students for class ${classId}`);
    return students;
  },
  createStudent: async (data: { classId: string; name: string }): Promise<Student> => {
    const studentsMap = getStudentsMap();
    const id = generateId();
    const student: Student = {
      ...data,
      id,
      createdAt: new Date(),
    };
    studentsMap.set(id, student);
    console.log(`[index.ts] Created student ${student.name} (${student.id}) for class ${student.classId}, total students now: ${studentsMap.size}`);
    return student;
  },
};

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Handle GET request (with classId query parameter)
    if (req.method === 'GET') {
      const { classId } = req.query;
      if (!classId || typeof classId !== 'string') {
        return res.status(400).json({ message: 'Class ID is required as query parameter' });
      }
      
      console.log(`[index.ts] GET /api/classroom/students?classId=${classId}`);
      const students = await storage.getStudentsByClass(classId);
      console.log(`[index.ts] Returning ${students.length} students`);
      
      return res.status(200).json({ students });
    }

    // Handle POST request
    if (req.method === 'POST') {
      console.log('[index.ts] POST /api/classroom/students - body:', req.body);
      
      const data = insertStudentSchema.parse(req.body);
      console.log('[index.ts] Parsed student data:', data);
      
      const student = await storage.createStudent(data);
      console.log('[index.ts] Student created:', student);
      
      return res.status(200).json({ student });
    }

    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error('[index.ts] Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors 
      });
    }
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}
