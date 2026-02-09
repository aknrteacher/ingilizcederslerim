// Vercel serverless function for getting students by class (GET /api/classroom/students/:classId)
interface Student {
  id: string;
  classId: string;
  name: string;
  createdAt: Date;
}

// Global storage (shared across all invocations in the same container)
// This MUST match the storage in index.ts
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
    console.log(`Getting students for class ${classId}, total students: ${studentsMap.size}`);
    const students = Array.from(studentsMap.values()).filter(
      (student) => student.classId === classId,
    );
    console.log(`Found ${students.length} students for class ${classId}`);
    return students;
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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed. Use GET to retrieve students.' });
  }

  const { classId } = req.query;

  try {
    if (!classId || typeof classId !== 'string') {
      return res.status(400).json({ message: 'Class ID is required' });
    }
    
    console.log(`GET /api/classroom/students/${classId}`);
    const students = await storage.getStudentsByClass(classId);
    console.log(`Returning ${students.length} students`);
    
    return res.status(200).json({ students });
  } catch (error: any) {
    console.error('Error getting students:', error);
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}
