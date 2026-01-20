# Ticket System Implementation Summary

## Files Changed

### 1. `shared/schema.ts`
- **Added**: `ticketRef`, `customerName`, `customerPhone`, `customerEmail`, `subject`, `priority`, `updatedAt` fields to `tickets` table
- **Added**: New `ticketMessages` table with fields: `id`, `ticketId`, `ticketRef`, `sender`, `channel`, `body`, `externalId`, `mediaUrl`, `createdAt`
- **Added**: `insertTicketMessageSchema` and `TicketMessage` type exports

### 2. `server/services/ticketService.ts` (NEW)
- **Functions**:
  - `generateTicketRef()`: Creates human-readable ticket references (T-YYYYMMDD-XXXX)
  - `validateCreateTicketInput()`: Validates ticket creation input
  - `validateInboundMessageInput()`: Validates inbound WhatsApp message input

### 3. `server/services/n8nWebhook.ts` (NEW)
- **Functions**:
  - `notifyN8nTicketCreated()`: Sends ticket creation event to n8n webhook with retry logic (3 attempts, exponential backoff)

### 4. `server/storage.ts`
- **Added**: `ticketMessages` Map, `ticketRefIndex` Map, `externalIdIndex` Map
- **New Methods**:
  - `getTicketByRef(ticketRef)`: Get ticket by human-readable reference
  - `createCustomerTicket(ticket, initialMessage)`: Create customer ticket with first message
  - `getTicketWithMessages(ticketRef)`: Get ticket with full conversation thread
  - `addTicketMessage(message)`: Add message to ticket (with idempotency check)
  - `getMessageByExternalId(externalId)`: Check for duplicate messages

### 5. `server/routes.ts`
- **Added**: `POST /api/ticket` - Create customer support ticket (public endpoint)
- **Added**: `POST /api/ticket/inbound` - Receive WhatsApp replies from n8n (protected by x-api-key)
- **Added**: `GET /api/ticket/:ticketRef` - Get ticket with full conversation thread (public endpoint)

### 6. `TICKET_SYSTEM.md` (NEW)
- Complete documentation with:
  - Architecture overview
  - Environment variables
  - API endpoint documentation
  - n8n workflow setup instructions
  - cURL examples
  - Error handling
  - Security notes
  - Testing guide
  - Production checklist

### 7. `WHATSAPP_INTEGRATION.md` (UPDATED)
- Added reference to new ticket system documentation

## Environment Variables Required

Add these to Railway (Project Settings → Variables):

```bash
BASE_URL=https://aio2-production.up.railway.app
N8N_TICKET_CREATED_WEBHOOK=https://n8n.srv1281573.hstgr.cloud/webhook/7ca8565a-7a16-4820-b6d2-4a30460f589c
N8N_SHARED_SECRET=<generate-with-openssl-rand-hex-32>
RAILWAY_INBOUND_SECRET=<generate-with-openssl-rand-hex-32>
AGENT_PHONE=+919655716000  # Optional, defaults to this
```

## API Endpoints Summary

### POST /api/ticket
**Public endpoint** - Create customer support ticket

**Request:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "subject": "Product Quality Issue",
  "message": "I received damaged bottles.",
  "priority": "high"
}
```

**Response:**
```json
{
  "ok": true,
  "ticketRef": "T-20250115-1234",
  "ticketId": "uuid-here"
}
```

### GET /api/ticket/:ticketRef
**Public endpoint** - Get ticket with full conversation

**Response:**
```json
{
  "ok": true,
  "ticket": { ... },
  "messages": [ ... ]
}
```

### POST /api/ticket/inbound
**Protected endpoint** - Receive WhatsApp reply (requires x-api-key header)

**Headers:**
```
x-api-key: <RAILWAY_INBOUND_SECRET>
```

**Request:**
```json
{
  "ticketRef": "T-20250115-1234",
  "message": "Thank you for reporting this.",
  "from": "+919655716000",
  "channel": "whatsapp",
  "externalId": "SM1234567890abcdef"
}
```

**Response:**
```json
{
  "ok": true
}
```

## cURL Examples

### Create Ticket
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

### Get Ticket
```bash
curl https://aio2-production.up.railway.app/api/ticket/T-20250115-1234
```

### Inbound Message (from n8n)
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

## Key Features

✅ **Production-grade validation** - All inputs validated with proper error messages  
✅ **Idempotency** - Duplicate messages prevented via `externalId` (Twilio MessageSid)  
✅ **Non-blocking webhooks** - n8n notification failures don't block ticket creation  
✅ **Retry logic** - 3 attempts with exponential backoff for n8n webhook calls  
✅ **Security** - API key protection for inbound endpoint  
✅ **Human-readable ticketRef** - Format: T-YYYYMMDD-XXXX  
✅ **Full conversation thread** - All messages (web + WhatsApp) in chronological order  
✅ **Backward compatible** - Existing internal ticket system unchanged  

## Testing Checklist

- [ ] Create ticket via POST /api/ticket
- [ ] Verify ticketRef format (T-YYYYMMDD-XXXX)
- [ ] Verify n8n webhook is called (check logs)
- [ ] Get ticket via GET /api/ticket/:ticketRef
- [ ] Send inbound message via POST /api/ticket/inbound
- [ ] Verify message appears in conversation thread
- [ ] Test idempotency (send same externalId twice)
- [ ] Test invalid API key (should return 401)
- [ ] Test invalid ticketRef (should return 404)
- [ ] Test validation errors (should return 400 with error details)

## Next Steps

1. **Set environment variables in Railway**
2. **Configure n8n workflows** (see TICKET_SYSTEM.md)
3. **Test end-to-end flow**:
   - Create ticket → n8n receives webhook → WhatsApp sent to manager
   - Manager replies via WhatsApp → n8n calls inbound endpoint → message appears in ticket
4. **Monitor logs** for any webhook failures or errors
