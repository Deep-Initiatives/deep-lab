import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"), // admin, coordinator
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Database Tables
export const pods = sqliteTable("pods", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // Active, Planning, Completed, On Hold
  progress: integer("progress").notNull().default(0), // 0-100
  teamSize: integer("team_size").notNull().default(1),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  technologies: text("technologies", { mode: "json" }).$type<string[]>().default([]),
  coordinatorId: text("coordinator_id").references(() => users.id),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const apps = sqliteTable("apps", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // AI Agent, Web App, Tool, Service
  status: text("status").notNull(), // Live, Beta, Prototype, In Development
  technologies: text("technologies", { mode: "json" }).$type<string[]>().default([]),
  icon: text("icon"),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  podId: text("pod_id").references(() => pods.id),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const milestones = sqliteTable("milestones", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: integer("date", { mode: "timestamp" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // launch, achievement, milestone, partnership
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Insert schemas for validation
export const insertPodSchema = createInsertSchema(pods).pick({
  name: true,
  description: true,
  status: true,
  progress: true,
  teamSize: true,
  startDate: true,
  endDate: true,
  technologies: true,
  coordinatorId: true,
});

export const insertAppSchema = createInsertSchema(apps).pick({
  name: true,
  description: true,
  category: true,
  status: true,
  technologies: true,
  icon: true,
  demoUrl: true,
  githubUrl: true,
  podId: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).pick({
  date: true,
  title: true,
  description: true,
  type: true,
});

// Type exports
export type Pod = typeof pods.$inferSelect;
export type InsertPod = z.infer<typeof insertPodSchema>;
export type App = typeof apps.$inferSelect;
export type InsertApp = z.infer<typeof insertAppSchema>;
export type TimelineMilestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

// Legacy type exports for backward compatibility
export type AppCategory = "AI Agent" | "Web App" | "Tool" | "Service";
export type AppStatus = "Live" | "Beta" | "Prototype" | "In Development";
export type PodStatus = "Active" | "Planning" | "Completed" | "On Hold";

// Stats types
export interface LabStats {
  totalApps: number;
  activePods: number;
  teamMembers: number;
  monthsSinceInception: number;
}
