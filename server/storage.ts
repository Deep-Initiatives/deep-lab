import { type User, type InsertUser, type App, type Pod, type TimelineMilestone, type Blog, type Application, type InsertApplication, type IdeaSubmission, type InsertIdeaSubmission, type LabStats } from "@shared/schema";
import { dbStorage } from "./db";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Apps
  getAllApps(): Promise<App[]>;
  getAppById(id: string): Promise<App | undefined>;
  createApp(app: any): Promise<App>;
  updateApp(id: string, app: any): Promise<App | undefined>;
  deleteApp(id: string): Promise<boolean>;
  
  // Pods
  getAllPods(): Promise<Pod[]>;
  getPodById(id: string): Promise<Pod | undefined>;
  createPod(pod: any): Promise<Pod>;
  updatePod(id: string, pod: any): Promise<Pod | undefined>;
  deletePod(id: string): Promise<boolean>;
  
  // Timeline
  getAllMilestones(): Promise<TimelineMilestone[]>;
  createMilestone(milestone: any): Promise<TimelineMilestone>;
  updateMilestone(id: string, milestone: any): Promise<TimelineMilestone | undefined>;
  deleteMilestone(id: string): Promise<boolean>;
  
  // Blogs
  getAllBlogs(): Promise<Blog[]>;
  getBlogById(id: string): Promise<Blog | undefined>;
  createBlog(blog: any): Promise<Blog>;
  updateBlog(id: string, blog: any): Promise<Blog | undefined>;
  deleteBlog(id: string): Promise<boolean>;
  
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getAllApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  updateApplicationStatus(id: string, status: string, notes?: string): Promise<Application>;
  deleteApplication(id: string): Promise<void>;
  
  // Idea Submissions
  createIdeaSubmission(idea: InsertIdeaSubmission): Promise<IdeaSubmission>;
  getAllIdeaSubmissions(): Promise<IdeaSubmission[]>;
  getIdeaSubmission(id: string): Promise<IdeaSubmission | undefined>;
  updateIdeaSubmissionStatus(id: string, status: string, notes?: string): Promise<IdeaSubmission>;
  deleteIdeaSubmission(id: string): Promise<void>;
  
  // Stats
  getLabStats(): Promise<LabStats>;
}

// Database-backed storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return await dbStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await dbStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return await dbStorage.createUser(user);
  }

  // App methods
  async getAllApps(): Promise<App[]> {
    return await dbStorage.getAllApps();
  }

  async getAppById(id: string): Promise<App | undefined> {
    return await dbStorage.getAppById(id);
  }

  async createApp(app: any): Promise<App> {
    return await dbStorage.createApp(app);
  }

  async updateApp(id: string, app: any): Promise<App | undefined> {
    return await dbStorage.updateApp(id, app);
  }

  async deleteApp(id: string): Promise<boolean> {
    return await dbStorage.deleteApp(id);
  }

  // Pod methods
  async getAllPods(): Promise<Pod[]> {
    return await dbStorage.getAllPods();
  }

  async getPodById(id: string): Promise<Pod | undefined> {
    return await dbStorage.getPodById(id);
  }

  async createPod(pod: any): Promise<Pod> {
    return await dbStorage.createPod(pod);
  }

  async updatePod(id: string, pod: any): Promise<Pod | undefined> {
    return await dbStorage.updatePod(id, pod);
  }

  async deletePod(id: string): Promise<boolean> {
    return await dbStorage.deletePod(id);
  }

  // Timeline methods
  async getAllMilestones(): Promise<TimelineMilestone[]> {
    return await dbStorage.getAllMilestones();
  }

  async createMilestone(milestone: any): Promise<TimelineMilestone> {
    return await dbStorage.createMilestone(milestone);
  }

  async updateMilestone(id: string, milestone: any): Promise<TimelineMilestone | undefined> {
    return await dbStorage.updateMilestone(id, milestone);
  }

  async deleteMilestone(id: string): Promise<boolean> {
    return await dbStorage.deleteMilestone(id);
  }

  // Blog methods
  async getAllBlogs(): Promise<Blog[]> {
    return await dbStorage.getAllBlogs();
  }

  async getBlogById(id: string): Promise<Blog | undefined> {
    return await dbStorage.getBlogById(id);
  }

  async createBlog(blog: any): Promise<Blog> {
    return await dbStorage.createBlog(blog);
  }

  async updateBlog(id: string, blog: any): Promise<Blog | undefined> {
    return await dbStorage.updateBlog(id, blog);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await dbStorage.deleteBlog(id);
  }

  // Application methods
  async createApplication(application: InsertApplication): Promise<Application> {
    return await dbStorage.createApplication(application);
  }

  async getAllApplications(): Promise<Application[]> {
    return await dbStorage.getAllApplications();
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return await dbStorage.getApplication(id);
  }

  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<Application> {
    return await dbStorage.updateApplicationStatus(id, status, notes);
  }

  async deleteApplication(id: string): Promise<void> {
    return await dbStorage.deleteApplication(id);
  }

  // Idea Submission methods
  async createIdeaSubmission(idea: InsertIdeaSubmission): Promise<IdeaSubmission> {
    return await dbStorage.createIdeaSubmission(idea);
  }

  async getAllIdeaSubmissions(): Promise<IdeaSubmission[]> {
    return await dbStorage.getAllIdeaSubmissions();
  }

  async getIdeaSubmission(id: string): Promise<IdeaSubmission | undefined> {
    return await dbStorage.getIdeaSubmission(id);
  }

  async updateIdeaSubmissionStatus(id: string, status: string, notes?: string): Promise<IdeaSubmission> {
    return await dbStorage.updateIdeaSubmissionStatus(id, status, notes);
  }

  async deleteIdeaSubmission(id: string): Promise<void> {
    return await dbStorage.deleteIdeaSubmission(id);
  }

  // Stats methods
  async getLabStats(): Promise<LabStats> {
    return await dbStorage.getLabStats();
  }
}

export const storage = new DatabaseStorage();
