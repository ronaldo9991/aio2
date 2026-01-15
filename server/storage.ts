import { 
  type User, type InsertUser,
  type Machine, type InsertMachine,
  type Job, type InsertJob,
  type Alert, type InsertAlert,
  type Ticket, type InsertTicket,
  type Approval, type InsertApproval,
  type AuditLog, type InsertAuditLog
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMachines(): Promise<Machine[]>;
  getMachine(id: string): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: string, userId: string): Promise<Alert | undefined>;
  
  getTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: string, status: string): Promise<Ticket | undefined>;
  
  getApprovals(): Promise<Approval[]>;
  getApproval(id: string): Promise<Approval | undefined>;
  createApproval(approval: InsertApproval): Promise<Approval>;
  updateApprovalStatus(id: string, status: string, approvedBy: string): Promise<Approval | undefined>;
  
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private machines: Map<string, Machine>;
  private jobs: Map<string, Job>;
  private alerts: Map<string, Alert>;
  private tickets: Map<string, Ticket>;
  private approvals: Map<string, Approval>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.users = new Map();
    this.machines = new Map();
    this.jobs = new Map();
    this.alerts = new Map();
    this.tickets = new Map();
    this.approvals = new Map();
    this.auditLogs = new Map();
    
    this.seedData();
  }

  private async seedData() {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser: User = {
      id: randomUUID(),
      email: "admin@aquaintel.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    const machines: InsertMachine[] = [
      { name: "Blow Molder A", type: "blow_mold", status: "operational", setupGroup: "A" },
      { name: "Blow Molder B", type: "blow_mold", status: "operational", setupGroup: "A" },
      { name: "Injection Molder 1", type: "injection", status: "warning", setupGroup: "B" },
      { name: "Blow Molder C", type: "blow_mold", status: "operational", setupGroup: "A" },
      { name: "Preform Line", type: "preform", status: "maintenance", setupGroup: "C" },
      { name: "Packing Station", type: "packing", status: "operational", setupGroup: "D" },
    ];

    machines.forEach((m, i) => {
      const id = `M-00${i + 1}`;
      this.machines.set(id, { ...m, id });
    });

    const alertData: Omit<Alert, "id">[] = [
      { ts: new Date(), severity: "CRITICAL", type: "MACHINE_FAILURE", entityType: "machine", entityId: "M-003", message: "High vibration detected - potential bearing failure", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(), severity: "WARNING", type: "QUALITY_DRIFT", entityType: "machine", entityId: "M-002", message: "Wall thickness approaching UCL", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(), severity: "INFO", type: "SCHEDULE", entityType: "job", entityId: "J-015", message: "Job priority automatically upgraded due to due date", acknowledgedBy: "admin", acknowledgedAt: new Date(), dedupeKey: null },
    ];

    alertData.forEach((a, i) => {
      const id = `A-00${i + 1}`;
      this.alerts.set(id, { ...a, id });
    });

    const approvalData: Omit<Approval, "id">[] = [
      { ts: new Date(), actionType: "RESCHEDULE", entityType: "schedule", entityId: "S-015", requestedBy: "orchestrator", status: "pending", approvedBy: null, approvedAt: null, reasonCode: null, notes: "High risk detected on M-003", source: "in_app" },
      { ts: new Date(), actionType: "MAINTENANCE_OVERRIDE", entityType: "machine", entityId: "M-002", requestedBy: "operator2", status: "pending", approvedBy: null, approvedAt: null, reasonCode: null, notes: "Requesting early maintenance window", source: "in_app" },
    ];

    approvalData.forEach((a, i) => {
      const id = `AP-00${i + 1}`;
      this.approvals.set(id, { ...a, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async getMachine(id: string): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async createMachine(machine: InsertMachine): Promise<Machine> {
    const id = `M-${String(this.machines.size + 1).padStart(3, '0')}`;
    const newMachine: Machine = { ...machine, id };
    this.machines.set(id, newMachine);
    return newMachine;
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const id = `J-${String(this.jobs.size + 1).padStart(3, '0')}`;
    const newJob: Job = { ...job, id, createdAt: new Date() };
    this.jobs.set(id, newJob);
    return newJob;
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => 
      new Date(b.ts!).getTime() - new Date(a.ts!).getTime()
    );
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = `A-${String(this.alerts.size + 1).padStart(3, '0')}`;
    const newAlert: Alert = { ...alert, id, ts: new Date() };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async acknowledgeAlert(id: string, userId: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date();
      this.alerts.set(id, alert);
    }
    return alert;
  }

  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).sort((a, b) => 
      new Date(b.ts!).getTime() - new Date(a.ts!).getTime()
    );
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const id = `T-${String(this.tickets.size + 1).padStart(3, '0')}`;
    const newTicket: Ticket = { ...ticket, id, ts: new Date() };
    this.tickets.set(id, newTicket);
    return newTicket;
  }

  async updateTicketStatus(id: string, status: string): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (ticket) {
      ticket.status = status;
      this.tickets.set(id, ticket);
    }
    return ticket;
  }

  async getApprovals(): Promise<Approval[]> {
    return Array.from(this.approvals.values()).sort((a, b) => 
      new Date(b.ts!).getTime() - new Date(a.ts!).getTime()
    );
  }

  async getApproval(id: string): Promise<Approval | undefined> {
    return this.approvals.get(id);
  }

  async createApproval(approval: InsertApproval): Promise<Approval> {
    const id = `AP-${String(this.approvals.size + 1).padStart(3, '0')}`;
    const newApproval: Approval = { ...approval, id, ts: new Date() };
    this.approvals.set(id, newApproval);
    return newApproval;
  }

  async updateApprovalStatus(id: string, status: string, approvedBy: string): Promise<Approval | undefined> {
    const approval = this.approvals.get(id);
    if (approval) {
      approval.status = status;
      approval.approvedBy = approvedBy;
      approval.approvedAt = new Date();
      this.approvals.set(id, approval);
    }
    return approval;
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const newLog: AuditLog = { ...log, id, ts: new Date() };
    this.auditLogs.set(id, newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
