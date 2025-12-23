import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateToken, verifyToken, comparePassword, extractTokenFromHeader, hashPassword } from "./auth";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const uploadDir = path.join(__dirname, "../client/public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `project-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

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

  // File upload endpoint for project images
  app.post("/api/admin/upload", authenticateToken, upload.single("image"), (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Create blog admin user (one-time setup)
  app.post("/api/admin/create-blog-admin", async (req, res) => {
    try {
      // Check if blog admin already exists
      const existingBlogAdmin = await storage.getUserByUsername("blog-admin");
      if (existingBlogAdmin) {
        return res.status(400).json({ error: "Blog admin user already exists" });
      }

      const hashedPassword = await hashPassword("blog123");
      const blogAdminUser = await storage.createUser({
        username: "blog-admin",
        password: hashedPassword,
        role: "blog-admin",
      });

      console.log("✅ Blog admin user created:", blogAdminUser.username);

      res.json({
        message: "Blog admin user created successfully",
        user: {
          id: blogAdminUser.id,
          username: blogAdminUser.username,
          role: blogAdminUser.role
        }
      });
    } catch (error) {
      console.error("Error creating blog admin:", error);
      res.status(500).json({ error: "Failed to create blog admin user" });
    }
  });

  // Update user profile
  app.patch("/api/admin/profile", authenticateToken, async (req, res) => {
    try {
      const { username, currentPassword, newPassword } = req.body;
      const userId = (req as any).user.userId;

      // Get current user
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updateData: any = {};

      // Update username if provided and different
      if (username && username !== currentUser.username) {
        // Check if username is already taken
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Username already taken" });
        }
        updateData.username = username;
      }

      // Update password if provided
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: "Current password is required to change password" });
        }

        // Verify current password
        const isValidPassword = await comparePassword(currentPassword, currentUser.password);
        if (!isValidPassword) {
          return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Hash new password
        updateData.password = await hashPassword(newPassword);
      }

      // Update user if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await storage.updateUser(userId, updateData);

        res.json({
          message: "Profile updated successfully",
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            role: updatedUser.role
          }
        });
      } else {
        res.json({ message: "No changes to update" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Admin-only: create admin or blog-admin user
  app.post("/api/admin/users", authenticateToken, async (req, res) => {
    try {
      const { role: requesterRole } = (req as any).user || {};
      if (requesterRole !== "admin") {
        return res.status(403).json({ error: "Only admin can create users" });
      }

      const { username, password, role } = req.body || {};

      if (!username || !password || !role) {
        return res.status(400).json({ error: "username, password and role are required" });
      }

      if (!["admin", "blog-admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'blog-admin'" });
      }

      // Ensure username is unique
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Important: pass plain password; hashing is handled in storage/db layer
      const newUser = await storage.createUser({ username, password, role } as any);

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Admin-only: list users
  app.get("/api/admin/users", authenticateToken, async (req, res) => {
    try {
      const { role: requesterRole } = (req as any).user || {};
      if (requesterRole !== "admin") {
        return res.status(403).json({ error: "Only admin can list users" });
      }
      const users = await storage.getAllUsers();
      const sanitized = users.map(u => ({ id: u.id, username: u.username, role: u.role, createdAt: (u as any).createdAt ?? null }));
      res.json(sanitized);
    } catch (error) {
      console.error("Error listing users:", error);
      res.status(500).json({ error: "Failed to list users" });
    }
  });

  // Admin-only: update user (username or role, and optionally password)
  app.patch("/api/admin/users/:id", authenticateToken, async (req, res) => {
    try {
      const { role: requesterRole, userId: requesterId } = (req as any).user || {};
      if (requesterRole !== "admin") {
        return res.status(403).json({ error: "Only admin can update users" });
      }
      const { username, role, password } = req.body || {};
      const targetId = req.params.id;

      // Prevent removing last admin or demoting self to blog-admin if desired (simple guard: allow self-update but not role change of self)
      if (targetId === requesterId && role && role !== "admin") {
        return res.status(400).json({ error: "Admins cannot demote their own role" });
      }

      const update: any = {};
      if (username) {
        const existing = await storage.getUserByUsername(username);
        if (existing && existing.id !== targetId) {
          return res.status(400).json({ error: "Username already exists" });
        }
        update.username = username;
      }
      if (role) {
        if (!["admin", "blog-admin"].includes(role)) {
          return res.status(400).json({ error: "Invalid role" });
        }
        update.role = role;
      }
      if (password) {
        update.password = password; // hashing handled in db layer
      }

      if (Object.keys(update).length === 0) {
        return res.json({ message: "No changes to update" });
      }

      const updated = await storage.updateUser(targetId, update);
      res.json({ id: updated.id, username: updated.username, role: updated.role });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Admin-only: delete user
  app.delete("/api/admin/users/:id", authenticateToken, async (req, res) => {
    try {
      const { role: requesterRole, userId: requesterId } = (req as any).user || {};
      if (requesterRole !== "admin") {
        return res.status(403).json({ error: "Only admin can delete users" });
      }
      const targetId = req.params.id;
      if (targetId === requesterId) {
        return res.status(400).json({ error: "Admins cannot delete themselves" });
      }
      await storage.deleteUser(targetId);
      res.json({ message: "User deleted" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
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
      console.error("Error creating app:", error);
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
      console.error("Error updating app:", error);
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
      const { status, notes, podData } = req.body;
      const ideaId = req.params.id;

      // Get the current idea to check if we need to create an app or pod
      const currentIdea = await storage.getIdeaSubmission(ideaId);
      if (!currentIdea) {
        return res.status(404).json({ error: "Idea submission not found" });
      }

      const previousStatus = currentIdea.status?.toLowerCase().trim();
      const normalizedStatus = status?.toLowerCase().trim();

      // If status is being changed to "rejected", delete associated app/pod if they exist
      if (normalizedStatus === "rejected" && (previousStatus === "approved" || previousStatus === "in_development")) {
        try {
          // Delete associated app/project if it exists (check regardless of previous status to handle edge cases)
          const allApps = await storage.getAllApps();
          const associatedApp = allApps.find(app => app.name.toLowerCase() === currentIdea.title.toLowerCase());
          if (associatedApp) {
            await storage.deleteApp(associatedApp.id);
          }

          // Delete associated pod if it exists (check regardless of previous status to handle edge cases)
          const allPods = await storage.getAllPods();
          const associatedPod = allPods.find(pod => pod.name.toLowerCase() === currentIdea.title.toLowerCase());
          if (associatedPod) {
            await storage.deletePod(associatedPod.id);
          }
        } catch (deletionError) {
          // Don't fail the status update if deletion fails - log it but continue
        }
      }

      // Update the idea status
      const idea = await storage.updateIdeaSubmissionStatus(ideaId, status, notes);

      // If status is "approved", automatically create an app/project
      if (normalizedStatus === "approved") {
        try {
          // Check if an app with the same name already exists
          const allApps = await storage.getAllApps();
          const existingApp = allApps.find(app => app.name.toLowerCase() === idea.title.toLowerCase());

          if (!existingApp) {
            // Prepare app data
            const appData = {
              name: idea.title,
              description: idea.proposedSolution || idea.problemStatement || "No description provided",
              category: "Web App" as const,
              status: "Prototype" as const,
              technologies: Array.isArray(idea.requiredExpertise) ? idea.requiredExpertise : (idea.requiredExpertise ? [idea.requiredExpertise] : []),
              icon: null,
              demoUrl: null,
              githubUrl: null,
              podId: null,
            };

            // Create a new app from the approved idea
            await storage.createApp(appData);
          }
        } catch (appCreationError) {
          // Don't fail the status update if app creation fails - log it but continue
        }
      }

      // If status is "in_development", create a pod with the provided pod data
      if (normalizedStatus === "in_development") {
        if (!podData || (typeof podData === 'object' && Object.keys(podData).length === 0)) {
          return res.status(400).json({ error: "Pod data is required when changing status to 'in_development'" });
        }

        try {
          // Check if a pod with the same name already exists
          const allPods = await storage.getAllPods();
          const existingPod = allPods.find(pod => pod.name.toLowerCase() === (podData.name || idea.title).toLowerCase());

          if (!existingPod) {
            // Create a new pod from the idea with provided pod data
            const podDataToCreate = {
              name: podData.name || idea.title,
              description: podData.description || idea.proposedSolution || idea.problemStatement || "No description provided",
              status: podData.status || "Active",
              progress: podData.progress || 0,
              teamSize: podData.teamSize || 1,
              startDate: podData.startDate || new Date().toISOString(),
              endDate: podData.endDate || null,
              technologies: Array.isArray(podData.technologies) ? podData.technologies : (podData.technologies ? [podData.technologies] : (Array.isArray(idea.requiredExpertise) ? idea.requiredExpertise : (idea.requiredExpertise ? [idea.requiredExpertise] : []))),
              coordinatorId: podData.coordinatorId || null,
            };

            await storage.createPod(podDataToCreate);
          }
        } catch (podCreationError) {
          return res.status(500).json({ error: "Failed to create pod", details: podCreationError instanceof Error ? podCreationError.message : String(podCreationError) });
        }
      }

      res.json(idea);
    } catch (error) {
      console.error("Error updating idea submission status:", error);
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

  // Admin: Create app for approved idea (utility endpoint)
  app.post("/api/admin/ideas/:id/create-app", authenticateToken, async (req, res) => {
    try {
      const ideaId = req.params.id;
      const idea = await storage.getIdeaSubmission(ideaId);

      if (!idea) {
        return res.status(404).json({ error: "Idea submission not found" });
      }

      if (idea.status !== "approved") {
        return res.status(400).json({ error: "Idea must be approved to create an app" });
      }

      // Check if an app with the same name already exists
      const allApps = await storage.getAllApps();
      const existingApp = allApps.find(app => app.name.toLowerCase() === idea.title.toLowerCase());

      if (existingApp) {
        return res.status(400).json({
          error: "App already exists for this idea",
          app: existingApp
        });
      }

      // Create a new app from the approved idea
      const newApp = await storage.createApp({
        name: idea.title,
        description: idea.proposedSolution || idea.problemStatement,
        category: "Web App", // Default category, can be changed later
        status: "Prototype", // Default status for newly approved ideas
        technologies: Array.isArray(idea.requiredExpertise) ? idea.requiredExpertise : [],
        icon: null,
        demoUrl: null,
        githubUrl: null,
        podId: null,
      });

      console.log(`✅ Manually created app "${newApp.name}" (ID: ${newApp.id}) from approved idea "${idea.title}" (ID: ${idea.id})`);

      res.json({
        message: "App created successfully",
        app: newApp
      });
    } catch (error) {
      console.error("Error creating app from idea:", error);
      res.status(500).json({ error: "Failed to create app from idea" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
