# PETBottle AI Ops - Futuristic Mobile App Prompt

## 🚀 Overview
Build a **futuristic, premium mobile app** (React Native or Flutter) with a sleek dashboard and integrated support ticket system. Focus on **modern UI/UX**, **glassmorphism effects**, **smooth animations**, and **real-time data** with n8n WhatsApp integration.

---

## 🎨 Design Philosophy

### Futuristic UI Elements
- **Glassmorphism**: Frosted glass cards with blur effects
- **Neon Accents**: Subtle glow effects on key metrics
- **Gradient Backgrounds**: Dark gradients with animated particles
- **Smooth Animations**: 60fps transitions, micro-interactions
- **Haptic Feedback**: Tactile responses on interactions
- **3D Depth**: Layered cards with shadows and elevation
- **Minimalist**: Clean, uncluttered interface
- **Bold Typography**: Modern sans-serif, clear hierarchy

### Color Palette

#### Dark Mode (Default)
- **Background**: `#0a0a0f` (deep space black)
- **Surface**: `#1a1a2e` (dark navy with glass effect)
- **Primary**: `#0EA5E9` (ocean blue with glow)
- **Accent**: `#00d4ff` (cyan neon)
- **Success**: `#00ff88` (green neon)
- **Warning**: `#ffb800` (amber glow)
- **Danger**: `#ff3366` (pink neon)
- **Text Primary**: `#ffffff` (pure white)
- **Text Secondary**: `#a0aec0` (cool gray)
- **Glass Overlay**: `rgba(255, 255, 255, 0.05)` with blur

#### Light Mode
- **Background**: `#f8fafc` (cool white)
- **Surface**: `#ffffff` (pure white with subtle shadow)
- **Primary**: `#0EA5E9` (ocean blue)
- **Accent**: `#00a8cc` (deep cyan)
- **Success**: `#00c853` (emerald)
- **Warning**: `#ff9800` (orange)
- **Danger**: `#e91e63` (pink)
- **Text Primary**: `#1a202c` (dark slate)
- **Text Secondary**: `#718096` (warm gray)
- **Glass Overlay**: `rgba(0, 0, 0, 0.02)` with blur

---

## 📱 App Structure (2 Main Screens)

### 1. Dashboard Screen (Home)
### 2. Support Tickets Screen

---

## 🏠 Screen 1: Dashboard

### Top Navigation Bar
- **Left**: Logo "AQ" (glowing circle, ocean-blue gradient)
- **Center**: "AQUAINTEL" (bold, modern font)
- **Right**: 
  - Theme toggle (animated moon/sun icon with glow)
  - Profile avatar (circular, with status indicator)

### Hero Section (Animated Gradient Background)
- **Animated particles** floating in background
- **Gradient overlay**: Ocean-blue to deep purple
- **Welcome message**: "Command Center" (large, bold)
- **Subtitle**: "Real-time operations monitoring"

### Key Performance Indicators (KPI Cards)

**Layout**: 2-column grid with glassmorphism cards

#### Card 1: OEE (Overall Equipment Effectiveness)
- **Value**: `86%` (large, bold, neon green glow)
- **Label**: "OEE"
- **Icon**: Activity/Chart icon (animated pulse)
- **Trend**: Up arrow +2% (green)
- **Glass effect**: Frosted background with blur
- **Border**: Subtle neon glow on hover

#### Card 2: Daily Production
- **Value**: `32,620` (formatted with commas)
- **Label**: "Bottles Today"
- **Icon**: TrendingUp icon
- **Subtext**: "+5.2% vs yesterday"
- **Visual**: Mini sparkline chart

#### Card 3: Production Rate
- **Value**: `2,330` (large)
- **Label**: "Bottles/Hour"
- **Icon**: Zap icon (animated)
- **Breakdown**: 
  - Machines: 1,350/hr (blue)
  - Robotics: 980/hr (purple)
- **Visual**: Split progress bar

#### Card 4: Defect Rate
- **Value**: `1.2%` (large, green if <2%)
- **Label**: "Defect Rate"
- **Icon**: ShieldCheck icon
- **Target**: <2% (green checkmark)
- **Visual**: Circular progress indicator

#### Card 5: Downtime
- **Value**: `45 min` (large)
- **Label**: "Downtime Today"
- **Icon**: Clock icon
- **Status**: Good (green) / Warning (yellow) / Critical (red)
- **Visual**: Countdown-style display

