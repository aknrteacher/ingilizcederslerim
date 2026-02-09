// Vercel serverless function for public class monitoring
/// <reference types="node" />
import { z } from 'zod';

// Inline storage - MUST match classes.ts exactly to share storage
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

interface ClassScores {
  classId: string;
  scores: Record<string, Record<string, number[]>>;
  updatedAt: Date;
}

// Global storage (shared across all API endpoints in the same runtime)
declare global {
  var __classesStorage: Map<string, Class> | undefined;
  var __studentsStorage: Map<string, Student> | undefined;
  var __classScoresStorage: Map<string, ClassScores> | undefined;
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

const getScoresMap = (): Map<string, ClassScores> => {
  if (!global.__classScoresStorage) {
    global.__classScoresStorage = new Map<string, ClassScores>();
  }
  return global.__classScoresStorage;
};

export default async function handler(req: any, res: any) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    console.log('[monitor] Request query:', req.query);
    console.log('[monitor] Request URL:', req.url);
    console.log('[monitor] Request params:', (req as any).params);
    
    // Try different ways to get the code (Vercel might pass it differently)
    // In Vercel, dynamic route params can be in req.query or req.params
    let code: string | null = null;
    
    // Try req.query.code first (Vercel's standard way)
    if (req.query && typeof req.query.code === 'string') {
      code = req.query.code;
    }
    // Try req.params.code (some Vercel setups use this)
    else if ((req as any).params && typeof (req as any).params.code === 'string') {
      code = (req as any).params.code;
    }
    // Fallback: extract from URL
    else if (req.url) {
      const urlParts = req.url.split('/').filter(Boolean);
      // Find the part after 'monitor'
      const monitorIndex = urlParts.indexOf('monitor');
      if (monitorIndex >= 0 && monitorIndex < urlParts.length - 1) {
        code = urlParts[monitorIndex + 1].split('?')[0];
      } else {
        // Last resort: take the last part
        code = urlParts[urlParts.length - 1]?.split('?')[0] || null;
      }
    }
    
    console.log('[monitor] Extracted code:', code);
    
    if (!code || typeof code !== 'string' || code.length === 0) {
      console.error('[monitor] Invalid code:', code);
      return res.status(400).json({ message: 'Invalid monitor code' });
    }
    
    // Convert to lowercase for matching (class names are stored as lowercase)
    const codeLower = code.toLowerCase().trim();

    const classesMap = getClassesMap();
    
    // Migration: Ensure all classes have monitorCode based on their name
    // This handles both old 4-digit codes and any classes that might have been created incorrectly
    const allClasses = Array.from(classesMap.values());
    let migrated = 0;
    allClasses.forEach(cls => {
      // Generate expected monitorCode from class name
      const expectedMonitorCode = cls.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // If monitorCode doesn't match expected format, update it
      if (cls.monitorCode !== expectedMonitorCode) {
        const oldCode = cls.monitorCode;
        cls.monitorCode = expectedMonitorCode;
        classesMap.set(cls.id, cls);
        migrated++;
        console.log(`[monitor] Migrated class "${cls.name}": "${oldCode}" -> "${expectedMonitorCode}"`);
      }
    });
    if (migrated > 0) {
      console.log(`[monitor] Migrated ${migrated} classes to use class names as monitor codes`);
    }
    
    // Refresh after migration
    const updatedClasses = Array.from(classesMap.values());
    
    console.log('[monitor] Total classes:', classesMap.size);
    console.log('[monitor] All classes:', updatedClasses.map(c => `"${c.name}" -> monitorCode:"${c.monitorCode}"`));
    console.log('[monitor] Searching for code:', codeLower);
    
    // Find by monitor code (which is now the class name in lowercase)
    let classObj = updatedClasses.find(c => c.monitorCode === codeLower);
    console.log('[monitor] Match by monitorCode:', classObj ? `FOUND: ${classObj.name}` : 'NOT FOUND');
    
    // Fallback: if not found by monitorCode, try matching by class name (for existing classes)
    if (!classObj) {
      // Try exact lowercase match first
      classObj = updatedClasses.find(c => c.name.toLowerCase() === codeLower);
      console.log('[monitor] Tried exact name match:', classObj ? `FOUND: ${classObj.name}` : 'NOT FOUND');
      
      // Try normalized match (remove all non-alphanumeric)
      if (!classObj) {
        classObj = updatedClasses.find(c => {
          const normalizedName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normalizedCode = codeLower.replace(/[^a-z0-9]/g, '');
          return normalizedName === normalizedCode;
        });
        if (classObj) {
          console.log('[monitor] Normalized match FOUND:', classObj.name);
        } else {
          console.log('[monitor] Normalized match NOT FOUND');
        }
      }
    }
    
    console.log('[monitor] Final result - Found class:', classObj ? classObj.name : 'NOT FOUND');
    
    if (!classObj) {
      // Return detailed error with available classes for debugging
      return res.status(404).json({ 
        message: 'Class not found',
        searchedFor: codeLower,
        availableClasses: updatedClasses.map(c => ({
          name: c.name,
          monitorCode: c.monitorCode,
          normalizedName: c.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        }))
      });
    }

    const studentsMap = getStudentsMap();
    const students = Array.from(studentsMap.values()).filter(s => s.classId === classObj.id);
    console.log('[monitor] Found students:', students.length);

    const scoresMap = getScoresMap();
    const scores = scoresMap.get(classObj.id);
    console.log('[monitor] Scores found:', !!scores);

    const response = {
      class: {
        id: classObj.id,
        name: classObj.name,
        monitorCode: classObj.monitorCode,
      },
      students: students.map(s => ({
        id: s.id,
        name: s.name,
      })) || [],
      scores: scores?.scores || {},
      updatedAt: scores?.updatedAt || null,
    };
    
    console.log('[monitor] Returning response:', {
      className: response.class.name,
      studentCount: response.students.length,
      studentNames: response.students.map(s => s.name),
      hasScores: Object.keys(response.scores).length > 0
    });
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('[monitor] Error in monitor handler:', error);
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}
