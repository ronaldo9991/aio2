#!/bin/bash

# Test n8n Inbound Webhook Flow
# Simulates Twilio sending WhatsApp message to n8n, which then forwards to Railway

echo "=========================================="
echo "Testing n8n Inbound Webhook Flow"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Create a ticket first
echo -e "${BLUE}Step 1: Creating a test ticket...${NC}"
TICKET_RESPONSE=$(curl -s -X POST "https://aio2-production.up.railway.app/api/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+1234567890",
    "customerEmail": "customer@example.com",
    "subject": "Test Ticket for n8n Inbound",
    "message": "Hello, I need help with my order. Please respond.",
    "priority": "high"
  }')

TICKET_REF=$(echo $TICKET_RESPONSE | grep -o '"ticketRef":"[^"]*' | cut -d'"' -f4)

if [ -z "$TICKET_REF" ]; then
  echo -e "${RED}❌ Failed to create ticket${NC}"
  echo $TICKET_RESPONSE
  exit 1
fi

echo -e "${GREEN}✅ Ticket created: $TICKET_REF${NC}"
echo ""

# Step 2: Simulate manager reply via WhatsApp (Twilio format)
echo -e "${BLUE}Step 2: Simulating manager WhatsApp reply...${NC}"
echo -e "${YELLOW}Manager message format: '$TICKET_REF Thank you for contacting us. We will investigate your issue immediately.'${NC}"
echo ""

# Create the message body with ticketRef
MANAGER_MESSAGE="$TICKET_REF Thank you for contacting us. We will investigate your issue immediately and get back to you within 24 hours."

# Generate a unique MessageSid
MESSAGE_SID="SM_$(date +%s)_$(openssl rand -hex 4)"

echo -e "${BLUE}Sending to n8n webhook: https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound${NC}"
echo ""

# Step 3: Send to n8n webhook (simulating Twilio)
N8N_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d "{
    \"Body\": \"$MANAGER_MESSAGE\",
    \"From\": \"whatsapp:+919655716000\",
    \"To\": \"whatsapp:+1234567890\",
    \"MessageSid\": \"$MESSAGE_SID\",
    \"AccountSid\": \"AC_TEST_123\",
    \"NumMedia\": \"0\"
  }")

HTTP_CODE=$(echo "$N8N_RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
RESPONSE_BODY=$(echo "$N8N_RESPONSE" | sed 's/HTTP_CODE:[0-9]*$//')

echo -e "${BLUE}n8n Webhook Response:${NC}"
echo "HTTP Status: $HTTP_CODE"
echo "Response Body:"
echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo -e "${GREEN}✅ n8n webhook received the message successfully!${NC}"
else
  echo -e "${RED}❌ n8n webhook returned error status: $HTTP_CODE${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Waiting for n8n to process and forward to Railway...${NC}"
echo "Waiting 5 seconds for n8n workflow to complete..."
sleep 5
echo ""

# Step 4: Check if message was added to ticket
echo -e "${BLUE}Step 4: Checking if message was added to ticket...${NC}"
TICKET_DATA=$(curl -s -X GET "https://aio2-production.up.railway.app/api/ticket/$TICKET_REF" \
  -H "Content-Type: application/json")

MESSAGE_COUNT=$(echo "$TICKET_DATA" | jq '.messages | length' 2>/dev/null || echo "0")
MANAGER_MESSAGES=$(echo "$TICKET_DATA" | jq '[.messages[] | select(.sender == "manager")] | length' 2>/dev/null || echo "0")

echo ""
echo -e "${BLUE}Ticket Conversation Summary:${NC}"
echo "Total messages: $MESSAGE_COUNT"
echo "Manager messages: $MANAGER_MESSAGES"
echo ""

if [ "$MANAGER_MESSAGES" -gt "0" ]; then
  echo -e "${GREEN}✅ SUCCESS! Manager message was added to ticket!${NC}"
  echo ""
  echo -e "${BLUE}Full Conversation:${NC}"
  echo "$TICKET_DATA" | jq '.messages[] | {sender: .sender, channel: .channel, body: .body, time: .createdAt}' 2>/dev/null || echo "$TICKET_DATA"
else
  echo -e "${YELLOW}⚠️  Manager message not found in ticket yet.${NC}"
  echo "This could mean:"
  echo "  1. n8n workflow is still processing"
  echo "  2. n8n workflow is not active"
  echo "  3. n8n workflow has an error"
  echo ""
  echo "Check n8n execution logs to see what happened."
fi

echo ""
echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo -e "Ticket Reference: ${GREEN}$TICKET_REF${NC}"
echo "View ticket: https://aio2-production.up.railway.app/ticket/$TICKET_REF"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Check n8n workflow execution logs"
echo "2. Verify the message was forwarded to Railway"
echo "3. Check Railway logs if message didn't arrive"
echo ""
