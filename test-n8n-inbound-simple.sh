#!/bin/bash

# Quick Test: Send message to n8n inbound webhook
# Use this to quickly test if n8n is receiving messages

echo "=========================================="
echo "Quick n8n Inbound Webhook Test"
echo "=========================================="
echo ""

# Get ticketRef from user or use a test one
if [ -z "$1" ]; then
  echo "Usage: $0 <TICKET_REF> [MESSAGE]"
  echo ""
  echo "Example:"
  echo "  $0 T-20260120-1234 \"Thank you for your message\""
  echo ""
  echo "Or create a ticket first, then use its ticketRef"
  exit 1
fi

TICKET_REF=$1
MANAGER_MESSAGE=${2:-"Thank you for contacting us. We will investigate your issue."}

# Format: ticketRef + message
FULL_MESSAGE="$TICKET_REF $MANAGER_MESSAGE"

echo "Ticket Reference: $TICKET_REF"
echo "Manager Message: $MANAGER_MESSAGE"
echo ""
echo "Sending to n8n webhook..."
echo ""

# Send to n8n
curl -v -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d "{
    \"Body\": \"$FULL_MESSAGE\",
    \"From\": \"whatsapp:+919655716000\",
    \"To\": \"whatsapp:+1234567890\",
    \"MessageSid\": \"SM_$(date +%s)\",
    \"AccountSid\": \"AC_TEST_123\",
    \"NumMedia\": \"0\"
  }"

echo ""
echo ""
echo "✅ Request sent to n8n!"
echo ""
echo "Next steps:"
echo "1. Check n8n workflow execution logs"
echo "2. Verify n8n forwarded to Railway"
echo "3. Check ticket conversation: https://aio2-production.up.railway.app/api/ticket/$TICKET_REF"
echo ""
