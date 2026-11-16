# GridRush — Real-Time Shared Grid Multiplayer App

A live multiplayer territory game played on a shared digital canvas of 400 blocks ($20 \times 20$ grid). Any visitor can instantly join, claim blocks, and see captures from all other online players in real time via WebSockets.

---

## 🌟 Architecture Overview

```
                                 Browser Client
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
          HTTP Mutations                               WebSocket Events
     (POST /cells/:id/claim)                       (board:cell-captured,
      with HttpOnly Cookie                               presence)
                │                                             │
                ▼                                             ▲
     ┌──────────────────────┐                       ┌─────────┴─────────┐
     │   Express REST API   │                       │   Socket.IO Hub   │
     │  (gridrush-backend)  │                       │  (gridrush-backend)│
     └──────────┬───────────┘                       └─────────▲─────────┘
                │                                             │
                ▼                                             │
     ┌────────────────────────────────────────────────────────┴─────────┐
     │                MongoDB Atlas Persistent Storage                  │
     │  - Atomic Conditional Claim (Cell.findOneAndUpdate)              │
     │  - Idempotent 400-Cell Seeding                                   │
     │  - Player Profiles & Keyed HMAC-SHA-256 Recovery Code Digests     │
     └──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
.
├── gridrush-backend/          # Node.js, Express, Socket.IO, MongoDB backend
│   ├── src/
│   │   ├── config/            # Database & environment configuration
│   │   ├── controllers/       # Route handlers (board, players, leaderboard)
│   │   ├── middleware/        # Cookie auth verification & centralized error handler
│   │   ├── models/            # Mongoose schemas (Player, Cell)
│   │   ├── routes/            # REST API endpoints (/api/v1/...)
│   │   ├── services/          # Atomic claims, seeder, recovery services
│   │   ├── sockets/           # Socket.IO connection, presence, broadcasting
│   │   ├── test/              # Concurrency and crypto logic test suite
│   │   └── utils/             # Crypto HMAC digests, JWT signing, color palette
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── gridrush-frontend/         # Next.js 14 App Router, TypeScript, Tailwind CSS
    ├── src/
    │   ├── api/               # Typed fetch client with credentials
    │   ├── app/               # Next.js App Router (layout, page, globals.css)
    │   ├── components/
    │   │   ├── board/         # GridBoard, GridCell, BoardLegend
    │   │   ├── dashboard/     # StatsOverview HUD, Leaderboard
    │   │   ├── layout/        # Header with live connection & presence pill
    │   │   ├── player/        # WelcomeScreen, forms, RecoveryCode modal
    │   │   └── ui/            # Reusable ConfirmModal (zero native browser alerts)
    │   ├── context/           # PlayerContext (auth state) & SocketContext (real-time)
    │   ├── hooks/             # useBoard (board state, claims, auto-reconnect sync)
    │   └── utils/             # Web Audio API haptic sound effects
    ├── .env.example
    ├── next.config.mjs
    ├── package.json
    └── tailwind.config.ts
```

---

## ⚡ Tech Stack

* **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, `socket.io-client`.
* **Backend:** Node.js, Express, TypeScript, Socket.IO, MongoDB Atlas, Mongoose.
* **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`) transmitted exclusively in `HttpOnly; SameSite; Secure` cookies; Node.js `crypto` (HMAC-SHA-256) for bearer recovery codes.

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd gridrush-backend
npm install
cp .env.example .env
# Edit .env and paste your MONGODB_URI, JWT_SECRET, RECOVERY_CODE_PEPPER
npm run dev
```
The backend will run on **http://localhost:5000**.

### 2. Frontend Setup
In a separate terminal:
```bash
cd gridrush-frontend
npm install
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## ☁️ Deployment Guide (Single GitHub Repository)

Because both the frontend and backend are in one repository, deployment to **Vercel** and **Render** is straightforward by specifying the root directory:

### 1. Backend on Render (Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **New Web Service** $\rightarrow$ Select this repository.
2. In the configuration:
   * **Root Directory:** Set to `gridrush-backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
3. Add Environment Variables:
   * `NODE_ENV`: `production`
   * `PORT`: `5000`
   * `MONGODB_URI`: *your connection string*
   * `JWT_SECRET`: *your secret*
   * `RECOVERY_CODE_PEPPER`: *your secret*
   * `CLIENT_URL`: `https://your-frontend-app.vercel.app`
