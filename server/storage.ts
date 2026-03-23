import { type User, type InsertUser, type Class, type InsertClass, type Student, type InsertStudent, type Participation, type InsertParticipation } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Classroom methods
  getClass(id: string): Promise<Class | undefined>;
  getClassByName(name: string): Promise<Class | undefined>;
  getAllClasses(): Promise<Class[]>;
  createClass(insertClass: InsertClass): Promise<Class>;
  updateClass(id: string, data: Partial<InsertClass>): Promise<Class>;
  deleteClass(id: string): Promise<void>;
  // Student methods
  getStudent(id: string): Promise<Student | undefined>;
  getStudentsByClass(classId: string): Promise<Student[]>;
  createStudent(insertStudent: InsertStudent): Promise<Student>;
  updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  // Participation methods
  getParticipation(studentId: string, classId: string, week: string): Promise<Participation | undefined>;
  getAllParticipationForClass(classId: string, week: string): Promise<Participation[]>;
  createOrUpdateParticipation(data: InsertParticipation): Promise<Participation>;
  addParticipationPoint(studentId: string, classId: string, week: string): Promise<Participation>;
  addAssignmentPoint(studentId: string, classId: string, week: string): Promise<Participation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private classes: Map<string, Class>;
  private students: Map<string, Student>;
  private participation: Map<string, Participation>;

  constructor() {
    this.users = new Map();
    this.classes = new Map();
    this.students = new Map();
    this.participation = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Classroom methods
  async getClass(id: string): Promise<Class | undefined> {
    return this.classes.get(id);
  }

  async getClassByName(name: string): Promise<Class | undefined> {
    return Array.from(this.classes.values()).find(
      (cls) => cls.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async getAllClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }

  async createClass(insertClass: InsertClass): Promise<Class> {
    const id = randomUUID();
    const monitorCode = (insertClass as any).monitorCode ?? insertClass.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cls: Class = {
      ...insertClass,
      id,
      monitorCode,
      grade: insertClass.grade ?? 0,
      section: insertClass.section ?? '',
      createdAt: new Date(),
    } as Class;
    this.classes.set(id, cls);
    return cls;
  }

  async updateClass(id: string, data: Partial<InsertClass>): Promise<Class> {
    const existing = this.classes.get(id);
    if (!existing) throw new Error("Class not found");
    const updated: Class = { ...existing, ...data };
    this.classes.set(id, updated);
    return updated;
  }

  async deleteClass(id: string): Promise<void> {
    // Delete related students and participation
    const studentsToDelete = Array.from(this.students.values()).filter(s => s.classId === id);
    studentsToDelete.forEach(s => {
      this.students.delete(s.id);
      // Delete participation for this student
      Array.from(this.participation.values())
        .filter(p => p.studentId === s.id)
        .forEach(p => this.participation.delete(p.id));
    });
    this.classes.delete(id);
  }

  // Student methods
  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    return Array.from(this.students.values()).filter(
      (student) => student.classId === classId,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = {
      ...insertStudent,
      id,
      createdAt: new Date(),
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student> {
    const existing = this.students.get(id);
    if (!existing) throw new Error("Student not found");
    const updated: Student = { ...existing, ...data };
    this.students.set(id, updated);
    return updated;
  }

  async deleteStudent(id: string): Promise<void> {
    // Delete related participation
    Array.from(this.participation.values())
      .filter(p => p.studentId === id)
      .forEach(p => this.participation.delete(p.id));
    this.students.delete(id);
  }

  // Participation methods
  private getParticipationKey(studentId: string, classId: string, week: string): string {
    return `${studentId}-${classId}-${week}`;
  }

  async getParticipation(studentId: string, classId: string, week: string): Promise<Participation | undefined> {
    const key = this.getParticipationKey(studentId, classId, week);
    return Array.from(this.participation.values()).find(
      (p) => p.studentId === studentId && p.classId === classId && p.week === week,
    );
  }

  async getAllParticipationForClass(classId: string, week: string): Promise<Participation[]> {
    return Array.from(this.participation.values()).filter(
      (p) => p.classId === classId && p.week === week,
    );
  }

  async createOrUpdateParticipation(data: InsertParticipation): Promise<Participation> {
    const existing = await this.getParticipation(data.studentId, data.classId, data.week);
    if (existing) {
      const updated: Participation = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.participation.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const participation: Participation = {
        ...data,
        points: data.points ?? 0,
        assignments: data.assignments ?? 0,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.participation.set(id, participation);
      return participation;
    }
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
      return this.createOrUpdateParticipation({
        studentId,
        classId,
        week,
        points: 1,
        assignments: 0,
      });
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
      return this.createOrUpdateParticipation({
        studentId,
        classId,
        week,
        points: 0,
        assignments: 1,
      });
    }
  }
}

export const storage = new MemStorage();
