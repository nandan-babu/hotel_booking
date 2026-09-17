# Raintech Hotel Room Booking

> **Developer Skills Assessment** — Raintech Software Limited  
> A modern, fully front-end hotel room booking application built as a practical demonstration of clean architecture, real-world React patterns, and production-quality UI.

---

## Overview

This project is a single-page hotel booking application built without any backend, database, or authentication system. All data is managed in client-side React state with localStorage persistence, demonstrating that a polished, feature-complete product can be delivered using front-end technologies alone.

The application covers the full guest journey — from discovering available rooms, selecting dates, confirming a booking, and reviewing it in a real-time admin dashboard.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component architecture with hooks |
| **TypeScript** (Strict Mode) | Type-safe, maintainable code |
| **Vite** | Blazing-fast build tool and dev server |
| **Tailwind CSS v3** | Utility-first styling, no custom CSS required |
| **React Router v6** | Client-side routing (`/`, `/bookings`, `/dashboard`) |
| **Lucide React** | Consistent, minimal SVG icon system |
| **date-fns** | Reliable, timezone-safe date arithmetic |
| **Vitest** | Unit testing for core business logic |

---

## Features

### 🏨 Booking Flow

- **Room Discovery** — Browse 5 curated rooms (Deluxe, Executive Suite, Family Room) displayed in a responsive card grid with photorealistic AI-generated image
s.
- **Date Selection** — Check-in and check-out date pickers with dynamic minimum date enforcement (today's date, computed at runtime — never hardcoded).
- **Guest Filtering** — Filter rooms by guest capacity; rooms that cannot accommodate the selected number of guests are automatically hidden.
- **Room Selection** — Single room selection with a clear visual state (teal border, checkmark badge, scale animation). Clicking the same room deselects it.
- **Availability Checking** — Rooms are marked as unavailable with a blurred overlay if the requested date range overlaps with any existing booking (using strict `checkIn < existingOut && checkOut > existingIn` overlap logic).
- **Guest Details** — Optional guest name and email captured inline before confirming.
- **Booking Summary Sidebar** — A sticky card on desktop (inline on mobile) that live-updates every time dates, guests, or room selection changes. Displays room photo, dates, night count, price per night, and total.
- **Booking Confirmation Modal** — Polished modal with a generated booking reference (`RT-XXXXX`), full stay receipt, and a direct link to the dashboard.

### ✅ Validation

Every input edge case is handled explicitly and surfaced to the user as an inline message — `alert()` is never used.

| Scenario | Error Message |
|---|---|
| No check-in date | "Please select a check-in date." |
| Check-in is in the past | "Check-in date cannot be in the past." |
| No check-out date | "Please select a check-out date." |
| Check-out ≤ check-in | "Check-out date must be after check-in." |
| No room selected | Confirm button disabled |
| Dates invalid | Confirm button disabled |

### 📊 Admin Dashboard (`/dashboard`)

- **Animated Statistics** — 4 KPI cards (Total Bookings, Active, Upcoming, Total Revenue) animate their counts from 0 to the live value using a cubic ease-out `requestAnimationFrame` loop every time the page loads.
- **Live Data** — All statistics are calculated from real booking state — nothing is hardcoded in the dashboard.
- **Recent Bookings Table** — Full booking history with colour-coded status badges (Confirmed, Upcoming, Active, Completed, Cancelled), sorted newest first.
- **Room Overview** — Per-room occupancy status (`Available` / `Occupied`) calculated dynamically using `checkIn ≤ today < checkOut`.
- **Occupancy Gauge** — Percentage progress bar and visual room dot indicators reflecting the current occupancy rate.
- **Quick Actions** — One-click navigation to New Booking, All Bookings, or the Rooms list.

### 📋 Bookings Management (`/bookings`)

- **Search** — Filter bookings by Booking ID, guest name, or room code.
- **Status Filter** — Filter by Upcoming, Active, Completed, Confirmed, or Cancelled.
- **Room Filter** — Filter by specific room code.
- **Sort** — Sort by Newest or Oldest first.
- **Empty State** — Friendly illustration with a direct call-to-action when no bookings exist.

### 💾 Persistence

All bookings are persisted to `localStorage` automatically on every state change. Refreshing the browser preserves the full booking history. No backend, no server — state management handled entirely in the `BookingContext`.

### 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| **Mobile** (< 640px) | Single column, stacked cards, full-width inputs |
| **Tablet** (640–1024px) | 2-column room grid, summary below rooms |
| **Desktop** (> 1024px) | 2–3 column room grid, sticky summary sidebar |

---

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.tsx        # Top navigation with active route highlighting
│   ├── BookingSearch.tsx # Hero section + date/guest search card
│   ├── RoomCard.tsx      # Individual room card with selection state
│   ├── GuestFilter.tsx   # Guest capacity filter dropdown
│   ├── BookingSummary.tsx # Sticky booking summary / price breakdown
│   ├── BookingConfirmation.tsx # Post-booking confirmation modal
│   ├── StatCard.tsx      # Animated KPI metric card
│   ├── BookingTable.tsx  # Bookings table with status badges
│   └── RoomOverview.tsx  # Per-room availability list
│
├── pages/                # Route-level page components
│   ├── BookingPage.tsx   # Main booking flow (route: /)
│   ├── DashboardPage.tsx # Admin dashboard (route: /dashboard)
│   └── BookingsPage.tsx  # Booking management (route: /bookings)
│
├── context/
│   └── BookingContext.tsx # Global booking state + localStorage persistence
│
├── hooks/
│   └── useCountUp.ts     # requestAnimationFrame count-up animation hook
│
├── data/
│   └── rooms.ts          # Hardcoded room data + existing mock bookings
│
├── utils/
│   ├── bookingUtils.ts   # Pure functions: calculateNights, validateDates, checkAvailability
│   └── bookingUtils.test.ts # Vitest unit test suite
│
├── App.tsx               # BrowserRouter + BookingProvider root
└── main.tsx              # React DOM entry point
```

---

## Core Logic

### Night Calculation

```ts
calculateNights("2026-09-15", "2026-09-18") // → 3
calculateNights("2026-09-15", "2026-09-15") // → 0 (invalid, same day)
calculateNights("2026-09-18", "2026-09-15") // → 0 (invalid, checkout before checkin)
```

Dates are parsed using `date-fns/parseISO` and normalized to midnight with `startOfDay` to eliminate any timezone or DST offset issues.

### Price Calculation

```ts
totalPrice = nights × pricePerNight
// e.g. 3 × ₹3,500 = ₹10,500
```

### Availability Overlap

```ts
// A room is UNAVAILABLE if:
existingCheckIn < requestedCheckOut && existingCheckOut > requestedCheckIn
```

Touching boundaries (e.g. checkout on the same day as a new check-in) are treated as available — guests checking out free the room for the next arrival.

---

## Run Locally

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation & Development

```bash
# Clone or navigate to the project directory
cd "hotel booking"

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at **http://localhost:5173**

### Production Build

```bash
npm run build        # Compile TypeScript and bundle with Vite
npm run preview      # Preview the production build locally
```

---

## Testing

Unit tests are written with **Vitest** and cover the core pure-function logic layer, completely isolated from React.

```bash
npm run test
```

### Test Coverage

| Test Case | Expected Result |
|---|---|
| Valid 3-night stay (Sep 15 → Sep 18) | Returns `3` |
| Valid 1-night stay | Returns `1` |
| Same-day dates | Returns `0` (invalid) |
| Checkout before check-in | Returns `0` (invalid) |
| Empty date strings | Returns `0` |
| Price: 3 nights × ₹3,500 | Returns `₹10,500` |
| Price: 2 nights × ₹5,800 | Returns `₹11,600` |
| Check-in in the past | `checkIn` error returned |
| Valid today check-in | No `checkIn` error |
| Booking overlap detection | Returns `false` (unavailable) |
| Touching boundaries (A checks out, B checks in same day) | Returns `true` (available) |

---

## Design Decisions

**Why no UI library?**  
Tailwind CSS provides full design control without the overhead of an opinionated component library. Every visual detail — shadows, radii, spacing — is explicitly defined.

**Why date-fns instead of native Date?**  
JavaScript's `Date` constructor is notoriously inconsistent with timezone handling. Parsing `"2026-09-15"` natively may produce September 14th in UTC-offset environments. `date-fns/parseISO` with `startOfDay` eliminates this class of bug entirely.

**Why Context + localStorage instead of a state manager?**  
The application has a single shared concern (booking state). A full state manager like Redux or Zustand would be over-engineering for this scope. A single React Context with `useReducer`-style helpers is readable, testable, and perfectly suited.

**Why `requestAnimationFrame` for count-up animation?**  
Browser-native `rAF` syncs with the display refresh rate (60fps), producing silky smooth animations without any external animation library dependency.

---

## Improvements With More Time

Given additional development time, the following enhancements would be prioritised:

| Area | Improvement |
|---|---|
| **Backend Integration** | REST or GraphQL API to persist bookings server-side |
| **Authentication** | Guest login to view and manage personal booking history |
| **Payment Processing** | Stripe integration for real payment flows |
| **Real Availability** | Live room availability via backend, preventing race conditions |
| **Calendar View** | Visual date picker showing blocked dates per room |
| **Email Confirmation** | Transactional email with booking receipt on confirmation |
| **Admin Controls** | Ability to cancel, modify, or manually create bookings from the dashboard |
| **Internationalisation** | Multi-currency and multi-language support |
| **Accessibility Audit** | Full WCAG 2.1 AA compliance testing and remediation |

---

## Room Data

| Code | Type | Price | Max Guests |
|---|---|---|---|
| R101 | Deluxe Room | ₹3,500 / night | 2 |
| R102 | Deluxe Room | ₹3,500 / night | 2 |
| R201 | Executive Suite | ₹5,800 / night | 3 |
| R202 | Executive Suite | ₹5,800 / night | 3 |
| R301 | Family Room | ₹4,200 / night | 4 |

---

## Verification Checklist

- [x] Displays all 5 sample rooms
- [x] Check-in date selection with today as minimum
- [x] Check-out date selection strictly after check-in
- [x] Single room selection with clear visual feedback
- [x] Night count calculated correctly
- [x] Total price calculated correctly
- [x] All validation messages displayed inline
- [x] Booking confirmation with generated reference
- [x] Dashboard statistics computed from live booking data
- [x] Bookings persisted to localStorage across page refreshes
- [x] Fully responsive on mobile, tablet, and desktop

---

*Built for the Raintech Software Limited Developer Skills Assessment.*
