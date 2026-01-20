#!/bin/bash

# Test Direct Railway Inbound (Bypassing n8n)
# Simulates manager sending message directly to Railway

echo "=========================================="
echo "Testing Direct Railway Inbound Message"
echo "=========================================="
echo ""

# Step 1: Create a ticket
echo "Step 1: Creating a test ticket..."
TICKET_RESPONSE=$(curl -s -X POST "https://aio2-production.up.railway.app/api/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+1234567890",
    "customerEmail": "customer@example.com",
    "subject": "Test Ticket - Direct Manager Reply",
    "message": "Hello, I have a question about my order.",
    "priority": "high"
  }')

TICKET_REF=$(echo $TICKET_RESPONSE | grep -o '"ticketRef":"[^"]*' | cut -d'"' -f4)

if [ -z "$TICKET_REF" ]; then
  echo "❌ Failed to create ticket"
  echo $TICKET_RESPONSE
  exit 1
fi

echo "✅ Ticket created: $TICKET_REF"
echo ""

# Step 2: Send manager reply directly to Railway
echo "Step 2: Sending manager reply directly to Railway..."
MANAGER_MESSAGE="Hello! Thank you for your message. We have received your request and our team will look into it immediately. We will update you within 24 hours."

echo "Manager message: '$MANAGER_MESSAGE'"
echo ""

RAILWAY_RESPONSE=$(curl -s -i -X POST "https://aio2-production.up.railway.app/ticket/inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca" \
  -d "{
    \"ticketRef\": \"$TICKET_REF\",
    \"message\": \"$MANAGER_MESSAGE\",
    \"from\": \"+919655716000\",
    \"channel\": \"whatsapp\",
    \"externalId\": \"SM_DIRECT_$(date +%s)\"
  }")

echo "Railway Response:"
echo "$RAILWAY_RESPONSE"
echo ""

# Step 3: Verify message was added
echo "Step 3: Verifying message was added to ticket..."
sleep 1

TICKET_DATA=$(curl -s -X GET "https://aio2-production.up.railway.app/api/ticket/$TICKET_REF" \
  -H "Content-Type: application/json")

echo ""
echo "=========================================="
echo "Ticket Conversation:"
echo "=========================================="
echo "$TICKET_DATA" | jq '.messages[] | {sender: .sender, channel: .channel, body: .body, time: .createdAt}'
echo ""

echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo "✅ Ticket Reference: $TICKET_REF"
echo "✅ Manager message added successfully"
echo ""
echo "View full ticket: https://aio2-production.up.railway.app/ticket/$TICKET_REF"
echo ""
