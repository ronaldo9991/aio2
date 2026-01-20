# Railway Variables Setup - Quick Guide

## Step-by-Step Instructions

### Step 1: Go to Railway Dashboard
1. Open https://railway.app
2. Login to your account
3. Click on your project: **aio2-production**

### Step 2: Open Variables Tab
1. In your project, click on the **"Variables"** tab (left sidebar)
2. You'll see a list of existing variables (if any)

### Step 3: Add Each Variable

Click **"+ New Variable"** button and add these **ONE BY ONE**:

---

#### Variable 1: BASE_URL
```
Name:  BASE_URL
Value: https://aio2-production.up.railway.app
```
Click **"Add"**

---

#### Variable 2: N8N_TICKET_CREATED_WEBHOOK
```
Name:  N8N_TICKET_CREATED_WEBHOOK
Value: https://n8n.srv1281573.hstgr.cloud/webhook/ticket-created
```
Click **"Add"**

---

#### Variable 3: N8N_SHARED_SECRET
```
Name:  N8N_SHARED_SECRET
Value: 7a39575f962572e6d7ff9bba435011fdd3943d40b230bcc284ad10c26e128fa6
```
Click **"Add"**

---

#### Variable 4: RAILWAY_INBOUND_SECRET

**First, generate a secret:**
- Open terminal/command prompt
- Run: `openssl rand -hex 32`
- Copy the output (it will be a long random string)

**Then add to Railway:**
```
Name:  RAILWAY_INBOUND_SECRET
Value: <paste the generated secret here>
```
Click **"Add"**

---

### Step 4: Verify All Variables

You should see these 4 variables in your list:
- ✅ BASE_URL
- ✅ N8N_TICKET_CREATED_WEBHOOK
- ✅ N8N_SHARED_SECRET
- ✅ RAILWAY_INBOUND_SECRET

### Step 5: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
   - OR just push a new commit to trigger auto-deploy

---

## Quick Copy-Paste Values

Copy these exact values:

```
BASE_URL=https://aio2-production.up.railway.app

N8N_TICKET_CREATED_WEBHOOK=https://n8n.srv1281573.hstgr.cloud/webhook/ticket-created

N8N_SHARED_SECRET=7a39575f962572e6d7ff9bba435011fdd3943d40b230bcc284ad10c26e128fa6

RAILWAY_INBOUND_SECRET=<generate using: openssl rand -hex 32>
```

---

## Troubleshooting

**Can't find Variables tab?**
- Make sure you're in the project view, not the dashboard
- Variables tab is in the left sidebar

**Variables not working?**
- Make sure there are no extra spaces before/after the values
- Make sure variable names are EXACT (case-sensitive)
- Redeploy after adding variables

**Need to edit a variable?**
- Click on the variable name
- Edit the value
- Save

**Need to delete a variable?**
- Click the trash icon next to the variable

---

## After Setup

Once all variables are set:
1. ✅ Create a ticket from the Tickets page
2. ✅ Check Railway logs (Deployments → View Logs)
3. ✅ Verify n8n receives the webhook
4. ✅ Check WhatsApp notification is sent

---

## Visual Guide

```
Railway Dashboard
  └── Your Project (aio2-production)
      └── Variables Tab
          └── + New Variable
              ├── Name: BASE_URL
              ├── Value: https://aio2-production.up.railway.app
              └── Add
              
              ├── Name: N8N_TICKET_CREATED_WEBHOOK
              ├── Value: https://n8n.srv1281573.hstgr.cloud/webhook/ticket-created
              └── Add
              
              ├── Name: N8N_SHARED_SECRET
              ├── Value: 7a39575f962572e6d7ff9bba435011fdd3943d40b230bcc284ad10c26e128fa6
              └── Add
              
              ├── Name: RAILWAY_INBOUND_SECRET
              ├── Value: <generated secret>
              └── Add
```

---

**That's it! Your ticket system will work with n8n once these variables are set.**
