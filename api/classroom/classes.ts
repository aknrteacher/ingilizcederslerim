// Vercel serverless function for classroom classes API
// This works alongside the Express server routes for production deployment
import { z } from 'zod';

// Define schema inline to avoid import issues
const insertClassSchema = z.object({
  name: z.string().min(1),
  grade: z.number().int().min(1).max(12),
  section: z.string().min(1).max(10),
});

// Simple UUID generator (no external dependencies)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Inline storage to avoid module resolution issues in Vercel
interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
  createdAt: Date;
}

const classesMap = new Map<string, Class>();

const storage = {
  getAllClasses: async (): Promise<Class[]> => {
    return Array.from(classesMap.values());
  },
  createClass: async (data: { name: string; grade: number; section: string }): Promise<Class> => {
    const id = generateId();
    const cls: Class = {
      ...data,
      id,
      createdAt: new Date(),
    };
    classesMap.set(id, cls);
    return cls;
  },
};

export default async function handler(req: any, res: any) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const method = req.method || 'GET';
    console.log(`[${method}] /api/classroom/classes`);

    if (method === 'GET') {
      try {
        const classes = await storage.getAllClasses();
        return res.status(200).json({ classes });
      } catch (err: any) {
        console.error('Error getting classes:', err);
        throw err;
      }
    }

    if (method === 'POST') {
      console.log('POST request body:', JSON.stringify(req.body, null, 2));
      
      // Handle case where body might be a string
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON in request body' });
        }
      }
      
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ message: 'Request body is required and must be an object' });
      }

      try {
        const data = insertClassSchema.parse(body);
        console.log('Parsed and validated data:', data);
        
        const cls = await storage.createClass(data);
        console.log('Class created successfully:', cls);
        
        return res.status(200).json({ class: cls });
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          console.error('Zod validation error:', err.errors);
          return res.status(400).json({ 
            message: err.errors[0]?.message || 'Validation error',
            errors: err.errors 
          });
        }
        throw err;
      }
    }

    return res.status(405).json({ message: `Method ${method} not allowed` });
  } catch (error: any) {
    console.error('Unhandled error in classroom/classes:', error);
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    
    return res.status(500).json({ 
      message: error?.message || 'Internal server error'
    });
  }
}
