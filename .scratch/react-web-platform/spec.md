# Spec: Pa~ZimConnect React Web Platform & Concealed Admin Portal

## Goal
Build a responsive, low-bandwidth optimized React Single Page Application (SPA) for Pa~ZimConnect under `/web`, deployable to Firebase Hosting, featuring full public directory parity with the mobile app and a strictly concealed, desktop-optimized Admin & Moderator Portal.

## Key Tenets
1. **Concealed Admin Invisibility**: Non-admin visitors must not see or detect any administrative routes, UI elements, or code bundles. Unauthenticated requests to secret routes render an exact 404 page. Admin JavaScript chunks are loaded strictly on-demand after verified authentication with Firebase Custom Claims (`role: 'admin' | 'moderator'`).
2. **Public Platform Parity**: Public visitors can switch between Zimbabwean seed cities, search across all 11 categories, submit listings with client-side `<200KB` WebP compression, view dual-currency commodity prices (USD & ZiG), and dispatch listing leads via WhatsApp (`+263`).
3. **High-Performance & Low-Bandwidth**: Built with Vite + React 19 + TypeScript + Tailwind CSS, with Service Worker offline caching for intermittent connectivity.
4. **Firebase Hosting CDN**: Configured via `firebase.json` for single-command deployment.
