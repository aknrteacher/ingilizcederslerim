// Vercel serverless function for creating students (POST /api/classroom/students)
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

// Inline storage - MUST match the storage in [classId].ts
// Note: In serverless, these are separate instances, so we need to use a shared approach
// For now, using a simple in-memory store that persists during warm invocations
interface Student {
  id: string;
  classId: string;
  name: string;
  createdAt: Date;
}

// Global storage (shared across all invocations in the same container)
// This will reset on cold starts, but persist during warm invocations
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
  createStudent: async (data: { classId: string; name: string }): Promise<Student> => {
    const studentsMap = getStudentsMap();
    const id = generateId();
    const student: Student = {
      ...data,
      id,
      createdAt: new Date(),
    };
    studentsMap.set(id, student);
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed. Use POST to create students.' });
  }

  try {
    console.log('POST /api/classroom/students - body:', req.body);
    
    const data = insertStudentSchema.parse(req.body);
    console.log('Parsed student data:', data);
    
    const student = await storage.createStudent(data);
    console.log('Student created:', student);
    
    return res.status(200).json({ student });
  } catch (error: any) {
    console.error('Error creating student:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors 
      });
    }
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}
