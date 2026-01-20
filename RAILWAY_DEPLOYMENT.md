# Railway Deployment Guide

This application is configured to deploy on Railway with port 8080.

## ⚠️ CRITICAL: Environment Variables

**YOU MUST SET THESE IN YOUR RAILWAY PROJECT SETTINGS BEFORE DEPLOYMENT:**

1. **`SESSION_SECRET`** (REQUIRED) - The application will **NOT START** without this.
   - Generate a strong random string (at least 32 characters)
   - Example: `openssl rand -hex 32` or use a password generator
   - Set this in Railway: Project Settings → Variables → Add `SESSION_SECRET`

2. **`PORT`** - Railway sets this automatically (defaults to 8080), but you can override if needed

3. **`NODE_ENV`** - Set automatically by Railway to `production`

**If `SESSION_SECRET` is missing, the server will crash immediately on startup.**

## Build & Deploy

Railway will automatically:
1. Detect Node.js project
2. Run `npm install`
3. Run `npm run build` (builds both client and server)
4. Run `npm start` (starts the production server)

## Port Configuration

The server is configured to:
- Read `PORT` from environment variable
- Default to port 8080 if `PORT` is not set
- Listen on `0.0.0.0` to accept connections from Railway's proxy

## Health Check

Railway will automatically check if the service is running on the configured port.

## Troubleshooting

### Server Crashes on Startup

**Most Common Issue: Missing `SESSION_SECRET`**
- Error in logs: `SESSION_SECRET environment variable is required`
- **Solution**: Go to Railway Project Settings → Variables → Add `SESSION_SECRET` with a strong random string
- The server checks for this variable at startup and will crash if it's missing

### Other Common Issues

1. **Build Errors**: Check Railway build logs for TypeScript or dependency errors
2. **Module Not Found**: Ensure all dependencies are in `package.json` (not just devDependencies)
3. **Port Issues**: Railway automatically handles port 8080, but verify `PORT` env var if needed
4. **Health Check Fails**: The `/api/health` endpoint should return `{ status: "ok" }` - if it doesn't, check server logs

### Testing Locally Before Deployment

```bash
# Set SESSION_SECRET
export SESSION_SECRET="your-test-secret-key-here"

# Build
npm run build

# Test production build
npm start

# Test health endpoint
curl http://localhost:8080/api/health
```

### Railway Logs

Check Railway deployment logs for:
- Build errors during `npm run build`
- Runtime errors during `npm start`
- Missing environment variables
- Port binding issues
