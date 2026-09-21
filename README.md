# PromptGrid Client

Next.js App Router frontend for **PromptGrid**, an AI Prompt Sharing & Marketplace Platform where users can browse, save, review, and unlock premium AI prompts.

## Live Links

* **Client App:** https://promptgrid-client.vercel.app
* **Server API:** https://promptgrid-server-fahid2002.onrender.com
* **Server Health:** https://promptgrid-server-fahid2002.onrender.com/api/health

## Features

* Responsive light and dark mode UI
* Public landing page
* Server-filtered All Prompts marketplace
* Search, category, tool, difficulty, sort, and visibility filters
* Free and premium prompt badges
* Premium/private prompts shown as locked cards for free users
* Prompt details page
* JWT cookie authentication
* Email/password registration and login
* Google login support
* Bookmark prompt functionality
* Copy prompt functionality
* Review and rating system
* Prompt reporting feature
* User dashboard
* Creator dashboard
* Admin dashboard
* Stripe Checkout redirect for premium access
* Verified payment success page
* Notification bell with unread count
* Analytics charts with Recharts
* Toast notifications with React Toastify
* Framer Motion animations
* Protected AI Tools workspace with Gemini-powered tools
* Prompt Builder and Optimizer
* Prompt Playground for testing prompts with custom input
* AI Prompt Review for safety and quality feedback
* Semantic Prompt Search by meaning
* Authenticated PromptGrid AI Assistant with typing state and chat history
* Optional TOTP-based multi-factor authentication setup and login verification
* Responsive collapsible menus for dashboard, AI Tools, and marketplace filters
* Responsive mobile header actions for theme and notifications
* FAQ, Privacy Policy, and Terms pages
* GitHub and LinkedIn social links in the footer

## Tech Stack

* Next.js
* React
* Tailwind CSS
* Framer Motion
* Recharts
* React Toastify
* Lucide React
* Google OAuth
* TOTP MFA setup and verification flow
* Vercel

## Project Structure

```txt
promptgrid-client/
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   └── utils/
├── public/
├── next.config.mjs
├── package.json
└── README.md
```

## Environment Variables

Create a `.env.local` file in the root of the client project.

For local backend testing:

```env
API_PROXY_TARGET=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_PROJECT_ID=your_google_project_id
```

For deployed backend testing:

```env
API_PROXY_TARGET=https://promptgrid-server-fahid2002.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_PROJECT_ID=your_google_project_id
```

The current payment flow uses backend Stripe Checkout, so `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is not required in this version.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The client will run on:

```txt
http://localhost:3000
```

## Build Project

```bash
npm run build
```

## Start Production Build Locally

```bash
npm run start
```

## API Proxy

The client uses Next.js rewrites to proxy frontend API requests.

Example frontend request:

```txt
/api/prompts
```

is forwarded to:

```txt
https://promptgrid-server-fahid2002.onrender.com/api/prompts
```

when `API_PROXY_TARGET` is set to the deployed Render server.

This keeps frontend API calls clean and helps authentication cookies work correctly on the frontend origin.

## Routes

```txt
/                  Home page
/all-prompts       All prompts marketplace
/prompts/[id]      Prompt details page
/login             Login page
/register          Register page
/dashboard         User, creator, and admin dashboard
/payment           Premium payment page
/payment/success   Payment success page
/ai-tools          Private Gemini AI tools workspace
/faq               Frequently asked questions
/privacy           Privacy policy
/terms             Terms of service
```

## AI Tools

The AI Tools route is private and requires authentication. It provides:

```txt
Prompt Builder      Turn a rough idea into a reusable prompt
Prompt Playground   Run a prompt against custom input
Prompt Review       Review safety, quality, and improvement suggestions
Semantic Search     Find approved public prompts by meaning
```

The floating PromptGrid Assistant is also available to authenticated users across the main application pages. Chat history is stored per authenticated user in browser storage and is cleared when the user logs out.

AI requests are sent through the client API proxy, so the Gemini API key is never exposed in the browser.

## Dashboard Access

```txt
User Dashboard:
- Add Prompt
- My Prompts
- Saved Prompts
- My Reviews
- Profile

