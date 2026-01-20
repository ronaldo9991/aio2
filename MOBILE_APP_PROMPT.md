# PETBottle AI Ops - Mobile App Development Prompt

## Overview
Build a native mobile application (React Native or Flutter) that replicates the PETBottle AI Ops web dashboard with **identical functionality, values, and visual output** from top to bottom. The app should provide the same user experience as the web version, optimized for mobile devices.

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

## 12. TICKETS PAGE

### Header
- **Icon**: Ticket
- **Title**: "Tickets"
- **Subtitle**: "Work orders and task management"

### KPI Grid (4 Chips)
1. **Open Tickets**: 2-3
2. **In Progress**: 1-2 (yellow)
3. **Overdue**: 0-1 (red if >0)
4. **Total Tickets**: 5

### Create Ticket Button
- Floating action button or header button
- Opens create ticket dialog

### Tickets Table
- **Columns**:
  - Ticket ID (T-001, T-002, etc.)
  - Type (MAINTENANCE, QUALITY_ISSUE, SCHEDULE_CHANGE, APPROVAL_REQUEST)
  - Status (open/in_progress/resolved/closed with color badges)
  - Assigned To (name or "Unassigned")
  - Entity ID
  - Due By (date, red if overdue)
  - Actions (View button)
- **Sortable**: All columns
- **Filterable**: By status, type

### Create Ticket Dialog
- **Fields**:
  - Customer Name (text)
  - Customer Phone (text)
  - Customer Email (email)
  - Subject (text)
  - Message (textarea)
  - Priority (dropdown: low/medium/high/urgent)
- **Submit Button**: Creates ticket and sends n8n webhook

### Ticket Details View
- Full ticket information
- Conversation thread (web + WhatsApp messages)
- Add reply functionality
- Status update buttons

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
- `GET /tickets` - Tickets list
- `POST /ticket` - Create ticket
- `GET /ticket/:ticketRef` - Get ticket with messages
- `GET /approvals` - Approvals list
- `POST /approvals/:id/approve` - Approve request
- `POST /approvals/:id/reject` - Reject request
- `GET /recommendations` - AI recommendations
- `POST /recommendations/accept` - Accept recommendation
- `POST /recommendations/override` - Override recommendation
- `GET /datasets` - Datasets list
- `POST /upload-csv` - Upload CSV
- `POST /datasets/generate-demo` - Generate demo data

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
- `petbottle://ticket/:id` - Open specific ticket
- `petbottle://alert/:id` - Open specific alert
- `petbottle://machine/:id` - Open machine details

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
