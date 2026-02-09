// Vercel serverless function for getting students by class (GET /api/classroom/students/:classId)
// This uses the SAME global storage as index.ts
import { getStudentsMap, type Student } from '../shared-storage';

const storage = {
  getStudentsByClass: async (classId: string): Promise<Student[]> => {
    const studentsMap = getStudentsMap();
    console.log(`[[classId].ts] Getting students for class ${classId}, total students: ${studentsMap.size}`);
    const students = Array.from(studentsMap.values()).filter(
      (student) => student.classId === classId,
    );
    console.log(`[[classId].ts] Found ${students.length} students for class ${classId}`);
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
