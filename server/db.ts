import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { 
  users, 
  pods, 
  apps, 
  milestones, 
  type User, 
  type Pod, 
  type App, 
  type TimelineMilestone, 
  type LabStats,
  type InsertUser,
  type InsertPod,
  type InsertApp,
  type InsertMilestone
} from "@shared/schema";
import { eq, and, desc, count } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL || "./local.db";
const sqlite = new Database(connectionString);
export const db = drizzle(sqlite);

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
    const result = await db.insert(users).values(userData).returning();
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
    // Convert date strings to Date objects for SQLite
    const processedData = {
      ...podData,
      startDate: new Date(podData.startDate),
      endDate: podData.endDate ? new Date(podData.endDate) : null,
    };
    const result = await db.insert(pods).values(processedData).returning();
    return result[0];
  }

  async updatePod(id: string, podData: Partial<InsertPod>): Promise<Pod | undefined> {
    // Convert date strings to Date objects for SQLite
    const processedData: any = { ...podData, updatedAt: new Date() };
    if (podData.startDate) {
      processedData.startDate = new Date(podData.startDate);
    }
    if (podData.endDate) {
      processedData.endDate = new Date(podData.endDate);
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
    const result = await db.insert(apps).values(appData).returning();
    return result[0];
  }

  async updateApp(id: string, appData: Partial<InsertApp>): Promise<App | undefined> {
    const result = await db
      .update(apps)
      .set({ ...appData, updatedAt: new Date() })
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
