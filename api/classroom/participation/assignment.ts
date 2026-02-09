// Vercel serverless function for assignment points API
import { storage } from '../_storage';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { studentId, classId, week } = req.body;
    if (!studentId || !classId || !week) {
      return res.status(400).json({ message: 'Missing required fields: studentId, classId, week' });
    }
    const participation = await storage.addAssignmentPoint(studentId, classId, week);
    return res.status(200).json({ participation });
  } catch (error: any) {
    console.error('Error in classroom/participation/assignment:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
