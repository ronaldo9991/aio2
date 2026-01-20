# Railway Environment Variables Setup

## Required Variables for Ticket System

Set these in Railway → Your Project → Variables tab:

### 1. Base URL
```
BASE_URL=https://aio2-production.up.railway.app
```

### 2. n8n Webhook Configuration
```
N8N_TICKET_CREATED_WEBHOOK=https://n8n.srv1281573.hstgr.cloud/webhook/ticket-created
N8N_SHARED_SECRET=7a39575f962572e6d7ff9bba435011fdd3943d40b230bcc284ad10c26e128fa6
```

### 3. Railway Inbound API Key
```
RAILWAY_INBOUND_SECRET=<generate-a-secure-random-string>
```

**Note:** Generate `RAILWAY_INBOUND_SECRET` using:
```bash
openssl rand -hex 32
```

## How to Set Variables in Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Select your project: **aio2-production**
3. Click on **Variables** tab
4. Click **+ New Variable** for each variable
5. Enter the **Variable Name** and **Value**
6. Click **Add**

## Verification

After setting variables, redeploy your service:
1. Go to **Deployments** tab
2. Click **Redeploy** or push a new commit

## Security Notes

- ✅ `N8N_SHARED_SECRET` is set: `7a39575f962572e6d7ff9bba435011fdd3943d40b230bcc284ad10c26e128fa6`
- ⚠️ Make sure `RAILWAY_INBOUND_SECRET` matches what you set in n8n workflow
- ⚠️ Never commit secrets to git
- ⚠️ Keep secrets secure and rotate periodically

## Testing

After setting variables, test ticket creation:
1. Create a ticket from the Tickets page
2. Check Railway logs for n8n webhook call
3. Verify n8n receives the webhook
4. Check WhatsApp notification is sent
