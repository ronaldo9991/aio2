# n8n Setup Guide for Ticket System

## Your n8n Webhook URL

```
https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created
```

## Railway Environment Variables

Set these in Railway → Project Settings → Variables:

```bash
BASE_URL=https://aio2-production.up.railway.app
N8N_TICKET_CREATED_WEBHOOK=https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created
N8N_SHARED_SECRET=<generate-secure-random-string>
RAILWAY_INBOUND_SECRET=<generate-secure-random-string>
```

## n8n Workflow 1: Ticket Created → Send WhatsApp

### Step 1: Webhook Node (Trigger)

1. Add a **Webhook** node
2. Configure:
   - **HTTP Method**: `POST`
   - **Path**: `/webhook-test/ticket-created` (already in your URL)
   - **Authentication**: `Header Auth`
     - **Name**: `x-api-key`
     - **Value**: `{{ $env.N8N_SHARED_SECRET }}` (or hardcode your secret)

### Step 2: Function Node (Format WhatsApp Message)

Add a **Code** node with this JavaScript:

```javascript
const ticket = $input.item.json;

// Format WhatsApp message
const message = `🎫 *NEW SUPPORT TICKET*

*Ticket:* ${ticket.ticketRef}
*Customer:* ${ticket.customerName}
*Phone:* ${ticket.customerPhone}
*Email:* ${ticket.customerEmail}
*Priority:* ${ticket.priority.toUpperCase()}
*Subject:* ${ticket.subject}

*Message:*
${ticket.message}

*View Ticket:* ${ticket.ticketUrl}

Reply to this message to respond to the ticket.`;

return {
  to: '+919655716000',  // Operation Manager
  body: message,
  ticketRef: ticket.ticketRef
};
```

### Step 3: Twilio Node (Send WhatsApp)

1. Add a **Twilio** node
2. Configure:
   - **Resource**: `Message`
   - **Operation**: `Send Message`
   - **From**: `whatsapp:{{ $env.TWILIO_WHATSAPP_FROM }}`
   - **To**: `{{ $json.to }}`
   - **Message**: `{{ $json.body }}`

### Step 4: Test the Workflow

1. Activate the workflow in n8n
2. Test by creating a ticket via Railway API:
```bash
curl -X POST https://aio2-production.up.railway.app/api/ticket \
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

3. Check n8n execution logs to see if webhook was received
4. Verify WhatsApp message was sent to +919655716000

## n8n Workflow 2: WhatsApp Reply → Update Ticket

### Step 1: Twilio Trigger (Incoming WhatsApp)

1. Add a **Twilio Trigger** node
2. Configure Twilio webhook to point to this n8n workflow URL
3. In Twilio Console → WhatsApp → Sandbox/Number → Configure webhook URL

### Step 2: Function Node (Parse Reply)

Add a **Code** node to extract ticket reference and format the reply:

```javascript
const message = $input.item.json;

// Extract ticketRef from message body or use conversation mapping
// Option 1: If ticketRef is in the message (e.g., "T-20250115-1234")
const ticketRefMatch = message.Body.match(/T-\d{8}-\d{4}/);
const ticketRef = ticketRefMatch ? ticketRefMatch[0] : null;

// Option 2: Use conversation mapping (store ticketRef in Twilio conversation)
// const ticketRef = message.ConversationSid; // If you map conversations

if (!ticketRef) {
  // If no ticketRef found, you might want to send an error message
  return {
    error: true,
    message: "Could not identify ticket reference. Please include ticket number (e.g., T-20250115-1234) in your reply."
  };
}

return {
  ticketRef: ticketRef,
  message: message.Body,
  from: message.From,
  channel: 'whatsapp',
  externalId: message.MessageSid,
  mediaUrl: message.MediaUrl0 || null
};
```

### Step 3: HTTP Request Node (Call Railway)

1. Add an **HTTP Request** node
2. Configure:
   - **Method**: `POST`
   - **URL**: `https://aio2-production.up.railway.app/ticket/inbound`
   - **Headers**:
     - `Content-Type`: `application/json`
     - `x-api-key`: `{{ $env.RAILWAY_INBOUND_SECRET }}`
   - **Body**: JSON from previous node:
     ```json
     {
       "ticketRef": "{{ $json.ticketRef }}",
       "message": "{{ $json.message }}",
       "from": "{{ $json.from }}",
       "channel": "{{ $json.channel }}",
       "externalId": "{{ $json.externalId }}",
       "mediaUrl": "{{ $json.mediaUrl }}"
     }
     ```

### Step 4: Error Handling (Optional)

Add error handling to send a WhatsApp message if the ticket update fails:

```javascript
// In a Function node after HTTP Request
if ($input.item.json.ok === false) {
  return {
    error: true,
    message: "Failed to update ticket. Please try again or contact support."
  };
}
return { success: true };
```

## Testing the Complete Flow

1. **Create Ticket**:
   ```bash
   curl -X POST https://aio2-production.up.railway.app/api/ticket \
     -H "Content-Type: application/json" \
     -d '{
       "customerName": "John Doe",
       "customerPhone": "+1234567890",
       "customerEmail": "john@example.com",
       "subject": "Product Issue",
       "message": "I have a problem with my order",
       "priority": "high"
     }'
   ```

2. **Verify WhatsApp sent** to +919655716000

3. **Reply via WhatsApp** from +919655716000:
   ```
   T-20250115-1234 Thank you for reporting this. We will investigate immediately.
   ```

4. **Verify reply appears** in ticket:
   ```bash
   curl https://aio2-production.up.railway.app/api/ticket/T-20250115-1234
   ```

## Troubleshooting

### Webhook Not Receiving Requests

1. Check Railway logs for webhook call attempts
2. Verify `N8N_SHARED_SECRET` matches in both Railway and n8n
3. Check n8n workflow is **Active**
4. Test webhook manually:
   ```bash
   curl -X POST https://n8n.srv1281573.hstgr.cloud/webhook/7ca8565a-7a16-4820-b6d2-4a30460f589c \
     -H "Content-Type: application/json" \
     -H "x-api-key: your-secret" \
     -d '{
       "ticketRef": "T-20250115-1234",
       "ticketId": "test-id",
       "ticketUrl": "https://aio2-production.up.railway.app/api/ticket/T-20250115-1234",
       "customerName": "Test",
       "customerPhone": "+1234567890",
       "customerEmail": "test@example.com",
       "subject": "Test",
       "message": "Test message",
       "priority": "medium",
       "createdAt": "2025-01-15T10:30:00Z"
     }'
   ```

### Inbound Messages Not Working

1. Verify `RAILWAY_INBOUND_SECRET` is set correctly
2. Check Railway logs for `/api/ticket/inbound` calls
3. Verify Twilio webhook is configured correctly
4. Test inbound endpoint manually:
   ```bash
   curl -X POST https://aio2-production.up.railway.app/ticket/inbound \
     -H "Content-Type: application/json" \
     -H "x-api-key: your-railway-inbound-secret" \
     -d '{
       "ticketRef": "T-20250115-1234",
       "message": "Test reply",
       "from": "+919655716000",
       "channel": "whatsapp",
       "externalId": "test-id-123"
     }'
   ```

## Security Notes

- **Never commit secrets** to git
- Use n8n environment variables for secrets
- Rotate secrets periodically
- Monitor n8n execution logs for suspicious activity
- Use HTTPS for all webhook URLs (already configured)
