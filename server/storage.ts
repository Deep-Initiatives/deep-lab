import { type User, type InsertUser, type App, type Pod, type TimelineMilestone, type LabStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Apps
  getAllApps(): Promise<App[]>;
  getAppById(id: string): Promise<App | undefined>;
  
  // Pods
  getAllPods(): Promise<Pod[]>;
  getPodById(id: string): Promise<Pod | undefined>;
  
  // Timeline
  getAllMilestones(): Promise<TimelineMilestone[]>;
  
  // Stats
  getLabStats(): Promise<LabStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private apps: Map<string, App>;
  private pods: Map<string, Pod>;
  private milestones: Map<string, TimelineMilestone>;

  constructor() {
    this.users = new Map();
    this.apps = new Map();
    this.pods = new Map();
    this.milestones = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize apps based on Deep Lab's actual pods and prototypes
    const appsData: App[] = [
      {
        id: "1",
        name: "AI Avatar Generator",
        description: "Advanced AI system that creates realistic avatars from text descriptions using cutting-edge generative models.",
        category: "AI Agent",
        status: "Live",
        technologies: ["Python", "Stable Diffusion", "FastAPI"],
        demoUrl: "#",
      },
      {
        id: "2",
        name: "AI Review Assistants",
        description: "Intelligent review analysis tool that provides comprehensive feedback using natural language processing.",
        category: "AI Agent",
        status: "Beta",
        technologies: ["GPT-4", "React", "Node.js"],
        demoUrl: "#",
      },
      {
        id: "3",
        name: "Voting Methods Experiment",
        description: "Experimental platform testing various democratic voting methodologies and consensus mechanisms.",
        category: "Web App",
        status: "Prototype",
        technologies: ["TypeScript", "Web3", "Ethereum"],
      },
      {
        id: "4",
        name: "AI-based Idea Filtering",
        description: "AI-powered tool that analyzes and filters project ideas based on feasibility and innovation potential.",
        category: "Tool",
        status: "Live",
        technologies: ["Python", "NLP", "Redis"],
        demoUrl: "#",
      },
      {
        id: "5",
        name: "Impact Measure",
        description: "Quantitative framework for measuring the real-world impact of AI projects and interventions.",
        category: "Tool",
        status: "Beta",
        technologies: ["R", "PostgreSQL", "D3.js"],
      },
      {
        id: "6",
        name: "HiveMind/MM Integration",
        description: "Distributed AI system enabling collective intelligence through multi-model coordination.",
        category: "AI Agent",
        status: "In Development",
        technologies: ["PyTorch", "Redis", "gRPC"],
      },
      {
        id: "7",
        name: "Internal NewsFeed/Newsletter",
        description: "Smart content aggregation system delivering personalized AI and tech news to the community.",
        category: "Web App",
        status: "Live",
        technologies: ["Next.js", "GraphQL", "MongoDB"],
        demoUrl: "#",
      },
      {
        id: "8",
        name: "AI Assisted Proposal Refinement",
        description: "AI assistant helping teams craft better project proposals through iterative feedback.",
        category: "Tool",
        status: "Beta",
        technologies: ["OpenAI", "React", "Supabase"],
        demoUrl: "#",
      },
      {
        id: "9",
        name: "Community Hub Portal",
        description: "Central platform connecting developers, researchers, and AI enthusiasts in our ecosystem.",
        category: "Web App",
        status: "Live",
        technologies: ["Vue.js", "Firebase", "Tailwind"],
        demoUrl: "#",
      },
      {
        id: "10",
        name: "Code Review Agent",
        description: "Automated code review system using AI to identify bugs, suggest improvements, and ensure best practices.",
        category: "AI Agent",
        status: "Beta",
        technologies: ["GPT-4", "GitHub API", "Python"],
      },
      {
        id: "11",
        name: "Data Pipeline Builder",
        description: "Visual tool for creating and managing complex data processing pipelines with AI assistance.",
        category: "Tool",
        status: "Prototype",
        technologies: ["Apache Airflow", "React Flow", "PostgreSQL"],
      },
      {
        id: "12",
        name: "ML Model Marketplace",
        description: "Platform for discovering, testing, and deploying pre-trained machine learning models.",
        category: "Service",
        status: "In Development",
        technologies: ["Docker", "Kubernetes", "FastAPI"],
      },
      {
        id: "13",
        name: "Sentiment Analyzer Pro",
        description: "Real-time sentiment analysis service for social media, reviews, and customer feedback.",
        category: "Service",
        status: "Live",
        technologies: ["BERT", "Kafka", "Elasticsearch"],
        demoUrl: "#",
      },
      {
        id: "14",
        name: "Documentation Generator",
        description: "AI-powered tool that automatically generates comprehensive documentation from codebases.",
        category: "Tool",
        status: "Beta",
        technologies: ["CodeBERT", "Markdown", "TypeScript"],
      },
      {
        id: "15",
        name: "Smart Contract Auditor",
        description: "Automated security analysis tool for identifying vulnerabilities in blockchain smart contracts.",
        category: "AI Agent",
        status: "Prototype",
        technologies: ["Solidity", "Static Analysis", "Machine Learning"],
      },
    ];

    // Initialize pods from Deep Lab's active pods
    const podsData: Pod[] = [
      {
        id: "1",
        name: "AI Avatar",
        description: "Creating next-generation avatar generation systems with advanced AI models",
        status: "Active",
        progress: 75,
        teamSize: 4,
        startDate: "2025-06-01",
        technologies: ["Stable Diffusion", "PyTorch"],
      },
      {
        id: "2",
        name: "AI Review Assistants",
        description: "Building intelligent review and feedback systems for improved decision making",
        status: "Active",
        progress: 60,
        teamSize: 3,
        startDate: "2025-07-15",
        technologies: ["GPT-4", "LangChain"],
      },
      {
        id: "3",
        name: "Voting Methods Experiment",
        description: "Researching and implementing novel democratic voting mechanisms",
        status: "Active",
        progress: 45,
        teamSize: 5,
        startDate: "2025-08-01",
        technologies: ["Web3", "Smart Contracts"],
      },
      {
        id: "4",
        name: "AI-based Idea Filtering",
        description: "Developing AI systems to evaluate and prioritize innovative ideas",
        status: "Active",
        progress: 80,
        teamSize: 3,
        startDate: "2025-06-15",
        technologies: ["NLP", "Classification Models"],
      },
      {
        id: "5",
        name: "Impact Measurement",
        description: "Creating frameworks to quantify and track project impact metrics",
        status: "Active",
        progress: 55,
        teamSize: 4,
        startDate: "2025-07-01",
        technologies: ["Data Analytics", "Visualization"],
      },
      {
        id: "6",
        name: "Community Hub Portal",
        description: "Building a central platform for community engagement and collaboration",
        status: "Active",
        progress: 90,
        teamSize: 6,
        startDate: "2025-06-10",
        technologies: ["React", "Firebase"],
      },
    ];

    // Initialize timeline milestones
    const milestonesData: TimelineMilestone[] = [
      {
        id: "1",
        date: "2025-06-01",
        title: "Deep Lab Inception",
        description: "Official launch of Deep Lab with initial team formation and vision establishment for rapid AI prototyping",
        type: "launch",
      },
      {
        id: "2",
        date: "2025-07-01",
        title: "First 5 Apps Deployed",
        description: "Successfully prototyped and deployed our first batch of AI applications including Avatar Generator and Idea Filtering",
        type: "achievement",
      },
      {
        id: "3",
        date: "2025-08-15",
        title: "10+ Apps Milestone",
        description: "Reached double-digit app count with diverse portfolio across AI agents, web apps, and developer tools",
        type: "milestone",
      },
      {
        id: "4",
        date: "2025-09-01",
        title: "Partnership with DeepFunding",
        description: "Established strategic partnership with DeepFunding to accelerate AI innovation and provide funding opportunities",
        type: "partnership",
      },
      {
        id: "5",
        date: "2025-10-01",
        title: "15+ Apps & 6 Active Pods",
        description: "Expanded portfolio to 15+ applications with 6 thriving development pods making significant progress",
        type: "achievement",
      },
    ];

    // Populate the maps
    appsData.forEach(app => this.apps.set(app.id, app));
    podsData.forEach(pod => this.pods.set(pod.id, pod));
    milestonesData.forEach(milestone => this.milestones.set(milestone.id, milestone));
  }

  // User methods
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

  // App methods
  async getAllApps(): Promise<App[]> {
    return Array.from(this.apps.values());
  }

  async getAppById(id: string): Promise<App | undefined> {
    return this.apps.get(id);
  }

  // Pod methods
  async getAllPods(): Promise<Pod[]> {
    return Array.from(this.pods.values());
  }

  async getPodById(id: string): Promise<Pod | undefined> {
    return this.pods.get(id);
  }

  // Timeline methods
  async getAllMilestones(): Promise<TimelineMilestone[]> {
    return Array.from(this.milestones.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Stats methods
  async getLabStats(): Promise<LabStats> {
    const inceptionDate = new Date('2025-06-01');
    const now = new Date();
    const monthsDiff = (now.getFullYear() - inceptionDate.getFullYear()) * 12 + 
                      (now.getMonth() - inceptionDate.getMonth());

    return {
      totalApps: this.apps.size,
      activePods: Array.from(this.pods.values()).filter(p => p.status === "Active").length,
      teamMembers: 20, // Based on Deep Lab's team
      monthsSinceInception: monthsDiff,
    };
  }
}

export const storage = new MemStorage();
