// Vercel serverless function for classroom students API
import { storage } from '../_storage';
import { z } from 'zod';

// Define schema inline to avoid import issues
const insertStudentSchema = z.object({
  classId: z.string().min(1),
  name: z.string().min(1),
});

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { classId } = req.query;

  try {
    if (req.method === 'GET') {
      if (!classId || typeof classId !== 'string') {
        return res.status(400).json({ message: 'Class ID is required' });
      }
      const students = await storage.getStudentsByClass(classId);
      return res.status(200).json({ students });
    }

    if (req.method === 'POST') {
      const data = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(data);
      return res.status(200).json({ student });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error in classroom/students:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
