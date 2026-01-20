# Test n8n Inbound Webhook - Complete Guide

## Quick Test Commands

### Option 1: Full Automated Test (Creates Ticket + Tests Flow)
```bash
./test-n8n-inbound.sh
```

### Option 2: Quick Test (Use Existing Ticket)
```bash
./test-n8n-inbound-simple.sh T-20260120-9168 "Your message here"
```

### Option 3: Manual curl Test
```bash
# Replace TICKET_REF with a real ticket reference
curl -v -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d '{
    "Body": "T-20260120-9168 Thank you for your message. We will help you.",
    "From": "whatsapp:+919655716000",
    "To": "whatsapp:+1234567890",
    "MessageSid": "SM_TEST_123",
    "AccountSid": "AC_TEST_123",
    "NumMedia": "0"
  }'
```

---

## What to Check in n8n

### 1. Check Webhook Received
- Go to n8n workflow
- Look at the **Webhook** node
- Check if it shows a recent execution
- Status should be **"Success"** (green)

### 2. Check Function Node (Message Parsing)
- Look at the **Function/Code** node that parses the message
- Check if it extracted `ticketRef` correctly
- Output should show: `{ ticketRef: "T-XXXXX", message: "...", ... }`

### 3. Check HTTP Request Node (Railway Call)
- Look at the **HTTP Request** node that calls Railway
- Check if it executed successfully
- Status should be **"Success"** (green)
- Response should be: `{"ok":true}`

### 4. Check for Errors
- Look for any red nodes (errors)
- Check execution logs for error messages
- Common issues:
  - Missing `ticketRef` in message body
  - Railway API key incorrect
  - Railway endpoint URL wrong
  - Network timeout

---

## Expected n8n Workflow Structure

```
1. Webhook Node (Trigger)
   ↓
2. Function Node (Parse Message)
   - Extract ticketRef from Body
   - Format message for Railway
   ↓
3. HTTP Request Node (Call Railway)
   - URL: https://aio2-production.up.railway.app/ticket/inbound
   - Method: POST
   - Headers: x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca
   - Body: { ticketRef, message, from, channel, externalId }
```

---

## Troubleshooting

### Issue: n8n webhook returns 200 but message doesn't reach Railway

**Check:**
1. Is the n8n workflow **active**? (Toggle in top-right)
2. Does the Function node extract `ticketRef` correctly?
3. Does the HTTP Request node have the correct Railway URL?
4. Is the `x-api-key` header set correctly in HTTP Request?
5. Check Railway logs for incoming requests

### Issue: n8n webhook returns 404

**Check:**
1. Is the webhook URL correct?
2. Is the workflow active?
3. For test webhooks, did you click "Execute workflow" first?

### Issue: Railway returns 401 Unauthorized

**Check:**
1. Is `RAILWAY_INBOUND_SECRET` set correctly in Railway?
2. Is the `x-api-key` header in n8n HTTP Request node correct?
3. Value should be: `44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca`

### Issue: Railway returns 404 Ticket not found

**Check:**
1. Is the `ticketRef` correct?
2. Does the ticket exist? Check: `curl https://aio2-production.up.railway.app/api/ticket/TICKET_REF`

---

## Test Results Interpretation

### ✅ Success Indicators:
- n8n webhook returns HTTP 200
- n8n workflow shows all nodes as "Success" (green)
- Railway returns `{"ok":true}`
- Ticket conversation shows manager message

### ⚠️ Partial Success:
- n8n webhook returns HTTP 200
- But message doesn't appear in ticket
- **Action:** Check n8n workflow execution logs

### ❌ Failure Indicators:
- n8n webhook returns 404/500
- n8n workflow shows red nodes (errors)
- Railway returns error

---

## Verify Message in Ticket

After sending to n8n, check if message was added:

```bash
# Replace TICKET_REF with your ticket reference
curl -X GET "https://aio2-production.up.railway.app/api/ticket/TICKET_REF" \
  -H "Content-Type: application/json" | jq '.messages'
```

You should see:
- Customer message (sender: "customer", channel: "web")
- Manager message (sender: "manager", channel: "whatsapp")

---

## n8n Workflow Configuration Checklist

- [ ] Webhook node configured with path: `/webhook-test/twilio/whatsapp-inbound`
- [ ] Webhook node has Header Auth: `x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3`
- [ ] Function node extracts `ticketRef` from `Body` field
- [ ] Function node formats message for Railway
- [ ] HTTP Request node calls: `https://aio2-production.up.railway.app/ticket/inbound`
- [ ] HTTP Request node uses POST method
- [ ] HTTP Request node has header: `x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca`
- [ ] HTTP Request node body includes: `ticketRef`, `message`, `from`, `channel`, `externalId`
- [ ] Workflow is **ACTIVE** (toggle in top-right)

---

## Quick Test Script

Save this as `quick-test.sh`:

```bash
#!/bin/bash
TICKET_REF="T-20260120-9168"  # Replace with your ticket
MESSAGE="Thank you for your message"

curl -v -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d "{
    \"Body\": \"$TICKET_REF $MESSAGE\",
    \"From\": \"whatsapp:+919655716000\",
    \"MessageSid\": \"SM_$(date +%s)\"
  }"
```

Run: `chmod +x quick-test.sh && ./quick-test.sh`
