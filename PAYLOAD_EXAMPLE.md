# n8n Webhook Payload Example

## Railway → n8n Webhook Payload

When a ticket is created, Railway sends this exact JSON structure to n8n:

```json
{
  "ticketRef": "T-20250115-1234",
  "ticketId": "uuid-here",
  "subject": "Product Quality Issue",
  "message": "I received damaged bottles in my last order.",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "priority": "high",
  "ticketUrl": "https://aio2-production.up.railway.app/ticket/T-20250115-1234",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## Headers

The request includes this security header:

```
x-api-key: YOUR_SHARED_SECRET
```

## Implementation

The payload is sent asynchronously (non-blocking) after ticket creation:

```javascript
// In server/routes.ts - POST /api/ticket
await notifyN8nTicketCreated({
  ticketRef,
  ticketId: ticket.id,
  subject: input.subject,
  message: input.message,
  customerName: input.customerName,
  customerPhone: input.customerPhone,
  customerEmail: input.customerEmail,
  priority: input.priority,
  ticketUrl: `${BASE_URL}/ticket/${ticketRef}`,
  createdAt: now.toISOString(),
}).catch((err) => {
  console.error("[API] Failed to notify n8n (non-blocking):", err);
});
```

## n8n Webhook URL

```
https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created
```

## Testing

Test the webhook manually:

```bash
curl -X POST https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-shared-secret" \
  -d '{
    "ticketRef": "T-20250115-1234",
    "ticketId": "test-id-123",
    "subject": "Test Ticket",
    "message": "This is a test message",
    "customerName": "Test User",
    "customerPhone": "+1234567890",
    "customerEmail": "test@example.com",
    "priority": "medium",
    "ticketUrl": "https://aio2-production.up.railway.app/ticket/T-20250115-1234",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }'
```

## Next Step: Connect Twilio WhatsApp

After the webhook receives the payload, connect it to:
- **Twilio Send WhatsApp** node
- Format the message using the payload data
- Send to operation manager (+919655716000)
