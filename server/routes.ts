import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all apps
  app.get("/api/apps", async (_req, res) => {
    try {
      const apps = await storage.getAllApps();
      res.json(apps);
    } catch (error) {
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
      res.status(500).json({ error: "Failed to fetch milestones" });
    }
  });

  // Get lab stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getLabStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin API endpoints for pod management
  // Create new pod
  app.post("/api/admin/pods", async (req, res) => {
    try {
      const pod = await storage.createPod(req.body);
      res.status(201).json(pod);
    } catch (error) {
      res.status(500).json({ error: "Failed to create pod" });
    }
  });

  // Update pod
  app.put("/api/admin/pods/:id", async (req, res) => {
    try {
      const pod = await storage.updatePod(req.params.id, req.body);
      if (!pod) {
        return res.status(404).json({ error: "Pod not found" });
      }
      res.json(pod);
    } catch (error) {
      res.status(500).json({ error: "Failed to update pod" });
    }
  });

  // Delete pod
  app.delete("/api/admin/pods/:id", async (req, res) => {
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
  app.post("/api/admin/apps", async (req, res) => {
    try {
      const app = await storage.createApp(req.body);
      res.status(201).json(app);
    } catch (error) {
      res.status(500).json({ error: "Failed to create app" });
    }
  });

  app.put("/api/admin/apps/:id", async (req, res) => {
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

  app.delete("/api/admin/apps/:id", async (req, res) => {
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
  app.post("/api/admin/milestones", async (req, res) => {
    try {
      const milestone = await storage.createMilestone(req.body);
      res.status(201).json(milestone);
    } catch (error) {
      res.status(500).json({ error: "Failed to create milestone" });
    }
  });

  app.put("/api/admin/milestones/:id", async (req, res) => {
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

  app.delete("/api/admin/milestones/:id", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
