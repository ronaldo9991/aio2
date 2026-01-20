/**
 * WhatsApp Integration Service
 * Supports both direct Twilio integration and n8n webhook integration
 */

interface WhatsAppMessage {
  to: string;
  message: string;
  alertId?: string;
  ticketId?: string;
}

interface WhatsAppConfig {
  accountSid?: string;
  authToken?: string;
  fromNumber?: string; // Twilio WhatsApp number (format: whatsapp:+1234567890)
  webhookUrl?: string; // n8n webhook URL
  enabled: boolean;
}

// Default configuration - can be overridden via environment variables
const config: WhatsAppConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromNumber: process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886", // Twilio sandbox number
  webhookUrl: process.env.N8N_WEBHOOK_URL,
  enabled: process.env.WHATSAPP_ENABLED === "true" || !!process.env.TWILIO_ACCOUNT_SID || !!process.env.N8N_WEBHOOK_URL,
};

const TARGET_PHONE = "+91965571600"; // Default target phone number

/**
 * Send WhatsApp message via Twilio directly
 */
async function sendViaTwilio(message: WhatsAppMessage): Promise<boolean> {
  if (!config.accountSid || !config.authToken || !config.fromNumber) {
    console.warn("[WhatsApp] Twilio credentials not configured");
    return false;
  }

  try {
    // Dynamic import to avoid bundling issues if Twilio is not installed
    const twilio = await import("twilio");
    const client = twilio.default(config.accountSid, config.authToken);

    const formattedTo = message.to.startsWith("whatsapp:") 
      ? message.to 
      : `whatsapp:${message.to}`;

    const result = await client.messages.create({
      from: config.fromNumber,
      to: formattedTo,
      body: message.message,
    });

    console.log(`[WhatsApp] Message sent via Twilio: ${result.sid}`);
    return true;
  } catch (error: any) {
    console.error("[WhatsApp] Twilio error:", error.message);
    return false;
  }
}

/**
 * Send WhatsApp message via n8n webhook
 */
async function sendViaWebhook(message: WhatsAppMessage): Promise<boolean> {
  if (!config.webhookUrl) {
    console.warn("[WhatsApp] n8n webhook URL not configured");
    return false;
  }

  try {
    const axios = await import("axios");
    const response = await axios.default.post(config.webhookUrl, {
      to: message.to,
      message: message.message,
      alertId: message.alertId,
      ticketId: message.ticketId,
      timestamp: new Date().toISOString(),
    });

    console.log(`[WhatsApp] Webhook sent to n8n: ${response.status}`);
    return response.status === 200;
  } catch (error: any) {
    console.error("[WhatsApp] Webhook error:", error.message);
    return false;
  }
}

/**
 * Send WhatsApp message
 * Tries webhook first (n8n), then falls back to direct Twilio
 */
export async function sendWhatsAppMessage(
  message: string,
  options: {
    alertId?: string;
    ticketId?: string;
    to?: string;
  } = {}
): Promise<boolean> {
  if (!config.enabled) {
    console.log("[WhatsApp] WhatsApp integration is disabled");
    return false;
  }

  const whatsappMessage: WhatsAppMessage = {
    to: options.to || TARGET_PHONE,
    message,
    alertId: options.alertId,
    ticketId: options.ticketId,
  };

  // Try webhook first (n8n), then fall back to direct Twilio
  if (config.webhookUrl) {
    const webhookSuccess = await sendViaWebhook(whatsappMessage);
    if (webhookSuccess) {
      return true;
    }
    // Fall back to Twilio if webhook fails
  }

  if (config.accountSid && config.authToken) {
    return await sendViaTwilio(whatsappMessage);
  }

  return false;
}

/**
 * Format alert message for WhatsApp
 */
export function formatAlertMessage(alert: {
  id: string;
  severity: string;
  type: string;
  message: string;
  entityType: string;
  entityId: string;
  ts: string;
}): string {
  const severityEmoji: Record<string, string> = {
    CRITICAL: "🔴",
    WARNING: "⚠️",
    INFO: "ℹ️",
  };

  const emoji = severityEmoji[alert.severity] || "📢";
  const timestamp = new Date(alert.ts).toLocaleString();

  return `${emoji} *ALERT: ${alert.severity}*

*Type:* ${alert.type}
*Entity:* ${alert.entityType} ${alert.entityId}
*Time:* ${timestamp}

${alert.message}

_Alert ID: ${alert.id}_`;
}

/**
 * Format ticket message for WhatsApp
 */
export function formatTicketMessage(ticket: {
  id: string;
  type: string;
  status: string;
  entityType: string;
  entityId: string;
  ts: string;
  assignedTo?: string | null;
  dueBy?: string | null;
}): string {
  const statusEmoji: Record<string, string> = {
    open: "🆕",
    in_progress: "🔄",
    resolved: "✅",
    closed: "🔒",
  };

  const emoji = statusEmoji[ticket.status] || "🎫";
  const timestamp = new Date(ticket.ts).toLocaleString();
  const dueDate = ticket.dueBy 
    ? new Date(ticket.dueBy).toLocaleString()
    : "Not set";

  return `${emoji} *SUPPORT TICKET: ${ticket.status.toUpperCase()}*

*Type:* ${ticket.type}
*Status:* ${ticket.status}
*Entity:* ${ticket.entityType} ${ticket.entityId}
*Created:* ${timestamp}
*Due By:* ${dueDate}
${ticket.assignedTo ? `*Assigned To:* ${ticket.assignedTo}` : ""}

_Ticket ID: ${ticket.id}_`;
}
