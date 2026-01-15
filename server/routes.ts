import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthUser } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET;

if (!JWT_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role as AuthUser["role"],
    };

    const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: "24h" });

    res.json({ user: authUser, token });
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ user: req.user });
  });

  app.get("/api/machines", authMiddleware, async (req: Request, res: Response) => {
    const machines = await storage.getMachines();
    const machinesWithRisk = machines.map(m => ({
      ...m,
      failureRisk: Math.random() * 0.7,
      temperature: 150 + Math.random() * 70,
      vibration: 1 + Math.random() * 5,
      lastMaintenance: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
    res.json(machinesWithRisk);
  });

  app.get("/api/machines/:id", authMiddleware, async (req: Request, res: Response) => {
    const machine = await storage.getMachine(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }
    res.json(machine);
  });

  app.get("/api/alerts", authMiddleware, async (req: Request, res: Response) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  app.get("/api/alerts/recent", authMiddleware, async (req: Request, res: Response) => {
    const alerts = await storage.getAlerts();
    res.json(alerts.slice(0, 5));
  });

  app.post("/api/alerts/:id/ack", authMiddleware, async (req: AuthRequest, res: Response) => {
    const alert = await storage.acknowledgeAlert(req.params.id, req.user?.id || "system");
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.json(alert);
  });

  app.get("/api/approvals", authMiddleware, async (req: Request, res: Response) => {
    const approvals = await storage.getApprovals();
    res.json(approvals);
  });

  app.post("/api/approvals/:id/approve", authMiddleware, async (req: AuthRequest, res: Response) => {
    const approval = await storage.updateApprovalStatus(req.params.id, "approved", req.user?.id || "system");
    if (!approval) {
      return res.status(404).json({ message: "Approval not found" });
    }
    
    await storage.createAuditLog({
      userId: req.user?.id,
      action: "APPROVAL_APPROVED",
      entityType: approval.entityType,
      entityId: approval.entityId,
      beforeJson: { status: "pending" },
      afterJson: { status: "approved" },
      reasonCode: null,
    });
    
    res.json(approval);
  });

  app.post("/api/approvals/:id/deny", authMiddleware, async (req: AuthRequest, res: Response) => {
    const approval = await storage.updateApprovalStatus(req.params.id, "denied", req.user?.id || "system");
    if (!approval) {
      return res.status(404).json({ message: "Approval not found" });
    }
    
    await storage.createAuditLog({
      userId: req.user?.id,
      action: "APPROVAL_DENIED",
      entityType: approval.entityType,
      entityId: approval.entityId,
      beforeJson: { status: "pending" },
      afterJson: { status: "denied" },
      reasonCode: null,
    });
    
    res.json(approval);
  });

  app.get("/api/tickets", authMiddleware, async (req: Request, res: Response) => {
    const tickets = await storage.getTickets();
    res.json(tickets);
  });

  app.get("/api/dashboard/stats", authMiddleware, async (req: Request, res: Response) => {
    const machines = await storage.getMachines();
    const alerts = await storage.getAlerts();
    const approvals = await storage.getApprovals();
    
    const activeAlerts = alerts.filter(a => !a.acknowledgedAt).length;
    const pendingApprovals = approvals.filter(a => a.status === "pending").length;
    const operationalMachines = machines.filter(m => m.status === "operational").length;
    
    res.json({
      totalJobs: 47,
      pendingApprovals,
      activeAlerts,
      machineUtilization: operationalMachines / machines.length,
      onTimeRate: 0.92,
      avgRiskScore: 0.18,
    });
  });

  app.get("/api/schedule/latest", authMiddleware, async (req: Request, res: Response) => {
    const mode = req.query.mode || "risk_aware";
    
    res.json({
      id: "S-001",
      runId: "run-001",
      mode,
      createdAt: new Date().toISOString(),
      kpiJson: {
        makespan: mode === "risk_aware" ? 2880 : 3200,
        totalLateness: mode === "risk_aware" ? 90 : 180,
        onTimeRate: mode === "risk_aware" ? 0.92 : 0.78,
        changeovers: mode === "risk_aware" ? 8 : 12,
        utilization: mode === "risk_aware" ? 0.84 : 0.72,
        riskCost: mode === "risk_aware" ? 0.15 : 0.35,
        stability: mode === "risk_aware" ? 0.88 : 0.65,
      },
      items: [
        { id: "1", machineId: "M-001", jobId: "J-001", startTs: "2025-01-15T08:00:00Z", endTs: "2025-01-15T10:30:00Z", frozen: true, riskScore: 0.12 },
        { id: "2", machineId: "M-001", jobId: "J-002", startTs: "2025-01-15T10:30:00Z", endTs: "2025-01-15T12:00:00Z", frozen: false, riskScore: 0.08 },
        { id: "3", machineId: "M-002", jobId: "J-003", startTs: "2025-01-15T08:00:00Z", endTs: "2025-01-15T11:00:00Z", frozen: true, riskScore: 0.32 },
      ],
    });
  });

  app.post("/api/schedule/run", authMiddleware, async (req: AuthRequest, res: Response) => {
    const mode = req.query.mode || "risk_aware";
    
    await storage.createAuditLog({
      userId: req.user?.id,
      action: "SCHEDULE_RUN",
      entityType: "schedule",
      entityId: "S-new",
      beforeJson: null,
      afterJson: { mode },
      reasonCode: null,
    });
    
    res.json({ success: true, runId: `run-${Date.now()}` });
  });

  app.get("/api/quality/measurements", authMiddleware, async (req: Request, res: Response) => {
    res.json([
      { id: "1", machineId: "M-001", ts: new Date().toISOString(), bottleWeightG: 24.8, wallThicknessMm: 0.42, defectLabel: null },
      { id: "2", machineId: "M-001", ts: new Date().toISOString(), bottleWeightG: 25.1, wallThicknessMm: 0.44, defectLabel: null },
      { id: "3", machineId: "M-002", ts: new Date().toISOString(), bottleWeightG: 24.5, wallThicknessMm: 0.39, defectLabel: "thin_wall" },
    ]);
  });

  app.get("/api/fairness/metrics", authMiddleware, async (req: Request, res: Response) => {
    res.json([
      { group: "Morning Shift", groupType: "shift", jobsAssigned: 45, avgUtilization: 0.84, latenessRate: 0.08, riskExposure: 0.22 },
      { group: "Evening Shift", groupType: "shift", jobsAssigned: 42, avgUtilization: 0.81, latenessRate: 0.12, riskExposure: 0.25 },
      { group: "Night Shift", groupType: "shift", jobsAssigned: 38, avgUtilization: 0.78, latenessRate: 0.15, riskExposure: 0.28 },
    ]);
  });

  app.get("/api/schedule/comparison", authMiddleware, async (req: Request, res: Response) => {
    res.json({
      baseline: {
        makespan: 3200,
        totalLateness: 180,
        onTimeRate: 0.78,
        changeovers: 12,
        utilization: 0.72,
        riskCost: 0.35,
        stability: 0.65,
      },
      riskAware: {
        makespan: 2880,
        totalLateness: 90,
        onTimeRate: 0.92,
        changeovers: 8,
        utilization: 0.84,
        riskCost: 0.15,
        stability: 0.88,
      },
      improvement: {
        makespan: -10,
        totalLateness: -50,
        onTimeRate: 18,
        changeovers: -33,
        utilization: 17,
        riskCost: -57,
        stability: 35,
      },
    });
  });

  app.get("/api/upload/history", authMiddleware, async (req: Request, res: Response) => {
    res.json([
      { id: "1", ts: new Date().toISOString(), uploadType: "jobs", filename: "january_jobs.csv", rowCount: 45, status: "ok" },
      { id: "2", ts: new Date().toISOString(), uploadType: "sensors", filename: "sensor_data.csv", rowCount: 1250, status: "ok" },
    ]);
  });

  return httpServer;
}
