# AQUAINTEL Design Guidelines

## Design Foundation

**Theme & Color Philosophy**
- Dark theme ONLY (no theme toggle)
- Minimal grayscale surfaces with glass/blur panels
- Ocean-blue accent (#0EA5E9 or similar) for actions, focus rings, and interactive highlights
- Must feel "expensive" and smooth with premium aesthetics

**Visual Treatment**
- Subtle noise overlay texture (CSS)
- Rounded corners, soft shadows
- Crisp typography using Inter font family
- Glass morphism for key UI panels (login, modals, cards)

## Motion & Animation Stack

**Libraries (Required)**
- Lenis for smooth scroll
- GSAP + ScrollTrigger for scroll-driven animations
- Framer Motion for micro-interactions and transitions
- Avoid heavy 3D; keep performance smooth

**Key Animations**
- Navbar: hides on scroll down, reveals on scroll up
- Minimal animations overall - use sparingly for polish
- Image crossfades only (no heavy video morphs)

## Signature Components

**Fake Browser Frame Wrapper**
- Mac-style window chrome with colored dots (red/yellow/green)
- URL bar showing "aquaintel.ai"
- Apply to Landing page (optionally Login/App for motif consistency)

**Cinematic Loader (1.5-2.5s sequence)**
1. Neon ocean-blue dot appears
2. Dot stretches into thin horizontal line
3. Letters "AQ" briefly appear
4. Expand to full "AQUAINTEL"
5. Underline draws beneath
6. Fade out into hero
- No progress bar
- Skip quickly if assets ready

**Cursor Interaction**
- Ocean-blue halo "light follows cursor" effect on landing
- Fades on idle

## Landing Page (Apple-like Scroll Story)

**Hero Section**
- Full-screen hero with muted looping video (or animated gradient fallback)
- Headline: "AQUAINTEL — PETBottle AI Ops"
- Subhead: "Risk-aware scheduling + machine health + quality drift control — with approvals and audit trails"
- CTAs: "Explore" and "Login" buttons
- Split text reveal on load with blur-to-sharp effect

**Scroll Sections (in order)**
1. **"What it does" Cards**: Five cards (Plan, Predict, Prevent, Approve, Audit) with staggered reveal + slight parallax
2. **Risk-Aware Scheduling**: BEFORE vs AFTER timeline UI showing baseline → risk-aware crossfade
3. **Modules Pinned Section**: Left side pinned title, right side content transitions through modules (Upload Center, Scheduling, Maintenance, Quality, Policy, Approvals, Fairness, Evaluation)
4. **Cinematic Product Shots**: Crossfade images with minimal spec labels (FailureRisk 72h, SPC drift control, Freeze window, HITL approvals)
5. **Gallery Grid**: Filterable grid with modal detail pages (Scheduling, Maintenance, Quality, Governance, Admin categories)

## Protected App Layout

**Shell Structure**
- Sidebar navigation with module links
- Admin-only items hidden for non-admin roles
- Top-right profile dropdown (Profile, Logout) - NOT a sidebar page

**Page Anatomy (Every page must have)**
- Header with KPI chips showing key metrics
- Minimum 2 cards with charts/insights
- Sortable data table
- Optional right-rail inspector/detail drawer

**Component Library (Required)**
Button, Card, Table, Modal, Drawer, Tabs, KPIChip, SidebarNav, TopbarProfileMenu, Skeleton loading states

## Login Page

**Glass Login Design**
- Centered glass panel with blur background
- Ocean-blue accent for input focus states
- Minimal form: email, password, login button
- Subtle animations on input focus

## Typography & Spacing

**Font**: Inter throughout
- Headings: Bold weights (600-700)
- Body: Regular (400) and Medium (500)
- Code/data: Monospace fallback where appropriate

**Spacing System**
- Use Tailwind spacing primitives: 2, 4, 8, 12, 16, 20, 24, 32 units
- Consistent vertical rhythm across sections
- Generous breathing room in landing sections

## Data Visualization

**Charts & Graphs**
- Dark theme compatible
- Ocean-blue primary data series
- Grayscale secondary/tertiary series
- Subtle grid lines
- Glass panel backgrounds

**Tables**
- Sortable columns with indicators
- Hover states with subtle highlights
- Row selection with ocean-blue accent
- Alternating row backgrounds (very subtle)

## Images

**Hero Video/Image**
- Full-width muted looping video of factory/production line or animated ocean-blue gradient
- Buttons on hero: blurred background, no custom hover states

**Product Screenshots**
- Cinematic mid-scroll product shots in landing
- Gallery modal images showing different modules
- All images should reinforce industrial/AI/factory aesthetic

**Placement**
- Hero: Full-screen background video/gradient
- Scroll sections: Embedded screenshots with crossfade transitions
- Gallery: Grid layout with modal expansion

## Accessibility & States

**Focus States**
- Ocean-blue glow rings on all interactive elements
- High contrast for readability
- Keyboard navigation support

**Loading States**
- Skeleton loaders matching component structure
- Smooth transitions from skeleton to content

## Critical UI Rules

- NO theme toggle (dark only)
- NO color references in spacing/layout - focus on structure
- Maintain glass aesthetic consistently
- Ocean-blue ONLY for accents, not backgrounds
- All buttons implement standard hover/active states automatically