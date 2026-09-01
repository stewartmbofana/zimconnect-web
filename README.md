# Zimconnect Web / Admin

This project is a React web application built with [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Firebase](https://firebase.google.com/).

## Prerequisites

- Node.js
- npm (or yarn/pnpm)

## Getting Started

1. Navigate to the `web` directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your Firebase configuration.
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

In the `web` directory, you can run:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and builds the app for production.
- `npm run typecheck`: Runs TypeScript type checking.
- `npm run test`: Runs the Vitest test suite.
- `npm run test:watch`: Runs tests in watch mode.

## Deployment

This app is configured to deploy to Firebase Hosting. The configuration can be found in `firebase.json` at the root directory.

To deploy:
```bash
# Build the project
cd web && npm run build

# Deploy to Firebase
cd .. && firebase deploy --only hosting
```
