import { sql } from "drizzle-orm";
import { pgTable, text, integer, real, timestamp, boolean, uuid, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"), // admin, coordinator, blog-admin
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Database Tables
export const pods = pgTable("pods", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // Active, Planning, Completed, On Hold
  progress: integer("progress").notNull().default(0), // 0-100
  teamSize: integer("team_size").notNull().default(1),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  technologies: json("technologies").$type<string[]>().default([]),
  industry: text("industry"), // AI4SDGs, Blockchain, ClimateTech, Emerging Technologies, Platform Development, Research
  coordinatorId: uuid("coordinator_id").references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const apps = pgTable("apps", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // AI Agent, Web App, Tool, Service
  status: text("status").notNull(), // Lined Up, In Progress, Completed (legacy: Prototype, In Development, Beta, Live)
  progress: integer("progress").notNull().default(0), // 0-100
  teamSize: integer("team_size").notNull().default(1),
  startDate: timestamp("start_date").notNull().defaultNow(),
  technologies: json("technologies").$type<string[]>().default([]),
  industry: text("industry"), // AI4SDGs, Blockchain, ClimateTech, Emerging Technologies, Platform Development, Research
  icon: text("icon"),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  podId: uuid("pod_id").references(() => pods.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date: timestamp("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // launch, achievement, milestone, partnership
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  category: text("category").notNull(), // Announcement, Partnership, Technology, Platform, Research, AI System
  tags: json("tags").$type<string[]>().default([]),
  readTime: text("read_time").notNull(),
  imageUrl: text("image_url"),
  externalUrl: text("external_url"),
  isActive: boolean("is_active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  mattermostHandle: text("mattermost_handle").notNull(),
  circles: json("circles").$type<string[]>().default([]),
  meetsRequirements: text("meets_requirements").notNull(),
  currentlyInCircle: text("currently_in_circle").notNull(),
  status: text("status").notNull().default("pending"), // pending, reviewed, accepted, rejected
  notes: text("notes"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const ideaSubmissions = pgTable("idea_submissions", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  submitterName: text("submitter_name").notNull(),
  problemStatement: text("problem_statement").notNull(),
  proposedSolution: text("proposed_solution").notNull(),
  targetAudience: text("target_audience").notNull(),
  expectedImpact: text("expected_impact").notNull(),
  requiredExpertise: json("required_expertise").$type<string[]>().default([]),
  successMetrics: text("success_metrics"),
  dependencies: text("dependencies"),
  status: text("status").notNull().default("pending"), // pending, under_review, approved, rejected, in_development
  notes: text("notes"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
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
  industry: true,
  coordinatorId: true,
});

export const insertAppSchema = createInsertSchema(apps).pick({
  name: true,
  description: true,
  category: true,
  status: true,
  progress: true,
  teamSize: true,
  startDate: true,
  technologies: true,
  industry: true,
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

export const insertBlogSchema = createInsertSchema(blogs).pick({
  title: true,
  excerpt: true,
  content: true,
  author: true,
  publishedAt: true,
  category: true,
  tags: true,
  readTime: true,
  imageUrl: true,
  externalUrl: true,
  featured: true,
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  fullName: true,
  email: true,
  role: true,
  mattermostHandle: true,
  circles: true,
  meetsRequirements: true,
  currentlyInCircle: true,
});

export const insertIdeaSubmissionSchema = createInsertSchema(ideaSubmissions).pick({
  title: true,
  submitterName: true,
  problemStatement: true,
  proposedSolution: true,
  targetAudience: true,
  expectedImpact: true,
  requiredExpertise: true,
  successMetrics: true,
  dependencies: true,
});

// Type exports
export type Pod = typeof pods.$inferSelect;
export type InsertPod = z.infer<typeof insertPodSchema>;
export type App = typeof apps.$inferSelect;
export type InsertApp = z.infer<typeof insertAppSchema>;
export type TimelineMilestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type IdeaSubmission = typeof ideaSubmissions.$inferSelect;
export type InsertIdeaSubmission = z.infer<typeof insertIdeaSubmissionSchema>;

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  inquiryType: text("inquiry_type").notNull(), // General, Partnership, Support, Other
  status: text("status").notNull().default("new"), // new, read, replied, closed
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
  inquiryType: true,
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

// Legacy type exports for backward compatibility
export type AppCategory = "AI Agent" | "Web App" | "Tool" | "Service";
export type AppStatus = "Live" | "Beta" | "Prototype" | "In Development";
export type PodStatus = "Active" | "Planning" | "Completed" | "On Hold";
export type BlogCategory = "Announcement" | "Partnership" | "Technology" | "Platform" | "Research" | "AI System";
export type Industry = "AI4SDGs" | "Blockchain" | "ClimateTech" | "Emerging Technologies" | "Platform Development" | "Research";

// Project category types (for UI organization)
export type ProjectCategory = "Lined Up" | "In Progress" | "Completed";

// Stats types
export interface LabStats {
  totalApps: number;
  activePods: number;
  teamMembers: number;
  monthsSinceInception: number;
}
