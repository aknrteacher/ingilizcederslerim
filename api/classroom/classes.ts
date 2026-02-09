// Vercel serverless function for classroom classes API
// Self-contained - no external storage imports
/// <reference types="node" />
import { z } from 'zod';

// Define schema inline to avoid import issues
const insertClassSchema = z.object({
  name: z.string().min(1),
});

// Simple UUID generator (no external dependencies)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Inline storage to avoid module resolution issues in Vercel
interface Class {
  id: string;
  name: string;
  monitorCode: string; // URL-safe class name (lowercased)
  createdAt: Date;
}

// Generate URL-safe monitor code from class name
function generateMonitorCode(className: string): string {
  // Convert to lowercase and remove spaces/special chars, keep alphanumeric
  return className.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Global storage (shared across invocations in same container)
declare global {
  var __classesStorage: Map<string, Class> | undefined;
  var __studentsStorage: Map<string, any> | undefined;
}

const getClassesMap = (): Map<string, Class> => {
  if (!global.__classesStorage) {
    global.__classesStorage = new Map<string, Class>();
  }
  return global.__classesStorage;
};

const storage = {
  getAllClasses: async (): Promise<Class[]> => {
    const classesMap = getClassesMap();
    const classes = Array.from(classesMap.values());
    
    // Migration: Update old classes that have 4-digit codes to use class name as monitorCode
    let updated = 0;
    classes.forEach(cls => {
      // If monitorCode is a 4-digit number, update it to use class name
      if (/^\d{4}$/.test(cls.monitorCode)) {
        const newMonitorCode = generateMonitorCode(cls.name);
        cls.monitorCode = newMonitorCode;
        classesMap.set(cls.id, cls);
        updated++;
        console.log(`[classes.ts] Migrated class ${cls.name}: old code -> ${newMonitorCode}`);
      }
    });
    if (updated > 0) {
      console.log(`[classes.ts] Migrated ${updated} classes to use class names as monitor codes`);
    }
    
    return classes;
  },
  createClass: async (data: { name: string }): Promise<Class> => {
    const classesMap = getClassesMap();
    const id = generateId();
    const monitorCode = generateMonitorCode(data.name);
    const cls: Class = {
      name: data.name,
      id,
      monitorCode,
      createdAt: new Date(),
    };
    classesMap.set(id, cls);
    console.log(`[classes.ts] Created class ${cls.name} (${cls.id}) with monitor code ${monitorCode}, total classes: ${classesMap.size}`);
    return cls;
  },
  getClassByCode: async (code: string): Promise<Class | null> => {
    const classesMap = getClassesMap();
    const cls = Array.from(classesMap.values()).find(c => c.monitorCode === code);
    return cls || null;
  },
  deleteClass: async (id: string): Promise<void> => {
    const classesMap = getClassesMap();
    // Also delete related students (they're stored in global.__studentsStorage)
    const studentsMap = getStudentsMap();
    if (studentsMap) {
      const studentsToDelete = Array.from(studentsMap.values()).filter(s => s.classId === id);
      studentsToDelete.forEach(s => studentsMap.delete(s.id));
      console.log(`[classes.ts] Deleted ${studentsToDelete.length} students for class ${id}`);
    }
    classesMap.delete(id);
    console.log(`[classes.ts] Deleted class ${id}, total classes: ${classesMap.size}`);
  },
};

// Helper to get students map (for deletion)
const getStudentsMap = (): Map<string, any> => {
  if (!global.__studentsStorage) {
    global.__studentsStorage = new Map();
  }
  return global.__studentsStorage;
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

    if (method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Class ID is required as query parameter' });
      }

      try {
        await storage.deleteClass(id);
        return res.status(200).json({ success: true });
      } catch (err: any) {
        console.error('Error deleting class:', err);
        return res.status(500).json({ message: err?.message || 'Failed to delete class' });
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