#### Card 6: AI Risk Score
- **Value**: `12%` (large, green glow)
- **Label**: "AI Risk Score"
- **Icon**: Sparkles icon (animated)
- **Status**: "Low Risk" (green badge)
- **Visual**: Risk gauge (circular)

#### Card 7: Energy Efficiency
- **Value**: `18.5 kWh` (large)
- **Label**: "Energy per 1K Bottles"
- **Icon**: Battery icon
- **Comparison**: 
  - Machines: 18.5 kWh
  - Robotics: 15.2 kWh (better)
- **Visual**: Comparison bars

#### Card 8: Workforce
- **Value**: `7` (large)
- **Label**: "Total Workers"
- **Breakdown**:
  - Machines: 5 workers
  - Robotics: 2 workers
- **Icon**: Users icon
- **Visual**: Avatar stack

### Production Chart Section

**Card**: Large glassmorphism card with gradient border

**Title**: "Production Timeline"
**Subtitle**: "Hourly throughput vs target"

**Chart Type**: Animated bar chart with gradient fills

**Data** (Fixed values - use exactly):
```
Hour    | Actual | Target
--------|--------|--------
08:00   | 2,330  | 2,200
09:00   | 2,330  | 2,200
10:00   | 2,330  | 2,200
11:00   | 2,330  | 2,200
12:00   | 2,330  | 2,200
13:00   | 2,330  | 2,200
14:00   | 2,330  | 2,200
15:00   | 2,330  | 2,200
```

**Visual Design**:
- Bars: Gradient fill (ocean-blue to cyan) with glow
- Target line: Dashed white line at 2,200
- Above target: Green glow
- Below target: Yellow glow
- Smooth animation on load (staggered bars)
- Interactive: Tap bar to see details

### Machines vs Robotics Comparison

**Card**: Side-by-side comparison with glass effect

**Left Side - Machines**:
- Icon: Wrench (blue glow)
- Production: `1,350/hr`
- OEE: `86%`
- Defect Rate: `3 per 100`
- Cost: `$0.095/bottle`
- Energy: `18.5 kWh/1K`
- Workers: `5`
- Visual: Progress ring (86%)

**Right Side - Robotics**:
- Icon: Bot (purple glow)
- Production: `980/hr`
- OEE: `88%`
- Defect Rate: `0 per 100` ⭐
- Cost: `$0.090/bottle` ⭐
- Energy: `15.2 kWh/1K` ⭐
- Workers: `2` ⭐
- Visual: Progress ring (88%)

**Winner Badge**: "Robotics Wins" (animated trophy icon)

### Quick Actions Section

**Horizontal scrollable cards**:

1. **View Machines** (tap → machines list)
   - Icon: Wrench
   - Count: 10 total, 8 operational
   - Status: Green indicator

2. **View Robotics** (tap → robotics list)
   - Icon: Bot
   - Count: 5 total, 4 operational
   - Status: Green indicator

3. **Active Alerts** (tap → alerts list)
   - Icon: AlertTriangle
   - Count: 5 active
   - Badge: Red dot if critical

4. **Support Tickets** (tap → tickets screen)
   - Icon: Ticket
   - Count: 3 open
   - Badge: Red dot if unread

### Recent Activity Feed

**Card**: Glassmorphism with scrollable list

**Items** (last 5 activities):
- "Machine M-003 maintenance completed" (2 min ago)
- "New ticket T-20250115-1234 created" (15 min ago)
- "Quality check passed - 1000 bottles" (1 hour ago)
- "Schedule optimized - 18% improvement" (2 hours ago)
- "Energy efficiency alert resolved" (3 hours ago)

**Design**: 
- Timeline style (vertical line)
- Icons for each activity type
- Timestamp (relative: "2 min ago")
- Tap to view details

### Floating Action Button (FAB)

**Position**: Bottom right corner
**Icon**: Plus (with glow effect)
**Action**: Create support ticket
**Animation**: Pulse effect, expands on tap

---

## 🎫 Screen 2: Support Tickets

### Header
- **Back Button**: Animated arrow
- **Title**: "Support Tickets" (bold)
- **Subtitle**: "Customer support with WhatsApp integration"
- **Search Icon**: Top right (glassmorphism button)

