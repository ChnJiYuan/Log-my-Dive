# Log my Dive — Project Milestones & Task Breakdown

> **Project:** Log my Dive — Personal Dive Logbook App
> **Mode:** Solo development
> **Timeline:** Flexible (priority-ordered, not date-bound)
> **Scope:** MVP only

---

## Overview

The MVP is organized into **8 milestones**, each building on the previous. Work through them in order — later milestones depend on foundational decisions made in earlier ones.

| # | Milestone | Key Output |
|---|-----------|------------|
| 0 | Foundation & Setup | Project scaffold, tech stack, design tokens |
| 1 | Data Layer | DiveLog schema, local database, CRUD API |
| 2 | Navigation & Shell | App shell, routing, bottom nav |
| 3 | Dive Log List | Home screen with log cards |
| 4 | Create / Edit / Delete Log | Full log form with time & depth fields |
| 5 | Log Detail Page | Full record view with diary section |
| 6 | Import (CSV & JSON) | Data import with adapter + dedup logic |
| 7 | Statistics Page | Personal dive summary & key metrics |
| 8 | Share Card | Shareable dive card with branding |

---

## Milestone 0 — Foundation & Setup

**Goal:** Everything needed before writing a single feature. Decisions made here affect every other milestone.

### Tasks

- [ ] **M0-1** Choose and document the tech stack
  - Mobile-first: React Native (Expo) recommended for cross-platform iOS/Android; alternatively a Progressive Web App (PWA) with React
  - Confirm database strategy: SQLite (local), AsyncStorage, or IndexedDB (PWA)
  - Decide on state management: Zustand or React Context for MVP
  - Decide on styling: NativeWind / Tailwind / StyleSheet

- [ ] **M0-2** Initialize the project repository
  - Create GitHub repo with a clear README
  - Set up `.gitignore`, `LICENSE`, and branch strategy (`main` + `dev`)
  - Configure linting and formatting (ESLint + Prettier)

- [ ] **M0-3** Define the design system
  - Set color tokens: deep ocean blue `#0A2342`, light blue `#4FC3F7`, coral accent `#FF6B6B`, white `#FFFFFF`, neutral grays
  - Set typography scale (font family, heading sizes, body size)
  - Set spacing scale (4px base unit)
  - Create a small component reference doc or Figma file

- [ ] **M0-4** Set up the project folder structure
  - `/src/screens` — one file per screen
  - `/src/components` — reusable UI components
  - `/src/models` — data types and schemas
  - `/src/services` — database access and business logic
  - `/src/adapters` — import adapter pattern (see Milestone 6)
  - `/src/utils` — shared helpers
  - `/assets` — icons, images, branding

- [ ] **M0-5** Create the core DiveLog data model
  - Define the `DiveLog` TypeScript interface (see Data Model section below)
  - Define the `User` interface
  - Define the `ImportSource` interface
  - Validate all field types and optionality

- [ ] **M0-6** Wire up the local database
  - Initialize SQLite (or chosen DB) with schema migrations
  - Confirm the DB opens correctly on app start
  - Write and test a basic `insert` and `select` query

---

## Milestone 1 — Data Layer

**Goal:** A complete, tested data access layer before any UI is built. Every screen will rely on this.

### Tasks

- [ ] **M1-1** Implement `DiveLogRepository` — create
  - `createDiveLog(log: Omit<DiveLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiveLog>`
  - Validate required fields: `date`, `entryTime`, `exitTime`
  - Auto-calculate `durationMinutes` from entry/exit times
  - Auto-assign `id` (UUID), `createdAt`, `updatedAt`

- [ ] **M1-2** Implement `DiveLogRepository` — read
  - `getAllDiveLogs(userId: string): Promise<DiveLog[]>` — sorted by date desc
  - `getDiveLogById(id: string): Promise<DiveLog | null>`
  - `getDiveLogsByDateRange(from: Date, to: Date): Promise<DiveLog[]>`

- [ ] **M1-3** Implement `DiveLogRepository` — update
  - `updateDiveLog(id: string, changes: Partial<DiveLog>): Promise<DiveLog>`
  - Recalculate `durationMinutes` if entry/exit time changes
  - Update `updatedAt` on every save

- [ ] **M1-4** Implement `DiveLogRepository` — delete
  - `deleteDiveLog(id: string): Promise<void>`
  - Soft delete preferred (add `deletedAt` field) to support future sync / undo

- [ ] **M1-5** Implement statistics queries
  - `getTotalDiveCount(userId: string): Promise<number>`
  - `getTotalDiveTimeMinutes(userId: string): Promise<number>`
  - `getMaxDepthRecord(userId: string): Promise<number>`
  - `getMostVisitedSites(userId: string, limit: number): Promise<{location: string, count: number}[]>`
  - `getDivesPerYear(userId: string): Promise<{year: number, count: number}[]>`
  - `getLastDive(userId: string): Promise<DiveLog | null>`