Creator Dashboard:
- Home Analytics
- Add Prompt
- My Prompts
- Analytics
- Profile

Admin Dashboard:
- Users
- Prompts
- Payments
- Reports
- Analytics
```

## Authentication and Account Security

The client supports email/password authentication, Google OAuth, role-aware navigation, protected dashboard routes, protected AI Tools routes, and optional multi-factor authentication.

MFA setup is available from the authenticated Profile dashboard:

```txt
Profile
→ Enable MFA
→ Scan the QR code in an authenticator app
→ Enter the six-digit code
→ Save the one-time recovery codes
```

When MFA is enabled, both email/password login and Google login pause at a short-lived verification screen. The user must enter an authenticator code or a recovery code before the server creates a session. During verification the client displays a loading toast so the user can see that authentication is being checked.

The client never receives or stores the MFA secret, encryption key, Gemini API key, JWT secret, database URL, or Stripe secret. Sensitive operations go through the server API proxy with HTTP-only authentication cookies.

## Responsive Experience

The application has mobile-specific navigation behavior while preserving the desktop layout:

* Mobile header keeps theme toggle, notifications, and hamburger controls beside the logo.
* Dashboard sidebar becomes a collapsible admin menu on small screens.
* AI Tools sidebar becomes a collapsible four-tool menu on small screens.
* All Prompts filters open inside a mobile Search & Filters panel and close after Search is selected.
* Marketplace filter controls use custom dropdowns to prevent native option menus from overflowing the viewport.
* Footer Platform and Legal links share a responsive row.
* Login and register pages do not render the floating AI Assistant.

## AI Assistant Behavior

The assistant is authenticated, user-scoped, and available across the main application pages. It supports concise greetings, page-aware context, cross-page questions, typing feedback with animated dots, and authenticated Gemini responses. Conversation history is stored under a user-specific browser-storage key and is cleared from the visible UI on logout.

The assistant also handles long replies with content-sized message bubbles, wrapped text, scrolling conversation history, light/dark message surfaces, and responsive positioning.

## Premium Access Flow

```txt
User opens payment page
→ User clicks upgrade
→ Server creates Stripe Checkout session
→ User pays through Stripe hosted checkout
→ Stripe redirects user to payment success page
→ Server verifies the payment session
→ User subscription becomes premium
→ Premium/private prompt content becomes unlocked
```

## Deployment

The frontend is deployed on Vercel.

Required Vercel environment variables:

```env
API_PROXY_TARGET=https://promptgrid-server-fahid2002.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_PROJECT_ID=your_google_project_id
```

After deployment, add the Vercel URL to:

* Server `CLIENT_URL`
* Google OAuth authorized JavaScript origins
* Google OAuth authorized redirect settings if required
* Stripe success and cancel redirect configuration if required

After changing environment variables, redeploy the Vercel project.

## Testing Checklist

Before final submission, verify:

* Home page loads
* All Prompts page loads
* Search works
* Free filter works
* Premium filter works
* Login works
* Register works
* Google login works
* Dashboard opens correctly
* Prompt details page works
* AI Tools route redirects logged-out users to login
* Prompt Builder returns an optimized prompt
* Prompt Playground returns a generated output
* AI Prompt Review returns safety and quality feedback
* Semantic Prompt Search returns relevant approved prompts
* AI Assistant responds for authenticated users
* AI Assistant closes and clears visible history after logout
* MFA setup displays a QR code and accepts a six-digit code
* MFA login displays a verification step for enabled accounts
* MFA verification shows a loading toast
* Recovery code login is available
* MFA secrets and recovery codes are never exposed in client responses
* Premium prompt appears locked for free users
* Stripe test payment redirects successfully
* User becomes premium after payment
* Premium prompt content unlocks
* Notification bell shows admin notifications

## Author

Developed by **Fahid Hasan**.

## License

This project is for educational and portfolio purposes.
