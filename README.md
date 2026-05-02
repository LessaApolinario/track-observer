> 🇧🇷 Leia em Português: [README-pt-br.md](README-pt-br.md)

# Track Observer

A real-time music sharing and chat application. Connect your Spotify account, see what you are currently listening to, share it with a room of other listeners, and chat — all at once.

---

## Features

- **Spotify integration** — OAuth 2.0 login, automatic token refresh, current track polling
- **Room presence** — see what other participants in the room are currently listening to (MongoDB-backed with TTL auto-expiry)
- **Live chat** — in-memory message feed with anonymous users and custom nicknames
- **Track search** — filter visible room tracks locally without extra requests
- **Responsive UI** — Tailwind CSS grid layout from mobile to desktop
- **React 19 Compiler** — automatic memoization for optimal rendering performance

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| State | `use-context-selector` |
| HTTP Client | Axios |
| Database | MongoDB 7 (native driver) |
| WebSocket | ws |
| Testing | Jest 30, React Testing Library |
| Containerization | Docker Compose (MongoDB) |

---

## Architecture Overview

```
src/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout (providers)
│   └── api/
│       ├── spotify/          # OAuth login, callback, current-track
│       ├── chat/             # In-memory message store (GET / POST)
│       └── room/
│           └── current-tracks/  # MongoDB presence (GET / POST)
├── core/
│   ├── domain/models/        # ChatMessage, Track, User, RoomCurrentTrack
│   ├── infrastructure/mongodb/  # Connection client with global caching
│   ├── @types/spotify/       # Spotify API type definitions
│   └── mappers/              # SpotifyToTrackMapper
└── ui/
    ├── components/           # Chat panel, track cards, search
    └── contexts/             # ChatProvider, TrackProvider + hooks
```

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/spotify/login` | GET | Starts the OAuth 2.0 flow and redirects to Spotify |
| `/api/spotify/callback` | GET | Exchanges the auth code for tokens, stores them in secure cookies |
| `/api/spotify/current-track` | GET | Returns the currently playing track, refreshes token if needed |
| `/api/chat` | GET | Lists chat messages |
| `/api/chat` | POST | Sends a new chat message |
| `/api/room/current-tracks` | GET | Lists all room participants and their current tracks |
| `/api/room/current-tracks` | POST | Upserts or removes a user's track from the room |

---

## Setup

### Prerequisites

- Node.js 20+
- A Spotify Developer account
- Docker (for the local MongoDB instance)

---

### 1. Create a Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create an App** and fill in the name and description.
3. Open **Edit Settings** and add the following Redirect URI:
   ```
   http://localhost:3000/api/spotify/callback
   ```
4. Save and copy your **Client ID** and **Client Secret**.

---

### 2. Start MongoDB

```bash
docker compose up -d
```

This starts a MongoDB instance on port `8200` (configurable via `MONGO_HOST_SERVER_PORT`).

---

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Spotify
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
SPOTIFY_APP_BASE_URL=http://localhost:3000

# MongoDB
MONGO_URL=mongodb://root:password@localhost:8200
MONGO_DATABASE=track-observer
```

---

### 4. Install dependencies and run

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000), click **Conectar com Spotify**, and authorize the app.

---

## Running Tests

```bash
yarn test
```

Tests use Jest with React Testing Library and jsdom.

---

## Required Spotify Scopes

- `user-read-currently-playing`
- `user-read-playback-state`
