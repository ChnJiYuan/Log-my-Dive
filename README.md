# Log my Dive

A lightweight dive logbook app that helps divers record, import, and organize dive logs from multiple sources in one place — with accurate entry and exit times, diary notes, basic stats, and simple sharing.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (Expo) |
| Web | Vite + React (PWA) |
| Shared logic | TypeScript — no React dependency |
| Monorepo | Yarn Workspaces + Turborepo |
| Database (mobile) | SQLite via `expo-sqlite` |
| Database (web) | IndexedDB |
| Import parsing | papaparse (CSV), native JSON |

---

## Project Structure

```
log-my-dive/
├── apps/
│   ├── mobile/              # Expo React Native app (iOS + Android)
│   │   ├── app/             # Expo Router file-based screens
│   │   │   ├── (tabs)/
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
│           ├── DiveLogAdapter.ts
│           ├── CsvAdapter.ts
│           ├── JsonAdapter.ts
│           └── stubs/
│               ├── GarminAdapter.ts      → Coming soon
│               └── SubsurfaceAdapter.ts  → Coming soon
│
├── package.json             # Yarn workspaces root
├── turbo.json               # Turborepo task config
└── tsconfig.base.json       # Shared TypeScript config
```

---

## Setup

### Prerequisites

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **Yarn** 1.x — `npm install -g yarn`
- **Expo CLI** — `npm install -g expo-cli` (for mobile)

### Install dependencies

```bash
yarn install
```

Yarn workspaces installs dependencies for all packages and apps in one step.

### Run the mobile app

```bash
yarn dev:mobile
```

In the Expo dev menu:
- Press **i** to open in iOS Simulator
- Press **a** to open in Android Emulator
- Scan the QR code with **Expo Go** on your physical device

### Run the web app

```bash
yarn dev:web
```

Open [http://localhost:5173](http://localhost:5173) in your browser. To install as a PWA, use "Add to Home Screen" in Safari (iOS) or Chrome (Android).

---

## Feature Status

| Feature | Status |
|---------|--------|
| App navigation & routing | ✅ Done |
| DiveLog TypeScript types | ✅ Done |
| StatisticsService (pure functions) | ✅ Done |
| Unit conversion utils (metric ↔ imperial) | ✅ Done |
| CsvAdapter parser | ✅ Done |
| JsonAdapter parser | ✅ Done |
| Garmin / Subsurface stubs | ✅ Stubbed |
| SQLite database (mobile) | 🔲 Milestone 1 |
| IndexedDB (web) | 🔲 Milestone 1 |
| Dive log list screen | 🔲 Milestone 3 |
| Create / Edit / Delete log | 🔲 Milestone 4 |
| Log detail page | 🔲 Milestone 5 |
| CSV & JSON import UI | 🔲 Milestone 6 |
| Statistics page | 🔲 Milestone 7 |
| Share card generation | 🔲 Milestone 8 |

---

## Design Notes

- **All values stored in metric** — depth in metres, temperature in °C, pressure in bar, weight in kg. Display units are converted at render time based on user preferences.
- **Shared core package** — `packages/core` has no React or React Native dependency, so the same `StatisticsService` and `DiveLogRepository` interface runs on mobile, web, and in unit tests.
- **Adapter pattern for imports** — adding a new data source means adding one file in `packages/adapters/src/` and setting `isAvailable = true`. No other code changes needed.

---

## Further Reading

- [Setup Guide](Log%20my%20Dive/SETUP.md) — detailed setup and architecture notes
- [Milestones & Tasks](Log%20my%20Dive/milestones-and-tasks.md) — full project roadmap and task breakdown
