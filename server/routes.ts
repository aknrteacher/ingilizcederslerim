import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClassSchema, insertStudentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Enable CORS for all routes
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // ============================================
  // CLASSROOM MONITORING ROUTES
  // ============================================
  
  // Classroom routes
  app.get("/api/classroom/classes", async (req, res) => {
    try {
      const classes = await storage.getAllClasses();
      res.json({ classes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/classroom/classes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cls = await storage.getClass(id);
      if (!cls) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json({ class: cls });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/classroom/classes/name/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const cls = await storage.getClassByName(name);
      if (!cls) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json({ class: cls });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/classroom/classes", async (req, res) => {
    try {
      const data = insertClassSchema.parse(req.body);
      const cls = await storage.createClass(data);
      res.json({ class: cls });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/classroom/classes", async (req, res) => {
    try {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ message: "id required" });
      await storage.deleteClass(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Student routes (support both /students?classId=xxx and /students/:classId)
  app.get("/api/classroom/students", async (req, res) => {
    try {
      const classId = req.query.classId as string;
      if (!classId) return res.status(400).json({ message: "classId required" });
      const students = await storage.getStudentsByClass(classId);
      res.json({ students });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  app.get("/api/classroom/students/:classId", async (req, res) => {
    try {
      const { classId } = req.params;
      const students = await storage.getStudentsByClass(classId);
      res.json({ students });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/classroom/students", async (req, res) => {
    try {
      const data = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(data);
      res.json({ student });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/classroom/students", async (req, res) => {
    try {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ message: "id required" });
      await storage.deleteStudent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Participation routes
  app.get("/api/classroom/participation/:classId/:week", async (req, res) => {
    try {
      const { classId, week } = req.params;
      const participation = await storage.getAllParticipationForClass(classId, week);
      res.json({ participation });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/classroom/participation/point", async (req, res) => {
    try {
      const { studentId, classId, week } = req.body;
      if (!studentId || !classId || !week) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const participation = await storage.addParticipationPoint(studentId, classId, week);
      res.json({ participation });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/classroom/participation/assignment", async (req, res) => {
    try {
      const { studentId, classId, week } = req.body;
      if (!studentId || !classId || !week) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const participation = await storage.addAssignmentPoint(studentId, classId, week);
      res.json({ participation });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Initialize permanent classes: edincik2A, edincik3A, edincik4A, edincik4B (each with one "test" student)
  // Scores routes (GET/POST for inclass category scores)
  app.get("/api/classroom/scores", async (req, res) => {
    try {
      const { default: handler } = await import("../api/classroom/scores");
      await handler(req, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });
  app.post("/api/classroom/scores", async (req, res) => {
    try {
      const { default: handler } = await import("../api/classroom/scores");
      await handler(req, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // Initialize permanent classes: edincik2A, edincik3A, edincik4A, edincik4B (each with one "test" student)
  app.post("/api/classroom/init-permanent-classes", async (req, res) => {
    try {
      const permanentClasses = [
        { name: 'edincik2A', grade: 2, section: 'A' },
        { name: 'edincik3A', grade: 3, section: 'A' },
        { name: 'edincik4A', grade: 4, section: 'A' },
        { name: 'edincik4B', grade: 4, section: 'B' },
      ];
      const created: { classes: any[]; students: any[] } = { classes: [], students: [] };

      for (const { name, grade, section } of permanentClasses) {
        const existing = await storage.getClassByName(name);
        if (existing) {
          const students = await storage.getStudentsByClass(existing.id);
          if (!students.some(s => s.name.toLowerCase() === 'test')) {
            const student = await storage.createStudent({ classId: existing.id, name: 'test' });
            created.students.push(student);
          }
          continue;
        }
        const cls = await storage.createClass({ name, grade, section });
        created.classes.push(cls);
        const student = await storage.createStudent({ classId: cls.id, name: 'test' });
        created.students.push(student);
      }

      res.json({
        success: true,
        message: `Initialized ${created.classes.length} classes and ${created.students.length} students`,
        classes: created.classes,
        students: created.students,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  return httpServer;
}
