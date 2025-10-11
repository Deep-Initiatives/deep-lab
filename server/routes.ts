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

  const httpServer = createServer(app);

  return httpServer;
}
