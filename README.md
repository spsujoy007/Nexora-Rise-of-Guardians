# NEXORA Guardians

NEXORA Guardians is a React-based civic environmental reporting platform. It enables citizens to report pollution incidents, receive AI-assisted classification, earn contribution rewards, and follow the health of their city. Municipal users can review incidents and monitor community activity from a dedicated dashboard.

This directory contains the frontend application built with React, TypeScript, Vite, Tailwind CSS, and Zustand.

## Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Application Routes](#application-routes)
- [Project Structure](#project-structure)
- [Available Commands](#available-commands)
- [Production Build and Deployment](#production-build-and-deployment)
- [Troubleshooting](#troubleshooting)

## Features

- Guardian dashboard with reports, AQI trends, category breakdowns, missions, streaks, and city health indicators.
- Citizen reporting flow with photo or video support, location details, and AI analysis.
- Automatic pollution type, severity, confidence, risk, and recommended action analysis.
- Mock AI mode for local development and optional live Google Gemini analysis.
- Incident map with a zero-configuration stylized map and optional Google Maps rendering.
- Community feed with report status, verification, likes, and comments.
- Missions, XP, Eco Coins, levels, badges, reputation, and leaderboard rankings.
- Profile page with achievements, activity timeline, impact estimates, and a GitHub-style contribution heatmap.
- Municipal dashboard for reviewing reports and environmental activity.
- Firebase authentication and Firestore subscriptions when live Firebase configuration is enabled.
- Cloudinary upload support for report media without exposing a server-side secret.

## How It Works

### 1. Authentication

Users start from the landing page and sign in with Google. Protected pages are wrapped in `ProtectedRoute`. When Firebase is not configured, the application uses its demo login flow and mock guardian data.

### 2. Reporting

An authenticated Guardian opens the report page, adds a description and optional media, and submits the incident. The analysis service automatically selects one of two paths:

- **Live mode:** sends the description and optional image to Google Gemini when `VITE_GEMINI_API_KEY` is configured.
- **Mock mode:** uses deterministic keyword matching and simulated latency when Gemini is unavailable.

Both paths return the same analysis shape: pollution type, severity, confidence, possible cause, health risk, suggested actions, and summary.

### 3. Map Rendering

The shared `IncidentMap` component chooses the map implementation automatically:

- Without `VITE_GOOGLE_MAPS_API_KEY`, it renders the built-in stylized incident map.
- With a valid Google Maps key, it lazy-loads the Google Maps implementation.

This keeps the default local demo fast and free of external map credentials.

### 4. State and Data

Zustand stores the active Guardian, reports, missions, notifications, authentication state, and celebrations. Mock data is loaded from `src/lib/mockData.ts`.

When live Firebase data is enabled, the store subscribes to Firestore snapshots for guardian and report updates. In mock mode, report submissions and rewards remain in the current browser session.

### 5. Rewards and Contributions

Submitting a report awards XP and Eco Coins. XP can increase the Guardian's level and contribution score. The profile contribution heatmap displays daily activity across the last 12 months in a GitHub-style calendar with month labels, weekday labels, and an intensity legend.

## Requirements

- Node.js 20 or newer recommended.
- npm 10 or newer recommended.
- A modern browser with JavaScript enabled.

No external API keys are required for the mock-mode demo.

## Quick Start

From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For the demo flow, select **Guardian Login**, continue with the mock Google login, choose an avatar, and open the dashboard.

On Windows PowerShell, if `npm` is blocked by the execution policy, use the Windows command shim:

```powershell
npm.cmd install
npm.cmd run dev
```

## Environment Configuration

## Project Structure

```text
src/
├── App.tsx                 # Router and route protection
├── main.tsx                # Application entry point
├── index.css               # Tailwind theme and global styles
├── components/             # Reusable UI, charts, maps, reports, and layout
├── hooks/                  # Authentication and reusable React hooks
├── lib/                    # Firebase, AI, Firestore, storage, types, and mock data
├── pages/                  # Route-level screens
├── routes/                 # Protected route behavior
└── store/                  # Zustand application state
```

## Available Commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production bundle
npm run lint      # Run Oxlint
npm run preview   # Serve the production bundle locally
```

The production build runs `tsc -b` before Vite. Existing type errors elsewhere in the project will prevent `npm run build` from completing even when the Vite bundle itself can be generated successfully.

## Production Build and Deployment

Build the application with:

```bash
npm run build
```

The output is written to `dist/`. The included `vercel.json` rewrites all routes to `index.html`, which is required for client-side routing on Vercel. Configure the same `VITE_*` variables in the deployment provider before building.

For a local production preview:

```bash
npm run build
npm run preview
```

## Troubleshooting

### The app starts without API keys

This is expected. NEXORA is designed to run in mock mode with local sample data, mock authentication, deterministic AI analysis, and a stylized map.

### Google sign-in does not work

Confirm that the `VITE_GOOGLE_AUTH_*` variables are present, Google sign-in is enabled in Firebase Authentication, and the local host is listed in Firebase authorized domains. Restart the Vite server after changing `.env`.

### The Google map is not displayed

Confirm `VITE_GOOGLE_MAPS_API_KEY` is configured and that Maps JavaScript API access is enabled. The stylized map is the intended fallback.

### Report media uploads fail

Configure both Cloudinary variables and use an unsigned upload preset. The preset should restrict allowed file types and sizes in the Cloudinary console.

### Environment changes are not picked up

Vite reads environment variables when the development server starts. Stop and restart `npm run dev` after editing `.env`.

## Technology Stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- React Router
- Zustand
- Firebase Authentication and Firestore
- Google Gemini API
- Google Maps JavaScript API and Leaflet-compatible map components
- Cloudinary unsigned media uploads
- Recharts, Framer Motion, Lucide React, and Three.js
