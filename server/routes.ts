import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateToken, verifyToken, comparePassword, extractTokenFromHeader } from "./auth";

// Authentication middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  req.user = payload;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role
      });
      
      res.json({ 
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Get all apps
  app.get("/api/apps", async (_req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ error: "Failed to fetch apps" });
    }
  });

  // Get app by ID
  app.get("/api/apps/:id", async (req, res) => {
    try {
      const app = await storage.getAppById(req.params.id);
      if (!app) {
        return res.status(404).json({ error: "App not found" });
      }
      res.json(app);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch app" });
    }
  });

  // Get all pods
  app.get("/api/pods", async (_req, res) => {
    try {
      const pods = await storage.getAllPods();
      res.json(pods);
    } catch (error) {
      console.error("Error fetching pods:", error);
      res.status(500).json({ error: "Failed to fetch pods" });
    }
  });

  // Get pod by ID
  app.get("/api/pods/:id", async (req, res) => {
    try {
      const pod = await storage.getPodById(req.params.id);
      if (!pod) {
        return res.status(404).json({ error: "Pod not found" });
      }
      res.json(pod);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pod" });
    }
  });

  // Get all timeline milestones
  app.get("/api/milestones", async (_req, res) => {
    try {
      const milestones = await storage.getAllMilestones();
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ error: "Failed to fetch milestones" });
    }
  });

  // Get lab stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getLabStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin API endpoints for pod management
  // Create new pod
  app.post("/api/admin/pods", authenticateToken, async (req, res) => {
    try {
      const pod = await storage.createPod(req.body);
      res.status(201).json(pod);
    } catch (error) {
      res.status(500).json({ error: "Failed to create pod" });
    }
  });

  // Update pod
  app.put("/api/admin/pods/:id", authenticateToken, async (req, res) => {
    try {
      const pod = await storage.updatePod(req.params.id, req.body);
      if (!pod) {
        return res.status(404).json({ error: "Pod not found" });
      }
      res.json(pod);
    } catch (error) {
      console.error("Error updating pod:", error);
      res.status(500).json({ error: "Failed to update pod" });
    }
  });

  // Delete pod
  app.delete("/api/admin/pods/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deletePod(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Pod not found" });
      }
      res.json({ message: "Pod deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete pod" });
    }
  });

  // Admin API endpoints for app management
  app.post("/api/admin/apps", authenticateToken, async (req, res) => {
    try {
      const app = await storage.createApp(req.body);
      res.status(201).json(app);
    } catch (error) {
      res.status(500).json({ error: "Failed to create app" });
    }
  });

  app.put("/api/admin/apps/:id", authenticateToken, async (req, res) => {
    try {
      const app = await storage.updateApp(req.params.id, req.body);
      if (!app) {
        return res.status(404).json({ error: "App not found" });
      }
      res.json(app);
    } catch (error) {
      res.status(500).json({ error: "Failed to update app" });
    }
  });

  app.delete("/api/admin/apps/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteApp(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "App not found" });
      }
      res.json({ message: "App deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete app" });
    }
  });

  // Admin API endpoints for milestone management
  app.post("/api/admin/milestones", authenticateToken, async (req, res) => {
    try {
      const milestone = await storage.createMilestone(req.body);
      res.status(201).json(milestone);
    } catch (error) {
      res.status(500).json({ error: "Failed to create milestone" });
    }
  });

  app.put("/api/admin/milestones/:id", authenticateToken, async (req, res) => {
    try {
      const milestone = await storage.updateMilestone(req.params.id, req.body);
      if (!milestone) {
        return res.status(404).json({ error: "Milestone not found" });
      }
      res.json(milestone);
    } catch (error) {
      res.status(500).json({ error: "Failed to update milestone" });
    }
  });

  app.delete("/api/admin/milestones/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteMilestone(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Milestone not found" });
      }
      res.json({ message: "Milestone deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete milestone" });
    }
  });

  // Blog API endpoints
  app.get("/api/blogs", async (_req, res) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const blog = await storage.getBlogById(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json(blog);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog" });
    }
  });

  // Admin API endpoints for blog management
  app.post("/api/admin/blogs", authenticateToken, async (req, res) => {
    try {
      const blog = await storage.createBlog(req.body);
      res.status(201).json(blog);
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog" });
    }
  });

  app.put("/api/admin/blogs/:id", authenticateToken, async (req, res) => {
    try {
      const blog = await storage.updateBlog(req.params.id, req.body);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json(blog);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog" });
    }
  });

  app.delete("/api/admin/blogs/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteBlog(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