- [ ] **M1-6** Write unit tests for all repository methods
  - Use an in-memory SQLite instance for tests
  - Cover happy paths, edge cases (empty DB, missing optional fields), and error cases

---

## Milestone 2 — Navigation & App Shell

**Goal:** A working, navigable app with placeholder screens. The skeleton users will see throughout the project.

### Tasks

- [ ] **M2-1** Set up the navigation library
  - Install and configure React Navigation (or Expo Router)
  - Define the root navigation stack

- [ ] **M2-2** Build the bottom tab navigator with 5 tabs
  - **Home** (Dive Logs list)
  - **Add Log** (Create new log — direct action, not a screen in the tab bar per se, or a floating action button)
  - **Import** (Import / Sync)
  - **Stats** (Profile / Statistics)
  - **Settings**

- [ ] **M2-3** Create placeholder screens for each section
  - Each screen should show its name and a brief description
  - Confirms routing works end-to-end

- [ ] **M2-4** Build the global app header component
  - App name / logo on the left
  - Optional action icon on the right (search, filter)
  - Consistent across all screens

- [ ] **M2-5** Set up global state / context
  - User session state (for MVP: a single default user, no auth required)
  - Theme / unit preferences (metric vs. imperial)

- [ ] **M2-6** Apply design system tokens globally
  - Confirm colors, typography, and spacing render correctly
  - Test on both iOS and Android (or light/dark mode for PWA)

---

## Milestone 3 — Dive Log List (Home Screen)

**Goal:** The first real feature — a clean, scrollable list of dive logs.

### Tasks

- [ ] **M3-1** Build the `DiveLogCard` component
  - Display: location, date, entry/exit time, duration, max depth, avg depth, water temp, buddy, dive type, short note
  - Show sync/source badge (manual, CSV import, etc.)
  - Tappable — navigates to Log Detail screen

- [ ] **M3-2** Build the `DiveLogList` screen
  - Fetches all logs from `DiveLogRepository`
  - Renders a `FlatList` (or virtual scroll) of `DiveLogCard`
  - Shows empty state when no logs exist ("Log your first dive")
  - Shows loading state while fetching

- [ ] **M3-3** Add a Floating Action Button (FAB)
  - Positioned bottom-right
  - Taps navigate to Create Log screen
  - Matches coral accent color from design system

- [ ] **M3-4** Add search / filter (optional for MVP, recommended)
  - Filter by date range
  - Filter by location name
  - Keeps UX simple — no complex multi-filter UI

- [ ] **M3-5** Sort logs by date (most recent first)
  - Confirm descending order from the data layer
  - Optional: toggle to sort ascending

---

## Milestone 4 — Create / Edit / Delete Dive Log

**Goal:** The core input flow. This is the most complex screen in the MVP.

### Tasks

- [ ] **M4-1** Build the `CreateLogScreen` layout
  - Scrollable form with clearly labelled sections:
    - **When & Where** (date, entry time, exit time, location, GPS)
    - **Dive Data** (max depth, avg depth, water temp, visibility)
    - **Equipment** (tank type, start/end pressure, weight)
    - **People** (buddy, guide/instructor)
    - **Conditions** (sea condition, dive type)
    - **Personal** (mood rating, notes, photos)

- [ ] **M4-2** Implement date & time pickers
  - Date picker (calendar UI)
  - Entry time picker (HH:MM)
  - Exit time picker (HH:MM)
  - Auto-calculate and display `durationMinutes` in real time as the user changes either time

- [ ] **M4-3** Implement location input
  - Free-text location name
  - Optional: "Use my current GPS coordinates" button
  - Store latitude/longitude alongside the name

- [ ] **M4-4** Implement numeric depth/pressure/weight fields
  - Respect the global unit setting (metric: m, bar, kg / imperial: ft, psi, lbs)
  - Show unit label inline next to each field

- [ ] **M4-5** Implement mood/experience rating
  - 1–5 star or emoji rating selector
  - Stored as a number

- [ ] **M4-6** Implement photo attachment
  - Pick from device photo library
  - Store as local file URI (not base64 in DB)
  - Show thumbnail preview in the form
  - Allow removal of attached photos

- [ ] **M4-7** Implement form validation
  - Required: `date`, `entryTime`, `exitTime`, `locationName`
  - Validate exit time is after entry time
  - Show inline error messages (not just a toast)

- [ ] **M4-8** Wire form to `DiveLogRepository.createDiveLog()`
  - On submit: save, show success feedback, navigate back to log list
  - Show a saving spinner during async operation

- [ ] **M4-9** Build the `EditLogScreen`
  - Reuse the same form layout as Create
  - Pre-populate all fields from the existing `DiveLog` record
  - Wire to `DiveLogRepository.updateDiveLog()`

