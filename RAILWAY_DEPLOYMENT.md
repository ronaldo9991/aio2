# Railway Deployment Guide

This application is configured to deploy on Railway with port 8080.

## Environment Variables

Set these in your Railway project settings:

- `PORT=8080` (Railway will set this automatically, but you can override if needed)
- `SESSION_SECRET=your-secret-key-here` (Required - use a strong random string)
- `NODE_ENV=production` (Set automatically by Railway)

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

If deployment fails:
1. Check Railway logs for build errors
2. Ensure `SESSION_SECRET` is set
3. Verify `npm run build` completes successfully locally
4. Check that port 8080 is accessible (Railway handles this automatically)
