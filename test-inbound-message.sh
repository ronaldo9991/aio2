#!/bin/bash

# Test Inbound Message Flow
# Simulates manager sending WhatsApp message to ticket

echo "=========================================="
echo "Testing WhatsApp Inbound Message Flow"
echo "=========================================="
echo ""

# Step 1: Create a ticket first
echo "Step 1: Creating a test ticket..."
TICKET_RESPONSE=$(curl -s -X POST "https://aio2-production.up.railway.app/api/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+1234567890",
    "customerEmail": "customer@example.com",
    "subject": "Test Ticket for Manager Reply",
    "message": "Hello, I need help with my order.",
    "priority": "medium"
  }')

TICKET_REF=$(echo $TICKET_RESPONSE | grep -o '"ticketRef":"[^"]*' | cut -d'"' -f4)

if [ -z "$TICKET_REF" ]; then
  echo "❌ Failed to create ticket"
  echo $TICKET_RESPONSE
  exit 1
fi

echo "✅ Ticket created: $TICKET_REF"
echo ""

# Step 2: Simulate manager reply via n8n webhook (Twilio → n8n)
echo "Step 2: Simulating manager WhatsApp reply via n8n webhook..."
echo "Manager message: 'Thank you for contacting us. We will investigate your issue.'"
echo ""

N8N_RESPONSE=$(curl -s -i -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d "{
    \"Body\": \"$TICKET_REF Thank you for contacting us. We will investigate your issue and get back to you soon.\",
    \"From\": \"whatsapp:+919655716000\",
    \"MessageSid\": \"SM_$(date +%s)\"
  }")

echo "n8n Webhook Response:"
echo "$N8N_RESPONSE"
echo ""

# Step 3: Wait a moment for n8n to process
echo "Step 3: Waiting for n8n to process and forward to Railway..."
sleep 3
echo ""

# Step 4: Check ticket conversation
echo "Step 4: Checking ticket conversation..."
TICKET_DATA=$(curl -s -X GET "https://aio2-production.up.railway.app/api/ticket/$TICKET_REF" \
  -H "Content-Type: application/json")

echo "Ticket Conversation:"
echo "$TICKET_DATA" | jq '.'
echo ""

echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo "Ticket Reference: $TICKET_REF"
echo "View ticket: https://aio2-production.up.railway.app/ticket/$TICKET_REF"
echo ""
