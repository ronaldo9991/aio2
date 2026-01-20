/**
 * Ticket Service
 * Handles ticket creation, message management, and ticketRef generation
 */

import { randomUUID } from "crypto";

/**
 * Generate a human-readable ticket reference
 * Format: T-YYYYMMDD-XXXX (e.g., T-20250115-1234)
 */
export function generateTicketRef(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `T-${dateStr}-${random}`;
}

/**
 * Validate ticket creation input
 */
export interface CreateTicketInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  subject: string;
  message: string;
  priority?: string;
}

export function validateCreateTicketInput(data: any): {
  valid: boolean;
  errors: string[];
  input?: CreateTicketInput;
} {
  const errors: string[] = [];

  if (!data.customerName || typeof data.customerName !== "string" || data.customerName.trim().length === 0) {
    errors.push("customerName is required and must be a non-empty string");
  }

  if (!data.customerPhone || typeof data.customerPhone !== "string" || data.customerPhone.trim().length === 0) {
    errors.push("customerPhone is required and must be a non-empty string");
  }

  if (!data.customerEmail || typeof data.customerEmail !== "string" || !data.customerEmail.includes("@")) {
    errors.push("customerEmail is required and must be a valid email");
  }

  if (!data.subject || typeof data.subject !== "string" || data.subject.trim().length === 0) {
    errors.push("subject is required and must be a non-empty string");
  }

  if (!data.message || typeof data.message !== "string" || data.message.trim().length === 0) {
    errors.push("message is required and must be a non-empty string");
  }

  const priority = data.priority || "medium";
  if (!["low", "medium", "high", "urgent"].includes(priority)) {
    errors.push("priority must be one of: low, medium, high, urgent");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    input: {
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerEmail: data.customerEmail.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      priority: priority,
    },
  };
}

/**
 * Validate inbound message input
 */
export interface InboundMessageInput {
  ticketRef: string;
  message: string;
  from: string;
  channel: string;
  externalId?: string;
  mediaUrl?: string;
}

export function validateInboundMessageInput(data: any): {
  valid: boolean;
  errors: string[];
  input?: InboundMessageInput;
} {
  const errors: string[] = [];

  if (!data.ticketRef || typeof data.ticketRef !== "string") {
    errors.push("ticketRef is required and must be a string");
  }

  if (!data.message || typeof data.message !== "string" || data.message.trim().length === 0) {
    errors.push("message is required and must be a non-empty string");
  }

  if (!data.from || typeof data.from !== "string") {
    errors.push("from is required and must be a string");
  }

  if (!data.channel || typeof data.channel !== "string") {
    errors.push("channel is required and must be a string");
  }

  if (data.externalId && typeof data.externalId !== "string") {
    errors.push("externalId must be a string if provided");
  }

  if (data.mediaUrl && typeof data.mediaUrl !== "string") {
    errors.push("mediaUrl must be a string if provided");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    input: {
      ticketRef: data.ticketRef.trim(),
      message: data.message.trim(),
      from: data.from.trim(),
      channel: data.channel.trim(),
      externalId: data.externalId?.trim(),
      mediaUrl: data.mediaUrl?.trim(),
    },
  };
}
