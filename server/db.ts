import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { 
  users, 
  pods, 
  apps, 
  milestones,
  blogs,
  type User, 
  type Pod, 
  type App, 
  type TimelineMilestone,
  type Blog,
  type LabStats,
  type InsertUser,
  type InsertPod,
  type InsertApp,
  type InsertMilestone,
  type InsertBlog
} from "@shared/schema";
import { hashPassword } from "./auth";
import { eq, and, desc, count } from "drizzle-orm";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Database connection established successfully
export const db = drizzle(pool);

export class DatabaseStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);
    const result = await db.insert(users).values({
      ...userData,
      password: hashedPassword
    }).returning();
    return result[0];
  }

  // Pod methods
  async getAllPods(): Promise<Pod[]> {
    return await db.select().from(pods).where(eq(pods.isActive, true)).orderBy(desc(pods.createdAt));
  }

  async getPodById(id: string): Promise<Pod | undefined> {
    const result = await db.select().from(pods).where(and(eq(pods.id, id), eq(pods.isActive, true))).limit(1);
    return result[0];
  }

  async createPod(podData: InsertPod): Promise<Pod> {
    // Convert date strings to Date objects and ensure technologies is an array
    const processedData = {
      ...podData,
      startDate: new Date(podData.startDate),
      endDate: podData.endDate ? new Date(podData.endDate) : null,
      technologies: Array.isArray(podData.technologies) ? podData.technologies as string[] : [],
    };
    const result = await db.insert(pods).values(processedData).returning();
    return result[0];
  }

  async updatePod(id: string, podData: Partial<InsertPod>): Promise<Pod | undefined> {
    // Convert date strings to Date objects and ensure technologies is an array
    const processedData: any = { ...podData };
    
    // Handle updatedAt
    processedData.updatedAt = new Date();
    
    // Handle startDate
    if (podData.startDate !== undefined) {
      if (typeof podData.startDate === 'string') {
        const startDateStr = podData.startDate as string;
        if (startDateStr.trim() !== '') {
          processedData.startDate = new Date(startDateStr);
        }
      } else if (podData.startDate instanceof Date) {
        processedData.startDate = podData.startDate;
      }
    }
    
    // Handle endDate
    if (podData.endDate !== undefined) {
      if (typeof podData.endDate === 'string') {
        const endDateStr = podData.endDate as string;
        if (endDateStr.trim() !== '') {
          processedData.endDate = new Date(endDateStr);
        } else {
          processedData.endDate = null;
        }
      } else if (podData.endDate instanceof Date) {
        processedData.endDate = podData.endDate;
      } else if (podData.endDate === null) {
        processedData.endDate = null;
      }
    }
    
    // Handle technologies
    if (podData.technologies !== undefined) {
      processedData.technologies = Array.isArray(podData.technologies) ? podData.technologies as string[] : [];
    }
    
    const result = await db
      .update(pods)
      .set(processedData)
      .where(and(eq(pods.id, id), eq(pods.isActive, true)))
      .returning();
    return result[0];
  }

  async deletePod(id: string): Promise<boolean> {
    const result = await db
      .update(pods)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(pods.id, id), eq(pods.isActive, true)))
      .returning();
    return result.length > 0;
  }

  // App methods
  async getAllApps(): Promise<App[]> {
    return await db.select().from(apps).where(eq(apps.isActive, true)).orderBy(desc(apps.createdAt));
  }

  async getAppById(id: string): Promise<App | undefined> {
    const result = await db.select().from(apps).where(and(eq(apps.id, id), eq(apps.isActive, true))).limit(1);
    return result[0];
  }

  async createApp(appData: InsertApp): Promise<App> {
    const processedData = {
      ...appData,
      technologies: Array.isArray(appData.technologies) ? appData.technologies as string[] : [],
    };
    const result = await db.insert(apps).values(processedData).returning();
    return result[0];
  }

  async updateApp(id: string, appData: Partial<InsertApp>): Promise<App | undefined> {
    const processedData: any = { ...appData };
    
    // Handle updatedAt
    processedData.updatedAt = new Date();
    
    // Handle technologies
    if (appData.technologies !== undefined) {
      processedData.technologies = Array.isArray(appData.technologies) ? appData.technologies as string[] : [];
    }
    
    const result = await db
      .update(apps)
      .set(processedData)
      .where(and(eq(apps.id, id), eq(apps.isActive, true)))
      .returning();
    return result[0];
  }

  async deleteApp(id: string): Promise<boolean> {
    const result = await db
      .update(apps)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(apps.id, id), eq(apps.isActive, true)))
      .returning();
    return result.length > 0;
  }

  // Milestone methods
  async getAllMilestones(): Promise<TimelineMilestone[]> {
    return await db.select().from(milestones).where(eq(milestones.isActive, true)).orderBy(milestones.date);
  }

  async createMilestone(milestoneData: InsertMilestone): Promise<TimelineMilestone> {
    // Convert date string to Date object for SQLite
    const processedData = {
      ...milestoneData,
      date: new Date(milestoneData.date),
    };
    const result = await db.insert(milestones).values(processedData).returning();
    return result[0];
  }

  async updateMilestone(id: string, milestoneData: Partial<InsertMilestone>): Promise<TimelineMilestone | undefined> {
    const result = await db
      .update(milestones)
      .set({ ...milestoneData, updatedAt: new Date() })
      .where(and(eq(milestones.id, id), eq(milestones.isActive, true)))
      .returning();
    return result[0];
  }

  async deleteMilestone(id: string): Promise<boolean> {
    const result = await db
      .update(milestones)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(milestones.id, id), eq(milestones.isActive, true)))
      .returning();
    return result.length > 0;
  }

  // Blog methods
  async getAllBlogs(): Promise<Blog[]> {
    return await db.select().from(blogs).where(eq(blogs.isActive, true)).orderBy(desc(blogs.publishedAt));
  }

  async getBlogById(id: string): Promise<Blog | undefined> {
    const result = await db.select().from(blogs).where(and(eq(blogs.id, id), eq(blogs.isActive, true))).limit(1);
    return result[0];
  }

  async createBlog(blogData: InsertBlog): Promise<Blog> {
    const processedData = {
      ...blogData,
      tags: Array.isArray(blogData.tags) ? blogData.tags as string[] : [],
    };
    const result = await db.insert(blogs).values(processedData).returning();
    return result[0];
  }

  async updateBlog(id: string, blogData: Partial<InsertBlog>): Promise<Blog | undefined> {
    const processedData: any = { ...blogData };
    
    // Handle updatedAt
    processedData.updatedAt = new Date();
    
    // Handle publishedAt
    if (blogData.publishedAt !== undefined) {
      if (typeof blogData.publishedAt === 'string') {
        const publishedAtStr = blogData.publishedAt as string;
        if (publishedAtStr.trim() !== '') {
          processedData.publishedAt = new Date(publishedAtStr);
        }
      } else if (blogData.publishedAt instanceof Date) {
        processedData.publishedAt = blogData.publishedAt;
      }
    }
    
    // Handle tags
    if (blogData.tags !== undefined) {
      processedData.tags = Array.isArray(blogData.tags) ? blogData.tags as string[] : [];
    }
    
    const result = await db
      .update(blogs)
      .set(processedData)
      .where(and(eq(blogs.id, id), eq(blogs.isActive, true)))
      .returning();
    return result[0];
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await db
      .update(blogs)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(blogs.id, id), eq(blogs.isActive, true)))
      .returning();
    return result.length > 0;
  }

  // Stats methods
  async getLabStats(): Promise<LabStats> {
    const inceptionDate = new Date('2025-06-01');
    const now = new Date();
    const monthsDiff = (now.getFullYear() - inceptionDate.getFullYear()) * 12 + 
                      (now.getMonth() - inceptionDate.getMonth());

    const [totalAppsResult, activePodsResult] = await Promise.all([
      db.select({ count: count() }).from(apps).where(eq(apps.isActive, true)),
      db.select({ count: count() }).from(pods).where(and(eq(pods.isActive, true), eq(pods.status, "Active")))
    ]);

    return {
      totalApps: totalAppsResult[0].count,
      activePods: activePodsResult[0].count,
      teamMembers: 40, // This could be calculated from actual team data
      monthsSinceInception: monthsDiff,
    };
  }
}

export const dbStorage = new DatabaseStorage();