- [ ] **M4-10** Implement delete with confirmation
  - Show a confirmation dialog ("Delete this dive log? This cannot be undone.")
  - Wire to `DiveLogRepository.deleteDiveLog()`
  - On confirm: delete and navigate back to log list

---

## Milestone 5 — Log Detail Page

**Goal:** A read-only view that presents all dive data clearly, plus the diary section.

### Tasks

- [ ] **M5-1** Build the `LogDetailScreen` layout
  - Header: location + date, large and prominent
  - Section blocks (same groupings as the form): Dive Data, Equipment, People, Conditions
  - Render each field as a label/value pair

- [ ] **M5-2** Build the dive diary section
  - Display notes in a readable card
  - Show photos in a horizontal scroll gallery
  - Show mood rating visually (stars/emoji)

- [ ] **M5-3** Add edit and delete actions
  - "Edit" button in the screen header or a contextual menu
  - "Delete" in a destructive action area at the bottom (or in the menu)

- [ ] **M5-4** Display the source/sync badge
  - Show whether this record was entered manually, imported from CSV, JSON, etc.
  - Show `createdAt` and `updatedAt` timestamps in a subtle footer

- [ ] **M5-5** Add a "Share" action button
  - Placeholder that links to the sharing feature (Milestone 8)
  - Can show "Coming soon" for now, or wire up once M8 is done

---

## Milestone 6 — Data Import (CSV & JSON)

**Goal:** Divers can bring in records from external sources. This is a key product differentiator.

### Tasks

- [ ] **M6-1** Define the canonical `DiveLog` import format
  - Document the expected CSV column headers
  - Document the expected JSON schema
  - Publish both as a template file users can reference

- [ ] **M6-2** Build the Adapter base interface
  ```
  interface DiveLogAdapter {
    sourceName: string;
    sourceType: 'csv' | 'json' | 'api';
    parse(rawData: string | object): Partial<DiveLog>[];
    validate(record: Partial<DiveLog>): boolean;
  }
  ```

- [ ] **M6-3** Implement `CsvAdapter`
  - Parse CSV using a library (e.g., `papaparse`)
  - Map CSV columns to `DiveLog` fields
  - Handle missing or malformed columns gracefully
  - Return an array of `Partial<DiveLog>` records

- [ ] **M6-4** Implement `JsonAdapter`
  - Accept either a single object or an array
  - Map JSON keys to `DiveLog` fields
  - Handle snake_case and camelCase variants

- [ ] **M6-5** Implement deduplication logic
  - A duplicate is defined as: same `date` + `entryTime` + `exitTime` + `locationName` + `maxDepth`
  - On import, check each incoming record against existing records
  - Present the user with: "X records imported, Y duplicates skipped"
  - Optional: allow the user to force-overwrite a duplicate

- [ ] **M6-6** Build the `ImportScreen` UI
  - "Import CSV" button — opens device file picker filtered to `.csv`
  - "Import JSON" button — opens device file picker filtered to `.json`
  - After file selection: parse, validate, show a preview of records to import
  - Confirm import button — saves all validated records to DB

- [ ] **M6-7** Show import history
  - List previous import operations with: source type, date imported, record count
  - Stored in `ImportSource` table

- [ ] **M6-8** Add placeholder architecture for future sync sources
  - Create stub adapters for: `GarminAdapter`, `SubsurfaceAdapter`, `PadiAdapter`
  - Each stub throws `NotImplementedError` with a message
  - Display these as "Coming soon" options in the Import screen

---

## Milestone 7 — Statistics Page

**Goal:** A clean, motivating summary of the diver's history. Not a dashboard — a personal record.

### Tasks

- [ ] **M7-1** Build the `StatsScreen` layout
  - Clean card-based layout, not a chart-heavy dashboard
  - Each stat is a clearly labelled card with a large number

- [ ] **M7-2** Implement and display top-line stats
  - Total number of dives
  - Total dive time (formatted as hours and minutes)
  - Maximum depth ever recorded
  - Last dive date + location

- [ ] **M7-3** Implement and display "Most visited dive sites"
  - Top 5 locations by dive count
  - Simple ranked list — no map needed for MVP

- [ ] **M7-4** Implement and display "Dives per year"
  - Year-by-year bar chart or simple list
  - Use a lightweight chart library (e.g., `react-native-chart-kit`) or render as a visual bar using plain styling

- [ ] **M7-5** Display connected/imported data sources
  - List of sources that have contributed records (manual, CSV, JSON)
  - Record count per source

- [ ] **M7-6** Handle empty states gracefully
  - "Start logging dives to see your stats" when no records exist

---

## Milestone 8 — Share Card

**Goal:** Let divers share a beautiful summary card from any dive log.

### Tasks

