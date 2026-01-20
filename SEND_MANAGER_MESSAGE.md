# Send Manager Message to Ticket - Quick Guide

## Method 1: Quick One-Liner (Direct to Railway)

Replace `TICKET_REF` with your actual ticket reference:

```bash
curl -X POST "https://aio2-production.up.railway.app/ticket/inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca" \
  -d '{
    "ticketRef": "TICKET_REF",
    "message": "Your manager reply message here",
    "from": "+919655716000",
    "channel": "whatsapp",
    "externalId": "SM_'$(date +%s)'"
  }'
```

### Example:
```bash
curl -X POST "https://aio2-production.up.railway.app/ticket/inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca" \
  -d '{
    "ticketRef": "T-20260120-1796",
    "message": "Hello! We have received your request and will investigate.",
    "from": "+919655716000",
    "channel": "whatsapp",
    "externalId": "SM_TEST_123"
  }'
```

---

## Method 2: Use Test Script (Creates Ticket + Sends Reply)

### Option A: Direct Railway (Bypasses n8n)
```bash
./test-direct-railway.sh
```

### Option B: Full Flow (Through n8n)
```bash
./test-inbound-message.sh
```

---

## Method 3: Interactive Script

Run this to create a ticket and send a manager reply:

```bash
# Create ticket
TICKET=$(curl -s -X POST "https://aio2-production.up.railway.app/api/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+1234567890",
    "customerEmail": "test@example.com",
    "subject": "Test Ticket",
    "message": "Customer message here",
    "priority": "medium"
  }')

# Extract ticketRef
TICKET_REF=$(echo $TICKET | grep -o '"ticketRef":"[^"]*' | cut -d'"' -f4)
echo "Ticket created: $TICKET_REF"

# Send manager reply
curl -X POST "https://aio2-production.up.railway.app/ticket/inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca" \
  -d "{
    \"ticketRef\": \"$TICKET_REF\",
    \"message\": \"Manager reply message here\",
    \"from\": \"+919655716000\",
    \"channel\": \"whatsapp\",
    \"externalId\": \"SM_$(date +%s)\"
  }"

echo "✅ Message sent!"
```

---

## Verify Message Was Added

Check the ticket conversation:

```bash
curl -X GET "https://aio2-production.up.railway.app/api/ticket/TICKET_REF" \
  -H "Content-Type: application/json" | jq '.messages'
```

---

## Quick Reference

- **Railway Endpoint**: `https://aio2-production.up.railway.app/ticket/inbound`
- **API Key**: `44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca`
- **Manager Phone**: `+919655716000`
- **Channel**: `whatsapp`

---

## What Happens

1. Manager sends message via WhatsApp
2. Twilio receives message
3. Twilio → n8n webhook
4. n8n processes and forwards to Railway
5. Railway adds message to ticket conversation
6. Message appears in ticket thread on website
