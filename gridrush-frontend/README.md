# GridRush — Real-Time Shared Grid Frontend

GridRush Frontend is a high-performance Next.js application powering the visual, interactive interface for GridRush. It connects to the GridRush authoritative backend via REST and persistent WebSockets to render a 400-block live canvas where players claim territory in real time.

---

## ✨ Features

- **Interactive 400-Cell Grid:** Responsive $20 \times 20$ CSS grid built for desktops, tablets, and mobile devices without horizontal overflow.
- **Zero-Friction Anonymous Play:** No email/password registration. Players choose a username and receive an anonymous profile with a server-assigned unique color.
- **Cross-Device Account Recovery:** Displays a 128-bit recovery code (`GR-XXXX-...`) once with one-click clipboard copying and confirmation dialogs.
- **Instantaneous Real-Time Synchronization:** Socket.IO client listening for remote captures with sub-100ms visual updates.
- **Automatic Reconnection Catch-Up:** Automatically fetches authoritative board state from the server on reconnect to reconcile any captures missed while offline.
- **Tactile UI & Micro-Interactions:**
  - Dynamic capture bounce animation (`@keyframes pop`).
  - Remote capture highlight beacon.
  - Race-condition conflict shake (`@keyframes shake`) with alert toasts.
  - Web Audio API haptic audio chimes for captures and conflicts.
- **Full Keyboard Accessibility:** Navigate the entire $20 \times 20$ grid using **Arrow Keys** and capture cells using **Space** or **Enter**.
- **Live Presence & Top 10 Leaderboard:** Displays real-time online players and a dynamic ranking table with medals (🥇, 🥈, 🥉).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS (Dark theme, custom animations)
- **Real-Time Client:** Socket.IO Client 4
- **Icons:** Lucide React

---

## 📁 Directory Structure

```
gridrush-frontend/
├── src/
│   ├── api/             # Typed API client with credentialed fetch wrappers
│   ├── app/             # Next.js App Router (layout, page, global CSS)
│   ├── components/
│   │   ├── board/       # GridBoard, GridCell, BoardLegend
│   │   ├── dashboard/   # StatsOverview HUD, Leaderboard
│   │   ├── layout/      # Sticky Header with live pills
│   │   └── player/      # WelcomeScreen, Create/Recover forms, RecoveryCode modal
│   ├── context/         # PlayerContext (auth state) & SocketContext (real-time hub)
│   ├── hooks/           # useBoard (board sync & claims)
│   ├── types/           # Shared TypeScript interfaces
│   └── utils/           # Web Audio API sound effects
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `gridrush-frontend/` root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

*For production (e.g. Vercel), set these to your deployed backend domain (e.g. `https://gridrush-api.onrender.com/api/v1` and `https://gridrush-api.onrender.com`).*

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

