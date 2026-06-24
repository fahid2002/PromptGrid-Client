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

## Tech Stack

* Next.js
* React
* Tailwind CSS
* Framer Motion
* Recharts
* React Toastify
* Lucide React
* Google OAuth
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
```

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
* Premium prompt appears locked for free users
* Stripe test payment redirects successfully
* User becomes premium after payment
* Premium prompt content unlocks
* Notification bell shows admin notifications

## Author

Developed by **Fahid Hasan**.

## License

This project is for educational and portfolio purposes.
