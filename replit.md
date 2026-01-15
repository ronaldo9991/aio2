# AQUAINTEL - PETBottle AI Ops Platform

## Overview

AQUAINTEL is a comprehensive AI-powered operations platform for PET bottle manufacturing. It features risk-aware scheduling, predictive maintenance, quality control, and human-in-the-loop approvals with complete audit trails.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **State Management**: Zustand (persisted to localStorage)
- **Data Fetching**: TanStack Query v5
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion + GSAP
- **Routing**: Wouter
- **Authentication**: JWT-based with bcrypt password hashing

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui base components
│   │   ├── AppSidebar.tsx  # Main navigation sidebar
│   │   ├── AppLayout.tsx   # Protected app shell
│   │   ├── DataTable.tsx   # Sortable data table
│   │   ├── KPIChip.tsx     # Metric display chip
│   │   ├── RiskBadge.tsx   # Risk level badge
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Landing.tsx     # Public landing page
│   │   ├── Login.tsx       # Authentication page
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Schedule.tsx    # Production scheduling
│   │   ├── MachineHealth.tsx
│   │   ├── QualityControl.tsx
│   │   ├── Alerts.tsx
│   │   ├── Tickets.tsx
│   │   ├── Approvals.tsx
│   │   ├── UploadCenter.tsx
│   │   ├── Fairness.tsx
│   │   ├── Evaluation.tsx
│   │   ├── AdminRules.tsx  # Admin only
│   │   └── WhatsApp.tsx    # Admin only
│   ├── lib/
│   │   ├── authStore.ts    # Zustand auth store
│   │   ├── api.ts          # API helper functions
│   │   └── queryClient.ts  # TanStack Query config
│   └── App.tsx             # Root component with routing
server/
├── routes.ts               # API endpoints
├── storage.ts              # In-memory storage with seed data
└── index.ts                # Express server setup
shared/
└── schema.ts               # Drizzle schema + Zod validation
```

## Key Features

### 13 Modules
1. **Dashboard** - Operations overview with KPIs
2. **Schedule** - Baseline vs Risk-Aware scheduling with Gantt view
3. **Machine Health** - Predictive maintenance with 72h failure predictions
4. **Quality Control** - SPC charts and defect tracking
5. **Alerts** - System notifications with acknowledgment
6. **Tickets** - Work order management
7. **Approvals** - Human-in-the-loop decisions
8. **Upload Center** - CSV data import wizard
9. **Fairness** - Bias monitoring across shifts/lines
10. **Evaluation** - Before/After schedule comparison
11. **Admin Rules** - Scheduler weight configuration (admin only)
12. **WhatsApp** - HITL approval integration (admin only)
13. **Landing** - Public marketing page with scroll story

### Role-Based Access
- **viewer**: Read-only access
- **operator**: Can acknowledge alerts, view data
- **supervisor**: Can approve/deny requests
- **admin**: Full access including admin modules

## Design System

- **Theme**: Dark-only with ocean-blue accent (#0EA5E9)
- **Effects**: Glass morphism, noise overlay, subtle animations
- **Components**: Premium feel with hover/active states
- See `design_guidelines.md` for complete specifications

## Running the App

The app runs on port 5000 with a single command:
```bash
npm run dev
```

## Demo Credentials

- **Email**: admin@aquaintel.com
- **Password**: admin123

## API Endpoints

All API routes are prefixed with `/api`:

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user (requires auth)

### Resources
- `GET /api/machines` - List all machines with health data
- `GET /api/alerts` - List all alerts
- `POST /api/alerts/:id/ack` - Acknowledge alert
- `GET /api/approvals` - List all approvals
- `POST /api/approvals/:id/approve` - Approve request
- `POST /api/approvals/:id/deny` - Deny request
- `GET /api/schedule/latest` - Get latest schedule
- `POST /api/schedule/run` - Run scheduler

## Environment Variables

- `SESSION_SECRET` - Required for JWT signing (already configured)

## Recent Changes

- Initial AQUAINTEL platform build with all 13 modules
- Dark-only theme with ocean-blue accent
- Glass morphism components and premium animations
- JWT authentication with role-based access
- Complete API backend with in-memory storage
- Added premium scroll bottle background effect on landing hero
  - PET bottle with GSAP ScrollTrigger parallax animation
  - Floats when idle, fades on scroll, respects reduced-motion
  - Component: `client/src/components/BottleBackground.tsx`
