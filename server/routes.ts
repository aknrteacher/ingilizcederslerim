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

  // Monitor route (public class view at /edincik2a, etc.)
  app.get("/api/classroom/monitor/:code", async (req, res) => {
    try {
      const code = (req.params.code || "").toLowerCase().trim();
      if (!code) return res.status(400).json({ message: "Invalid monitor code" });
      const codeNorm = code.replace(/[^a-z0-9]/g, "");

      let classes = await storage.getAllClasses();
      // Auto-initialize permanent classes if none exist (e.g. after server restart)
      if (classes.length === 0) {
        for (const { name, grade, section } of [
          { name: "edincik2A", grade: 2, section: "A" },
          { name: "edincik3A", grade: 3, section: "A" },
          { name: "edincik4A", grade: 4, section: "A" },
          { name: "edincik4B", grade: 4, section: "B" },
        ]) {
          const cls = await storage.createClass({ name, grade, section });
          await storage.createStudent({ classId: cls.id, name: "test" });
        }
        classes = await storage.getAllClasses();
      }

      const classObj = classes.find(
        (c) =>
          ((c as any).monitorCode ?? c.name.toLowerCase().replace(/[^a-z0-9]/g, "")) === codeNorm
      );

      if (!classObj) {
        return res.status(404).json({
          message: "Class not found",
          searchedFor: code,
          availableClasses: classes.map((c) => ({
            name: c.name,
            monitorCode: (c as any).monitorCode ?? c.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
          })),
        });
      }

      const students = await storage.getStudentsByClass(classObj.id);
      const scoresEntry = (global as any).__classScoresStorage?.get(classObj.id);
      const scores = scoresEntry?.scores || {};
      const monitorCode = (classObj as any).monitorCode ?? classObj.name.toLowerCase().replace(/[^a-z0-9]/g, "");

      res.json({
        class: { id: classObj.id, name: classObj.name, monitorCode },
        students: students.map((s) => ({ id: s.id, name: s.name })),
        scores,
        updatedAt: scoresEntry?.updatedAt || null,
      });
    } catch (error: any) {
      console.error("[monitor] Error:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  // Published snapshot (teacher publishes table for parents to see)
  // IMPORTANT: we always normalize the key the SAME way the parent page does:
  // lowercase and remove all non-alphanumeric characters.
  const publishedSnapshots = new Map<
    string,
    {
      class: any;
      students: any[];
      scores: Record<string, Record<string, number[]>>;
      updatedAt: Date;
    }
  >();
  app.post("/api/classroom/publish-snapshot", async (req, res) => {
    try {
      const { classId, class: classObj, students, scores } = req.body;
      if (!classId || !classObj || !students) return res.status(400).json({ message: "Missing required fields" });
      // Normalize monitor code exactly like the parent page URL:
      // 1) take monitorCode if present, otherwise generate from name
      // 2) lowercase
      // 3) strip everything except a–z and 0–9
      const rawMonitorCode =
        (classObj.monitorCode ||
          classObj.name?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
          "") as string;
      const mc = rawMonitorCode.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!mc) return res.status(400).json({ message: "Invalid class" });

      publishedSnapshots.set(mc, {
        class: { ...classObj, monitorCode: mc },
        students,
        scores: scores || {},
        updatedAt: new Date(),
      });

      res.json({ success: true, monitorCode: mc });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });
  app.get("/api/classroom/published-snapshot/:code", async (req, res) => {
    try {
      const code = (req.params.code || "").toLowerCase().trim();
      const snapshot = publishedSnapshots.get(code.replace(/[^a-z0-9]/g, ""));
      if (!snapshot) return res.status(404).json({ message: "No published snapshot" });
      res.json(snapshot);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

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
