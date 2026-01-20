/**
 * n8n Webhook Service
 * Handles secure webhook calls to n8n with retry logic
 */

/**
 * n8n Webhook Payload Structure
 * Matches the exact format required by n8n webhook
 */
interface WebhookPayload {
  ticketRef: string;
  ticketId: string;
  subject: string;
  message: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  priority: string;
  ticketUrl: string;
  createdAt: string;
}

/**
 * Send ticket created event to n8n webhook
 * Implements retry logic with exponential backoff
 */
export async function notifyN8nTicketCreated(payload: WebhookPayload): Promise<boolean> {
  const webhookUrl = process.env.N8N_TICKET_CREATED_WEBHOOK;
  const apiKey = process.env.N8N_SHARED_SECRET;

  if (!webhookUrl || !apiKey) {
    console.warn("[n8n] Webhook URL or API key not configured, skipping notification");
    return false;
  }

  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const axios = await import("axios");
      const response = await axios.default.post(
        webhookUrl,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log(`[n8n] Ticket created notification sent successfully: ${payload.ticketRef}`);
        return true;
      }
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff

      if (isLastAttempt) {
        console.error(
          `[n8n] Failed to send ticket notification after ${maxRetries} attempts:`,
          error.message
        );
        // Log to error tracking (in production, use proper error tracking service)
        return false;
      }

      console.warn(
        `[n8n] Attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms:`,
        error.message
      );

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return false;
}
