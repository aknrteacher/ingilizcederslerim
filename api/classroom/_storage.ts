// Shared storage for Vercel serverless functions
// This is a copy of the storage logic that works in serverless context
import { randomUUID } from 'crypto';

interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
  createdAt: Date;
}

interface Student {
  id: string;
  classId: string;
  name: string;
  createdAt: Date;
}

interface Participation {
  id: string;
  studentId: string;
  classId: string;
  week: string;
  points: number;
  assignments: number;
  createdAt: Date;
  updatedAt: Date;
}

class MemStorage {
  private users: Map<string, any>;
  private classes: Map<string, Class>;
  private students: Map<string, Student>;
  private participation: Map<string, Participation>;

  constructor() {
    this.users = new Map();
    this.classes = new Map();
    this.students = new Map();
    this.participation = new Map();
  }

  async getAllClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }

  async getClass(id: string): Promise<Class | undefined> {
    return this.classes.get(id);
  }

  async getClassByName(name: string): Promise<Class | undefined> {
    return Array.from(this.classes.values()).find(
      (cls) => cls.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async createClass(data: { name: string; grade: number; section: string }): Promise<Class> {
    const id = randomUUID();
    const cls: Class = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.classes.set(id, cls);
    return cls;
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    return Array.from(this.students.values()).filter(
      (student) => student.classId === classId,
    );
  }

  async createStudent(data: { classId: string; name: string }): Promise<Student> {
    const id = randomUUID();
    const student: Student = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.students.set(id, student);
    return student;
  }

  async getAllParticipationForClass(classId: string, week: string): Promise<Participation[]> {
    return Array.from(this.participation.values()).filter(
      (p) => p.classId === classId && p.week === week,
    );
  }

  async getParticipation(studentId: string, classId: string, week: string): Promise<Participation | undefined> {
    return Array.from(this.participation.values()).find(
      (p) => p.studentId === studentId && p.classId === classId && p.week === week,
    );
  }

  async addParticipationPoint(studentId: string, classId: string, week: string): Promise<Participation> {
    const existing = await this.getParticipation(studentId, classId, week);
    if (existing) {
      const updated: Participation = {
        ...existing,
        points: (existing.points || 0) + 1,
        updatedAt: new Date(),
      };
      this.participation.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const participation: Participation = {
        id,
        studentId,
        classId,
        week,
        points: 1,
        assignments: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.participation.set(id, participation);
      return participation;
    }
  }

  async addAssignmentPoint(studentId: string, classId: string, week: string): Promise<Participation> {
    const existing = await this.getParticipation(studentId, classId, week);
    if (existing) {
      const updated: Participation = {
        ...existing,
        assignments: (existing.assignments || 0) + 1,
        updatedAt: new Date(),
      };
      this.participation.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const participation: Participation = {
        id,
        studentId,
        classId,
        week,
        points: 0,
        assignments: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.participation.set(id, participation);
      return participation;
    }
  }
}

// Global storage instance (shared across all function invocations in the same container)
// Note: In serverless, this will reset on cold starts, but persist during warm invocations
let storageInstance: MemStorage | null = null;

export function getStorage(): MemStorage {
  if (!storageInstance) {
    storageInstance = new MemStorage();
  }
  return storageInstance;
}

export const storage = getStorage();
