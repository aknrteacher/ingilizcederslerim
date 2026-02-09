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

    const code = req.query.code;
    if (!code || !/^\d{4}$/.test(code)) {
      return res.status(400).json({ message: 'Invalid monitor code' });
    }

    const classesMap = getClassesMap();
    const classObj = Array.from(classesMap.values()).find(c => c.monitorCode === code);
    
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const studentsMap = getStudentsMap();
    const students = Array.from(studentsMap.values()).filter(s => s.classId === classObj.id);

    const scoresMap = getScoresMap();
    const scores = scoresMap.get(classObj.id);

    return res.status(200).json({
      class: {
        id: classObj.id,
        name: classObj.name,
        monitorCode: classObj.monitorCode,
      },
      students: students.map(s => ({
        id: s.id,
        name: s.name,
      })),
      scores: scores?.scores || {},
      updatedAt: scores?.updatedAt || null,
    });
  } catch (error: any) {
    console.error('Error in monitor handler:', error);
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}