### Search Bar
- **Glassmorphism input** with blur
- **Placeholder**: "Search by ticket ref, customer, subject..."
- **Icon**: Search (left), Filter (right)
- **Real-time search** as user types

### Filter Chips (Horizontal Scroll)
- **All** (default, selected)
- **Open** (blue badge with count)
- **In Progress** (yellow badge)
- **Resolved** (green badge)
- **Closed** (gray badge)

### Tickets List

**Card Design**: Glassmorphism with gradient border

**Each Ticket Card Shows**:
- **Ticket Reference**: `T-20250115-1234` (large, bold, monospace)
- **Subject**: "Product Quality Issue" (medium, bold)
- **Customer**: "John Doe" (small, secondary)
- **Priority Badge**: 
  - Low: Gray
  - Medium: Blue
  - High: Orange
  - Urgent: Red (with pulse animation)
- **Status Badge**: 
  - Open: Blue glow
  - In Progress: Yellow glow
  - Resolved: Green glow
  - Closed: Gray
- **Last Message Preview**: "Thank you for reporting..." (truncated)
- **Timestamp**: "2 hours ago" (relative)
- **Unread Indicator**: Red dot (if manager replied)
- **WhatsApp Status**: "Manager replied" (green checkmark)

**Swipe Actions**:
- Swipe left: Mark as resolved
- Swipe right: Archive/Delete

**Pull to Refresh**: Smooth animation with loading indicator

### Create Ticket Button
- **FAB**: Large, floating, ocean-blue gradient
- **Icon**: Plus (white)
- **Glow Effect**: Pulsing neon
- **Position**: Bottom right

### Empty State
- **Icon**: Ticket (large, gray, with glow)
- **Message**: "No tickets yet"
- **Subtext**: "Create your first support ticket"
- **Button**: "Create Ticket" (primary)

---

## 🎫 Create Ticket Screen

### Header
- **Back Button**: Close icon
- **Title**: "New Support Ticket" (bold)
- **Subtitle**: "We'll notify the manager via WhatsApp"

### Form (Scrollable)

**Card**: Glassmorphism form container

#### Field 1: Customer Name
- **Label**: "Customer Name" (floating label)
- **Input**: Text input with glassmorphism
- **Validation**: Required, min 2 characters
- **Icon**: User icon (left)
- **Error State**: Red border + error message

#### Field 2: Customer Phone
- **Label**: "Phone Number"
- **Input**: Phone input with country picker
- **Format**: +1234567890
- **Validation**: Required, valid phone format
- **Icon**: Phone icon (left)
- **Country Code**: Dropdown with flags

#### Field 3: Customer Email
- **Label**: "Email Address"
- **Input**: Email input
- **Validation**: Required, valid email format
- **Icon**: Mail icon (left)
- **Keyboard**: Email keyboard

#### Field 4: Subject
- **Label**: "Subject"
- **Input**: Text input
- **Validation**: Required, max 200 characters
- **Icon**: FileText icon (left)
- **Character Counter**: "0/200" (bottom right)

#### Field 5: Message
- **Label**: "Message"
- **Input**: Textarea (multi-line, expandable)
- **Validation**: Required, min 10 characters, max 5000
- **Icon**: MessageSquare icon (left)
- **Character Counter**: "0/5000"
- **Placeholder**: "Describe your issue in detail..."

#### Field 6: Priority
- **Label**: "Priority"
- **Input**: Picker/Selector
- **Options**: 
  - Low (gray)
  - Medium (blue) - default
  - High (orange)
  - Urgent (red, with warning icon)
- **Visual**: Color-coded chips with icons

### Submit Button
- **Style**: Large, full-width, gradient (ocean-blue to cyan)
- **Text**: "Create Ticket & Notify Manager"
- **Icon**: Send icon (right)
- **Loading State**: Spinner + "Creating ticket..."
- **Success State**: Checkmark animation

### Info Card (Below Form)
- **Icon**: Info icon (blue)
- **Message**: "Your ticket will be sent to the manager via WhatsApp. You'll receive a notification when they reply."
- **Glassmorphism background**

---

## 💬 Ticket Details Screen

### Header
- **Back Button**: Arrow (animated)
- **Ticket Ref**: `T-20250115-1234` (large, bold, copyable)
- **Menu**: Three dots (options: Share, Copy ref, Close ticket)

### Ticket Info Card (Glassmorphism)

