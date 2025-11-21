# Deep Lab Website Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing from DeepFunding's modern gradient aesthetic, Linear's clean typography, and Vercel's bold visual treatments. The design emphasizes Deep Lab's innovative spirit through vibrant gradients, dynamic layouts, and interactive showcases.

**Key Principles**:
- Gradient-first visual identity reflecting the logo's energy
- Bold, confident typography establishing technical authority
- Interactive elements showcasing active innovation
- Glass-morphism and depth for modern tech aesthetic

## Core Design Elements

### A. Color Palette

**Primary Gradient System** (from logo):
- Primary Orange: 25 100% 63%
- Primary Purple: 280 98% 65%
- Primary Blue: 205 100% 64%

**Dark Mode** (primary):
- Background Base: 240 8% 8%
- Background Elevated: 240 6% 12%
- Text Primary: 0 0% 98%
- Text Secondary: 240 5% 70%

**Accent Colors**:
- Success Green: 142 76% 56%
- Gradient overlays using 15-20% opacity for cards/sections

### B. Typography

**Font Families**: 
- Headlines: Inter (700-800 weight) - technical confidence
- Body: Inter (400-500) - clean readability
- Accents: JetBrains Mono for code/metrics

**Scale**:
- Hero Headline: text-6xl md:text-7xl lg:text-8xl font-bold
- Section Headers: text-4xl md:text-5xl font-bold
- Card Titles: text-xl md:text-2xl font-semibold
- Body: text-base md:text-lg

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32
- Section padding: py-20 md:py-32
- Container max-width: max-w-7xl
- Card spacing: gap-6 md:gap-8
- Content margins: px-4 md:px-6 lg:px-8

**Grid Structures**:
- Apps showcase: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Pod cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stats: grid-cols-2 md:grid-cols-4

### D. Component Library

**Navigation**:
- Fixed top nav with glass-morphism (backdrop-blur-xl bg-background/80)
- Logo with gradient on hover
- Smooth scroll behavior
- Mobile: Hamburger with slide-in menu

**Hero Section**:
- Full-width animated gradient background (orange→purple→blue)
- Large headline with gradient text effect
- Animated statistics counter (15+ apps, 6 pods, months since inception)
- Dual CTAs: "View Projects" (gradient fill) + "Join Team" (outline with blur on gradient bg)

**App Showcase Cards**:
- Glass-morphism cards (backdrop-blur-md bg-white/5 border border-white/10)
- Hover: Lift effect (translate-y-1 scale-105) with enhanced gradient border
- Top: Small gradient accent bar indicating category
- Include: Icon/logo, title, 2-line description, tech tags, "View Details" link
- Filter tabs above: All, AI Agents, Web Apps, Tools (gradient underline for active)

**Pod Status Dashboard**:
- Horizontal scroll on mobile, grid on desktop
- Each pod card: Name, progress bar with gradient fill, team size, status badge
- Live pulse animation on active status indicators
- Mini chart/graph showing progress trend

**Stats Section**:
- Animated counters with gradient numbers
- Icons from Heroicons
- Glass-card backgrounds
- Grid layout with hover effects

**Timeline/Journey**:
- Vertical timeline with gradient connector line
- Milestone cards: Date, achievement, visual icon
- Alternating left-right layout on desktop
- Scroll-triggered fade-in animations

**CTA Sections**:
- Gradient background sections
- Bold headline + supporting text
- Primary button with gradient + Secondary outline
- Include context: "Join 6 active pods" or "15+ successful prototypes"

**Footer**:
- Dark background with subtle gradient overlay
- Multi-column: About, Quick Links, Active Pods, Contact
- Social icons with gradient on hover
- Newsletter signup with gradient button
- Copyright and legal links

### E. Visual Enhancements

**Glass-morphism Pattern**:
```
backdrop-blur-xl bg-white/5 border border-white/10
shadow-2xl shadow-purple-500/10
```

**Gradient Text**:
```
bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500
bg-clip-text text-transparent
```

**Card Hover States**:
- Transform: scale-105 -translate-y-1
- Enhanced shadow and gradient border glow
- Smooth transition-all duration-300

**Animations** (minimal, strategic):
- Hero gradient: Slow animated background gradient
- Stats: Count-up animation on scroll into view
- Cards: Stagger fade-in on scroll
- Hover: Smooth scale/lift transforms
- No distracting perpetual animations

## Images

**Hero Section**: 
- Large background: Abstract AI/neural network visualization with gradient overlay (orange to purple/blue tones)
- Purpose: Establish tech-forward identity while keeping text readable

**App Showcase Cards**:
- Small thumbnail/icon for each app (200x200px)
- Clean, minimal screenshots or custom icons
- Consistent style across all apps

**Pod Section**:
- Team avatars or abstract pod icons
- Optional: Small progress/activity visualizations

**About/Journey Section**:
- Timeline milestone icons (custom gradient SVGs via Heroicons style)
- Optional: Team photo or lab workspace image

## Page Structure

1. **Hero**: Full viewport with animated gradient, headline, stats, dual CTAs
2. **Quick Intro**: Single column, centered text explaining Deep Lab's mission
3. **Apps Showcase**: Filterable grid of 15+ prototyped apps/services
4. **Active Pods**: Dashboard-style cards showing current projects
5. **Journey/Timeline**: Visual story since June 2025
6. **Impact Stats**: Animated counters in grid layout
7. **Join Us CTA**: Gradient section with idea submission + team signup buttons
8. **Footer**: Comprehensive with newsletter, links, social

**Multi-column Usage**: Apps grid (3-col), pods (3-col), stats (4-col), footer (4-col) - all single column on mobile.