4. Copy your backend URL: e.g. `https://gridrush-backend.onrender.com`.

### 2. Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) $\rightarrow$ **Add New Project** $\rightarrow$ Import this repository.
2. In the configuration:
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Click **Edit** and select **`gridrush-frontend`**
3. Add Environment Variables:
   * `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api/v1`
   * `NEXT_PUBLIC_SOCKET_URL`: `https://your-backend.onrender.com`
4. Click **Deploy**.

---

## 📋 Evaluation Questionnaire & System Design

### 1. Deployed App Link
* **Frontend:** `https://your-app-name.vercel.app`
* **Backend:** `https://your-backend-name.onrender.com`

### 2. GitHub Repository Link
* `https://github.com/your-username/real-time-grid-app`

### 3. Tech Stack Used
* **Next.js 14 App Router (Frontend):** Modern React architecture, optimized static page bundling, and fast client interactivity.
* **Tailwind CSS (Styling):** Responsive $20 \times 20$ grid container, dark palette, tactile states, and keyframe animations (`@keyframes pop` and `@keyframes shake`).
* **Node.js & Express (Backend):** Lightweight, asynchronous event-driven server managing REST state mutations and session cookies.
* **Socket.IO (Real-Time Layer):** Persistent full-duplex bi-directional connection for immediate capture broadcasts and active player presence tracking.
* **MongoDB Atlas & Mongoose (Database):** Authoritative single source of truth with document-level locking for atomic claim operations.

### 4. How did you handle real-time updates?
* **Authoritative Separation of Concerns:** Claims are submitted as HTTP `POST /api/v1/cells/:cellId/claim` requests with credentials.
* **Atomic Database Update:** Uses MongoDB's atomic conditional query:
  ```typescript
  const updatedCell = await Cell.findOneAndUpdate(
    { cellId, ownerId: null },
    { $set: { ownerId: player._id, claimedAt: new Date() } },
    { new: true }
  );
  ```
  If two players click simultaneously, MongoDB's document-level lock guarantees exactly one operation matches `{ ownerId: null }`. The loser receives `null` and is returned a `409 Conflict`.
* **Event Broadcast Pipeline:** Only after the database write succeeds does the server fire `io.emit('board:cell-captured', payload)` to all active sockets.
* **Reconnection Catch-up:** The client listens for socket reconnection. If a player was disconnected or asleep, reconnecting triggers an automatic REST fetch to reconcile any captures missed while offline.

### 5. What trade-offs did you make?
1. **REST for Mutations vs. Pure WebSockets:** REST was selected for claim actions to leverage standard HTTP status codes (`409 Conflict`, `401 Unauthorized`), automatic cookie exchange, and standard error handling without having to build a custom RPC correlation protocol over raw WebSocket frames.
2. **MongoDB Atomic Operations vs. Redis Distributed Locks:** For a 400-cell grid with hundreds of concurrent users, MongoDB's indexed conditional update handles thousands of operations per second with sub-10ms latency, eliminating the complexity and failure modes of dual-write cache invalidation.
3. **Fixed $20 \times 20$ Grid vs. Infinite Canvas:** A 400-cell bounded map creates natural territorial competition and immediate visual clarity without requiring virtualized canvas rendering.
4. **Anonymous Identity with Bearer Recovery Code vs. Email/Password:** Avoids onboarding friction while allowing cross-device portability without collecting personal data.

### 6. Any bonus features you added?
* **Zero-Friction Anonymous Identity:** Instant play with server-assigned accessible colors.
* **Cross-Device Account Recovery:** 128-bit cryptographic key (`GR-XXXX-...`) with copy-to-clipboard and rotation options.
* **Custom In-App Modal Dialogs:** Replaced all native browser `alert()` and `confirm()` calls with tailored confirmation modals.
* **Live Presence Tracking:** Real-time online counter deduplicated across multiple open tabs per player.
* **Dynamic Top 10 Leaderboard:** Live rankings with medal badges (🥇, 🥈, 🥉).
* **Tactile Micro-Interactions & Audio Feedback:** Web Audio API capture chimes, bounce animations, remote capture flash beacons, and conflict shake alerts.
* **Full Keyboard Accessibility:** Navigate the grid using **Arrow Keys** and capture cells using **Space** or **Enter**.

