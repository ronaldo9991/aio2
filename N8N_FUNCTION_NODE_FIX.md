# n8n Function Node Fix - Invalid Output Format Error

## Problem
Error: "Invalid output format [item 0] An output item contains the reserved key error."

## Solution
Wrap the output in a `json` key. n8n has reserved keys like `error`, so you must wrap your output.

## Fixed Function Node Code

Replace your Function/Code node with this:

```javascript
// Twilio sends WhatsApp messages in this format
const twilioData = $input.item.json;

// Extract ticketRef from message body (e.g., "T-20250115-1234")
const messageBody = twilioData.Body || twilioData.message || '';
const ticketRefMatch = messageBody.match(/T-\d{8}-\d{4}/);

// Alternative: Extract from first line if format is "T-XXXXX\nMessage"
const lines = messageBody.split('\n');
const firstLineTicketRef = lines[0].match(/T-\d{8}-\d{4}/);

const ticketRef = ticketRefMatch ? ticketRefMatch[0] : (firstLineTicketRef ? firstLineTicketRef[0] : null);

// Extract the actual reply message (remove ticketRef if present)
let replyMessage = messageBody;
if (ticketRef) {
  replyMessage = messageBody.replace(ticketRef, '').trim();
  // Remove leading/trailing whitespace and newlines
  replyMessage = replyMessage.replace(/^\s+|\s+$/g, '');
}

// If no ticketRef found, return error wrapped in json
if (!ticketRef) {
  return {
    json: {
      hasError: true,
      errorMessage: "Could not identify ticket reference. Please include ticket number (e.g., T-20250115-1234) in your reply."
    }
  };
}

// Return success data wrapped in json
return {
  json: {
    ticketRef: ticketRef,
    message: replyMessage || messageBody,
    from: twilioData.From || twilioData.from || '+919655716000',
    channel: 'whatsapp',
    externalId: twilioData.MessageSid || twilioData.messageSid || null,
    mediaUrl: twilioData.MediaUrl0 || twilioData.mediaUrl || null,
    hasError: false
  }
};
```

## Key Changes

1. **Wrapped in `json` key**: All output is now `{ json: { ... } }`
2. **Changed `error` to `hasError`**: Avoids reserved key conflict
3. **Changed `message` to `errorMessage`**: More descriptive

## Updated HTTP Request Node

After the Function node, add an **IF** node to check for errors:

### IF Node Configuration:
- Condition: `{{ $json.hasError }}` equals `false`
- Only proceed to HTTP Request if no error

### HTTP Request Node Body:
```json
{
  "ticketRef": "{{ $json.ticketRef }}",
  "message": "{{ $json.message }}",
  "from": "{{ $json.from }}",
  "channel": "{{ $json.channel }}",
  "externalId": "{{ $json.externalId }}",
  "mediaUrl": "{{ $json.mediaUrl }}"
}
```

## Alternative: Simpler Version (No Error Handling)

If you don't need error handling, use this simpler version:

```javascript
const twilioData = $input.item.json;
const messageBody = twilioData.Body || '';
const ticketRefMatch = messageBody.match(/T-\d{8}-\d{4}/);
const ticketRef = ticketRefMatch ? ticketRefMatch[0] : null;

if (!ticketRef) {
  // Return empty or skip - let HTTP Request fail
  return [];
}

let replyMessage = messageBody.replace(ticketRef, '').trim();

return {
  json: {
    ticketRef: ticketRef,
    message: replyMessage || messageBody,
    from: twilioData.From || '+919655716000',
    channel: 'whatsapp',
    externalId: twilioData.MessageSid || null,
    mediaUrl: twilioData.MediaUrl0 || null
  }
};
```

## Testing

After updating the Function node:
1. Save the workflow
2. Test with: `./test-n8n-inbound.sh`
3. Check n8n execution logs
4. Verify message appears in ticket

## Complete Workflow Structure

```
1. Webhook Node
   ↓
2. Function Node (Parse - returns { json: {...} })
   ↓
3. IF Node (Check hasError === false)
   ↓ (if true)
4. HTTP Request Node (Call Railway)
```
