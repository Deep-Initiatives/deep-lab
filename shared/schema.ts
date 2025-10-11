import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
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

// App/Project types
export type AppCategory = "AI Agent" | "Web App" | "Tool" | "Service";
export type AppStatus = "Live" | "Beta" | "Prototype" | "In Development";

export interface App {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  status: AppStatus;
  technologies: string[];
  icon?: string;
  demoUrl?: string;
  githubUrl?: string;
}

// Pod types
export type PodStatus = "Active" | "Planning" | "Completed" | "On Hold";

export interface Pod {
  id: string;
  name: string;
  description: string;
  status: PodStatus;
  progress: number; // 0-100
  teamSize: number;
  startDate: string;
  technologies?: string[];
}

// Timeline milestone types
export interface TimelineMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "launch" | "achievement" | "milestone" | "partnership";
}

// Stats types
export interface LabStats {
  totalApps: number;
  activePods: number;
  teamMembers: number;
  monthsSinceInception: number;
}