**Customer Information**:
- **Name**: John Doe (large, bold)
- **Phone**: +1234567890 (tap to call, with phone icon)
- **Email**: john@example.com (tap to email, with mail icon)

**Ticket Details**:
- **Subject**: "Product Quality Issue" (bold)
- **Priority**: High (orange badge with glow)
- **Status**: Open (blue badge)
- **Created**: Jan 15, 2025, 10:30 AM
- **Last Updated**: Jan 15, 2025, 11:45 AM

**WhatsApp Status**:
- **Icon**: WhatsApp icon (green)
- **Status**: "Sent to manager" ✓ (green checkmark)
- **Last Activity**: "Manager replied 2 hours ago"

### Conversation Thread (Chat UI)

**Design**: WhatsApp-style chat

**Customer Messages** (Left-aligned, blue/gray bubble):
- **Bubble**: Rounded, glassmorphism, blue gradient
- **Text**: White
- **Timestamp**: "10:30 AM" (small, gray)
- **Badge**: "Web" (small, top-right)
- **Tail**: Pointing left

**Manager Messages** (Right-aligned, green bubble):
- **Bubble**: Rounded, green gradient with glow
- **Text**: White
- **Timestamp**: "11:45 AM" (small, gray)
- **Badge**: "WhatsApp" (small, with WhatsApp icon)
- **Tail**: Pointing right
- **Read Receipt**: Double checkmark (green)

**Message Example**:
```
[Customer - 10:30 AM] [Web]
I received damaged bottles in my last order.
The bottles have cracks and are unusable.

[Manager - 11:45 AM] [WhatsApp] ✓✓
Thank you for reporting this issue. 
We'll investigate immediately and get back to you.
```

**Features**:
- **Auto-scroll**: Scrolls to bottom on new message
- **Pull to Refresh**: Refresh conversation
- **Long Press**: Copy message, report
- **Tap Media**: Full-screen view (if images/videos)

### Real-Time Updates

**Polling**: Every 5 seconds when screen is active
**Push Notification**: When manager replies
**Visual Indicator**: 
- "Manager is typing..." (if typing indicator available)
- "Last seen 2 min ago" (if available)

### Input Area (Bottom)

**Container**: Glassmorphism bar at bottom

**Components**:
- **Text Input**: Multi-line, expandable
- **Placeholder**: "Type your reply..."
- **Attach Button**: Paperclip icon (camera/gallery)
- **Send Button**: Send icon (enabled when text entered)

**Note**: Customer replies create new tickets (or follow-up tickets)

---

## 🔄 n8n Integration Flow

### Flow 1: Create Ticket → WhatsApp Notification

```
┌─────────────┐
│ Mobile App  │
│ Creates     │
│ Ticket      │
└──────┬──────┘
       │
       │ POST /api/ticket
       │
       ▼
┌─────────────┐
│   Backend   │
│  (Railway)  │
│             │
│ 1. Creates  │
│    ticket   │
│ 2. Calls    │
│    n8n      │
└──────┬──────┘
       │
       │ POST https://n8n.srv1281573.hstgr.cloud/webhook/ticket-created
       │ Headers: x-api-key: <N8N_SHARED_SECRET>
       │
       ▼
┌─────────────┐
│     n8n     │
│  Workflow   │
│             │
│ 1. Receives │
│    webhook  │
│ 2. Formats  │
│    message  │
│ 3. Sends    │
│    WhatsApp │
└──────┬──────┘
       │
       │ Twilio API
       │
       ▼
┌─────────────┐
│  WhatsApp   │
│   Manager   │
│ +919655716  │
│    000      │
└─────────────┘
```

**n8n Webhook Payload**:
```json
{
  "ticketRef": "T-20250115-1234",
  "ticketId": "uuid-here",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "subject": "Product Quality Issue",
  "message": "I received damaged bottles in my last order.",
  "priority": "high",
  "ticketUrl": "https://aio2-production.up.railway.app/ticket/T-20250115-1234",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

**WhatsApp Message Format**:
```
🎫 *NEW SUPPORT TICKET*

*Ticket:* T-20250115-1234
*Customer:* John Doe
*Phone:* +1234567890
*Email:* john@example.com
*Priority:* HIGH
*Subject:* Product Quality Issue

*Message:*
I received damaged bottles in my last order.

*View Ticket:* https://aio2-production.up.railway.app/ticket/T-20250115-1234