- [ ] **M8-1** Design the share card layout
  - Card dimensions: ~1080×1350px (portrait 4:5 ratio, Instagram-friendly)
  - Content: location, date, max depth, duration, entry/exit time, one photo (or a default ocean image), short note, "Log my Dive" wordmark + logo

- [ ] **M8-2** Implement card generation
  - Render the card as an off-screen view
  - Capture it as a PNG using `react-native-view-shot` (or `html2canvas` for PWA)

- [ ] **M8-3** Implement the share action
  - Use the native share sheet (`Share.share()` in React Native) to share the PNG
  - Allow saving to device camera roll
  - Keep the flow simple: one tap to generate, one tap to share

- [ ] **M8-4** Add the "Share" button to `LogDetailScreen`
  - Wire up the button from M5-5
  - Show a brief loading state while the card renders

---

## Milestone 9 — Settings & Polish

**Goal:** Make the app feel complete and production-ready before shipping.

### Tasks

- [ ] **M9-1** Build the `SettingsScreen`
  - Unit preference toggle: metric (m, °C, bar, kg) / imperial (ft, °F, psi, lbs)
  - App version display
  - "Clear all data" option (with confirmation dialog)
  - Placeholder for future: Account / Cloud Sync

- [ ] **M9-2** Apply unit preferences globally
  - All depth, temperature, pressure, and weight fields respect the selected unit
  - Convert stored values (always stored in metric) to the display unit at render time

- [ ] **M9-3** Accessibility pass
  - All interactive elements have accessibility labels
  - Minimum touch target size: 44×44px
  - Text contrast meets WCAG AA minimum

- [ ] **M9-4** Performance review
  - Log list renders smoothly with 100+ records (test with seed data)
  - No unnecessary re-renders in the form screen
  - Images are loaded lazily in the log list

- [ ] **M9-5** Error handling & edge cases
  - Graceful handling of DB errors (show user-friendly message, log details)
  - Graceful handling of file import errors (bad format, empty file)
  - Handle app backgrounding mid-form without data loss

- [ ] **M9-6** Seed data script
  - Create a developer script that inserts 20–50 realistic sample dive logs
  - Useful for testing list performance, stats, and the share card

- [ ] **M9-7** Final QA pass
  - Test all user flows end-to-end on a real device (iOS and/or Android)
  - Fix any layout issues on small screens (375px width minimum)
  - Confirm all MVP features from the requirements are present

---

## Data Model Reference

```typescript
interface DiveLog {
  id: string;                     // UUID
  userId: string;
  source: 'manual' | 'csv' | 'json' | 'garmin' | 'subsurface' | string;
  sourceRecordId?: string;        // Original ID from external source

  // Time
  date: string;                   // ISO 8601 date (YYYY-MM-DD)
  entryTime: string;              // HH:MM (24h)
  exitTime: string;               // HH:MM (24h)
  durationMinutes: number;        // Calculated from entryTime / exitTime

  // Location
  locationName: string;
  latitude?: number;
  longitude?: number;

  // Dive data
  maxDepth?: number;              // Stored in metres
  averageDepth?: number;          // Stored in metres
  waterTemperature?: number;      // Stored in °C
  visibility?: number;            // Stored in metres

  // Equipment
  tankType?: string;
  startPressure?: number;         // Stored in bar
  endPressure?: number;           // Stored in bar
  weight?: number;                // Stored in kg

  // People
  buddy?: string;
  instructor?: string;

  // Conditions & type
  diveType?: string;              // e.g. 'recreational', 'night', 'drift'
  seaCondition?: string;          // e.g. 'calm', 'choppy', 'strong current'

  // Personal
  moodRating?: number;            // 1–5
  notes?: string;
  photos?: string[];              // Array of local file URIs

  // Metadata
  createdAt: string;              // ISO 8601 datetime
  updatedAt: string;              // ISO 8601 datetime
  deletedAt?: string;             // Soft delete
}

interface ImportSource {
  id: string;
  name: string;
  type: 'manual' | 'csv' | 'json' | 'api';
  status: 'active' | 'error' | 'pending';
  recordCount: number;
  lastSyncedAt?: string;
}
```

---

## MVP Feature Checklist

Use this as your final ship gate — all items must be checked before the MVP is considered done.

- [ ] Dive log list with all required card fields
- [ ] Create dive log with entry/exit time and auto-calculated duration
- [ ] Edit dive log
- [ ] Delete dive log (with confirmation)
- [ ] Dive detail page with diary section
- [ ] CSV import with deduplication
- [ ] JSON import with deduplication
- [ ] Statistics page with top-line metrics
- [ ] Share card generation and export
- [ ] Unit preference (metric / imperial)
- [ ] Empty states on all screens
- [ ] Tested on a real device

---

*Document last updated: 2026-05-11*
*Project: Log my Dive — MVP*
