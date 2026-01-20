import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const machines = pgTable("machines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("operational"),
  setupGroup: text("setup_group"),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productSize: text("product_size").notNull(),
  quantity: integer("quantity").notNull(),
  dueDate: timestamp("due_date").notNull(),
  priority: integer("priority").notNull().default(1),
  processingTimeMin: integer("processing_time_min").notNull(),
  requiredMachineType: text("required_machine_type").notNull(),
  moldId: text("mold_id"),
  setupGroup: text("setup_group"),
  createdAt: timestamp("created_at").defaultNow(),
  isUrgent: boolean("is_urgent").default(false),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  runId: varchar("run_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  mode: text("mode").notNull(),
  scenario: text("scenario"),
  kpiJson: jsonb("kpi_json"),
  weightsJson: jsonb("weights_json"),
});

export const scheduleItems = pgTable("schedule_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduleId: varchar("schedule_id").notNull(),
  machineId: varchar("machine_id").notNull(),
  jobId: varchar("job_id").notNull(),
  startTs: timestamp("start_ts").notNull(),
  endTs: timestamp("end_ts").notNull(),
  frozen: boolean("frozen").default(false),
  riskSnapshotJson: jsonb("risk_snapshot_json"),
  lockedFromPrev: boolean("locked_from_prev").default(false),
});

export const sensorReadings = pgTable("sensor_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  machineId: varchar("machine_id").notNull(),
  ts: timestamp("ts").notNull(),
  vibration: real("vibration"),
  temperature: real("temperature"),
  powerDraw: real("power_draw"),
  airPressure: real("air_pressure"),
  cycleTime: real("cycle_time"),
  motorCurrent: real("motor_current"),
  supplierBatchId: text("supplier_batch_id"),
  shiftId: text("shift_id"),
});

export const qualityMeasurements = pgTable("quality_measurements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  machineId: varchar("machine_id").notNull(),
  ts: timestamp("ts").notNull(),
  bottleWeightG: real("bottle_weight_g"),
  wallThicknessMm: real("wall_thickness_mm"),
  neckDiameterMm: real("neck_diameter_mm"),
  defectLabel: text("defect_label"),
  moldWearScore: real("mold_wear_score"),
  supplierBatchId: text("supplier_batch_id"),
  shiftId: text("shift_id"),
});

