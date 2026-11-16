# GridRush — Real-Time Shared Grid Backend

GridRush Backend is a high-concurrency Node.js, Express, TypeScript, and Socket.IO service that powers the real-time multiplayer grid game. It manages player identities, persists 400 grid cells in MongoDB, enforces atomic conflict resolution, and broadcasts live captures to connected clients.

---

## 🚀 Features

- **Authoritative Backend:** The server is the single source of truth for cell ownership, game state, and validation.
- **Atomic Concurrency Handling:** Utilizes MongoDB conditional atomic updates (`Cell.findOneAndUpdate({ cellId, ownerId: null }, ...)`) ensuring exactly one winner during simultaneous capture attempts without race conditions.
- **Real-Time WebSocket Pub/Sub:** Socket.IO server broadcasting `board:cell-captured` and `presence:count` events.
- **Anonymous Identity & Bearer Recovery Codes:** Instant onboarding without passwords or emails. Generates a 128-bit high-entropy recovery code (`GR-XXXX-...`) stored exclusively as a keyed HMAC-SHA-256 digest with server pepper.
- **Secure JWT Session Cookies:** Tokens are signed with `JWT_SECRET` and transmitted via `HttpOnly; SameSite; Secure` cookies.
- **Idempotent 400-Cell Seeding:** Automatically initializes missing cells on startup without wiping existing cell claims on server restarts.
- **Dynamic Leaderboard:** Real-time aggregation of top capturing players directly from MongoDB.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v20+ / v22+)
- **Language:** TypeScript (Strict mode, ES2022, NodeNext)
- **Framework:** Express 4
- **Real-Time Layer:** Socket.IO 4
- **Database:** MongoDB Atlas with Mongoose 8
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `cookie-parser`
- **Security:** Node.js `crypto` (HMAC-SHA-256, `randomBytes`)

---

## 📁 Architecture Overview

```
gridrush-backend/
├── src/
│   ├── config/          # Environment variables & MongoDB connection
│   ├── controllers/     # Express route handlers (board, player, leaderboard)
│   ├── middleware/      # Auth cookie verification & centralized error handler
│   ├── models/          # Mongoose schemas (Player, Cell)
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic (atomic claims, recovery, leaderboard)
│   ├── sockets/         # Socket.IO hub, presence tracking, handshake auth
│   ├── test/            # Concurrency and crypto logic verification tests
│   ├── utils/           # Crypto digests, JWT helpers, accessible palette
│   ├── app.ts           # Express application setup & middleware pipeline
│   └── server.ts        # HTTP server, Socket.IO binding, and startup seeder
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 📡 REST API Contract

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/health` | No | Server health check and uptime status |
| `POST` | `/players` | No | Create anonymous player; returns one-time recovery code and sets session cookie |
| `POST` | `/players/recover` | No | Recover account using code; sets session cookie |
| `GET` | `/players/me` | Yes (`HttpOnly` Cookie) | Get profile and claimed cell count of current player |
| `POST` | `/players/recovery-code/rotate` | Yes (`HttpOnly` Cookie) | Invalidate old code and issue new one-time recovery code |
| `POST` | `/players/logout` | No | Clear session cookie |
| `GET` | `/board` | No | Get all 400 cells and board summary statistics |
| `POST` | `/cells/:cellId/claim` | Yes (`HttpOnly` Cookie) | Atomically claim block `cellId` (0..399) |
| `GET` | `/leaderboard` | No | Get top 10 players sorted by claimed cell count |

---

## ⚡ WebSocket Event Contract

The Socket.IO server requires credentials (`withCredentials: true`) to parse the `gridrush_session` cookie during handshake.

### Server $\rightarrow$ Client Events:
* **`board:cell-captured`**: Emitted to **all** connected clients when any player successfully claims a cell.
  ```json
  {
    "cellId": 142,
    "owner": {
      "id": "65e6834d92fa123456789abc",
      "username": "NovaKnight",
      "color": "#3B82F6"
    },
    "claimedAt": "2026-11-16T12:00:00.000Z"
  }
  ```
* **`presence:count`**: Emitted to all clients when the online player count changes.
  ```json
  { "count": 5 }
  ```
* **`presence:initial`**: Emitted to a newly connecting socket during initial handshake.

---

## ⚙️ Environment Variables

Create a `.env` file in the `gridrush-backend/` root:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_minimum_32_characters
RECOVERY_CODE_PEPPER=your_recovery_pepper_secret_minimum_32_characters
SESSION_COOKIE_NAME=gridrush_session
SESSION_MAX_AGE_DAYS=30
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Verification Tests
Runs automated cryptographic, token lifecycle, and atomic concurrency race simulation tests:
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

