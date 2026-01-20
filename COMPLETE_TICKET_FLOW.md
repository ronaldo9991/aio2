# Complete Ticket Flow - Employee ↔ Manager Communication

## Overview

This document explains the complete flow of ticket communication between employees (website) and managers (WhatsApp).

## Flow Diagram

```
Employee (Website)                    Manager (WhatsApp)
     │                                       │
     │ 1. Creates Ticket                    │
     ├──────────────────────────────────────>│
     │                                       │
     │ 2. Ticket Created                    │
     │    ↓                                 │
     │ Railway → n8n Webhook                │
     │    ↓                                 │
     │ n8n → Twilio → WhatsApp              │
     │                                       │
     │                          📱 3. Receives Notification
     │                          📱 "New Ticket: T-XXXXX..."
     │                                       │
     │                          💬 4. Replies on WhatsApp
     │                          💬 "T-XXXXX Your reply here"
     │                                       │
     │                                       │
     │ 5. WhatsApp → Twilio                 │
     │    ↓                                 │
     │ Twilio → n8n Webhook                │
     │    ↓                                 │
     │ n8n processes → Railway              │
     │    ↓                                 │
     │ Railway stores message               │
     │    ↓                                 │
     │ Website polls every 3 seconds        │
     │    ↓                                 │
     │ ✅ 6. Employee sees manager reply    │
     │                                       │
```

## Step-by-Step Flow

### Step 1: Employee Creates Ticket on Website

**Location:** Tickets page → "Create Ticket" button

**What happens:**
1. Employee fills in customer details and message
2. Clicks "Create Ticket"
3. Frontend calls: `POST /api/ticket`

**Railway endpoint:**
```javascript
POST /api/ticket
{
  customerName: "John Doe",
  customerPhone: "+1234567890",
  customerEmail: "john@example.com",
  subject: "Order Issue",
  message: "I need help with my order",
  priority: "high"
}
```

**Response:**
```json
{
  "ok": true,
  "ticketRef": "T-20260120-1234",
  "ticketId": "uuid-here"
}
```

---

### Step 2: Manager Receives WhatsApp Notification

**What happens:**
1. Railway creates ticket and stores customer message
2. Railway calls n8n webhook: `POST https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created`
3. n8n workflow processes:
   - Formats WhatsApp message
   - Sends to Twilio
   - Twilio delivers to manager's WhatsApp: `+919655716000`

**Manager receives:**
```
🎫 NEW SUPPORT TICKET

Ticket: T-20260120-1234
Customer: John Doe
Phone: +1234567890
Email: john@example.com
Priority: HIGH
Subject: Order Issue

Message:
I need help with my order

View Ticket: https://aio2-production.up.railway.app/ticket/T-20260120-1234

Reply to this message to respond to the ticket.
```

---

### Step 3: Manager Replies on WhatsApp

**What manager does:**
1. Manager opens WhatsApp
2. Sees the ticket notification
3. Replies with: `T-20260120-1234 Thank you for contacting us. We will help you.`

**Format:**
- Start with ticket reference: `T-20260120-1234`
- Follow with the reply message
- Can be on same line or separate line

---

### Step 4: n8n Processes Manager Reply

**What happens:**
1. Twilio receives WhatsApp message
2. Twilio calls n8n webhook: `POST https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound`
3. n8n workflow:
   - **Webhook Node**: Receives Twilio message
   - **Function Node**: Extracts `ticketRef` from message body
   - **IF Node**: Checks if `ticketRef` exists (should go to true branch)
   - **HTTP Request Node**: Calls Railway `/ticket/inbound`

**Railway endpoint called:**
```javascript
POST https://aio2-production.up.railway.app/ticket/inbound
Headers:
  x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca
Body:
{
  ticketRef: "T-20260120-1234",
  message: "Thank you for contacting us. We will help you.",
  from: "+919655716000",
  channel: "whatsapp",
  externalId: "SM_1234567890",
  mediaUrl: null
}
```

**Railway response:**
```json
{"ok": true}
```

---

### Step 5: Employee Sees Manager Reply on Website

**What happens:**
1. Railway stores manager message in ticket conversation
2. Website Tickets page is polling every 3 seconds
3. New message appears automatically in conversation view

**Visual indicators:**
- ✅ Manager messages: Blue background, right-aligned
- ✅ WhatsApp badge: Green "WhatsApp" label with "Live" indicator
- ✅ Auto-refresh: Spinner shows when fetching new messages

---

## Testing the Complete Flow

### Test Script
```bash
./test-complete-flow.sh
```

This script:
1. Creates a ticket (simulating employee)
2. Verifies ticket creation
3. Simulates manager WhatsApp reply via n8n
4. Verifies manager message appears in ticket

### Manual Testing

**1. Create Ticket:**
- Go to Tickets page
- Click "Create Ticket"
- Fill in details and submit
- Manager should receive WhatsApp notification

**2. Manager Replies:**
- Manager replies on WhatsApp with ticket reference
- Message format: `T-XXXXX Your reply here`

**3. Check Website:**
- Open the ticket conversation
- Manager reply should appear within 3-5 seconds
- Shows "WhatsApp" badge and "Live" indicator

---

## Troubleshooting

### Issue: Manager doesn't receive WhatsApp notification

**Check:**
1. n8n workflow for ticket creation is active
2. n8n workflow has correct Twilio configuration
3. Manager phone number is correct: `+919655716000`
4. Railway `N8N_TICKET_CREATED_WEBHOOK` is set correctly

### Issue: Manager reply doesn't appear on website

**Check:**
1. n8n workflow for inbound messages is active
2. IF node goes to true branch (check condition)
3. HTTP Request node calls Railway correctly
4. Railway `/ticket/inbound` endpoint is working
5. Website is polling (check browser console)

### Issue: Messages appear slowly

**Solution:**
- Current polling: Every 3 seconds
- This is normal for polling-based updates
- Messages appear within 3-5 seconds typically

---

## API Endpoints

### Create Ticket
```
POST /api/ticket
Public endpoint (no auth required)
```

### Get Ticket with Messages
```
GET /api/ticket/:ticketRef
Returns ticket and all messages
```

### Receive Manager Reply
```
POST /ticket/inbound
Protected by x-api-key header
Called by n8n when manager replies
```

---

## n8n Workflows

### Workflow 1: Ticket Created → WhatsApp Notification
- **Webhook**: `/webhook-test/ticket-created`
- **Function**: Format WhatsApp message
- **Twilio**: Send to manager

### Workflow 2: WhatsApp Reply → Store in Ticket
- **Webhook**: `/webhook-test/twilio/whatsapp-inbound`
- **Function**: Extract ticketRef from message
- **IF**: Check if ticketRef exists
- **HTTP Request**: Call Railway `/ticket/inbound`

---

## Environment Variables (Railway)

Required variables:
- `BASE_URL`: https://aio2-production.up.railway.app
- `N8N_TICKET_CREATED_WEBHOOK`: https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created
- `N8N_SHARED_SECRET`: 7a39575f962572e6d7ff9bba435011fdd3943d40b230bcc284ad10c26e128fa6
- `N8N_INBOUND_WEBHOOK`: https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound
- `N8N_INBOUND_SECRET`: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3
- `RAILWAY_INBOUND_SECRET`: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca

---

## Summary

✅ **Employee creates ticket** → Railway creates ticket → n8n sends WhatsApp to manager
✅ **Manager replies on WhatsApp** → Twilio → n8n → Railway stores message
✅ **Employee sees reply** → Website polls every 3 seconds → Message appears automatically

The complete flow is implemented and working. Ensure n8n workflows are active for the flow to work end-to-end.
