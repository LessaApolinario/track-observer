This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Spotify Integration

This project now includes Spotify OAuth and a server-side endpoint that reads the current playing track from your Spotify account using Route Handlers:

- `GET /api/spotify/login`: Starts OAuth flow
- `GET /api/spotify/callback`: Exchanges `code` for tokens and stores secure cookies
- `GET /api/spotify/current-track`: Returns the currently playing track mapped to the app model

### 1) Create your app on Spotify

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create an App**.
3. Fill in app name and description.
4. Open **Edit Settings**.
5. Add this Redirect URI:
	- `http://localhost:3000/api/spotify/callback`
6. Save settings.
7. Copy your **Client ID** and **Client Secret**.

### 2) Add environment variables

Create a `.env.local` file in the project root:

```bash
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

### 3) Run and authenticate

1. Start the project (`yarn dev` or `npm run dev`).
2. Open `http://localhost:3000`.
3. Click **Conectar com Spotify** when it appears.
4. Authorize the app.

After callback, the app polls `/api/spotify/current-track` and updates the track card automatically.

### Required Spotify scopes

- `user-read-currently-playing`
- `user-read-playback-state`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
