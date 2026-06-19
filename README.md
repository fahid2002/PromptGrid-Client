# PromptGrid Client

Next.js App Router frontend for the AI Prompt Sharing & Marketplace Platform.

**Live URL:** Add the Vercel production URL here after deployment.

## Features

- Mockup-faithful responsive light/dark UI
- Public home and server-filtered All Prompts pages
- JWT cookie login, registration and Google login
- Private prompt details with premium locking
- Bookmark, copy, review and reporting actions
- User, creator and admin dashboards
- Framer Motion, Recharts and React Toastify
- Stripe Checkout redirect and verified success state

## Run locally

1. Copy `.env.example` to `.env.local` and set `API_PROXY_TARGET`.
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:3000`.

For credential-free UI testing, run `npm run dev:memory` in the server project first. This starts a temporary MongoDB instance and never writes sample records into production.

## Routes

- Public: `/`, `/all-prompts`, `/login`, `/register`
- Private: `/prompts/[id]`, `/payment`, `/payment/success`, `/dashboard/**`
- User dashboard: Add Prompt, My Prompts, Saved Prompts, My Reviews, Profile
- Creator dashboard: Home analytics, Add Prompt, My Prompts, Analytics, Profile
- Admin dashboard: Users, Prompts, Payments, Reports, Analytics

## Main packages

Next.js, React, Tailwind CSS, Framer Motion, Recharts, React Toastify, Lucide React and Google OAuth.

## Deploy to Vercel

Import this directory as the project root. Set `API_PROXY_TARGET` to the Render API origin and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the same Google Web Client ID used by the API. Add the Vercel URL to the server's `CLIENT_URL`, Google authorized JavaScript origins and Stripe success/cancel configuration.

The rewrite in `next.config.mjs` keeps the JWT cookie on the frontend origin, so authenticated private routes remain valid after reload.

After deploying, verify every private route by opening it directly and refreshing it. Also add the Vercel origin to Google OAuth authorized origins and update the README Live URL.
