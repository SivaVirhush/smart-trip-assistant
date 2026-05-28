# Incredible Heritage

Guest-mode heritage travel web app.

## Features

- AI guide for heritage questions.
- AI calendar for temporary trip plans.
- Cultural maps with routes and traffic.
- Live traffic view.
- Current-affairs feed.

## Local Setup

Backend:

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
copy .env.example .env
npm install
npm start
```

Open `http://localhost:3000`.

## Before Pushing To Git

- Keep real `.env` files out of Git.
- Commit `.env.example` files only.
- Run:

```bash
cd frontend
npm run build
```

## Frontend Routes

The frontend uses client-side routes:

- `/`
- `/guest`
- `/chat`
- `/chat/new`
- `/chat/:chatId`
- `/features`
- `/calendar`
- `/cultural-maps`
- `/live-traffic`
- `/current-affairs`
