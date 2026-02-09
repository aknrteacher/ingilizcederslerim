// Vercel serverless function for public class monitoring
/// <reference types="node" />
import { z } from 'zod';

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
    
    // Try different ways to get the code (Vercel might pass it differently)
    const code = req.query.code || req.query?.code || (req.url ? req.url.split('/').pop()?.split('?')[0] : null);
    console.log('[monitor] Extracted code:', code);
    
    if (!code || typeof code !== 'string') {
      console.error('[monitor] Invalid code:', code);
      return res.status(400).json({ message: 'Invalid monitor code' });
    }
    
    // Convert to lowercase for matching (class names are stored as lowercase)
    const codeLower = code.toLowerCase();

    const classesMap = getClassesMap();
    console.log('[monitor] Total classes:', classesMap.size);
    const allClasses = Array.from(classesMap.values());
    console.log('[monitor] All monitor codes:', allClasses.map(c => c.monitorCode));
    console.log('[monitor] All class names:', allClasses.map(c => c.name));
    
    // Find by monitor code (which is now the class name in lowercase)
    let classObj = allClasses.find(c => c.monitorCode === codeLower);
    
    // Fallback: if not found by monitorCode, try matching by class name (for existing classes)
    if (!classObj) {
      classObj = allClasses.find(c => c.name.toLowerCase() === codeLower);
      console.log('[monitor] Tried fallback match by name');
    }
    
    console.log('[monitor] Found class:', classObj ? classObj.name : 'NOT FOUND');
    
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
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
