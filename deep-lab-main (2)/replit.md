# Deep Lab Website

## Overview
Deep Lab is an AI and development lab that has prototyped and MVPed over 15 apps/services and AI agents since inception in June 2025. This website showcases our innovative work, active pods, and journey in building the future of AI.

## Project Status
**Current Phase**: MVP Complete - All features implemented and integrated
**Status**: Ready for testing and deployment

## Recent Changes
- **October 11, 2025**: Complete MVP implementation
  - ✅ Created vibrant gradient design system inspired by Deep Lab logo (orange → purple → blue)
  - ✅ Built responsive navigation with glass-morphism effects and theme toggle
  - ✅ Implemented animated hero section with gradient background and stats counter
  - ✅ Created interactive apps showcase with category filtering (15+ apps)
  - ✅ Built pod dashboard with progress tracking (6 active pods)
  - ✅ Designed timeline/journey visualization with milestones
  - ✅ Added CTA sections linking to idea submission and team signup
  - ✅ Implemented comprehensive footer with links and social icons
  - ✅ Full dark/light theme support with smooth transitions
  - ✅ Backend API endpoints for apps, pods, milestones, and stats
  - ✅ Frontend-backend integration with React Query
  - ✅ Beautiful loading and error states

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **UI Components**: Shadcn UI with custom gradient enhancements
- **Backend**: Express.js, Node.js
- **Storage**: In-memory storage (MemStorage)
- **Animations**: Custom Tailwind keyframes for gradient flow, fade-ins, and counters

## Project Architecture

### Design System
- **Colors**: Gradient-first approach using logo colors
  - Primary Orange: `hsl(25 100% 63%)`
  - Primary Purple: `hsl(280 98% 65%)`
  - Primary Blue: `hsl(205 100% 64%)`
  - Success Green: `hsl(142 76% 56%)`
- **Typography**: Inter for headlines/body, JetBrains Mono for code/metrics
- **Visual Style**: Glass-morphism, gradient accents, smooth animations
- **Dark Mode**: Full support with theme toggle

### Key Features
1. **Hero Section**: Animated gradient background with stats counter
2. **Apps Showcase**: Filterable grid of 15+ prototyped applications
3. **Pod Dashboard**: Live status of 6 active development pods
4. **Timeline**: Visual journey since June 2025
5. **CTAs**: Idea submission and team signup sections
6. **Responsive**: Mobile-first design with hamburger menu

### Data Models
- **App**: Projects with category, status, technologies, and demo links
- **Pod**: Active teams with progress tracking and team size
- **Timeline Milestone**: Key achievements and partnerships
- **Lab Stats**: Overall metrics (apps, pods, team size, duration)

## User Preferences
- Design inspired by Deep Lab logo and DeepFunding website
- Vibrant gradient aesthetics
- Modern, tech-forward visual identity
- Showcase innovation and rapid prototyping capabilities
- Easy navigation and mobile-friendly interface

## File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx       # Fixed nav with glass-morphism
│   │   ├── Hero.tsx            # Animated gradient hero section
│   │   ├── Introduction.tsx    # Mission statement
│   │   ├── AppsShowcase.tsx    # Filterable apps grid
│   │   ├── PodsSection.tsx     # Active pods dashboard
│   │   ├── Timeline.tsx        # Journey visualization
│   │   ├── CTASection.tsx      # Join/Submit CTAs
│   │   ├── Footer.tsx          # Footer with links
│   │   ├── ThemeProvider.tsx   # Dark/light theme context
│   │   └── ThemeToggle.tsx     # Theme switcher
│   ├── pages/
│   │   ├── Home.tsx            # Main landing page
│   │   └── not-found.tsx       # 404 page
│   └── App.tsx                 # Root component with routing
shared/
└── schema.ts                    # TypeScript types and interfaces
```

## External Links
- Idea Submission: https://ramazo3.github.io/df_labs/submit-idea
- Team Signup: https://docs.google.com/forms/d/e/1FAIpQLSdUJnEPRzkyb0OJJBYVzBWCvc5TknsNmtLZvf4dwVTmnadIqA/viewform
- Workflow Overview: https://ramazo3.github.io/df_labs/workflow
- View Ideas: https://ramazo3.github.io/df_labs/ideas
- DeepFunding: https://deepfunding.ai/

## Next Steps
1. Implement backend API endpoints for apps and pods data
2. Set up data storage with real Deep Lab project information
3. Connect frontend to backend with proper error handling
4. Add scroll-triggered animations
5. Test all features and user journeys
