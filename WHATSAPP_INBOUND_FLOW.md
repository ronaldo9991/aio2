# WhatsApp Inbound Message Flow

## Complete Flow Diagram

```
Manager replies on WhatsApp
    ↓
Twilio receives message
    ↓
Twilio → n8n Webhook: /webhook-test/twilio/whatsapp-inbound
    ↓
n8n processes message (extracts ticketRef, formats reply)
    ↓
n8n → Railway: POST /ticket/inbound
    ↓
Railway adds message to ticket conversation
    ↓
Message appears in ticket thread on dashboard
```

## n8n Inbound Webhook Configuration

### Webhook URL
```
https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound
```

### Authentication
- **Header**: `x-api-key`
- **Value**: `20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3`

## Twilio Configuration

### Set Webhook URL in Twilio
1. Go to Twilio Console → WhatsApp → Sandbox (or your WhatsApp number)
2. Set **When a message comes in** webhook URL:
   ```
   https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound
   ```
3. Method: `POST`

## n8n Workflow Setup

### Step 1: Webhook Node
- **Path**: `/webhook-test/twilio/whatsapp-inbound`
- **Method**: `POST`
- **Auth**: Header Auth with `x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3`

### Step 2: Function Node (Parse Message)
```javascript
const twilioData = $input.item.json;
const messageBody = twilioData.Body || twilioData.message || '';
const ticketRefMatch = messageBody.match(/T-\d{8}-\d{4}/);

const ticketRef = ticketRefMatch ? ticketRefMatch[0] : null;
let replyMessage = messageBody.replace(ticketRef || '', '').trim();

if (!ticketRef) {
  return {
    error: true,
    message: "Could not identify ticket reference. Please include ticket number (e.g., T-20250115-1234) in your reply."
  };
}

return {
  ticketRef: ticketRef,
  message: replyMessage || messageBody,
  from: twilioData.From || '+919655716000',
  channel: 'whatsapp',
  externalId: twilioData.MessageSid || null,
  mediaUrl: twilioData.MediaUrl0 || null
};
```

### Step 3: HTTP Request Node (Call Railway)
- **URL**: `https://aio2-production.up.railway.app/ticket/inbound`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca`
- **Body**: JSON from Function node

## Railway Endpoint

### POST /ticket/inbound
- **URL**: `https://aio2-production.up.railway.app/ticket/inbound`
- **Auth**: Requires `x-api-key` header
- **Secret**: `44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca`

## Message Format

When manager replies on WhatsApp, the message should include the ticket reference:

**Format 1:**
```
T-20250115-1234 Thank you for your message. We will investigate.
```

**Format 2:**
```
T-20250115-1234
Thank you for your message. We will investigate.
```

The n8n workflow will:
1. Extract `T-20250115-1234` as ticketRef
2. Use the rest as the reply message
3. Send to Railway to add to ticket conversation

## Testing

### Test n8n Webhook
```bash
curl -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d '{
    "Body": "T-20250115-1234 This is a test reply from manager",
    "From": "whatsapp:+919655716000",
    "MessageSid": "SM1234567890abcdef"
  }'
```

### Test Railway Endpoint
```bash
curl -X POST "https://aio2-production.up.railway.app/ticket/inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca" \
  -d '{
    "ticketRef": "T-20250115-1234",
    "message": "This is a test reply from manager",
    "from": "+919655716000",
    "channel": "whatsapp",
    "externalId": "SM1234567890abcdef"
  }'
```

## Railway Variables

Add these to Railway:
- `N8N_INBOUND_SECRET=20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3`
- `RAILWAY_INBOUND_SECRET=44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca`
