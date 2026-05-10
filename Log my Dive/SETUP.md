# Log my Dive — Setup Guide

## Prerequisites

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **Yarn** 1.x — `npm install -g yarn`
- **Expo CLI** — `npm install -g expo-cli` (for mobile)

---

## 1. Install all dependencies

From the root of the project:

```bash
yarn install
```

Yarn workspaces will install dependencies for all packages and apps in one go.

---

## 2. Run the mobile app (Expo)

```bash
yarn dev:mobile
```

Then in the Expo dev menu:
- Press **i** to open in iOS Simulator
- Press **a** to open in Android Emulator
- Scan the QR code with **Expo Go** on your physical device

---

## 3. Run the web app (Vite PWA)

```bash
yarn dev:web
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To install as a PWA on your phone, open the URL in Safari (iOS) or Chrome (Android) and use "Add to Home Screen".

---

## Project Structure

```
log-my-dive/
├── apps/
│   ├── mobile/              # Expo React Native app (iOS + Android)
│   │   ├── app/             # Expo Router file-based screens
│   │   │   ├── (tabs)/      # Bottom-tab screens
│   │   │   │   ├── index.tsx      → Home (Dive Log List)
│   │   │   │   ├── import.tsx     → Import screen
│   │   │   │   ├── stats.tsx      → Statistics
│   │   │   │   └── settings.tsx   → Settings
│   │   │   ├── log/
│   │   │   │   ├── [id].tsx       → Dive Detail
│   │   │   │   └── create.tsx     → Create/Edit Log
│   │   │   └── _layout.tsx        → Root layout
│   │   └── src/
│   │       └── hooks/        → useDiveLogs, useDiveLog
│   │
│   └── web/                 # Vite + React PWA
│       └── src/
│           ├── pages/        → One file per screen (mirrors mobile)
│           └── App.tsx       → Router + nav shell
│
├── packages/
│   ├── core/                # Shared business logic (no React, no RN)
│   │   └── src/
│   │       ├── models/       → DiveLog.ts, User.ts, ImportSource.ts
│   │       ├── services/     → DiveLogRepository.ts, StatisticsService.ts
│   │       └── utils/        → units.ts (metric ↔ imperial)
│   │
│   └── adapters/            # Import adapter pattern
│       └── src/
│           ├── DiveLogAdapter.ts   → Base interface
│           ├── CsvAdapter.ts       → CSV import (papaparse)
│           ├── JsonAdapter.ts      → JSON import
│           └── stubs/
│               ├── GarminAdapter.ts      → Coming soon
│               └── SubsurfaceAdapter.ts  → Coming soon
│
├── package.json             # Yarn workspaces root
├── turbo.json               # Turborepo task config
└── tsconfig.base.json       # Shared TypeScript config
```

---

## Key design decisions

**Why a monorepo?**
Both apps share the same data model, business logic, and import adapters. Keeping them in one repo means you change the `DiveLog` type once and it updates everywhere.

**Why `packages/core` has no React dependency?**
Pure TypeScript — no React, no React Native. This means the same `StatisticsService` and `DiveLogRepository` interface runs on mobile, web, and in unit tests with no mocking.

**Why the adapter pattern for imports?**
Adding a new data source (Garmin, Subsurface, PADI) in the future means adding one file in `packages/adapters/src/stubs/` and setting `isAvailable = true`. No other code changes needed.

**All values stored in metric.**
Depth in metres, temperature in °C, pressure in bar, weight in kg. The `packages/core/src/utils/units.ts` file converts to display units at render time based on the user's settings.

---

## What's wired up vs. what's a placeholder

| Feature | Status |
|---------|--------|
| App navigation & routing | ✅ Working |
| DiveLog TypeScript types | ✅ Done |
| StatisticsService (pure functions) | ✅ Done |
| Unit conversion utils | ✅ Done |
| CsvAdapter parser | ✅ Done |
| JsonAdapter parser | ✅ Done |
| Garmin / Subsurface stubs | ✅ Stubbed |
| SQLite database (mobile) | 🔲 Milestone 1 |
| IndexedDB (web) | 🔲 Milestone 1 |
| Real data in log list | 🔲 Milestone 3 |
| Form → DB save | 🔲 Milestone 4 |
| File picker → import | 🔲 Milestone 6 |
| Share card generation | 🔲 Milestone 8 |

---

## Next step: Milestone 1 — Data Layer

Implement `DiveLogRepository` for SQLite (mobile) using `expo-sqlite`:

```
apps/mobile/src/db/
├── schema.ts          # CREATE TABLE statements
├── migrations.ts      # Version-based migrations
└── SqliteDiveLogRepository.ts   # Implements DiveLogRepository interface
```

And for the web using IndexedDB (or a lightweight wrapper like `idb`):

```
apps/web/src/db/
└── IdbDiveLogRepository.ts
```

Both must implement the same `DiveLogRepository` interface from `@log-my-dive/core`.
