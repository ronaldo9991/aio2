# Railway Update: Add Inbound Webhook Variable

## Quick Update Instructions

### Add This Variable to Railway:

1. Go to Railway Dashboard → Your Project → **Variables** tab
2. Click **"+ New Variable"**
3. Add:

```
Name:  N8N_INBOUND_WEBHOOK
Value: https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound
```

4. Click **"Add"**
5. **Redeploy** your service (Railway will auto-redeploy, or click "Redeploy" button)

---

## Complete List of Required Variables

Make sure you have ALL these variables in Railway:

1. ✅ `BASE_URL` = `https://aio2-production.up.railway.app`
2. ✅ `N8N_TICKET_CREATED_WEBHOOK` = `https://n8n.srv1281573.hstgr.cloud/webhook-test/ticket-created`
3. ✅ `N8N_SHARED_SECRET` = `7a39575f962572e6d7ff9bba435011fdd3943d40b230bcc284ad10c26e128fa6`
4. ✅ `N8N_INBOUND_WEBHOOK` = `https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound` ⬅️ **ADD THIS NOW**
5. ✅ `N8N_INBOUND_SECRET` = `20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3`
6. ✅ `RAILWAY_INBOUND_SECRET` = `44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca`

---

## What This Does

The `N8N_INBOUND_WEBHOOK` variable stores the URL where Twilio will send WhatsApp messages from the manager. This URL is used by:
- Twilio webhook configuration (set in Twilio Console)
- n8n workflow to receive incoming WhatsApp messages

---

## After Adding Variable

1. Railway will automatically redeploy
2. Wait for deployment to complete (check Deployments tab)
3. Test the inbound flow by replying to a ticket on WhatsApp

---

## Verify It's Working

After redeploy, test with:

```bash
curl -X POST "https://n8n.srv1281573.hstgr.cloud/webhook-test/twilio/whatsapp-inbound" \
  -H "Content-Type: application/json" \
  -H "x-api-key: 20e4dc3ab2cad293a5e789c2169a8608d2692b64e9645fcfbb841e3cbfc97ef3" \
  -d '{
    "Body": "T-20250115-1234 This is a test reply",
    "From": "whatsapp:+919655716000",
    "MessageSid": "SM_TEST_123"
  }'
```

If n8n workflow is set up correctly, it should process and forward to Railway.
