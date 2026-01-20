# Customer Support Ticket System

Production-grade ticket system with WhatsApp integration via n8n for bidirectional communication.

## Overview

The ticket system enables customers to create support tickets via the website, which are automatically sent to the operation manager via WhatsApp. The manager can reply via WhatsApp, and replies are automatically attached to the ticket conversation thread.

## Architecture

```
Website → POST /api/ticket → Railway → n8n Webhook → Twilio → WhatsApp Manager
                                                                    ↓
Website ← GET /api/ticket/:ticketRef ← Railway ← POST /api/ticket/inbound ← n8n ← Twilio ← WhatsApp Reply
```

## Environment Variables

Add these to your Railway project settings (Project Settings → Variables):

```bash
# Base URL (required for ticket URLs)
BASE_URL=https://aio2-production.up.railway.app

# n8n Webhook Configuration
N8N_TICKET_CREATED_WEBHOOK=https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created
N8N_SHARED_SECRET=your-secure-random-string-here

# Railway Inbound API Key (for n8n to call back)
RAILWAY_INBOUND_SECRET=another-secure-random-string-here

# Optional: Agent phone number (defaults to +919655716000)
AGENT_PHONE=+919655716000
```

### Generating Secure Secrets

```bash
# Generate secure random strings
openssl rand -hex 32  # For N8N_SHARED_SECRET
openssl rand -hex 32  # For RAILWAY_INBOUND_SECRET
```

## API Endpoints

### 1. Create Ticket

**POST** `/api/ticket`

Creates a new customer support ticket and notifies n8n.

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "subject": "Product Quality Issue",
  "message": "I received damaged bottles in my last order.",
  "priority": "high"
}
```

**Priority Values:** `low`, `medium`, `high`, `urgent` (default: `medium`)

**Response:**
```json
{
  "ok": true,
  "ticketRef": "T-20250115-1234",
  "ticketId": "uuid-here"
}
```

**cURL Example:**
```bash
curl -X POST https://aio2-production.up.railway.app/api/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerPhone": "+1234567890",
    "customerEmail": "john@example.com",
    "subject": "Product Quality Issue",
    "message": "I received damaged bottles in my last order.",
    "priority": "high"
  }'