Reply to this message to respond to the ticket.
```

### Flow 2: Manager Reply → Ticket Updated

```
┌─────────────┐
│  WhatsApp   │
│   Manager   │
│   Replies   │
└──────┬──────┘
       │
       │ WhatsApp Message
       │
       ▼
┌─────────────┐
│   Twilio    │
│  Webhook    │
└──────┬──────┘
       │
       │ Triggers n8n
       │
       ▼
┌─────────────┐
│     n8n     │
│  Workflow   │
│             │
│ 1. Receives │
│    WhatsApp │
│ 2. Parses   │
│    message  │
│ 3. Calls    │
│    backend  │
└──────┬──────┘
       │
       │ POST /api/ticket/inbound
       │ Headers: x-api-key: <RAILWAY_INBOUND_SECRET>
       │
       ▼
┌─────────────┐
│   Backend   │
│  (Railway)  │
│             │
│ 1. Validates│
│    API key  │
│ 2. Finds    │
│    ticket   │
│ 3. Adds     │
│    message  │
└──────┬──────┘
       │
       │ Push Notification
       │
       ▼
┌─────────────┐
│ Mobile App  │
│ Receives    │
│ Update      │
└─────────────┘
```

**n8n → Backend Payload**:
```json
{
  "ticketRef": "T-20250115-1234",
  "message": "Thank you for reporting this. We'll investigate immediately.",
  "from": "+919655716000",
  "channel": "whatsapp",
  "externalId": "SM1234567890abcdef",
  "mediaUrl": null
}
```

---

## 📊 Complete Data Values (Use Exactly)

### Production Metrics
```javascript
{
  // Overall
  totalBottlesPerHour: 2330,        // Fixed
  dailyProduction: 32620,            // 2330 × 14 hours
  oee: 0.86,                         // 86% (machines)
  oeeRobotics: 0.88,                 // 88% (robotics)
  defectRate: 1.2,                   // 1.2%
  downtime: 45,                      // minutes
  aiRiskScore: 0.12,                 // 12%
  
  // Machines
  machineBottlesPerHour: 1350,       // Total (10 machines × 135)
  machineBottlesPerMachine: 135,     // Per machine
  machineOEE: 0.86,                  // 86%
  machineUtilization: 0.84,          // 84%
  machineDefectRate: 3,              // 3 per 100 bottles
  machineCostPerBottle: 0.095,       // $0.095
  machineEnergyPer1000: 18.5,        // 18.5 kWh
  machineWorkers: 5,                 // 5 workers
  machineLaborCostPerHour: 125,      // $125/hr (5 × $25)
  totalMachines: 10,
  operationalMachines: 8,
  
  // Robotics
  robotBottlesPerHour: 980,          // Total (5 robots)
  robotOEE: 0.88,                    // 88%
  robotUtilization: 0.81,            // 81%
  robotDefectRate: 0,                // 0 per 100 bottles
  robotCostPerBottle: 0.090,         // $0.090
  robotEnergyPer1000: 15.2,          // 15.2 kWh
  robotWorkers: 2,                   // 2 workers
  robotLaborCostPerHour: 50,         // $50/hr (2 × $25)
  totalRobots: 5,
  operationalRobots: 4,
  
  // Energy
  machineDailyKwh: 245,              // kWh
  robotDailyKwh: 117,                // kWh
  totalDailyKwh: 362,                // kWh
  machineDailyCost: 29.11,           // $29.11
  robotDailyCost: 13.80,             // $13.80
  totalDailyCost: 42.91,             // $42.91
  energySavings: 15.31,               // $15.31
  energySavingsPercent: 52.6,         // 52.6%
  
  // Labor
  totalWorkers: 7,                   // 5 + 2
  totalLaborCostPerHour: 175,        // $175/hr
  dailyLaborCost: 2450,              // $2,450 (14 hours)
  
  // Quality
  weightMin: 24.0,                   // grams
  weightMax: 26.0,                   // grams
  thicknessMin: 0.40,                // mm
  thicknessMax: 0.46,                // mm
  totalDefects: 12,                  // 1.2% of 1000
  goodBottles: 988,                  // 98.8%
  
  // Schedule
  onTimeRate: 0.92,                  // 92%
  machineUtilizationSchedule: 0.84,  // 84%
  robotUtilizationSchedule: 0.87,    // 87%
  setupChanges: 8,
  totalTime: 2880,                   // minutes (48 hours)
  riskCost: 0.15,                    // 15%
}
```

### Hourly Production Data (Fixed)
```javascript
const hourlyData = [
  { hour: '08:00', actual: 2330, target: 2200 },
  { hour: '09:00', actual: 2330, target: 2200 },
  { hour: '10:00', actual: 2330, target: 2200 },
  { hour: '11:00', actual: 2330, target: 2200 },
  { hour: '12:00', actual: 2330, target: 2200 },
  { hour: '13:00', actual: 2330, target: 2200 },
  { hour: '14:00', actual: 2330, target: 2200 },
  { hour: '15:00', actual: 2330, target: 2200 },
];
```

### Downtime Breakdown (Fixed)
```javascript
const downtimeReasons = [
  { reason: 'Maintenance', minutes: 18, percentage: 40 },
  { reason: 'Setup Change', minutes: 12, percentage: 27 },
  { reason: 'Quality Issue', minutes: 8, percentage: 18 },
  { reason: 'Material Shortage', minutes: 5, percentage: 11 },
  { reason: 'Other', minutes: 2, percentage: 4 },
];
// Total: 45 minutes
```

### Defect Breakdown (Fixed)
```javascript
const defectTypes = [
  { type: 'Thin Wall', count: 4, percentage: 35 },
  { type: 'Overweight', count: 3, percentage: 24 },
  { type: 'Surface Flaw', count: 3, percentage: 21 },
  { type: 'Neck Deformity', count: 1, percentage: 12 },
  { type: 'Other', count: 1, percentage: 8 },
];
// Total: 12 defects (1.2% of 1000)
```

---

## 🔌 API Endpoints

### Base URL
```
https://aio2-production.up.railway.app
```

### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@aquaintel.com",
  "password": "admin123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "admin@aquaintel.com",
    "role": "admin"
  }
}
```

### Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <token>

Response:
{
  "oee": 0.86,
  "dailyBottlesProduced": 32620,
  "bottlesPerHour": 2330,
  "defectRate": 1.2,
  "downtime": 45,
  "avgRiskScore": 0.12,
  "energyPer1000": 18.5,
  "totalWorkers": 7,
  "machineBottlesPerHour": 1350,
  "robotBottlesPerHour": 980,
  "machineOEE": 0.86,
  "robotOEE": 0.88,
  "machineDefectRate": 3,
  "robotDefectRate": 0,
  "machineCostPerBottle": 0.095,
  "robotCostPerBottle": 0.090,
  "machineEnergyPer1000": 18.5,
  "robotEnergyPer1000": 15.2,
  "machineWorkers": 5,
  "robotWorkers": 2,
  "totalLaborCostPerHour": 175,
  "dailyLaborCost": 2450
}
```

### Create Ticket
```http
POST /api/ticket
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "subject": "Product Quality Issue",
  "message": "I received damaged bottles in my last order.",
  "priority": "high"
}

Response:
{
  "ok": true,
  "ticketRef": "T-20250115-1234",
  "ticketId": "uuid-here"
}

Error (400):
{
  "ok": false,
  "error": "Validation failed",
  "details": {
    "customerName": "Required",
    "customerPhone": "Invalid format"
  }
}
```

### Get Ticket
```http
GET /api/ticket/:ticketRef
Authorization: Bearer <token>

Response:
{
  "ok": true,
  "ticket": {
    "id": "uuid",
    "ticketRef": "T-20250115-1234",
    "subject": "Product Quality Issue",
    "status": "open",
    "customerName": "John Doe",
    "customerPhone": "+1234567890",
    "customerEmail": "john@example.com",
    "priority": "high",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T11:45:00Z"
  },
  "messages": [
    {
      "id": "msg-uuid-1",
      "sender": "customer",
      "channel": "web",
      "body": "I received damaged bottles in my last order.",
      "mediaUrl": null,
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": "msg-uuid-2",
      "sender": "manager",
      "channel": "whatsapp",
      "body": "Thank you for reporting this. We'll investigate immediately.",
      "mediaUrl": null,
      "createdAt": "2025-01-15T11:45:00Z"
    }
  ]
}
```

### List Tickets (Optional)
```http
GET /api/tickets?status=open&priority=high
Authorization: Bearer <token>

