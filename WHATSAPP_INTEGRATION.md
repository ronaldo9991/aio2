# WhatsApp Integration Guide

This application supports WhatsApp notifications via Twilio and n8n integration for alerts and support tickets.

## Features

- **Automatic WhatsApp notifications** when alerts are created
- **Automatic WhatsApp notifications** when support tickets are created
- **Dual integration support**: Direct Twilio or n8n webhook
- **Operation Manager notifications**: All alerts and tickets sent to +919655716000

## Setup Options

### Option 1: Direct Twilio Integration

1. **Get Twilio Credentials**:
   - Sign up at [Twilio](https://www.twilio.com/)
   - Get your Account SID and Auth Token from the Twilio Console
   - Set up a WhatsApp-enabled phone number (or use Twilio Sandbox for testing)

2. **Set Environment Variables**:
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  # Your Twilio WhatsApp number
   WHATSAPP_ENABLED=true
   ```

3. **For Railway Deployment**:
   - Add these variables in Railway → Project Settings → Variables

### Option 2: n8n Webhook Integration (Recommended)

1. **Set up n8n Workflow**:
   - Create a new workflow in n8n
   - Add a "Webhook" node to receive alerts/tickets
   - Add a "Twilio" node to send WhatsApp messages
   - Configure the Twilio node with your credentials

2. **Set Environment Variables**:
   ```bash
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
   WHATSAPP_ENABLED=true
   ```

3. **n8n Workflow Example**:
   ```
   Webhook (POST) → Function (Format Message) → Twilio (Send WhatsApp)
   ```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `WHATSAPP_ENABLED` | Enable WhatsApp integration | No | `false` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Yes (for Twilio) | - |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Yes (for Twilio) | - |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp number | Yes (for Twilio) | `whatsapp:+14155238886` |
| `N8N_WEBHOOK_URL` | n8n webhook URL | Yes (for n8n) | - |
| `WHATSAPP_TARGET_PHONE` | Target phone number | No | `+919655716000` (Operation Manager) |

### Target Phone Number

The default target phone number is `+919655716000` (Operation Manager). All alerts and support tickets are automatically sent to this number. You can override this by:
- Setting `WHATSAPP_TARGET_PHONE` environment variable
- Passing `to` parameter in webhook calls

## How It Works

### Automatic Notifications

When an alert or ticket is created (via API or system), the application automatically:

1. Formats the message using the appropriate template
2. Sends the message via:
   - **n8n webhook** (if `N8N_WEBHOOK_URL` is set)
   - **Direct Twilio** (if Twilio credentials are set)
3. Logs success/failure (doesn't block the main operation)

### Message Formats

#### Alert Message Format:
```
🔴 *ALERT: CRITICAL*

*Type:* MACHINE_FAILURE
*Entity:* machine M-003
*Time:* 1/15/2025, 10:30:00 AM

High vibration detected - potential bearing failure

_Alert ID: A-001_
```

#### Ticket Message Format:
```
🆕 *SUPPORT TICKET: OPEN*

*Type:* MAINTENANCE_REQUEST
*Status:* open
*Entity:* machine M-007
*Created:* 1/15/2025, 8:00:00 AM
*Due By:* 1/16/2025, 12:00:00 PM
*Assigned To:* operator1

_Ticket ID: T-001_
```

## API Endpoints

### Create Alert (triggers WhatsApp)
```http
POST /api/alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "severity": "CRITICAL",
  "type": "MACHINE_FAILURE",
  "entityType": "machine",
  "entityId": "M-003",
  "message": "High vibration detected - potential bearing failure"
}
```

### Create Ticket (triggers WhatsApp)
```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "MAINTENANCE_REQUEST",
  "entityType": "machine",
  "entityId": "M-007",
  "assignedTo": "operator1",
  "dueBy": "2025-01-16T12:00:00Z"
}
```

### Webhook Endpoints (for n8n)

#### Alert Webhook
```http
POST /api/webhooks/whatsapp/alert
Content-Type: application/json

{
  "id": "A-001",
  "severity": "CRITICAL",
  "type": "MACHINE_FAILURE",
  "entityType": "machine",
  "entityId": "M-003",
  "message": "High vibration detected",
  "ts": "2025-01-15T10:30:00Z",
  "to": "+919655716000"  // Optional: override target (defaults to Operation Manager)
}
```

#### Ticket Webhook
```http
POST /api/webhooks/whatsapp/ticket
Content-Type: application/json

{
  "id": "T-001",
  "type": "MAINTENANCE_REQUEST",
  "status": "open",
  "entityType": "machine",
  "entityId": "M-007",
  "ts": "2025-01-15T08:00:00Z",
  "assignedTo": "operator1",
  "dueBy": "2025-01-16T12:00:00Z",
  "to": "+919655716000"  // Optional: override target (defaults to Operation Manager)
}
```

## n8n Workflow Setup

### Step 1: Create Webhook Node

1. Add a "Webhook" node
2. Set method to `POST`
3. Copy the webhook URL
4. Set this URL as `N8N_WEBHOOK_URL` in your environment

### Step 2: Add Function Node (Optional)

Format the message if needed:
```javascript
const alert = $input.item.json;
const message = `🔴 ALERT: ${alert.severity}\n\n${alert.message}`;
return { json: { to: alert.to || "+91965571600", message } };
```

### Step 3: Add Twilio Node

1. Add "Twilio" node
2. Configure with your Twilio credentials:
   - Account SID
   - Auth Token
   - From: Your Twilio WhatsApp number (format: `whatsapp:+1234567890`)
   - To: `{{ $json.to }}`
   - Message: `{{ $json.message }}`

### Step 4: Test Workflow

1. Activate the workflow in n8n
2. Create a test alert via API
3. Check if WhatsApp message is received

## Testing

### Test Alert Creation
```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "CRITICAL",
    "type": "TEST_ALERT",
    "message": "This is a test alert"
  }'
```

### Test Ticket Creation
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "TEST_TICKET",
    "entityType": "system",
    "entityId": "TEST-001"
  }'
```

### Test Webhook Directly
```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp/alert \
  -H "Content-Type: application/json" \
  -d '{
    "id": "A-TEST",
    "severity": "CRITICAL",
    "type": "TEST",
    "message": "Test alert",
    "ts": "2025-01-15T10:30:00Z"
  }'
```

## Troubleshooting

### WhatsApp messages not sending

1. **Check environment variables**:
   ```bash
   echo $WHATSAPP_ENABLED
   echo $TWILIO_ACCOUNT_SID
   echo $N8N_WEBHOOK_URL
   ```

2. **Check server logs**:
   - Look for `[WhatsApp]` log messages
   - Check for error messages

3. **Verify Twilio credentials**:
   - Test Twilio credentials in Twilio Console
   - Ensure WhatsApp is enabled for your number

4. **Verify n8n webhook**:
   - Test webhook URL directly
   - Check n8n workflow execution logs
   - Ensure workflow is activated

### Phone number format

- Always use international format: `+91965571600`
- For Twilio: Prefix with `whatsapp:` if needed: `whatsapp:+91965571600`
- The service automatically handles formatting

## Security Notes

- Webhook endpoints (`/api/webhooks/whatsapp/*`) are **not protected** by authentication
- For production, consider:
  - Adding webhook authentication (API key)
  - Using HTTPS only
  - Rate limiting webhook endpoints
  - IP whitelisting for n8n instance

## Next Steps

1. Set up your preferred integration method (Twilio or n8n)
2. Configure environment variables
3. Test with a sample alert/ticket
4. Monitor logs for successful message delivery
5. Customize message formats if needed