```

**What Happens:**
1. Ticket is created with a human-readable `ticketRef` (e.g., `T-20250115-1234`)
2. Initial message is stored as the first message in the conversation
3. n8n webhook is called asynchronously (non-blocking) with ticket details
4. If n8n is down, ticket creation still succeeds (retries 3 times with exponential backoff)

### 2. Get Ticket with Messages

**GET** `/api/ticket/:ticketRef`

Retrieves a ticket with its full conversation thread.

**Response:**
```json
{
  "ok": true,
  "ticket": {
    "id": "uuid",
    "ticketRef": "T-20250115-1234",
    "subject": "Product Quality Issue",
    "status": "open",
    "customerName": "John Doe",
    "customerPhone": "+1234567890",
    "customerEmail": "john@example.com",
    "priority": "high",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T11:45:00Z"
  },
  "messages": [
    {
      "id": "msg-uuid-1",
      "sender": "customer",
      "channel": "web",
      "body": "I received damaged bottles in my last order.",
      "mediaUrl": null,
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "msg-uuid-2",
      "sender": "manager",
      "channel": "whatsapp",
      "body": "Thank you for reporting this. We'll investigate immediately.",
      "mediaUrl": null,
      "createdAt": "2025-01-15T11:45:00Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl https://aio2-production.up.railway.app/api/ticket/T-20250115-1234
```

### 3. Inbound WhatsApp Message

**POST** `/api/ticket/inbound`

Called by n8n when the manager replies via WhatsApp. This endpoint is protected by `x-api-key` header.

**Request Headers:**
```
x-api-key: <RAILWAY_INBOUND_SECRET>
Content-Type: application/json
```

**Request Body:**
```json
{
  "ticketRef": "T-20250115-1234",
  "message": "Thank you for reporting this. We'll investigate immediately.",
  "from": "+919655716000",
  "channel": "whatsapp",
  "externalId": "SM1234567890abcdef",  // Twilio MessageSid (for idempotency)
  "mediaUrl": "https://..."  // Optional: if message includes media
}
```

**Response:**
```json
{
  "ok": true
}
```

**cURL Example:**
```bash
curl -X POST https://aio2-production.up.railway.app/api/ticket/inbound \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-railway-inbound-secret" \
  -d '{
    "ticketRef": "T-20250115-1234",
    "message": "Thank you for reporting this. We will investigate immediately.",
    "from": "+919655716000",
    "channel": "whatsapp",
    "externalId": "SM1234567890abcdef"
  }'
```

**Idempotency:**
- If `externalId` is provided and already exists, the endpoint returns `ok: true` without creating a duplicate message
- This prevents duplicate messages if n8n retries the webhook call

## n8n Workflow Setup

### Workflow 1: Ticket Created → Send WhatsApp

1. **Webhook Node** (Trigger)
   - Method: POST
   - Path: `/webhook/ticket-created`
   - Authentication: Header Auth
     - Name: `x-api-key`
     - Value: `{{ $env.N8N_SHARED_SECRET }}`

2. **Function Node** (Format Message)
   ```javascript
   const ticket = $input.item.json;
   
   return {
     to: '+919655716000',  // Operation Manager
     body: `🎫 *NEW SUPPORT TICKET*
   
   *Ticket:* ${ticket.ticketRef}
   *Customer:* ${ticket.customerName}
   *Phone:* ${ticket.customerPhone}
   *Email:* ${ticket.customerEmail}
   *Priority:* ${ticket.priority.toUpperCase()}
   *Subject:* ${ticket.subject}
   
   *Message:*
   ${ticket.message}
   
   *View Ticket:* ${ticket.ticketUrl}
   
   Reply to this message to respond to the ticket.`
   };
   ```

3. **Twilio Node** (Send WhatsApp)
   - Account SID: `{{ $env.TWILIO_ACCOUNT_SID }}`
   - Auth Token: `{{ $env.TWILIO_AUTH_TOKEN }}`
   - From: `whatsapp:{{ $env.TWILIO_WHATSAPP_FROM }}`
   - To: `{{ $json.to }}`
   - Message: `{{ $json.body }}`

### Workflow 2: WhatsApp Reply → Update Ticket

1. **Twilio Trigger** (Incoming WhatsApp)
   - Configure Twilio webhook to call this n8n workflow
   - Twilio → WhatsApp → n8n webhook

2. **Function Node** (Parse Reply)
   ```javascript
   const message = $input.item.json;
   
   // Extract ticketRef from message body (e.g., "T-20250115-1234")
   // Or use a conversation mapping if you track which ticket the manager is replying to
   
   return {
     ticketRef: extractTicketRef(message.Body),  // Implement your logic
     message: message.Body,
     from: message.From,
     channel: 'whatsapp',
     externalId: message.MessageSid,
     mediaUrl: message.MediaUrl0 || null
   };
   ```

3. **HTTP Request Node** (Call Railway)
   - Method: POST
   - URL: `https://aio2-production.up.railway.app/api/ticket/inbound`
   - Headers:
     - `Content-Type: application/json`
     - `x-api-key: {{ $env.RAILWAY_INBOUND_SECRET }}`
   - Body: JSON from Function Node

## Data Model

### Tickets Table
- `id` (UUID, primary key)
- `ticketRef` (unique, human-readable: `T-YYYYMMDD-XXXX`)
- `customerName`, `customerPhone`, `customerEmail`
- `subject`, `priority`, `status`
- `createdAt` (`ts`), `updatedAt`

### Ticket Messages Table
- `id` (UUID, primary key)
- `ticketId` (FK to tickets)
- `ticketRef` (for quick lookup)
- `sender` (`customer` | `manager` | `agent`)
- `channel` (`web` | `whatsapp`)
- `body` (message text)
- `externalId` (Twilio MessageSid, unique, for idempotency)
- `mediaUrl` (optional)
- `createdAt`

## Error Handling

### Ticket Creation
- **400 Bad Request**: Invalid input (validation errors returned)
- **500 Internal Server Error**: Database/storage error (ticket creation fails, but n8n notification failure is non-blocking)

### Inbound Message
- **401 Unauthorized**: Invalid or missing `x-api-key` header
- **400 Bad Request**: Invalid input
- **404 Not Found**: Ticket not found
- **500 Internal Server Error**: Server error

### Get Ticket
- **400 Bad Request**: Missing `ticketRef`
- **404 Not Found**: Ticket not found
- **500 Internal Server Error**: Server error

## Security

1. **API Key Protection**: `/api/ticket/inbound` requires `x-api-key` header matching `RAILWAY_INBOUND_SECRET`
2. **Input Validation**: All inputs are validated using Zod schemas
3. **Idempotency**: Duplicate messages are prevented via `externalId` (Twilio MessageSid)
4. **Non-blocking Webhooks**: n8n notification failures don't block ticket creation

## Testing

### Test Ticket Creation
```bash
curl -X POST http://localhost:8080/api/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerPhone": "+1234567890",
    "customerEmail": "test@example.com",
    "subject": "Test Ticket",
    "message": "This is a test message",
    "priority": "medium"
  }'
```

### Test Get Ticket
```bash
curl http://localhost:8080/api/ticket/T-20250115-1234
```

### Test Inbound Message (with API key)
```bash
curl -X POST http://localhost:8080/api/ticket/inbound \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{
    "ticketRef": "T-20250115-1234",
    "message": "Test reply from manager",
    "from": "+919655716000",
    "channel": "whatsapp",
    "externalId": "test-external-id-123"
  }'
```

## Production Checklist

- [ ] Set `BASE_URL` in Railway variables
- [ ] Set `N8N_TICKET_CREATED_WEBHOOK` in Railway variables
- [ ] Set `N8N_SHARED_SECRET` in Railway variables (strong random string)
- [ ] Set `RAILWAY_INBOUND_SECRET` in Railway variables (strong random string)
- [ ] Configure n8n workflow for ticket creation → WhatsApp
- [ ] Configure n8n workflow for WhatsApp reply → Railway
- [ ] Test ticket creation end-to-end
- [ ] Test WhatsApp reply end-to-end
- [ ] Verify idempotency (send same message twice)
- [ ] Monitor logs for webhook failures

## Troubleshooting

### n8n Webhook Not Receiving Notifications
- Check `N8N_TICKET_CREATED_WEBHOOK` is correct
- Verify `N8N_SHARED_SECRET` matches n8n webhook auth
- Check Railway logs for webhook call errors
- Verify n8n workflow is active

### Inbound Messages Not Appearing
- Verify `x-api-key` header matches `RAILWAY_INBOUND_SECRET`
- Check ticketRef exists in database
- Verify n8n is calling the correct endpoint
- Check Railway logs for errors

### Duplicate Messages
- Ensure `externalId` (Twilio MessageSid) is included in inbound requests
- Verify idempotency check is working (check logs)

## Support

For issues or questions, check:
1. Railway deployment logs
2. n8n workflow execution logs
3. Twilio message logs
4. Application error logs
