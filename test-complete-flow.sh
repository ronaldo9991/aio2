#!/bin/bash

echo "=========================================="
echo "Testing Complete Ticket Flow"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Employee creates ticket on website
echo -e "${BLUE}Step 1: Employee creates ticket on website...${NC}"
TICKET_RESPONSE=$(curl -s -X POST "https://aio2-production.up.railway.app/api/ticket" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerPhone": "+1234567890",
    "customerEmail": "customer@example.com",
    "subject": "Customer Issue - Need Help",
    "message": "Hello, I have a problem with my order. Please help me.",
    "priority": "high"
  }')

TICKET_REF=$(echo $TICKET_RESPONSE | jq -r '.ticketRef')
TICKET_ID=$(echo $TICKET_RESPONSE | jq -r '.ticketId')

if [ -z "$TICKET_REF" ] || [ "$TICKET_REF" = "null" ]; then
  echo -e "${YELLOW}❌ Failed to create ticket${NC}"
  echo $TICKET_RESPONSE
  exit 1
fi

echo -e "${GREEN}✅ Ticket created: $TICKET_REF${NC}"
echo -e "${YELLOW}📱 Manager should receive WhatsApp notification via n8n${NC}"
echo ""
echo "Waiting 3 seconds for n8n to process..."
sleep 3
echo ""

# Step 2: Verify ticket has initial customer message
echo -e "${BLUE}Step 2: Verifying ticket has customer message...${NC}"
TICKET_DATA=$(curl -s -X GET "https://aio2-production.up.railway.app/api/ticket/$TICKET_REF")
MESSAGE_COUNT=$(echo "$TICKET_DATA" | jq '.messages | length')
echo -e "${GREEN}✅ Ticket has $MESSAGE_COUNT message(s)${NC}"
echo ""

# Step 3: Simulate manager reply via WhatsApp (through n8n)
echo -e "${BLUE}Step 3: Manager replies on WhatsApp (simulated via n8n)...${NC}"
MANAGER_REPLY="Hi! Thank you for contacting us. We have received your ticket and will investigate immediately. We'll get back to you soon."

echo -e "${YELLOW}Sending manager reply to n8n webhook...${NC}"
curl -s -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d "{
    \"Body\": \"$TICKET_REF $MANAGER_REPLY\",
    \"From\": \"whatsapp:+919655716000\",
    \"To\": \"whatsapp:+1234567890\",
    \"MessageSid\": \"SM_$(date +%s)\"
  }" > /dev/null

echo -e "${GREEN}✅ Manager reply sent to n8n${NC}"
echo "Waiting 5 seconds for n8n to process and Railway to receive..."
sleep 5
echo ""

# Step 4: Verify manager message appears in ticket
echo -e "${BLUE}Step 4: Verifying manager reply appears in ticket...${NC}"
TICKET_DATA=$(curl -s -X GET "https://aio2-production.up.railway.app/api/ticket/$TICKET_REF")
TOTAL_MESSAGES=$(echo "$TICKET_DATA" | jq '.messages | length')
MANAGER_MESSAGES=$(echo "$TICKET_DATA" | jq '[.messages[] | select(.sender == "manager" and .channel == "whatsapp")] | length')

echo ""
echo "Ticket Summary:"
echo "- Total messages: $TOTAL_MESSAGES"
echo "- Manager WhatsApp messages: $MANAGER_MESSAGES"
echo ""

if [ "$MANAGER_MESSAGES" -gt "0" ]; then
  echo -e "${GREEN}✅ SUCCESS! Manager WhatsApp reply appears in ticket!${NC}"
  echo ""
  echo "All Messages:"
  echo "$TICKET_DATA" | jq '.messages[] | {sender: .sender, channel: .channel, body: .body, time: .createdAt}'
else
  echo -e "${YELLOW}⚠️  Manager message not found yet${NC}"
  echo "This could mean:"
  echo "  1. n8n workflow is still processing"
  echo "  2. n8n workflow has an error"
  echo "  3. Railway endpoint is not receiving the message"
fi

echo ""
echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo -e "Ticket Reference: ${GREEN}$TICKET_REF${NC}"
echo "View on website: https://aio2-production.up.railway.app/ticket/$TICKET_REF"
echo ""
echo -e "${YELLOW}Complete Flow:${NC}"
echo "1. ✅ Employee created ticket on website"
echo "2. ✅ Manager receives WhatsApp notification (via n8n)"
echo "3. ✅ Manager replies on WhatsApp"
echo "4. ✅ n8n processes and forwards to Railway"
echo "5. $([ "$MANAGER_MESSAGES" -gt "0" ] && echo "✅" || echo "⏳") Employee sees manager reply on website"
echo ""
