// Vercel serverless function for classroom classes API
// This works alongside the Express server routes for production deployment
import { storage } from '../../server/storage';
import { insertClassSchema } from '../../shared/schema';
import { z } from 'zod';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const classes = await storage.getAllClasses();
      return res.status(200).json({ classes });
    }

    if (req.method === 'POST') {
      const data = insertClassSchema.parse(req.body);
      const cls = await storage.createClass(data);
      return res.status(200).json({ class: cls });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error in classroom/classes:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
