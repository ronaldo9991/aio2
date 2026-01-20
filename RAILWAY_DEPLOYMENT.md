# Railway Deployment Guide

This application is configured to deploy on Railway with port 8080.

## Environment Variables

**Optional (but recommended for production):**

1. **`SESSION_SECRET`** (Optional) - For production security
   - If not set, a default secret will be used (not recommended for production)
   - Generate a strong random string (at least 32 characters)
   - Example: `openssl rand -hex 32` or use a password generator
   - Set this in Railway: Project Settings → Variables → Add `SESSION_SECRET`

2. **`PORT`** - Railway sets this automatically (defaults to 8080), but you can override if needed

3. **`NODE_ENV`** - Set automatically by Railway to `production`

**Note:** The application will work without `SESSION_SECRET`, but it's recommended to set it in production for security.

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

### Common Issues

1. **Build Errors**: Check Railway build logs for TypeScript or dependency errors
2. **Module Not Found**: Ensure all dependencies are in `package.json` (not just devDependencies)
3. **Port Issues**: Railway automatically handles port 8080, but verify `PORT` env var if needed
4. **Health Check Fails**: The `/api/health` endpoint should return `{ status: "ok" }` - if it doesn't, check server logs

### Testing Locally Before Deployment

```bash
# Build
npm run build

# Test production build
npm start

# Test health endpoint
curl http://localhost:8080/api/health

# Optional: Set SESSION_SECRET for production-like testing
export SESSION_SECRET="your-test-secret-key-here"
npm start
```

### Railway Logs

Check Railway deployment logs for:
- Build errors during `npm run build`
- Runtime errors during `npm start`
- Missing environment variables
- Port binding issues
