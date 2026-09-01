# ADR 0013: React Web Platform and Concealed Editorial Architecture

## Context
While the primary mobile client is implemented in Flutter, users and desktop moderators require a responsive, lightweight web application. The web version must provide public directory access and submission capabilities, alongside a high-velocity editorial moderation portal that is strictly concealed from non-admin users and deployed via Firebase Hosting.

## Decision
We adopt a unified Vite + React + TypeScript single-page application (SPA) located under `/web`, configured for deployment to Firebase Hosting:
1. **Concealed Admin Architecture**: The Moderator workspace is lazy-loaded via dynamic code chunking (`React.lazy()`) and strictly hidden behind unindexed routing, 404 cloak masking, stealth activation triggers (e.g. ribbon interaction/secret shortcut), and Firebase Auth Custom Claims (`role: 'admin' | 'moderator'`).
2. **UI & Styling System**: Built using Tailwind CSS, Lucide icons, and accessible component primitives styled to adhere to the Pa~ZimConnect brand system (National Accent Ribbon, crisp green palette, responsive typography).
3. **Data & Offline Resilience**: Powered by TanStack Query and Firebase Web SDK v11 with client-side image compression and Service Worker PWA caching for low-bandwidth, intermittent Zimbabwean connectivity.

## Rationale & Trade-offs
- **Bundle Separation**: Dynamic code splitting ensures that public visitors never download administrative JavaScript bundles or route definitions.
- **Low Bandwidth Optimization**: Vite + React SPA outputs an ultra-lightweight static build ideal for Firebase CDN edge delivery and mobile web browsers with high data cost sensitivity.
- **Editorial Velocity**: Desktop-optimized layouts enable batch moderation of listings, rapid civic updates, and price index revisions across Zimbabwean towns.
