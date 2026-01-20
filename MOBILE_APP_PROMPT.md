# PETBottle AI Ops - Mobile App Development Prompt

## Overview
Build a native mobile application (React Native or Flutter) that replicates the PETBottle AI Ops web dashboard with **identical functionality, values, and visual output** from top to bottom. The app should provide the same user experience as the web version, optimized for mobile devices.

### Key Features
- **19 Complete Pages** - All dashboard pages with identical functionality
- **Support Ticket System** - Full customer support with n8n WhatsApp integration
- **Real-Time Updates** - Live data refresh and push notifications
- **Offline Support** - Cached data and offline-first architecture
- **Biometric Authentication** - Face ID / Touch ID / Fingerprint support
- **Deep Linking** - Direct navigation to specific pages/tickets

## Application Identity
- **Name**: AQUAINTEL - PETBottle AI Ops
- **Tagline**: Intelligent Manufacturing Dashboard for Plastic Bottle Production
- **Brand Colors**: Ocean-blue accent (#0EA5E9), Dark theme with glass morphism effects
- **Logo**: "AQ" monogram in rounded square with ocean-blue background

## Authentication & User Roles

### Login Credentials
- **Admin**: admin@aquaintel.com / admin123
- **Operator**: operator@aquaintel.com / operator123
- **Supervisor**: supervisor@aquaintel.com / supervisor123

### Role-Based Access
- **viewer**: Read-only access
- **operator**: Can acknowledge alerts, view data
- **supervisor**: Can approve/deny requests
- **admin**: Full access including admin modules

## Core Values & Metrics (FIXED - Use These Exact Values)

### Production Metrics
- **Total Bottles/Hour**: 2,330 (Fixed)
  - Machines: 1,350/hr total (10 machines × 135 bottles/machine)
  - Robotics: 980/hr total (5 robots)
- **Daily Production**: 32,620 bottles/day (2,330 × 14 hours)
- **OEE (Overall Equipment Effectiveness)**: 86% (machines), 88% (robotics)
- **Machine Utilization**: 84%
- **Defect Rate**: 1.2%
- **Downtime**: 45 minutes/day
- **Energy per 1000 Bottles**: 18.5 kWh (machines), 15.2 kWh (robotics)
- **Cost per Bottle**: $0.095 (machines), $0.090 (robotics)
- **AI Risk Score**: 12% (average failure risk)

### Labor Metrics
- **Workers for Machines**: 5 workers (1 per 2 machines)
- **Workers for Robotics**: 2 workers (1 per 3 robots)
- **Total Workers**: 7 workers
- **Labor Cost/Hour**: $175 ($25 per worker)
- **Daily Labor Cost**: $2,450 (14-hour shift)

### Energy Metrics
- **Machines Daily kWh**: 245 kWh
- **Robotics Daily kWh**: 117 kWh
- **Total Daily kWh**: 362 kWh
- **Machines Daily Cost**: $29.11
- **Robotics Daily Cost**: $13.80
- **Total Daily Cost**: $42.91
- **Energy Savings with Robotics**: 52.6% ($15.31/day)

### Quality Metrics
- **Machine Defects**: 3 per 100 bottles
- **Robotics Defects**: 0 per 100 bottles
- **Total Quality Rate**: 98.8%
- **Weight Range**: 24.0g - 26.0g
- **Wall Thickness Range**: 0.40mm - 0.46mm

## Page-by-Page Specifications

---

## 1. LANDING PAGE (Public)

### Header
- Logo: "AQ" monogram (ocean-blue background, white text)
- Title: "AQUAINTEL"
- Subtitle: "PETBottle AI Ops"
- Navigation: "Explore" and "Login" buttons

### Hero Section
- Full-screen hero with animated gradient background (ocean-blue theme)
- Headline: "AQUAINTEL — PETBottle AI Ops"
- Subhead: "Risk-aware scheduling + machine health + quality drift control — with approvals and audit trails."
- CTAs: "Explore Dashboard", "Login"
- Smooth scroll indicator

### Scroll Sections

#### Section 1: "What it does" Cards
Five cards with staggered reveal animation:
1. **Plan** - Production scheduling and optimization
2. **Predict** - AI-powered failure predictions
3. **Prevent** - Proactive maintenance alerts
4. **Approve** - Human-in-the-loop decisions
5. **Audit** - Complete audit trails

#### Section 2: Risk-Aware Dynamic Scheduling
- Title: "Risk-Aware Dynamic Scheduling"
- BEFORE vs AFTER timeline UI
- Crossfade between baseline and risk-aware schedules
- Show improvement metrics: +18% on-time delivery, -33% setup changes

#### Section 3: Modules Pinned Section
Left: Pinned title "Modules"
Right: Content transitions showing:
- Upload Center
- Scheduling
- Maintenance
- Quality
- Policy
- Approvals
- Fairness
- Evaluation

#### Section 4: Product Features
Cinematic product shots with crossfade:
- Failure Risk 72h prediction
- SPC drift control
- Freeze window
- HITL approvals

#### Section 5: Gallery Grid
Filterable gallery with modal detail pages:
- Scheduling
- Maintenance
- Quality
- Governance
- Admin

### Footer
- Company information
- Links to login
- Copyright notice

---

## 2. LOGIN PAGE

### Design
- Glass morphism effect (frosted glass background)
- Centered login card
- Ocean-blue accent colors

### Form Fields
- Email input (placeholder: "admin@aquaintel.com")
- Password input (show/hide toggle)
- "Remember me" checkbox
- "Login" button (primary, ocean-blue)
- Error message display area

### Features
- Form validation
- Loading state during authentication
- Error handling with user-friendly messages
- Auto-redirect to dashboard on success

---

## 3. DASHBOARD (Command Center)

### Header
- Icon: BarChart3 (ocean-blue)
- Title: "Command Center"
- Subtitle: "Real-time operations dashboard with key performance indicators"

### Info Alert
Blue info box explaining:
- OEE target: 85%+
- AI Risk Score: Lower is better
- Throughput vs Target comparison
- Defect Rate target: <2%

### KPI Grid (9 Chips)
1. **OEE**: 86% (green if ≥86%, yellow otherwise)
2. **Daily Production**: 32,620 (formatted with commas)
3. **Downtime**: 45 min (green if <30, yellow if <60, red otherwise)
4. **Defect Rate**: 1.2% (green if <2%, yellow if <5%, red otherwise)
5. **Energy / 1K Bottles**: 18.5 kWh
6. **AI Risk Score**: 12%** (green if <15%, yellow if <25%, red otherwise)
7. **Total Bottles/Hour**: 2,330 (formatted)
8. **Labor Cost/Hour**: $175 (formatted)
9. **Total Workers**: 7

### Chart 1: Throughput vs Target
- **Type**: Bar chart
- **Hours**: 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00
- **Actual**: 2,330 bottles/hour (fixed for all hours)
- **Target**: 2,200 bottles/hour (dashed blue line)
- **Colors**: Green if above target, yellow if below
- **Y-axis**: 2,097 to 2,563 range
- **Legend**: Above Target (green), Below Target (yellow), Target: 2,200

### Chart 2: AI Risk Score Timeline
- **Type**: Line chart
- **Hours**: 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00
- **Risk**: 12% (fixed for all hours)
- **Y-axis**: 0% to 20%
- **Zones**: Green (0-15%), Yellow (15-20%)
- **Summary**: Current Risk Score: 12%, Status: Low Risk

### Chart 3: Production per Hour - Machines vs Robotics
- **Type**: Stacked bar chart
- **Hours**: 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00
- **Machines**: 1,350/hr (blue bars, bottom)
- **Robotics**: 980/hr (purple bars, top)
- **Total**: 2,330/hr
- **Y-axis**: 0 to 2,500
- **Labels**: M: 1,350, R: 980, Total: 2,330 (above each bar)
- **Legend**: Machines: 1,350/hr, Robotics: 980/hr, Total: 2,330/hr

### Labor Requirements Card
- **Machines**: 5 workers (blue theme)
  - 5 workers for 10 operational machines
  - 1 worker per 2 machines
- **Robotics**: 2 workers (purple theme)
  - 2 workers for 5 robots
  - 1 worker per 3 robots
- **Total Workers**: 7 workers

### Labor Cost Card
- **Machines Labor**: $125/hr (5 workers × $25)
- **Robotics Labor**: $50/hr (2 workers × $25)
- **Total/Hour**: $175
- **Daily (14hr shift)**: $2,450

### Chart 4: Downtime Reasons
- **Type**: Horizontal progress bars
- **Total**: 45 minutes
- **Breakdown**:
  - Maintenance: 18 min (40%)
  - Setup Change: 12 min (27%)
  - Quality Issue: 8 min (18%)
  - Material Shortage: 5 min (11%)
  - Other: 2 min (4%)

### Chart 5: Defects by Type
- **Type**: Horizontal progress bars
- **Total**: 12 defects (1.2% of 1000 bottles)
- **Breakdown**:
  - Thin Wall: 4 (35%)
  - Overweight: 3 (24%)
  - Surface Flaw: 3 (21%)
  - Neck Deformity: 1 (12%)
  - Other: 1 (8%)

### AI Recommendations Card
- **Title**: "AI Recommendations"
- **Subtitle**: "Today's AI-powered suggestions"
- **Icon**: Sparkles
- Show top 3 recommendations with:
  - Title
  - Description (2 lines max)
  - Confidence percentage
- "View All Recommendations" button

### Recent Alerts Card
- **Title**: "Recent Alerts"
- **Subtitle**: "Latest system notifications"
- **Table Columns**:
  - Severity (CRITICAL/WARNING/INFO with color badges)
  - Type
  - Message
  - Entity ID
- **Sample Data**:
  - WARNING - MACHINE_HEALTH - "Elevated vibration on Machine M-003" - M-003
  - INFO - QUALITY - "SPC limit warning for wall thickness" - M-001
  - CRITICAL - SCHEDULE - "Job J-015 at risk of missing due date" - J-015

---

## 4. SCHEDULE PAGE

### Header
- **Icon**: BarChart3
- **Title**: "Production Schedule"
- **Subtitle**: "Optimize job scheduling for machines and robotics with AI-powered planning"

### Info Alert
Explanation of:
- Baseline Schedule: Simple first-come-first-served
- AI-Optimized Schedule: Considers failure risk, reduces setup changes, improves on-time delivery
- Charts show hourly job distribution and utilization

### Action Buttons
- **Generate Baseline** (outline button)
- **Generate AI-Optimized** (primary button)

### KPI Grid (6 Chips)
1. **On-Time Delivery**: 92% (green)
2. **Machine Utilization**: 84%
3. **Robotics Utilization**: 87%
4. **Setup Changes**: 8
5. **Total Time**: 48 hours
6. **Risk Cost**: 15% (green if <30%, yellow otherwise)

### Schedule Comparison Card
- **Title**: "Schedule Comparison: Baseline vs AI-Optimized"
- **Machines Utilization**:
  - Baseline: 72%
  - Optimized: 84%
  - Improvement: +17%
- **Robotics Utilization**:
  - Baseline: 68%
  - Optimized: 87%
  - Improvement: +28%
- **Visual**: Side-by-side bars (yellow for baseline, blue/purple for optimized)

### Machines Schedule Chart
- **Type**: Bar chart
- **Hours**: 08:00 to 17:00
- **Metrics per hour**:
  - Jobs scheduled (2-5 jobs)
  - Utilization (75-90%)
  - Risk score (15-35%)
- **Visual**: Stacked bars (blue for utilization, red overlay for risk)

### AI Risk Score for Robotics Chart
- **Type**: Line chart
- **Hours**: 08:00 to 17:00
- **Risk Scores** (fixed values):
  - 08:00: 18%
  - 09:00: 28%
  - 10:00: 20%
  - 11:00: 22%
  - 12:00: 22%
  - 13:00: 28%
  - 14:00: 22%
  - 15:00: 28%
  - 16:00: 22%
  - 17:00: 18%
- **Y-axis**: 0% to 30%
- **Zones**: Green (<20%), Yellow (20-30%), Red (>30%)
- **Legend**: Risk zones with colors

### Schedule Table
- **Columns**:
  - Job ID
  - Machine/Robot
  - Start Time
  - End Time
  - Status (🔒 Locked / Flexible)
- **Sortable**: All columns
- **Data**: Sample schedule items with timestamps

---

## 5. MACHINES PAGE

### Header
- **Icon**: Wrench
- **Title**: "Machines"
- **Subtitle**: "Production machines inventory and status"

### KPI Grid (4 Chips)
1. **Total Machines**: 10
2. **Operational**: 8-9 (green)
3. **In Maintenance**: 1-2 (yellow)
4. **Average Risk**: 12%

### Machines Table
- **Columns**:
  - Machine ID (M-001, M-002, etc.)
  - Name (Blow Molder A, Blow Molder B, etc.)
  - Type (blow_mold, injection, preform, packing)
  - Status (operational/warning/maintenance/offline with color badges)
  - 72h Failure Risk (risk badge: Low/Medium/High)
  - Temperature (°C)
  - Vibration (mm/s)
  - Last Maintenance (date)
- **Sortable**: All columns
- **Sample Data**:
  - M-001: Blow Molder A, operational, 12% risk, 185°C, 2.3 mm/s
  - M-002: Blow Molder B, operational, 28% risk, 192°C, 3.1 mm/s
  - M-003: Injection Molder 1, warning, 65% risk, 210°C, 5.8 mm/s
  - M-004: Blow Molder C, operational, 8% risk, 180°C, 1.9 mm/s
  - M-005: Preform Line, maintenance, 42% risk, 0°C, 0 mm/s
  - M-006: Packing Station, operational, 15% risk, 25°C, 0.8 mm/s

### Machine Details Card
- Click machine row to see:
  - Production rate: 135 bottles/hour
  - OEE: 86%
  - Utilization: 84%
  - Cost per bottle: $0.095
  - Energy per 1000: 18.5 kWh

---

## 6. ROBOTICS PAGE

### Header
- **Icon**: Bot
- **Title**: "Robotics"
- **Subtitle**: "Robotics systems inventory and performance"

### KPI Grid (4 Chips)
1. **Total Robots**: 5
2. **Operational**: 4-5 (green)
3. **Average Health**: 88%
4. **Total Errors**: 0-3

### Robotics Table
- **Columns**:
  - Robot ID (R-001, R-002, etc.)
  - Name (Palletizing Robot A, etc.)
  - Status (operational/idle/error with color badges)
  - Health Score (0-100% with progress bar)
  - 72h Failure Risk (risk badge)
  - Utilization (0-100%)
  - Pick Rate (units/hr)
  - Error Count
- **Sortable**: All columns
- **Sample Data**:
  - R-001: Palletizing Robot A, operational, 92% health, 8% risk, 87% util, 145 units/hr, 0 errors
  - R-002: Palletizing Robot B, operational, 88% health, 12% risk, 82% util, 138 units/hr, 1 error
  - R-003: Packaging Robot 1, operational, 95% health, 5% risk, 91% util, 165 units/hr, 0 errors
  - R-004: Packaging Robot 2, operational, 78% health, 22% risk, 75% util, 125 units/hr, 2 errors
  - R-005: Quality Inspection Bot, idle, 85% health, 15% risk, 68% util, 95 units/hr, 0 errors

### Robotics Details Card
- Total production: 980 bottles/hour
- OEE: 88%
- Utilization: 81%
- Cost per bottle: $0.090
- Energy per 1000: 15.2 kWh

---

## 7. MACHINE HEALTH PAGE

### Header
- **Icon**: BarChart3
- **Title**: "Machine & Robotics Health"
- **Subtitle**: "Predictive maintenance and equipment monitoring"

### Info Alert
Explanation of:
- Machines: Failure risk (0-100%), temperature, vibration
- Robotics: Health score (0-100%), failure risk, utilization, pick rate
- Status colors: Green = Good, Yellow = Warning, Red = Critical

### KPI Grid (6 Chips)
1. **Total Machines**: 10
2. **Operational Machines**: 8-9 (green)
3. **Machine Risk Score**: 12% (green if <30%, yellow otherwise)
4. **Total Robots**: 5
5. **Operational Robots**: 4-5 (green)
6. **Robot Health Score**: 88% (green if >85%, yellow if >75%, red otherwise)

### Utilization Comparison Card
- **Machines**: 82% utilization (8/10 operational)
- **Robotics**: 81% utilization (4-5/5 operational)
- **Visual**: Side-by-side progress bars (blue for machines, purple for robotics)

### Machine Failure Risk Timeline
- **Type**: Line chart
- **Hours**: 08:00 to 15:00
- **Average Risk**: 10-30% (varies slightly)
- **High-Risk Count**: 1-2 machines (risk >50%)
- **Y-axis**: 0% to 70%
- **Zones**: Green (<20%), Yellow (20-50%), Red (>50%)

### Robotics Health Score Timeline
- **Type**: Line chart
- **Hours**: 08:00 to 15:00
- **Average Health**: 75-98%
- **Operational Count**: 4-5 robots
- **Y-axis**: 75% to 100%
- **Zones**: Green (>90%), Yellow (75-90%)

### Temperature & Vibration Distribution
- **Type**: Bar chart
- **Machines**: M-001 to M-006
- **Temperature**: 0-210°C (blue bars)
- **Vibration**: 0-6 mm/s (orange overlay)
- **Risk Indicator**: Color-coded by risk level

### Machines Table
- Same as Machines page table

### Robotics Table
- Same as Robotics page table

---

## 8. MACHINES VS ROBOTICS PAGE

### Header
- **Icon**: BarChart3
- **Title**: "Machines vs Robotics Comparison"
- **Subtitle**: "Comprehensive performance analysis"

### Comparison Table
| Metric | Machines | Robotics | Winner |
|--------|----------|----------|--------|
| **Bottles/Hour** | 1,350 | 980 | Machines |
| **Cost per Bottle** | $0.095 | $0.090 | Robotics |
| **OEE** | 86% | 88% | Robotics |
| **Utilization** | 84% | 81% | Machines |
| **Defect Rate** | 3 per 100 | 0 per 100 | Robotics |
| **Labor Required** | 5 workers | 2 workers | Robotics |
| **Energy/1K Bottles** | 18.5 kWh | 15.2 kWh | Robotics |
| **Daily Energy Cost** | $29.11 | $13.80 | Robotics |

### Overall Winner Banner
- **Winner**: Robotics
- **Reasoning**: Superior in quality, cost, and energy efficiency
- **Visual**: Large card with trophy icon, green theme

### Detailed Comparison Charts
1. **Production Rate**: Bar chart (1,350 vs 980)
2. **Cost Comparison**: Bar chart ($0.095 vs $0.090)
3. **OEE Comparison**: Bar chart (86% vs 88%)
4. **Defect Rate**: Bar chart (3 vs 0 per 100)
5. **Energy Comparison**: Bar chart (18.5 vs 15.2 kWh)
6. **Labor Comparison**: Bar chart (5 vs 2 workers)

---

## 9. QUALITY CONTROL PAGE

### Header
- **Icon**: TestTube2
- **Title**: "Quality Control"
- **Subtitle**: "Monitor bottle quality and detect defects in real-time"

### Info Alert
Explanation of:
- Quality breakdown: Machines 3 defects/100, Robotics 0 defects/100
- Weight range: 24.0g - 26.0g
- Wall thickness: 0.40mm - 0.46mm
- Defect rate target: <2%

### KPI Grid (6 Chips)
1. **Good Bottles**: 988 (green)
2. **Total Defects**: 12 (yellow if >0)
3. **Defect Rate**: 1.2% (green if <2%, yellow if <5%, red otherwise)
4. **Machine Defects**: 3 (yellow if >0)
5. **Robot Defects**: 0 (green)
6. **Avg Weight**: 25.0g

### Quality Measurements Table
- **Columns**:
  - Machine/Robot (with icon: wrench for machines, bot for robotics)
  - Time
  - Weight (g) with checkmark/X icon
  - Thickness (mm) with checkmark/X icon
  - Status (Good badge or defect type badge)
- **Sortable**: All columns
- **Sample Data**:
  - M-001, 08:30, 24.8g ✓, 0.42mm ✓, Good
  - M-001, 09:00, 25.1g ✓, 0.44mm ✓, Good
  - M-002, 08:45, 24.5g ✗, 0.39mm ✗, thin_wall
  - M-002, 09:15, 25.3g ✓, 0.43mm ✓, Good
  - M-003, 08:20, 26.2g ✗, 0.48mm ✗, overweight

### Quality Charts
1. **Defect Distribution**: Pie chart (Thin Wall, Overweight, Surface Flaw, etc.)
2. **Weight Distribution**: Histogram (24.0g - 26.0g range)
3. **Thickness Distribution**: Histogram (0.40mm - 0.46mm range)
4. **Defect Rate Over Time**: Line chart (hours, defect percentage)

---

## 10. ENERGY PAGE

### Header
- **Icon**: Zap
- **Title**: "Energy & Sustainability"
- **Subtitle**: "Compare energy consumption and efficiency"

### Info Alert
Explanation: Lower energy = Lower costs = Better for environment

### Winner Banner
- **Energy Efficiency Winner**: Robotics
- **Energy Savings**: 52.6%
- **Daily Savings**: $15.31
- **Visual**: Large green card with award icon

### Side-by-Side Comparison Cards

#### Machines Card (Blue Theme)
- **kWh per 1000 Bottles**: 18.5 kWh
- **Daily kWh**: 245 kWh
- **Cost per Bottle**: $0.0022
- **Daily Cost**: $29.11
- **Efficiency**: 84%
- **Peak Load**: 280 kW

#### Robotics Card (Purple Theme)
- **kWh per 1000 Bottles**: 15.2 kWh
- **Daily kWh**: 117 kWh
- **Cost per Bottle**: $0.0018
- **Daily Cost**: $13.80
- **Efficiency**: 91%
- **Peak Load**: 195 kW

### Comparison Charts
1. **Energy Comparison**: Bar chart (kWh/1K, Daily kWh, Peak Load)
2. **Cost Comparison**: Bar chart (Cost/Bottle, Daily Cost)
3. **Efficiency Comparison**: Bar chart (84% vs 91%)
4. **Hourly Energy Consumption**: Line chart (08:00-17:00, machines vs robotics)
5. **Energy Distribution**: Pie chart (245 kWh vs 117 kWh)

### Summary Card
- **Total Daily kWh**: 362 kWh
- **Total Daily Cost**: $42.91
- **Savings with Robotics**: $15.31/day (52.6%)

---

## 11. ALERTS PAGE

### Header
- **Icon**: AlertTriangle
- **Title**: "Alerts"
- **Subtitle**: "System notifications and warnings"

### KPI Grid (3 Chips)
1. **Active Alerts**: 5
2. **Critical**: 1-2 (red)
3. **Unacknowledged**: 3-4 (yellow)

### Alerts Table
- **Columns**:
  - Severity (CRITICAL/WARNING/INFO with color badges)
  - Type (MACHINE_HEALTH, QUALITY, SCHEDULE, etc.)
  - Message
  - Entity Type (machine, robot, job, etc.)
  - Entity ID
  - Timestamp
  - Status (Acknowledged/Unacknowledged)
  - Actions (Acknowledge button)
- **Sortable**: All columns
- **Filterable**: By severity, type, status

### Alert Details Modal
- Full alert information
- Entity details link
- Acknowledge button
- History timeline

---

## 12. TICKETS PAGE (Support Ticket System with n8n Integration)

### Header
- **Icon**: Ticket
- **Title**: "Support Tickets"
- **Subtitle**: "Customer support tickets with WhatsApp integration via n8n"

### Info Alert
Explanation of support ticket system:
- Customers create tickets via mobile app
- Tickets automatically sent to manager via WhatsApp (n8n webhook)
- Manager replies via WhatsApp, messages appear in ticket thread
- Real-time updates when new messages arrive

### KPI Grid (4 Chips)
1. **Open Tickets**: 2-3
2. **In Progress**: 1-2 (yellow)
3. **Overdue**: 0-1 (red if >0)
4. **Total Tickets**: 5

### Create Ticket Button
- Floating action button (FAB) with plus icon
- Opens create ticket dialog/modal

### Tickets Table
- **Columns**:
  - Ticket Reference (T-20250115-1234 format: T-YYYYMMDD-XXXX)
  - Customer Name
  - Subject
  - Priority (low/medium/high/urgent with color badges)
  - Status (open/in_progress/resolved/closed with color badges)
  - Created At (timestamp, formatted)
  - Last Message (time ago, e.g., "2 hours ago")
  - Unread Badge (red dot if unread messages)
  - Actions (View button)
- **Sortable**: All columns
- **Filterable**: By status, priority
- **Pull to Refresh**: Refresh ticket list

### Create Ticket Dialog/Modal
- **Full-screen modal on mobile**
- **Form Fields**:
  - **Customer Name** (text input, required)
  - **Customer Phone** (text input with phone formatting, required)
    - Format: +1234567890
    - Country code picker
  - **Customer Email** (email input, required)
    - Email validation
  - **Subject** (text input, required)
    - Max 200 characters
  - **Message** (textarea, required)
    - Min 10 characters
    - Max 5000 characters
    - Character counter
  - **Priority** (dropdown/picker, default: medium)
    - Options: low, medium, high, urgent
    - Color-coded badges
- **Submit Button**: 
  - Shows loading state
  - Creates ticket via `POST /api/ticket`
  - Displays success message with ticket reference
  - Automatically triggers n8n webhook to send WhatsApp notification
- **Cancel Button**: Closes modal without saving

### Ticket Details View (Full Screen)

#### Header Section
- **Ticket Reference**: Large, prominent (T-20250115-1234)
- **Status Badge**: Color-coded (open/in_progress/resolved/closed)
- **Priority Badge**: Color-coded (low/medium/high/urgent)
- **Back Button**: Returns to tickets list
- **Menu Button**: Options (Mark as resolved, Close ticket, etc.)

#### Ticket Information Card
- **Customer Name**: John Doe
- **Customer Phone**: +1234567890 (tap to call)
- **Customer Email**: john@example.com (tap to email)
- **Subject**: Product Quality Issue
- **Created At**: January 15, 2025, 10:30 AM
- **Last Updated**: January 15, 2025, 11:45 AM
- **WhatsApp Status**: 
  - "Sent to manager" (green checkmark)
  - "Waiting for reply" (yellow clock)
  - "Manager replied" (green checkmark)

#### Conversation Thread
- **Chat-style interface** (like WhatsApp/iMessage)
- **Messages displayed chronologically** (oldest to newest)
- **Message Bubbles**:
  - **Customer messages** (left-aligned, blue/gray):
    - Sender: "Customer"
    - Channel badge: "Web" (small badge)
    - Message body
    - Timestamp (e.g., "10:30 AM")
    - Media (if any): Image/video preview
  - **Manager messages** (right-aligned, green):
    - Sender: "Manager"
    - Channel badge: "WhatsApp" (small badge with WhatsApp icon)
    - Message body
    - Timestamp (e.g., "11:45 AM")
    - Media (if any): Image/video preview
- **Loading Indicator**: Shows when fetching messages
- **Empty State**: "No messages yet" if thread is empty
- **Auto-scroll**: Scrolls to bottom when new message arrives

#### Add Reply Section (Customer Only)
- **Text Input**: 
  - Placeholder: "Type your reply..."
  - Multi-line support
  - Character counter (max 5000)
- **Attach Media Button**: 
  - Camera icon
  - Opens camera/gallery picker
  - Supports images and videos
- **Send Button**: 
  - Sends reply via `POST /api/ticket/:ticketRef/reply` (if implemented)
  - Or creates new ticket for follow-up
- **Note**: Customer replies create new tickets; manager replies come via WhatsApp

#### Real-Time Updates
- **WebSocket/Polling**: 
  - Polls `GET /api/ticket/:ticketRef` every 5 seconds when ticket is open
  - Or uses WebSocket for real-time updates
- **Push Notification**: 
  - Receives push notification when manager replies via WhatsApp
  - Notification shows: "New reply from manager on ticket T-20250115-1234"
  - Tapping notification opens ticket details
- **Badge Update**: 
  - Updates unread count in tickets list
  - Red dot indicator on ticket row

### n8n Integration Flow

#### Flow 1: Create Ticket → WhatsApp Notification

**Step 1: Mobile App Creates Ticket**
```
Mobile App → POST /api/ticket
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "subject": "Product Quality Issue",
  "message": "I received damaged bottles in my last order.",
  "priority": "high"
}
```

**Step 2: Backend Creates Ticket & Calls n8n**
```
Backend → POST https://n8n.srv1281573.hstgr.cloud/webhook/ticket-created
Headers:
  x-api-key: <N8N_SHARED_SECRET>
Body:
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

**Step 3: n8n Sends WhatsApp Message**
```
n8n → Twilio → WhatsApp Manager (+919655716000)

Message Format:
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

**Step 4: Mobile App Shows Success**
- Success toast: "Ticket T-20250115-1234 created successfully. Manager has been notified via WhatsApp."
- Navigate to ticket details view
- Show "Sent to manager" status

#### Flow 2: Manager Replies via WhatsApp → Ticket Updated

**Step 1: Manager Replies on WhatsApp**
```
Manager → WhatsApp → Twilio
Message: "Thank you for reporting this. We'll investigate immediately."
```

**Step 2: Twilio Triggers n8n Webhook**
```
Twilio → n8n Webhook (Twilio Trigger Node)
{
  "Body": "Thank you for reporting this. We'll investigate immediately.",
  "From": "whatsapp:+919655716000",
  "MessageSid": "SM1234567890abcdef",
  "MediaUrl0": null
}
```

**Step 3: n8n Processes & Calls Backend**
```
n8n → POST https://aio2-production.up.railway.app/api/ticket/inbound
Headers:
  Content-Type: application/json
  x-api-key: <RAILWAY_INBOUND_SECRET>
Body:
{
  "ticketRef": "T-20250115-1234",
  "message": "Thank you for reporting this. We'll investigate immediately.",
  "from": "+919655716000",
  "channel": "whatsapp",
  "externalId": "SM1234567890abcdef",
  "mediaUrl": null
}
```

**Step 4: Backend Adds Message to Ticket**
- Validates API key
- Finds ticket by ticketRef
- Checks idempotency (externalId)
- Adds message to conversation thread
- Returns success

**Step 5: Mobile App Receives Update**
- **Push Notification**: "New reply from manager on ticket T-20250115-1234"
- **Real-time Update**: If ticket details are open, message appears immediately
- **Badge Update**: Unread count increases
- **Sound/Vibration**: Notification sound plays

### n8n Configuration Details

#### Environment Variables (Backend)
```bash
BASE_URL=https://aio2-production.up.railway.app
N8N_TICKET_CREATED_WEBHOOK=https://n8n.srv1281573.hstgr.cloud/webhook/ticket-created
N8N_SHARED_SECRET=<generate-with-openssl-rand-hex-32>
RAILWAY_INBOUND_SECRET=<generate-with-openssl-rand-hex-32>
AGENT_PHONE=+919655716000
```

#### n8n Workflow 1: Ticket Created → WhatsApp

**Node 1: Webhook (Trigger)**
- Method: POST
- Path: `/webhook/ticket-created`
- Authentication: Header Auth
  - Name: `x-api-key`
  - Value: `{{ $env.N8N_SHARED_SECRET }}`

**Node 2: Function (Format Message)**
```javascript
const ticket = $input.item.json;

return {
  to: '+919655716000',  // Operation Manager
  body: `🎫 *NEW SUPPORT TICKET*

*Ticket:* ${ticket.ticketRef}
*Customer:* ${ticket.customerName}
*Phone:* ${ticket.customerPhone}
*Email:* ${ticket.customerEmail}
*Priority:* ${ticket.priority.toUpperCase()}
*Subject:* ${ticket.subject}

*Message:*
${ticket.message}

*View Ticket:* ${ticket.ticketUrl}

Reply to this message to respond to the ticket.`
};
```

**Node 3: Twilio (Send WhatsApp)**
- Account SID: `{{ $env.TWILIO_ACCOUNT_SID }}`
- Auth Token: `{{ $env.TWILIO_AUTH_TOKEN }}`
- From: `whatsapp:{{ $env.TWILIO_WHATSAPP_FROM }}`
- To: `{{ $json.to }}`
- Message: `{{ $json.body }}`

#### n8n Workflow 2: WhatsApp Reply → Update Ticket

**Node 1: Twilio Trigger (Incoming WhatsApp)**
- Configure Twilio webhook to call this n8n workflow
- Twilio → WhatsApp → n8n webhook

**Node 2: Function (Parse Reply)**
```javascript
const message = $input.item.json;

// Extract ticketRef from message body or conversation context
// For now, assume ticketRef is in message body or use conversation mapping

// If ticketRef is in message: "T-20250115-1234: Thank you..."
const ticketRefMatch = message.Body.match(/T-\d{8}-\d{4}/);
const ticketRef = ticketRefMatch ? ticketRefMatch[0] : extractFromContext(message);

// Remove ticketRef from message body if present
const cleanMessage = message.Body.replace(/T-\d{8}-\d{4}:\s*/, '');

return {
  ticketRef: ticketRef,
  message: cleanMessage,
  from: message.From.replace('whatsapp:', ''),
  channel: 'whatsapp',
  externalId: message.MessageSid,
  mediaUrl: message.MediaUrl0 || null
};
```

**Node 3: HTTP Request (Call Railway)**
- Method: POST
- URL: `https://aio2-production.up.railway.app/api/ticket/inbound`
- Headers:
  - `Content-Type: application/json`
  - `x-api-key: {{ $env.RAILWAY_INBOUND_SECRET }}`
- Body: JSON from Function Node

### API Endpoints for Mobile

#### Create Ticket
```
POST /api/ticket
Content-Type: application/json

Request:
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

Error Response (400):
{
  "ok": false,
  "error": "Validation failed",
  "details": {
    "customerName": "Required",
    "customerPhone": "Invalid format"
  }
}
```

#### Get Ticket with Messages
```
GET /api/ticket/:ticketRef

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

Error Response (404):
{
  "ok": false,
  "error": "Ticket not found"
}
```

#### List All Tickets (Optional - if implemented)
```
GET /api/tickets?status=open&priority=high

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
      "unreadCount": 1
    }
  ]
}
```

### Mobile App Implementation Details

#### Ticket Creation Flow
1. User taps "Create Ticket" button
2. Modal opens with form
3. User fills in all required fields
4. Form validation (client-side)
5. Submit button shows loading state
6. API call to `POST /api/ticket`
7. On success:
   - Show success toast with ticket reference
   - Close modal
   - Navigate to ticket details
   - Show "Sent to manager" status
   - n8n webhook is automatically called by backend (non-blocking)
8. On error:
   - Show error message
   - Highlight invalid fields
   - Keep modal open

#### Ticket Details View Flow
1. User taps ticket from list
2. Navigate to ticket details screen
3. Fetch ticket data via `GET /api/ticket/:ticketRef`
4. Display ticket info and conversation thread
5. Start polling every 5 seconds (or use WebSocket)
6. When new message arrives:
   - Add to conversation thread
   - Scroll to bottom
   - Show notification badge
   - Play notification sound
   - Update "Last Updated" timestamp

#### Real-Time Updates
- **Polling**: Poll `GET /api/ticket/:ticketRef` every 5 seconds when screen is active
- **WebSocket** (if implemented): Subscribe to ticket updates
- **Push Notifications**: 
  - Register for push notifications on app launch
  - Receive notification when manager replies
  - Deep link to ticket details on tap

#### Push Notification Payload
```json
{
  "title": "New Reply on Ticket",
  "body": "Manager replied to ticket T-20250115-1234",
  "data": {
    "type": "ticket_reply",
    "ticketRef": "T-20250115-1234",
    "screen": "ticket_details"
  }
}
```

#### Error Handling
- **Network Error**: Show "No internet connection" message
- **401 Unauthorized**: Redirect to login
- **404 Not Found**: Show "Ticket not found" message
- **500 Server Error**: Show "Server error, please try again"
- **Validation Error**: Show field-specific errors

#### Offline Support
- Cache ticket list locally
- Cache ticket details when viewed
- Queue ticket creation if offline
- Sync when connection restored
- Show "Offline" indicator

### UI/UX Considerations

#### Ticket List
- **Swipe Actions**: 
  - Swipe left: Mark as resolved
  - Swipe right: Archive/Delete
- **Pull to Refresh**: Refresh ticket list
- **Search Bar**: Search by ticket reference, customer name, subject
- **Filter Chips**: Quick filters (Open, In Progress, Resolved, Closed)
- **Sort Options**: By date, priority, status

#### Ticket Details
- **Swipe to Dismiss**: Swipe down to close
- **Share Button**: Share ticket details
- **Copy Ticket Ref**: Long press to copy ticket reference
- **Call Customer**: Tap phone number to call
- **Email Customer**: Tap email to send email

#### Conversation Thread
- **Message Bubbles**: 
  - Customer: Left-aligned, blue/gray background
  - Manager: Right-aligned, green background
- **Timestamps**: Show relative time (e.g., "2 hours ago")
- **Read Receipts**: Show "Delivered" and "Read" indicators
- **Media Preview**: Show thumbnails for images/videos
- **Tap to Expand**: Tap media to view full screen

### Testing Checklist

- [ ] Create ticket with all fields
- [ ] Create ticket with validation errors
- [ ] View ticket details
- [ ] Conversation thread displays correctly
- [ ] Real-time updates work (polling/WebSocket)
- [ ] Push notifications received when manager replies
- [ ] n8n webhook called successfully
- [ ] WhatsApp message sent to manager
- [ ] Manager reply appears in conversation
- [ ] Idempotency works (duplicate messages prevented)
- [ ] Offline mode works (cache, queue, sync)
- [ ] Error handling works (network, 401, 404, 500)
- [ ] Pull to refresh works
- [ ] Search and filter work
- [ ] Swipe actions work
- [ ] Deep linking works (from push notification)

---

## 13. APPROVALS PAGE

### Header
- **Icon**: CheckSquare
- **Title**: "Approvals"
- **Subtitle**: "Human-in-the-loop decision requests"

### KPI Grid (3 Chips)
1. **Pending**: 3-5
2. **Approved Today**: 2-3 (green)
3. **Rejected Today**: 0-1

### Approvals Table
- **Columns**:
  - Approval ID (A-001, etc.)
  - Type (SCHEDULE_CHANGE, MAINTENANCE, etc.)
  - Requested By
  - Entity ID
  - Status (pending/approved/rejected with color badges)
  - Requested At (timestamp)
  - Actions (Approve/Reject buttons for pending)
- **Sortable**: All columns
- **Filterable**: By status, type

### Approval Details Modal
- Full request information
- Entity details
- Approve/Reject buttons
- Reason field (required for reject)
- Audit trail

---

## 14. UPLOAD CENTER PAGE

### Header
- **Icon**: Upload
- **Title**: "Upload Center"
- **Subtitle**: "Import and manage production data"

### KPI Grid (2 Chips)
1. **Total Datasets**: 5-10
2. **Last Upload**: Today's date

### Upload Section
- **File Picker**: CSV file selection
- **Auto-Detection**: Shows detected dataset type
- **Preview**: Shows column mapping and sample rows
- **Upload Button**: Processes and stores dataset

### Datasets List
- **Columns**:
  - Dataset Name
  - Type (production, robotics, maintenance, quality, energy, orders, sensors)
  - Rows Count
  - Uploaded At
  - Actions (View, Delete)
- **Sortable**: All columns

### Generate Demo Data Button
- Creates synthetic datasets for all types
- Shows progress indicator

### Dataset Details View
- Column mappings
- Sample data preview (first 10 rows)
- Data quality report
- Use for ML training option

---

## 15. AI RECOMMENDATIONS PAGE

### Header
- **Icon**: Sparkles
- **Title**: "AI Recommendations"
- **Subtitle**: "AI-powered recommendations to optimize operations"

### Info Alert
Explanation of:
- Confidence levels (90%+ = very confident)
- Impact estimates
- Accept/Override workflow
- Audit requirements

### Recommendations List
Each recommendation card shows:
- **Type Badge**: maintenance/schedule/quality/energy (color-coded)
- **Confidence Badge**: Percentage with color (green ≥80%, yellow ≥60%, red <60%)
- **Title**: Recommendation title
- **Description**: Full description
- **Impact Estimate**: Expected benefit (e.g., "Avoid 8 hours downtime")
- **Entity**: Machine/Robot/Job ID
- **Actions**: Accept button, Override button

### Override Dialog
- **Reason Field**: Required textarea
- **Submit Button**: Logs override with reason
- **Cancel Button**: Closes dialog

### Empty State
- Sparkles icon
- "No pending recommendations"
- Explanation text

---

## 16. AI REPORT PAGE

### Header
- **Icon**: FileText
- **Title**: "AI Report"
- **Subtitle**: "Comprehensive AI analysis and insights"

### Overall Winner Section
- **Winner**: Robotics
- **Visual**: Large banner with trophy icon

### Category Winners
- **Quality**: Robotics (0 vs 3 defects per 100)
- **Cost**: Robotics ($0.090 vs $0.095)
- **Energy**: Robotics (15.2 vs 18.5 kWh)
- **Production**: Machines (1,350 vs 980 bottles/hour)

### Key Insights Section
- Robotics superior in quality and efficiency
- Machines excel in raw production volume
- Hybrid approach recommended

### Detailed Analysis
- Production metrics comparison
- Cost analysis
- Quality analysis
- Energy analysis
- Recommendations for optimization

---

## 17. DATA HUB PAGE

### Header
- **Icon**: BarChart3
- **Title**: "Data Hub"
- **Subtitle**: "Centralized data management and analytics"

### Features
- CSV upload interface
- Auto-detection of dataset types
- Data validation
- Synthetic data generation
- Real-time analytics
- Dataset management

### Dataset Types
1. Production (output, throughput, cycle time, downtime)
2. Robotics (utilization, idle time, pick rate, errors)
3. Maintenance (failures, actions, downtime, costs)
4. Quality (defects, reject rates, inspections)
5. Energy (kWh, peak load, cost, efficiency)
6. Orders (quantities, due dates, priorities)
7. Sensors (vibration, temperature, power, pressure)

---

## 18. ADMIN RULES PAGE (Admin Only)

### Header
- **Icon**: Settings
- **Title**: "Admin Rules"
- **Subtitle**: "Configure scheduler weights and system parameters"

### Scheduler Weights Configuration
- **Risk Weight**: 0.0 - 1.0 (slider)
- **Setup Weight**: 0.0 - 1.0 (slider)
- **Due Date Weight**: 0.0 - 1.0 (slider)
- **Priority Weight**: 0.0 - 1.0 (slider)
- **Save Button**: Updates configuration

### System Parameters
- Default values display
- Edit capabilities
- Validation rules

---

## 19. WHATSAPP PAGE (Admin Only)

### Header
- **Icon**: MessageSquare
- **Title**: "WhatsApp Integration"
- **Subtitle**: "Configure WhatsApp notifications and approvals"

### Configuration
- **Agent Phone**: +919655716000
- **Webhook URL**: Display current webhook
- **API Key**: Masked display
- **Test Button**: Send test message

### Integration Status
- Connection status indicator
- Last message sent timestamp
- Message statistics

---

## Navigation Structure

### Bottom Tab Navigation (Mobile)
1. **Dashboard** (Home icon)
2. **Schedule** (Calendar icon)
3. **Machines** (Wrench icon)
4. **Quality** (TestTube icon)
5. **More** (Menu icon) - Opens drawer with all other pages

### Side Drawer Menu
- **Operations Section**:
  - Dashboard
  - Schedule
  - Machines
  - Robotics
  - Machine Health
  - Machines vs Robotics
  - Quality Control
  - Energy
  - Alerts
  - Tickets
  - Approvals
  - Upload Center
- **AI Section**:
  - AI Recommendations
  - AI Report
- **Admin Section** (Admin only):
  - Admin Rules
  - WhatsApp

### Top Bar
- Logo/Back button (context-dependent)
- Page title
- Profile menu (avatar dropdown)
  - Profile
  - Settings (optional)
  - Logout

---

## Design System

### Colors
- **Primary**: Ocean-blue (#0EA5E9)
- **Background**: Dark theme (#0a0a0a base)
- **Card Background**: Dark with glass morphism
- **Text Primary**: White/light gray
- **Text Secondary**: Muted gray
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

### Typography
- **Headings**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Small**: 12px
- **Monospace**: For IDs, numbers, timestamps

### Components
- **Cards**: Rounded corners, glass morphism, subtle borders
- **Buttons**: Rounded, ocean-blue primary, outline secondary
- **Badges**: Small, rounded, color-coded
- **Charts**: Responsive, touch-friendly, interactive
- **Tables**: Scrollable, sortable, filterable
- **Modals**: Full-screen on mobile, centered on tablet
- **Skeletons**: Loading states for all data

### Animations
- **Page Transitions**: Smooth fade/slide
- **Chart Animations**: Staggered bar/line animations
- **Button Press**: Scale down on press
- **Card Hover**: Subtle lift (if applicable)
- **Loading**: Skeleton screens

### Responsive Breakpoints
- **Mobile**: < 768px (single column, bottom nav)
- **Tablet**: 768px - 1024px (two columns, side nav)
- **Desktop**: > 1024px (full layout, side nav)

---

## API Integration

### Base URL
- Production: `https://aio2-production.up.railway.app`
- Development: Configure via environment variable

### Authentication
- **Login**: `POST /api/auth/login`
- **Get User**: `GET /api/auth/me` (requires auth token)
- **Token Storage**: Secure storage (Keychain/Keystore)

### Endpoints (All prefixed with `/api`)
- `GET /dashboard/stats` - Dashboard KPIs
- `GET /dashboard/recommendations` - AI recommendations
- `GET /machines` - Machine list with health data
- `GET /robotics` - Robotics list with health data
- `GET /schedule/latest` - Latest schedule
- `POST /schedule/run` - Generate schedule
- `GET /schedule/comparison` - Schedule comparison
- `GET /quality/measurements` - Quality data
- `GET /energy/comparison` - Energy comparison
- `GET /alerts` - Alerts list
- `POST /alerts/:id/ack` - Acknowledge alert
- `GET /tickets` - Tickets list (optional, if implemented)
- `POST /ticket` - Create customer support ticket (triggers n8n webhook)
- `GET /ticket/:ticketRef` - Get ticket with full conversation thread
- `POST /ticket/inbound` - Receive WhatsApp replies from n8n (protected, requires x-api-key)
- `GET /approvals` - Approvals list
- `POST /approvals/:id/approve` - Approve request
- `POST /approvals/:id/reject` - Reject request
- `GET /recommendations` - AI recommendations
- `POST /recommendations/accept` - Accept recommendation
- `POST /recommendations/override` - Override recommendation
- `GET /datasets` - Datasets list
- `POST /upload-csv` - Upload CSV
- `POST /datasets/generate-demo` - Generate demo data

### Support Ticket Endpoints (n8n Integration)

#### Create Ticket
```
POST /api/ticket
Content-Type: application/json

Request Body:
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "customerEmail": "john@example.com",
  "subject": "Product Quality Issue",
  "message": "I received damaged bottles in my last order.",
  "priority": "high"  // low, medium, high, urgent
}

Response:
{
  "ok": true,
  "ticketRef": "T-20250115-1234",
  "ticketId": "uuid-here"
}

Note: Automatically triggers n8n webhook to send WhatsApp notification to manager
```

#### Get Ticket with Messages
```
GET /api/ticket/:ticketRef

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

#### Inbound WhatsApp Message (n8n → Backend)
```
POST /api/ticket/inbound
Headers:
  Content-Type: application/json
  x-api-key: <RAILWAY_INBOUND_SECRET>

Request Body:
{
  "ticketRef": "T-20250115-1234",
  "message": "Thank you for reporting this. We'll investigate immediately.",
  "from": "+919655716000",
  "channel": "whatsapp",
  "externalId": "SM1234567890abcdef",  // Twilio MessageSid (for idempotency)
  "mediaUrl": "https://..."  // Optional
}

Response:
{
  "ok": true
}

Note: This endpoint is called by n8n when manager replies via WhatsApp
```

### Error Handling
- Network errors: Show user-friendly message
- 401 Unauthorized: Redirect to login
- 404 Not Found: Show "Not found" message
- 500 Server Error: Show "Server error, please try again"
- Validation errors: Show field-specific errors

### Data Refresh
- **Pull to Refresh**: All list pages
- **Auto-refresh**: Dashboard every 30 seconds
- **Manual Refresh**: Refresh button in header

---

## Mobile-Specific Features

### Offline Support
- Cache recent data locally
- Show "Offline" indicator
- Queue actions for sync when online
- Offline-first for viewing cached data

### Push Notifications
- Critical alerts
- New tickets assigned
- Approval requests
- Schedule changes

### Biometric Authentication
- Face ID / Touch ID / Fingerprint
- Optional after initial login
- Secure token storage

### Deep Linking
- `petbottle://dashboard` - Open dashboard
- `petbottle://ticket/:ticketRef` - Open specific ticket (e.g., `petbottle://ticket/T-20250115-1234`)
- `petbottle://alert/:id` - Open specific alert
- `petbottle://machine/:id` - Open machine details
- `petbottle://ticket/create` - Open create ticket form

### Share Functionality
- Share ticket details
- Share chart screenshots
- Share reports

### Camera Integration
- Capture photos for tickets
- Scan QR codes for machine IDs
- Document scanning for maintenance logs

---

## Testing Requirements

### Functional Testing
- All pages load correctly
- All API calls work
- Forms validate properly
- Navigation works smoothly
- Data displays correctly with fixed values

### Visual Testing
- All charts render correctly
- Colors match design system
- Typography is consistent
- Spacing and layout are correct
- Animations are smooth

### Performance Testing
- App loads in < 3 seconds
- Charts render in < 1 second
- Smooth 60fps scrolling
- No memory leaks
- Efficient data caching

### Device Testing
- iOS (iPhone 12, 13, 14, 15, SE)
- Android (various screen sizes)
- Tablet layouts
- Landscape orientation
- Dark mode (always on)

---

## Deployment

### iOS
- App Store submission
- TestFlight for beta testing
- Version numbering
- Release notes

### Android
- Google Play Store submission
- Internal testing track
- Version numbering
- Release notes

### Updates
- Over-the-air updates (if using React Native/Expo)
- Version checking
- Forced updates for critical fixes

---

## Success Criteria

1. ✅ All 19 pages implemented with identical functionality
2. ✅ All fixed values match web version exactly
3. ✅ All charts display correctly with same data
4. ✅ All tables are sortable and filterable
5. ✅ All forms validate and submit correctly
6. ✅ Navigation is intuitive and smooth
7. ✅ Design matches web version (dark theme, ocean-blue accents)
8. ✅ Performance is excellent (< 3s load, 60fps)
9. ✅ Works offline with cached data
10. ✅ Push notifications work correctly
11. ✅ Biometric authentication works
12. ✅ Deep linking works
13. ✅ All API endpoints integrated
14. ✅ Error handling is user-friendly
15. ✅ Accessibility features implemented

---

## Notes

- **All numeric values must match exactly** - Use the fixed values specified in this document
- **Charts must use the same data** - No random variations, use exact values
- **Colors must match** - Ocean-blue (#0EA5E9) for primary, exact color codes for status badges
- **Typography must match** - Same font sizes, weights, and styles
- **Layout must be responsive** - Optimize for mobile but maintain visual hierarchy
- **Animations should be smooth** - Use native animations for best performance
- **Data should be cached** - Store recent data locally for offline access
- **API calls should be efficient** - Batch requests, use pagination, implement caching

---

## Final Checklist

Before considering the app complete, verify:

- [ ] All 19 pages implemented
- [ ] All fixed values match exactly
- [ ] All charts render with correct data
- [ ] All tables are functional
- [ ] All forms work correctly
- [ ] Navigation is complete
- [ ] Authentication works
- [ ] Role-based access works
- [ ] API integration complete
- [ ] Error handling implemented
- [ ] Offline support works
- [ ] Push notifications work
- [ ] Biometric auth works
- [ ] Deep linking works
- [ ] Performance is excellent
- [ ] Design matches web version
- [ ] Tested on iOS and Android
- [ ] Accessibility features added
- [ ] Documentation complete

---

**END OF PROMPT**

This prompt provides complete specifications for building a mobile app that replicates the PETBottle AI Ops web dashboard with identical functionality, values, and output. Follow this document precisely to ensure the mobile app matches the web version exactly.
