// Shared storage module for all classroom API endpoints
// This ensures all endpoints share the same in-memory storage

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

export function getClassesMap(): Map<string, Class> {
  if (!global.__classesStorage) {
    global.__classesStorage = new Map<string, Class>();
  }
  return global.__classesStorage;
}

export function getStudentsMap(): Map<string, Student> {
  if (!global.__studentsStorage) {
    global.__studentsStorage = new Map<string, Student>();
  }
  return global.__studentsStorage;
}

export function getScoresMap(): Map<string, ClassScores> {
  if (!global.__classScoresStorage) {
    global.__classScoresStorage = new Map<string, ClassScores>();
  }
  return global.__classScoresStorage;
}

export type { Class, Student, ClassScores };