export const riskScores = pgTable("risk_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  ts: timestamp("ts").notNull(),
  failureRisk: real("failure_risk"),
  qualityRisk: real("quality_risk"),
  uncertaintyJson: jsonb("uncertainty_json"),
  explanationJson: jsonb("explanation_json"),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ts: timestamp("ts").defaultNow(),
  severity: text("severity").notNull(),
  type: text("type").notNull(),
  entityType: text("entity_type"),
  entityId: varchar("entity_id"),
  message: text("message").notNull(),
  acknowledgedBy: varchar("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  dedupeKey: text("dedupe_key"),
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ts: timestamp("ts").defaultNow(),
  type: text("type").notNull(),
  status: text("status").notNull().default("open"),
  assignedTo: varchar("assigned_to"),
  dueBy: timestamp("due_by"),
  entityType: text("entity_type"),
  entityId: varchar("entity_id"),
  policyJson: jsonb("policy_json"),
  // Customer support ticket fields
  ticketRef: varchar("ticket_ref").unique(), // Human-readable reference (e.g., T-20250115-1234)
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  subject: text("subject"),
  priority: text("priority").default("medium"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ticketMessages = pgTable("ticket_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull(), // FK to tickets.id
  ticketRef: varchar("ticket_ref").notNull(), // Also store ref for quick lookup
  sender: text("sender").notNull(), // "customer" | "manager" | "agent"
  channel: text("channel").notNull(), // "web" | "whatsapp"
  body: text("body").notNull(),
  externalId: varchar("external_id").unique(), // Twilio MessageSid for idempotency
  mediaUrl: text("media_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const approvals = pgTable("approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ts: timestamp("ts").defaultNow(),
  actionType: text("action_type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  requestedBy: varchar("requested_by"),
  status: text("status").notNull().default("pending"),
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  reasonCode: text("reason_code"),
  notes: text("notes"),
  source: text("source").default("in_app"),
});

export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ts: timestamp("ts").defaultNow(),
  userId: varchar("user_id"),
  uploadType: text("upload_type").notNull(),
  filename: text("filename").notNull(),
  rowCount: integer("row_count"),
  mappingJson: jsonb("mapping_json"),
  status: text("status").notNull().default("ok"),
  errorJson: jsonb("error_json"),
});

export const adminRules = pgTable("admin_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  updatedAt: timestamp("updated_at").defaultNow(),
  rulesJson: jsonb("rules_json"),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ts: timestamp("ts").defaultNow(),
  userId: varchar("user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: varchar("entity_id"),
  beforeJson: jsonb("before_json"),
  afterJson: jsonb("after_json"),
  reasonCode: text("reason_code"),
});

export const whatsappConfig = pgTable("whatsapp_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: text("provider").default("twilio"),
  enabled: boolean("enabled").default(false),
  fromNumber: text("from_number"),
  supervisorNumbersJson: jsonb("supervisor_numbers_json"),
  webhookSecret: text("webhook_secret"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const datasets = pgTable("datasets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  filename: text("filename").notNull(),
  rowCount: integer("row_count"),
  columnMappingJson: jsonb("column_mapping_json"),
  sampleDataJson: jsonb("sample_data_json"),
  status: text("status").notNull().default("active"),
  uploadedBy: varchar("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  description: text("description"),
  tags: jsonb("tags"),
});

export const mlModels = pgTable("ml_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'forecast', 'classification', 'anomaly'
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("draft"), // 'draft', 'training', 'active', 'archived'
  datasetId: varchar("dataset_id"),
  metricsJson: jsonb("metrics_json"),
  featureImportanceJson: jsonb("feature_importance_json"),
  trainedAt: timestamp("trained_at"),
  trainedBy: varchar("trained_by"),
  configJson: jsonb("config_json"),
});

export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'maintenance', 'schedule', 'quality', 'energy'
  entityType: text("entity_type"), // 'machine', 'job', 'schedule'
  entityId: varchar("entity_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: real("confidence").notNull(),
  impactEstimate: text("impact_estimate"),
  status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'overridden'
  acceptedBy: varchar("accepted_by"),
  acceptedAt: timestamp("accepted_at"),
  overrideReason: text("override_reason"),
  modelId: varchar("model_id"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertMachineSchema = createInsertSchema(machines).omit({ id: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true });
export const insertScheduleSchema = createInsertSchema(schedules).omit({ id: true, createdAt: true });
export const insertScheduleItemSchema = createInsertSchema(scheduleItems).omit({ id: true });
export const insertSensorReadingSchema = createInsertSchema(sensorReadings).omit({ id: true });
export const insertQualityMeasurementSchema = createInsertSchema(qualityMeasurements).omit({ id: true });
export const insertRiskScoreSchema = createInsertSchema(riskScores).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, ts: true });
export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, ts: true, updatedAt: true });
export const insertTicketMessageSchema = createInsertSchema(ticketMessages).omit({ id: true, createdAt: true });
export const insertApprovalSchema = createInsertSchema(approvals).omit({ id: true, ts: true });
export const insertUploadSchema = createInsertSchema(uploads).omit({ id: true, ts: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, ts: true });
export const insertDatasetSchema = createInsertSchema(datasets).omit({ id: true, uploadedAt: true });
export const insertMLModelSchema = createInsertSchema(mlModels).omit({ id: true, trainedAt: true });
export const insertRecommendationSchema = createInsertSchema(recommendations).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Machine = typeof machines.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type ScheduleItem = typeof scheduleItems.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;
export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertQualityMeasurement = z.infer<typeof insertQualityMeasurementSchema>;
export type QualityMeasurement = typeof qualityMeasurements.$inferSelect;
export type InsertRiskScore = z.infer<typeof insertRiskScoreSchema>;
export type RiskScore = typeof riskScores.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTicketMessage = z.infer<typeof insertTicketMessageSchema>;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertApproval = z.infer<typeof insertApprovalSchema>;
export type Approval = typeof approvals.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;
export type InsertMLModel = z.infer<typeof insertMLModelSchema>;
export type MLModel = typeof mlModels.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type UserRole = "viewer" | "operator" | "supervisor" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface ScheduleKPIs {
  makespan: number;
  totalLateness: number;
  onTimeRate: number;
  changeovers: number;
  utilization: number;
  riskCost: number;
  stability: number;
}
