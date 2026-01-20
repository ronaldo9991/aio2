import { 
  type User, type InsertUser,
  type Machine, type InsertMachine,
  type Job, type InsertJob,
  type Alert, type InsertAlert,
  type Ticket, type InsertTicket,
  type TicketMessage, type InsertTicketMessage,
  type Approval, type InsertApproval,
  type AuditLog, type InsertAuditLog,
  type Dataset, type InsertDataset,
  type MLModel, type InsertMLModel,
  type Recommendation, type InsertRecommendation
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
  getTicketByRef(ticketRef: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: string, status: string): Promise<Ticket | undefined>;
  // Customer ticket methods
  createCustomerTicket(ticket: InsertTicket, initialMessage: InsertTicketMessage): Promise<{ ticket: Ticket; message: TicketMessage }>;
  getTicketWithMessages(ticketRef: string): Promise<{ ticket: Ticket; messages: TicketMessage[] } | undefined>;
  addTicketMessage(message: InsertTicketMessage): Promise<TicketMessage>;
  getMessageByExternalId(externalId: string): Promise<TicketMessage | undefined>;
  
  getApprovals(): Promise<Approval[]>;
  getApproval(id: string): Promise<Approval | undefined>;
  createApproval(approval: InsertApproval): Promise<Approval>;
  updateApprovalStatus(id: string, status: string, approvedBy: string): Promise<Approval | undefined>;
  
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  
  // New methods for datasets, models, recommendations
  getDatasets(): Promise<Dataset[]>;
  getDataset(id: string): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  deleteDataset(id: string): Promise<boolean>;
  
  getMLModels(): Promise<MLModel[]>;
  getMLModel(id: string): Promise<MLModel | undefined>;
  createMLModel(model: InsertMLModel): Promise<MLModel>;
  updateMLModel(id: string, updates: Partial<MLModel>): Promise<MLModel | undefined>;
  
  getRecommendations(): Promise<Recommendation[]>;
  getRecommendation(id: string): Promise<Recommendation | undefined>;
  createRecommendation(rec: InsertRecommendation): Promise<Recommendation>;
  updateRecommendationStatus(id: string, status: string, userId?: string, overrideReason?: string): Promise<Recommendation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private machines: Map<string, Machine>;
  private jobs: Map<string, Job>;
  private alerts: Map<string, Alert>;
  private tickets: Map<string, Ticket>;
  private ticketMessages: Map<string, TicketMessage>;
  private ticketRefIndex: Map<string, string>; // ticketRef -> ticketId mapping
  private externalIdIndex: Map<string, string>; // externalId -> messageId mapping
  private approvals: Map<string, Approval>;
  private auditLogs: Map<string, AuditLog>;
  private datasets: Map<string, Dataset>;
  private mlModels: Map<string, MLModel>;
  private recommendations: Map<string, Recommendation>;

  constructor() {
    this.users = new Map();
    this.machines = new Map();
    this.jobs = new Map();
    this.alerts = new Map();
    this.tickets = new Map();
    this.ticketMessages = new Map();
    this.ticketRefIndex = new Map();
    this.externalIdIndex = new Map();
    this.approvals = new Map();
    this.auditLogs = new Map();
    this.datasets = new Map();
    this.mlModels = new Map();
    this.recommendations = new Map();
    
    this.seedData();
    this.seedMLModels();
  }

  private seedMLModels() {
    const now = new Date();
    const models: MLModel[] = [
      {
        id: randomUUID(),
        name: 'failure_risk',
        type: 'classification',
        version: 1,
        status: 'active',
        datasetId: null,
        trainedAt: now,
        trainedBy: 'system',
        metricsJson: {
          accuracy: 0.88,
          precision: 0.85,
          recall: 0.90,
          f1: 0.87,
        },
        featureImportanceJson: [
          { feature: 'vibration', importance: 0.35 },
          { feature: 'temperature', importance: 0.28 },
          { feature: 'daysSinceMaintenance', importance: 0.22 },
          { feature: 'powerDraw', importance: 0.15 },
        ],
        configJson: {},
      },
      {
        id: randomUUID(),
        name: 'throughput_forecaster',
        type: 'forecast',
        version: 1,
        status: 'active',
        datasetId: null,
        trainedAt: now,
        trainedBy: 'system',
        metricsJson: {
          mae: 150,
          rmse: 200,
          mape: 0.12,
        },
        featureImportanceJson: [
          { feature: 'previous_day_throughput', importance: 0.60 },
          { feature: 'machine_status', importance: 0.30 },
          { feature: 'day_of_week', importance: 0.10 },
        ],
        configJson: {},
      },
      {
        id: randomUUID(),
        name: 'quality_anomaly_detector',
        type: 'anomaly',
        version: 1,
        status: 'active',
        datasetId: null,
        trainedAt: now,
        trainedBy: 'system',
        metricsJson: {
          contamination: 0.01,
          outliers_detected: 15,
          precision: 0.92,
        },
        featureImportanceJson: [
          { feature: 'bottleWeightG', importance: 0.50 },
          { feature: 'wallThicknessMm', importance: 0.40 },
          { feature: 'neckDiameterMm', importance: 0.10 },
        ],
        configJson: {},
      },
    ];

    models.forEach(model => {
      this.mlModels.set(model.id, model);
    });
  }

  private async seedData() {
    // Create users
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser: User = {
      id: randomUUID(),
      email: "admin@aquaintel.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    const operatorUser: User = {
      id: randomUUID(),
      email: "operator@aquaintel.com",
      password: await bcrypt.hash("operator123", 10),
      role: "operator",
      createdAt: new Date(),
    };
    this.users.set(operatorUser.id, operatorUser);

    const supervisorUser: User = {
      id: randomUUID(),
      email: "supervisor@aquaintel.com",
      password: await bcrypt.hash("supervisor123", 10),
      role: "supervisor",
      createdAt: new Date(),
    };
    this.users.set(supervisorUser.id, supervisorUser);

    // Create comprehensive machine data
    const machines: InsertMachine[] = [
      { name: "Blow Molder A", type: "blow_mold", status: "operational", setupGroup: "A" },
      { name: "Blow Molder B", type: "blow_mold", status: "operational", setupGroup: "A" },
      { name: "Injection Molder 1", type: "injection", status: "warning", setupGroup: "B" },
      { name: "Blow Molder C", type: "blow_mold", status: "operational", setupGroup: "A" },
      { name: "Preform Line", type: "preform", status: "maintenance", setupGroup: "C" },
      { name: "Packing Station", type: "packing", status: "operational", setupGroup: "D" },
      { name: "Blow Molder D", type: "blow_mold", status: "operational", setupGroup: "A" },
      { name: "Injection Molder 2", type: "injection", status: "operational", setupGroup: "B" },
      { name: "Blow Molder E", type: "blow_mold", status: "warning", setupGroup: "A" },
      { name: "Labeling Station", type: "packing", status: "operational", setupGroup: "D" },
    ];

    machines.forEach((m, i) => {
      const id = `M-${String(i + 1).padStart(3, '0')}`;
      this.machines.set(id, { ...m, id });
    });

    // Create comprehensive job data (60 jobs)
    const now = new Date();
    const jobTemplates = [
      { productSize: "500ml", quantity: 5000, processingTimeMin: 180, priority: 1, isUrgent: false },
      { productSize: "1L", quantity: 3000, processingTimeMin: 240, priority: 2, isUrgent: false },
      { productSize: "250ml", quantity: 8000, processingTimeMin: 150, priority: 1, isUrgent: false },
      { productSize: "750ml", quantity: 4000, processingTimeMin: 200, priority: 2, isUrgent: false },
      { productSize: "2L", quantity: 2000, processingTimeMin: 300, priority: 3, isUrgent: true },
      { productSize: "500ml", quantity: 6000, processingTimeMin: 180, priority: 1, isUrgent: false },
      { productSize: "1L", quantity: 3500, processingTimeMin: 240, priority: 2, isUrgent: false },
      { productSize: "250ml", quantity: 10000, processingTimeMin: 150, priority: 1, isUrgent: false },
    ];

    const machineTypes = ["blow_mold", "injection", "blow_mold", "blow_mold", "blow_mold", "injection"];
    const setupGroups = ["A", "A", "B", "A", "A", "B"];
    const moldIds = ["MOLD-001", "MOLD-002", "MOLD-003", "MOLD-004", "MOLD-005", "MOLD-006"];

    for (let i = 0; i < 60; i++) {
      const template = jobTemplates[i % jobTemplates.length];
      const daysOffset = Math.floor(i / 8) + (i % 3);
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + daysOffset);
      dueDate.setHours(17, 0, 0, 0); // 5 PM due time

      const job: InsertJob = {
        productSize: template.productSize,
        quantity: template.quantity + Math.floor(Math.random() * 1000 - 500),
        dueDate,
        priority: template.priority + (Math.random() > 0.8 ? 1 : 0),
        processingTimeMin: template.processingTimeMin + Math.floor(Math.random() * 30 - 15),
        requiredMachineType: machineTypes[i % machineTypes.length],
        moldId: moldIds[i % moldIds.length],
        setupGroup: setupGroups[i % setupGroups.length],
        isUrgent: template.isUrgent || (daysOffset <= 1 && Math.random() > 0.7),
      };

      await this.createJob(job);
    }

    // Create comprehensive alert data (25 alerts)
    const alertData: Omit<Alert, "id">[] = [
      { ts: new Date(now.getTime() - 2 * 60 * 60 * 1000), severity: "CRITICAL", type: "MACHINE_FAILURE", entityType: "machine", entityId: "M-003", message: "High vibration detected (5.8 mm/s) - potential bearing failure on Injection Molder 1", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "vib-M-003" },
      { ts: new Date(now.getTime() - 4 * 60 * 60 * 1000), severity: "WARNING", type: "QUALITY_DRIFT", entityType: "machine", entityId: "M-002", message: "Wall thickness approaching UCL (0.45mm) on Blow Molder B", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "quality-M-002" },
      { ts: new Date(now.getTime() - 6 * 60 * 60 * 1000), severity: "INFO", type: "SCHEDULE", entityType: "job", entityId: "J-015", message: "Job priority automatically upgraded due to due date approaching", acknowledgedBy: adminUser.id, acknowledgedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), dedupeKey: null },
      { ts: new Date(now.getTime() - 8 * 60 * 60 * 1000), severity: "WARNING", type: "TEMPERATURE", entityType: "machine", entityId: "M-009", message: "Operating temperature elevated (215°C) on Blow Molder E", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "temp-M-009" },
      { ts: new Date(now.getTime() - 10 * 60 * 60 * 1000), severity: "CRITICAL", type: "QUALITY_DEFECT", entityType: "machine", entityId: "M-001", message: "Multiple thin_wall defects detected in last 50 bottles", acknowledgedBy: supervisorUser.id, acknowledgedAt: new Date(now.getTime() - 9 * 60 * 60 * 1000), dedupeKey: "defect-M-001" },
      { ts: new Date(now.getTime() - 12 * 60 * 60 * 1000), severity: "WARNING", type: "SCHEDULE", entityType: "job", entityId: "J-028", message: "Job at risk of missing due date - requires expedited processing", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 14 * 60 * 60 * 1000), severity: "INFO", type: "MAINTENANCE", entityType: "machine", entityId: "M-005", message: "Scheduled maintenance window starting in 2 hours", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 16 * 60 * 60 * 1000), severity: "WARNING", type: "VIBRATION", entityType: "machine", entityId: "M-007", message: "Vibration trending upward (3.2 mm/s) on Blow Molder D", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "vib-M-007" },
      { ts: new Date(now.getTime() - 18 * 60 * 60 * 1000), severity: "INFO", type: "SCHEDULE", entityType: "schedule", entityId: "S-001", message: "New schedule generated with improved risk-aware optimization", acknowledgedBy: adminUser.id, acknowledgedAt: new Date(now.getTime() - 17 * 60 * 60 * 1000), dedupeKey: null },
      { ts: new Date(now.getTime() - 20 * 60 * 60 * 1000), severity: "CRITICAL", type: "MACHINE_FAILURE", entityType: "machine", entityId: "M-003", message: "Motor current spike detected - immediate inspection required", acknowledgedBy: supervisorUser.id, acknowledgedAt: new Date(now.getTime() - 19 * 60 * 60 * 1000), dedupeKey: "motor-M-003" },
      { ts: new Date(now.getTime() - 22 * 60 * 60 * 1000), severity: "WARNING", type: "QUALITY_DRIFT", entityType: "machine", entityId: "M-004", message: "Bottle weight variance increasing - SPC control limit warning", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "weight-M-004" },
      { ts: new Date(now.getTime() - 24 * 60 * 60 * 1000), severity: "INFO", type: "APPROVAL", entityType: "approval", entityId: "AP-001", message: "New approval request pending: Reschedule for high-risk machine", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 26 * 60 * 60 * 1000), severity: "WARNING", type: "TEMPERATURE", entityType: "machine", entityId: "M-002", message: "Temperature fluctuation detected - possible heating element issue", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "temp-M-002" },
      { ts: new Date(now.getTime() - 28 * 60 * 60 * 1000), severity: "INFO", type: "SCHEDULE", entityType: "job", entityId: "J-042", message: "Job completed ahead of schedule - capacity available", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 30 * 60 * 60 * 1000), severity: "WARNING", type: "VIBRATION", entityType: "machine", entityId: "M-001", message: "Vibration level above normal baseline (2.8 mm/s)", acknowledgedBy: operatorUser.id, acknowledgedAt: new Date(now.getTime() - 29 * 60 * 60 * 1000), dedupeKey: "vib-M-001" },
      { ts: new Date(now.getTime() - 32 * 60 * 60 * 1000), severity: "CRITICAL", type: "SCHEDULE", entityType: "job", entityId: "J-055", message: "Urgent job J-055 at risk - requires immediate machine assignment", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 34 * 60 * 60 * 1000), severity: "INFO", type: "QUALITY", entityType: "machine", entityId: "M-006", message: "Quality metrics within optimal range - all measurements in spec", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 36 * 60 * 60 * 1000), severity: "WARNING", type: "MAINTENANCE", entityType: "machine", entityId: "M-008", message: "Maintenance due in 48 hours - schedule maintenance window", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 38 * 60 * 60 * 1000), severity: "INFO", type: "SCHEDULE", entityType: "schedule", entityId: "S-002", message: "Schedule optimization completed - 12% improvement in makespan", acknowledgedBy: adminUser.id, acknowledgedAt: new Date(now.getTime() - 37 * 60 * 60 * 1000), dedupeKey: null },
      { ts: new Date(now.getTime() - 40 * 60 * 60 * 1000), severity: "WARNING", type: "QUALITY_DRIFT", entityType: "machine", entityId: "M-010", message: "Neck diameter variance detected - monitor closely", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "neck-M-010" },
      { ts: new Date(now.getTime() - 42 * 60 * 60 * 1000), severity: "CRITICAL", type: "MACHINE_FAILURE", entityType: "machine", entityId: "M-003", message: "Air pressure drop detected - potential leak in system", acknowledgedBy: supervisorUser.id, acknowledgedAt: new Date(now.getTime() - 41 * 60 * 60 * 1000), dedupeKey: "pressure-M-003" },
      { ts: new Date(now.getTime() - 44 * 60 * 60 * 1000), severity: "INFO", type: "APPROVAL", entityType: "approval", entityId: "AP-003", message: "Approval request approved: Maintenance override granted", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 46 * 60 * 60 * 1000), severity: "WARNING", type: "TEMPERATURE", entityType: "machine", entityId: "M-007", message: "Temperature sensor reading inconsistent - verify calibration", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "temp-M-007" },
      { ts: new Date(now.getTime() - 48 * 60 * 60 * 1000), severity: "INFO", type: "SCHEDULE", entityType: "job", entityId: "J-018", message: "Job rescheduled due to machine availability optimization", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: null },
      { ts: new Date(now.getTime() - 50 * 60 * 60 * 1000), severity: "WARNING", type: "VIBRATION", entityType: "machine", entityId: "M-004", message: "Vibration pattern indicates potential imbalance - schedule inspection", acknowledgedBy: null, acknowledgedAt: null, dedupeKey: "vib-M-004" },
    ];

    alertData.forEach((a) => {
      const id = `A-${String(this.alerts.size + 1).padStart(3, '0')}`;
      this.alerts.set(id, { ...a, id });
    });

    // Create comprehensive approval data (15 approvals)
    const approvalData: Omit<Approval, "id">[] = [
      { ts: new Date(now.getTime() - 2 * 60 * 60 * 1000), actionType: "RESCHEDULE", entityType: "schedule", entityId: "S-015", requestedBy: "orchestrator", status: "pending", approvedBy: null, approvedAt: null, reasonCode: "HIGH_RISK", notes: "High failure risk detected on M-003 (0.65) - recommend rescheduling jobs to lower-risk machine", source: "in_app" },
      { ts: new Date(now.getTime() - 4 * 60 * 60 * 1000), actionType: "MAINTENANCE_OVERRIDE", entityType: "machine", entityId: "M-002", requestedBy: operatorUser.id, status: "pending", approvedBy: null, approvedAt: null, reasonCode: "PREVENTIVE", notes: "Requesting early maintenance window to address temperature fluctuations", source: "in_app" },
      { ts: new Date(now.getTime() - 6 * 60 * 60 * 1000), actionType: "PRIORITY_OVERRIDE", entityType: "job", entityId: "J-028", requestedBy: supervisorUser.id, status: "approved", approvedBy: adminUser.id, approvedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), reasonCode: "CUSTOMER_URGENT", notes: "Customer requested expedited delivery", source: "in_app" },
      { ts: new Date(now.getTime() - 8 * 60 * 60 * 1000), actionType: "RESCHEDULE", entityType: "schedule", entityId: "S-012", requestedBy: "orchestrator", status: "approved", approvedBy: adminUser.id, approvedAt: new Date(now.getTime() - 7 * 60 * 60 * 1000), reasonCode: "OPTIMIZATION", notes: "Schedule optimization improves makespan by 8%", source: "in_app" },
      { ts: new Date(now.getTime() - 10 * 60 * 60 * 1000), actionType: "MAINTENANCE_OVERRIDE", entityType: "machine", entityId: "M-009", requestedBy: operatorUser.id, status: "denied", approvedBy: supervisorUser.id, approvedAt: new Date(now.getTime() - 9 * 60 * 60 * 1000), reasonCode: "SCHEDULE_CONFLICT", notes: "Maintenance window conflicts with high-priority job", source: "in_app" },
      { ts: new Date(now.getTime() - 12 * 60 * 60 * 1000), actionType: "QUALITY_HOLD", entityType: "job", entityId: "J-035", requestedBy: "quality_system", status: "pending", approvedBy: null, approvedAt: null, reasonCode: "DEFECT_RATE", notes: "Defect rate exceeds threshold - hold production pending review", source: "automated" },
      { ts: new Date(now.getTime() - 14 * 60 * 60 * 1000), actionType: "RESCHEDULE", entityType: "schedule", entityId: "S-018", requestedBy: "orchestrator", status: "pending", approvedBy: null, approvedAt: null, reasonCode: "MACHINE_DOWN", notes: "M-005 maintenance extended - reschedule affected jobs", source: "in_app" },
      { ts: new Date(now.getTime() - 16 * 60 * 60 * 1000), actionType: "PRIORITY_OVERRIDE", entityType: "job", entityId: "J-052", requestedBy: supervisorUser.id, status: "approved", approvedBy: adminUser.id, approvedAt: new Date(now.getTime() - 15 * 60 * 60 * 1000), reasonCode: "RUSH_ORDER", notes: "Rush order from key customer", source: "in_app" },
      { ts: new Date(now.getTime() - 18 * 60 * 60 * 1000), actionType: "MAINTENANCE_OVERRIDE", entityType: "machine", entityId: "M-001", requestedBy: operatorUser.id, status: "approved", approvedBy: supervisorUser.id, approvedAt: new Date(now.getTime() - 17 * 60 * 60 * 1000), reasonCode: "PREVENTIVE", notes: "Early maintenance to prevent quality issues", source: "in_app" },
      { ts: new Date(now.getTime() - 20 * 60 * 60 * 1000), actionType: "RESCHEDULE", entityType: "schedule", entityId: "S-020", requestedBy: "orchestrator", status: "denied", approvedBy: adminUser.id, approvedAt: new Date(now.getTime() - 19 * 60 * 60 * 1000), reasonCode: "NO_IMPROVEMENT", notes: "Proposed schedule does not improve metrics", source: "in_app" },
      { ts: new Date(now.getTime() - 22 * 60 * 60 * 1000), actionType: "QUALITY_HOLD", entityType: "job", entityId: "J-041", requestedBy: "quality_system", status: "approved", approvedBy: supervisorUser.id, approvedAt: new Date(now.getTime() - 21 * 60 * 60 * 1000), reasonCode: "DEFECT_RATE", notes: "Quality review completed - proceed with adjusted parameters", source: "automated" },
      { ts: new Date(now.getTime() - 24 * 60 * 60 * 1000), actionType: "MAINTENANCE_OVERRIDE", entityType: "machine", entityId: "M-007", requestedBy: operatorUser.id, status: "pending", approvedBy: null, approvedAt: null, reasonCode: "VIBRATION_ISSUE", notes: "Addressing vibration trend before it becomes critical", source: "in_app" },
      { ts: new Date(now.getTime() - 26 * 60 * 60 * 1000), actionType: "PRIORITY_OVERRIDE", entityType: "job", entityId: "J-048", requestedBy: supervisorUser.id, status: "pending", approvedBy: null, approvedAt: null, reasonCode: "CUSTOMER_URGENT", notes: "Customer delivery deadline moved up", source: "in_app" },
      { ts: new Date(now.getTime() - 28 * 60 * 60 * 1000), actionType: "RESCHEDULE", entityType: "schedule", entityId: "S-022", requestedBy: "orchestrator", status: "approved", approvedBy: adminUser.id, approvedAt: new Date(now.getTime() - 27 * 60 * 60 * 1000), reasonCode: "OPTIMIZATION", notes: "Risk-aware optimization reduces overall risk cost by 22%", source: "in_app" },
      { ts: new Date(now.getTime() - 30 * 60 * 60 * 1000), actionType: "MAINTENANCE_OVERRIDE", entityType: "machine", entityId: "M-004", requestedBy: operatorUser.id, status: "approved", approvedBy: supervisorUser.id, approvedAt: new Date(now.getTime() - 29 * 60 * 60 * 1000), reasonCode: "PREVENTIVE", notes: "Preventive maintenance to address vibration pattern", source: "in_app" },
    ];

    approvalData.forEach((a) => {
      const id = `AP-${String(this.approvals.size + 1).padStart(3, '0')}`;
      this.approvals.set(id, { ...a, id });
    });

    // Create comprehensive ticket data (12 tickets)
    const ticketData: Omit<Ticket, "id">[] = [
      { ts: new Date(now.getTime() - 3 * 60 * 60 * 1000), type: "QUALITY_ISSUE", status: "open", assignedTo: supervisorUser.id, dueBy: new Date(now.getTime() + 21 * 60 * 60 * 1000), entityType: "machine", entityId: "M-001", policyJson: { severity: "high", autoEscalate: true } },
      { ts: new Date(now.getTime() - 6 * 60 * 60 * 1000), type: "MACHINE_DOWNTIME", status: "in_progress", assignedTo: operatorUser.id, dueBy: new Date(now.getTime() + 18 * 60 * 60 * 1000), entityType: "machine", entityId: "M-005", policyJson: { severity: "critical", autoEscalate: true } },
      { ts: new Date(now.getTime() - 9 * 60 * 60 * 1000), type: "SCHEDULE_CONFLICT", status: "resolved", assignedTo: adminUser.id, dueBy: new Date(now.getTime() + 15 * 60 * 60 * 1000), entityType: "schedule", entityId: "S-015", policyJson: { severity: "medium", autoEscalate: false } },
      { ts: new Date(now.getTime() - 12 * 60 * 60 * 1000), type: "QUALITY_ISSUE", status: "open", assignedTo: supervisorUser.id, dueBy: new Date(now.getTime() + 12 * 60 * 60 * 1000), entityType: "machine", entityId: "M-002", policyJson: { severity: "high", autoEscalate: true } },
      { ts: new Date(now.getTime() - 15 * 60 * 60 * 1000), type: "MAINTENANCE_REQUEST", status: "in_progress", assignedTo: operatorUser.id, dueBy: new Date(now.getTime() + 9 * 60 * 60 * 1000), entityType: "machine", entityId: "M-009", policyJson: { severity: "medium", autoEscalate: false } },
      { ts: new Date(now.getTime() - 18 * 60 * 60 * 1000), type: "SCHEDULE_CONFLICT", status: "resolved", assignedTo: adminUser.id, dueBy: new Date(now.getTime() + 6 * 60 * 60 * 1000), entityType: "schedule", entityId: "S-012", policyJson: { severity: "low", autoEscalate: false } },
      { ts: new Date(now.getTime() - 21 * 60 * 60 * 1000), type: "QUALITY_ISSUE", status: "open", assignedTo: supervisorUser.id, dueBy: new Date(now.getTime() + 3 * 60 * 60 * 1000), entityType: "machine", entityId: "M-010", policyJson: { severity: "high", autoEscalate: true } },
      { ts: new Date(now.getTime() - 24 * 60 * 60 * 1000), type: "MACHINE_DOWNTIME", status: "resolved", assignedTo: operatorUser.id, dueBy: new Date(now.getTime()), entityType: "machine", entityId: "M-003", policyJson: { severity: "critical", autoEscalate: true } },
      { ts: new Date(now.getTime() - 27 * 60 * 60 * 1000), type: "MAINTENANCE_REQUEST", status: "open", assignedTo: operatorUser.id, dueBy: new Date(now.getTime() - 3 * 60 * 60 * 1000), entityType: "machine", entityId: "M-007", policyJson: { severity: "medium", autoEscalate: false } },
      { ts: new Date(now.getTime() - 30 * 60 * 60 * 1000), type: "SCHEDULE_CONFLICT", status: "resolved", assignedTo: adminUser.id, dueBy: new Date(now.getTime() - 6 * 60 * 60 * 1000), entityType: "schedule", entityId: "S-018", policyJson: { severity: "low", autoEscalate: false } },
      { ts: new Date(now.getTime() - 33 * 60 * 60 * 1000), type: "QUALITY_ISSUE", status: "in_progress", assignedTo: supervisorUser.id, dueBy: new Date(now.getTime() - 9 * 60 * 60 * 1000), entityType: "machine", entityId: "M-004", policyJson: { severity: "high", autoEscalate: true } },
      { ts: new Date(now.getTime() - 36 * 60 * 60 * 1000), type: "MACHINE_DOWNTIME", status: "resolved", assignedTo: operatorUser.id, dueBy: new Date(now.getTime() - 12 * 60 * 60 * 1000), entityType: "machine", entityId: "M-008", policyJson: { severity: "critical", autoEscalate: true } },
    ];

    ticketData.forEach((t) => {
      const id = `T-${String(this.tickets.size + 1).padStart(3, '0')}`;
      this.tickets.set(id, { ...t, id });
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
    
    // Trigger WhatsApp notification (async, don't wait)
    this.sendAlertWhatsApp(newAlert).catch(err => 
      console.error("[Storage] Failed to send alert WhatsApp:", err)
    );
    
    return newAlert;
  }

  private async sendAlertWhatsApp(alert: Alert): Promise<void> {
    try {
      const { sendWhatsAppMessage, formatAlertMessage } = await import("./services/whatsapp");
      const message = formatAlertMessage(alert);
      // Send to Operation Manager at +919655716000
      await sendWhatsAppMessage(message, { 
        alertId: alert.id,
        to: "+919655716000" // Operation Manager
      });
      console.log(`[Storage] Alert WhatsApp sent to Operation Manager: ${alert.id}`);
    } catch (error) {
      // Silently fail if WhatsApp service is not available
      console.error("[Storage] WhatsApp service error:", error);
    }
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
    
    // Trigger WhatsApp notification (async, don't wait)
    this.sendTicketWhatsApp(newTicket).catch(err => 
      console.error("[Storage] Failed to send ticket WhatsApp:", err)
    );
    
    return newTicket;
  }

  private async sendTicketWhatsApp(ticket: Ticket): Promise<void> {
    try {
      const { sendWhatsAppMessage, formatTicketMessage } = await import("./services/whatsapp");
      const message = formatTicketMessage(ticket);
      // Send directly to Operation Manager at +919655716000
      await sendWhatsAppMessage(message, { 
        ticketId: ticket.id,
        to: "+919655716000" // Operation Manager
      });
      console.log(`[Storage] Ticket WhatsApp sent to Operation Manager: ${ticket.id}`);
    } catch (error) {
      // Silently fail if WhatsApp service is not available
      console.error("[Storage] WhatsApp service error:", error);
    }
  }

  async updateTicketStatus(id: string, status: string): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (ticket) {
      ticket.status = status;
      if (ticket.updatedAt !== undefined) {
        ticket.updatedAt = new Date();
      }
      this.tickets.set(id, ticket);
    }
    return ticket;
  }

  // Customer ticket methods
  async getTicketByRef(ticketRef: string): Promise<Ticket | undefined> {
    const ticketId = this.ticketRefIndex.get(ticketRef);
    if (!ticketId) return undefined;
    return this.tickets.get(ticketId);
  }

  async createCustomerTicket(
    ticket: InsertTicket,
    initialMessage: InsertTicketMessage
  ): Promise<{ ticket: Ticket; message: TicketMessage }> {
    const ticketId = randomUUID();
    const messageId = randomUUID();
    const now = new Date();

    const newTicket: Ticket = {
      ...ticket,
      id: ticketId,
      ts: now,
      updatedAt: now,
    } as Ticket;

    const newMessage: TicketMessage = {
      ...initialMessage,
      id: messageId,
      ticketId,
      createdAt: now,
    } as TicketMessage;

    // Store ticket and message
    this.tickets.set(ticketId, newTicket);
    this.ticketMessages.set(messageId, newMessage);

    // Index by ticketRef for quick lookup
    if (ticket.ticketRef) {
      this.ticketRefIndex.set(ticket.ticketRef, ticketId);
    }

    // Index by externalId if provided (for idempotency)
    if (initialMessage.externalId) {
      this.externalIdIndex.set(initialMessage.externalId, messageId);
    }

    return { ticket: newTicket, message: newMessage };
  }

  async getTicketWithMessages(ticketRef: string): Promise<{ ticket: Ticket; messages: TicketMessage[] } | undefined> {
    const ticket = await this.getTicketByRef(ticketRef);
    if (!ticket) return undefined;

    // Get all messages for this ticket, ordered by createdAt
    const messages = Array.from(this.ticketMessages.values())
      .filter((msg) => msg.ticketRef === ticketRef || msg.ticketId === ticket.id)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

    return { ticket, messages };
  }

  async addTicketMessage(message: InsertTicketMessage): Promise<TicketMessage> {
    const messageId = randomUUID();
    const now = new Date();

    // Find ticket by ref
    const ticket = await this.getTicketByRef(message.ticketRef);
    if (!ticket) {
      throw new Error(`Ticket not found: ${message.ticketRef}`);
    }

    const newMessage: TicketMessage = {
      ...message,
      id: messageId,
      ticketId: ticket.id,
      createdAt: now,
    } as TicketMessage;

    // Check idempotency by externalId
    if (message.externalId) {
      const existingMessageId = this.externalIdIndex.get(message.externalId);
      if (existingMessageId) {
        const existing = this.ticketMessages.get(existingMessageId);
        if (existing) {
          return existing; // Return existing message (idempotent)
        }
      }
      this.externalIdIndex.set(message.externalId, messageId);
    }

    // Store message
    this.ticketMessages.set(messageId, newMessage);

    // Update ticket updatedAt
    if (ticket.updatedAt !== undefined) {
      ticket.updatedAt = now;
      this.tickets.set(ticket.id, ticket);
    }

    return newMessage;
  }

  async getMessageByExternalId(externalId: string): Promise<TicketMessage | undefined> {
    const messageId = this.externalIdIndex.get(externalId);
    if (!messageId) return undefined;
    return this.ticketMessages.get(messageId);
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

  // Dataset methods
  async getDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values()).sort((a, b) => {
      const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    const id = randomUUID();
    const newDataset: Dataset = { ...dataset, id, uploadedAt: new Date() };
    this.datasets.set(id, newDataset);
    return newDataset;
  }

  async deleteDataset(id: string): Promise<boolean> {
    return this.datasets.delete(id);
  }

  // ML Model methods
  async getMLModels(): Promise<MLModel[]> {
    return Array.from(this.mlModels.values()).sort((a, b) => {
      const dateA = a.trainedAt ? new Date(a.trainedAt).getTime() : 0;
      const dateB = b.trainedAt ? new Date(b.trainedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getMLModel(id: string): Promise<MLModel | undefined> {
    return this.mlModels.get(id);
  }

  async createMLModel(model: InsertMLModel): Promise<MLModel> {
    const id = randomUUID();
    const newModel: MLModel = { ...model, id, trainedAt: model.trainedAt || null };
    this.mlModels.set(id, newModel);
    return newModel;
  }

  async updateMLModel(id: string, updates: Partial<MLModel>): Promise<MLModel | undefined> {
    const model = this.mlModels.get(id);
    if (model) {
      const updated = { ...model, ...updates };
      this.mlModels.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Recommendation methods
  async getRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getRecommendation(id: string): Promise<Recommendation | undefined> {
    return this.recommendations.get(id);
  }

  async createRecommendation(rec: InsertRecommendation): Promise<Recommendation> {
    const id = randomUUID();
    const newRec: Recommendation = { ...rec, id, createdAt: new Date() };
    this.recommendations.set(id, newRec);
    return newRec;
  }

  async updateRecommendationStatus(
    id: string,
    status: string,
    userId?: string,
    overrideReason?: string
  ): Promise<Recommendation | undefined> {
    const rec = this.recommendations.get(id);
    if (rec) {
      const updated: Recommendation = {
        ...rec,
        status: status as any,
        acceptedBy: status === 'accepted' ? userId || null : rec.acceptedBy,
        acceptedAt: status === 'accepted' ? new Date() : rec.acceptedAt,
        overrideReason: overrideReason || rec.overrideReason,
      };
      this.recommendations.set(id, updated);
      return updated;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