Response:
{
  "ok": true,
  "tickets": [
    {
      "id": "uuid",
      "ticketRef": "T-20250115-1234",
      "subject": "Product Quality Issue",
      "status": "open",
      "priority": "high",
      "customerName": "John Doe",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T11:45:00Z",
      "unreadCount": 1,
      "lastMessage": "Thank you for reporting this..."
    }
  ]
}
```

---

## 🎨 UI Components Specifications

### Glassmorphism Card
```css
background: rgba(255, 255, 255, 0.05);  /* Dark mode */
background: rgba(0, 0, 0, 0.02);         /* Light mode */
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### Neon Glow Effect
```css
box-shadow: 
  0 0 10px rgba(14, 165, 233, 0.5),
  0 0 20px rgba(14, 165, 233, 0.3),
  0 0 30px rgba(14, 165, 233, 0.1);
```

### Gradient Button
```css
background: linear-gradient(135deg, #0EA5E9 0%, #00d4ff 100%);
box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
```

### Animated Background
- Floating particles (slow drift)
- Gradient overlay (subtle animation)
- Parallax effect on scroll

---

## 📱 Mobile App Features

### Push Notifications
- **Registration**: On app launch
- **Trigger**: Manager replies to ticket
- **Payload**:
  ```json
  {
    "title": "New Reply on Ticket",
    "body": "Manager replied to ticket T-20250115-1234",
    "data": {
      "type": "ticket_reply",
      "ticketRef": "T-20250115-1234"
    }
  }
  ```
- **Action**: Deep link to ticket details

### Offline Support
- **Cache**: Dashboard data, ticket list, ticket details
- **Queue**: Ticket creation if offline
- **Sync**: Automatic when online
- **Indicator**: "Offline" banner at top

### Real-Time Updates
- **Polling**: Every 5 seconds (dashboard, ticket details)
- **WebSocket**: If available (preferred)
- **Push**: Instant notifications

### Haptic Feedback
- **Light**: Button taps, card selections
- **Medium**: Swipe actions, form submissions
- **Heavy**: Errors, important confirmations

### Animations
- **Page Transitions**: 0.3s fade + slide
- **Card Entrance**: Staggered (0.1s delay each)
- **Chart Animations**: Smooth bar/line animations
- **Loading**: Skeleton screens (not spinners)
- **Micro-interactions**: Button press, card hover

---

## 🛠️ Tech Stack Recommendations

### React Native (Recommended)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State**: Zustand or Redux Toolkit
- **UI**: React Native Paper (Material Design 3) or NativeBase
- **Charts**: react-native-chart-kit or victory-native
- **Animations**: react-native-reanimated
- **Blur**: @react-native-community/blur
- **Push**: expo-notifications
- **Storage**: @react-native-async-storage/async-storage

### Flutter (Alternative)
- **Framework**: Flutter
- **State**: Provider or Riverpod
- **UI**: Material Design 3 or Flutter Glassmorphism
- **Charts**: fl_chart
- **Animations**: Built-in Flutter animations
- **Blur**: BackdropFilter widget
- **Push**: firebase_messaging
- **Storage**: shared_preferences

---

## ✅ Success Criteria

- ✅ Futuristic, premium UI with glassmorphism
- ✅ Dark mode and light mode (smooth transitions)
- ✅ All metrics display exact values (no variations)
- ✅ Smooth 60fps animations
- ✅ Support ticket system with n8n integration
- ✅ Real-time updates (polling/push)
- ✅ Push notifications work
- ✅ Offline mode works
- ✅ Native mobile feel (not web-like)
- ✅ Haptic feedback on interactions
- ✅ Clean, minimal design
- ✅ Fast load times (< 3 seconds)

---

## 🎯 Key Implementation Notes

1. **Use exact values** - No random variations, use fixed data
2. **Glassmorphism everywhere** - Cards, inputs, modals
3. **Smooth animations** - 60fps, no jank
4. **Neon accents** - Subtle glows on important elements
5. **Mobile-first** - Touch-friendly, thumb-zone navigation
6. **Real-time** - Polling + push notifications
7. **Offline-first** - Cache everything, sync when online
8. **Premium feel** - High-quality assets, smooth interactions

---

**END OF PROMPT**

Build a futuristic, premium mobile app that feels native, looks stunning, and works flawlessly. Focus on quality over quantity - make these 2 screens perfect.
