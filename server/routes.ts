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
  app.get("/api/admin/blogs", authenticateToken, async (req, res) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

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

  // Contact form submission routes
  app.post("/api/contact", async (req, res) => {
    try {
      const contact = await storage.createContactSubmission(req.body);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Admin: Get all contact submissions
  app.get("/api/admin/contacts", authenticateToken, async (req, res) => {
    try {
      const contacts = await storage.getAllContactSubmissions();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  // Admin: Get specific contact submission
  app.get("/api/admin/contacts/:id", authenticateToken, async (req, res) => {
    try {
      const contact = await storage.getContactSubmission(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: "Contact submission not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact submission" });
    }
  });

  // Admin: Update contact submission status
  app.patch("/api/admin/contacts/:id/status", authenticateToken, async (req, res) => {
    try {
      const { status } = req.body;
      const contact = await storage.updateContactSubmissionStatus(req.params.id, status);
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact submission status" });
    }
  });

  // Admin: Delete contact submission
  app.delete("/api/admin/contacts/:id", authenticateToken, async (req, res) => {
    try {
      await storage.deleteContactSubmission(req.params.id);
      res.json({ message: "Contact submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact submission" });
    }
  });

  // Public: Submit application
  app.post("/api/applications", async (req, res) => {
    try {
      const application = await storage.createApplication(req.body);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Admin: Get all applications
  app.get("/api/admin/applications", authenticateToken, async (_req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Admin: Get application by ID
  app.get("/api/admin/applications/:id", authenticateToken, async (req, res) => {
    try {
      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // Admin: Update application status
  app.patch("/api/admin/applications/:id/status", authenticateToken, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const application = await storage.updateApplicationStatus(req.params.id, status, notes);
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // Admin: Delete application
  app.delete("/api/admin/applications/:id", authenticateToken, async (req, res) => {
    try {
      await storage.deleteApplication(req.params.id);
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // Public: Submit idea
  app.post("/api/ideas", async (req, res) => {
    try {
      const idea = await storage.createIdeaSubmission(req.body);
      res.status(201).json(idea);
    } catch (error) {
      console.error("Error creating idea submission:", error);
      res.status(500).json({ error: "Failed to submit idea" });
    }
  });

  // Public: Get all idea submissions (approved and in development only for public)
  app.get("/api/ideas", async (_req, res) => {
    try {
      const allIdeas = await storage.getAllIdeaSubmissions();
      // Filter to show all ideas (admins can filter in their view)
      res.json(allIdeas);
    } catch (error) {
      console.error("Error fetching idea submissions:", error);
      res.status(500).json({ error: "Failed to fetch idea submissions" });
    }
  });

  // Admin: Get all idea submissions
  app.get("/api/admin/ideas", authenticateToken, async (_req, res) => {
    try {
      const ideas = await storage.getAllIdeaSubmissions();
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching idea submissions:", error);
      res.status(500).json({ error: "Failed to fetch idea submissions" });
    }
  });

  // Admin: Get idea submission by ID
  app.get("/api/admin/ideas/:id", authenticateToken, async (req, res) => {
    try {
      const idea = await storage.getIdeaSubmission(req.params.id);
      if (!idea) {
        return res.status(404).json({ error: "Idea submission not found" });
      }
      res.json(idea);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch idea submission" });
    }
  });

  // Admin: Update idea submission status
  app.patch("/api/admin/ideas/:id/status", authenticateToken, async (req, res) => {
    try {
      const { status, notes } = req.body;
      const idea = await storage.updateIdeaSubmissionStatus(req.params.id, status, notes);
      res.json(idea);
    } catch (error) {
      res.status(500).json({ error: "Failed to update idea submission status" });
    }
  });

  // Admin: Delete idea submission
  app.delete("/api/admin/ideas/:id", authenticateToken, async (req, res) => {
    try {
      await storage.deleteIdeaSubmission(req.params.id);
      res.json({ message: "Idea submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete idea submission" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
