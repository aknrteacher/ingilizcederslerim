import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Classroom monitoring schema
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // e.g., "2-A", "3-B"
  grade: integer("grade").default(0).notNull(),
  section: text("section").default("").notNull(), // e.g., "A", "B"
  monitorCode: text("monitor_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const participation = pgTable("participation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  classId: varchar("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  week: text("week").notNull(), // Format: "2024-W01" or "YYYY-MM-DD" for week start
  points: integer("points").default(0).notNull(),
  assignments: integer("assignments").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClassSchema = createInsertSchema(classes).pick({
  name: true,
  grade: true,
  section: true,
  monitorCode: true,
}).partial({ grade: true, section: true, monitorCode: true });

export const insertStudentSchema = createInsertSchema(students).pick({
  classId: true,
  name: true,
});

export const insertParticipationSchema = createInsertSchema(participation).pick({
  studentId: true,
  classId: true,
  week: true,
  points: true,
  assignments: true,
});

export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertParticipation = z.infer<typeof insertParticipationSchema>;
export type Participation = typeof participation.$inferSelect;
