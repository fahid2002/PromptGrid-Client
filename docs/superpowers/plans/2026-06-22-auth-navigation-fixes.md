# Authentication Navigation Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make registration, login, Dashboard, Pricing, Google authentication, toast feedback, and notification dismissal behave consistently in production.

**Architecture:** Express remains the authentication authority and protects every private API. Next.js pages rely on `AuthProvider` plus `/auth/me` instead of cookie-only edge redirects; Pricing is public and gates only checkout. Google uses an explicit popup initiated by a generic custom button and the server verifies the resulting Google access token before resolving an account.

**Tech Stack:** Next.js 16 App Router, React 19, Express, JWT HTTP-only cookies, Google OAuth, Vitest, Tailwind CSS.

---

## File structure

- Create `src/libs/auth-navigation.js`: pure redirect-policy helpers.
- Modify `src/components/auth/AuthForm.js`: registration/login state, toast, and navigation flows.
- Remove `src/proxy.js`: eliminate cookie-only page rejection; private APIs and `PrivateRoute` remain authoritative.
- Modify `src/components/payment/PaymentPage.js`: public plan display and login-gated checkout.
- Modify `src/components/auth/GoogleAuthButton.js`: generic pre-click Google control using popup OAuth.
- Modify server Google validator/controller: verify Google access tokens and avoid creating a session during registration.
- Modify `src/components/notifications/NotificationBell.js`: outside-click, Escape, and route-change dismissal.
- Extend focused Vitest suites before each production change.

### Task 1: Redirect policy and page access

**Files:**
- Create: `src/libs/auth-navigation.js`
- Modify: `src/components/auth/AuthForm.js`
- Modify: `src/components/payment/PaymentPage.js`
- Delete: `src/proxy.js`
- Test: `tests/routes.test.js`
- Test: `tests/libs.test.js`

- [ ] **Step 1: Write failing redirect and access tests**

Add assertions that `authDestination('register')` is `/login`, `authDestination('login')` is `/`, Dashboard uses `PrivateRoute`, Pricing does not wrap the page in `PrivateRoute`, and no cookie-only proxy exists.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- tests/routes.test.js tests/libs.test.js`

Expected: FAIL because `auth-navigation.js` does not exist and Pricing/proxy still use the old policy.

- [ ] **Step 3: Implement the minimal redirect policy**

Create:

```js
export function authDestination(mode) {
  return mode === 'register' ? '/login' : '/';
}
```

Use `router.replace(authDestination(...))` and `router.refresh()` after successful navigation. Do not set authenticated state for registration. Remove cookie-only page middleware. Make Pricing render publicly and redirect an unauthenticated checkout click to `/login?next=%2Fpayment` with an informational toast.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- tests/routes.test.js tests/libs.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src tests
git commit -m "Fix authentication redirects and route access"
```

### Task 2: Generic Google button and intent-correct sessions

**Files:**
- Modify: `src/components/auth/GoogleAuthButton.js`
- Modify: `src/components/auth/AuthForm.js`
- Modify: `src/libs/registration.js`
- Modify server: `src/controllers/auth-controller.js`
- Modify server: `src/validators/auth-input.js`
- Modify server tests: `tests/google-account.test.js`
- Test client: `tests/libs.test.js`
- Test client: `tests/auth-contrast.test.js`

- [ ] **Step 1: Write failing Google-flow tests**

Test that the client payload uses `{ accessToken, intent, role }`, the generic button source contains `Continue with Google` and `useGoogleLogin`, and server account resolution does not establish a session for registration intent.

- [ ] **Step 2: Run tests and verify RED**

Run client: `npm test -- tests/libs.test.js tests/auth-contrast.test.js`

Run server: `npm test -- tests/google-account.test.js`

Expected: FAIL because the old ID-token button and payload are still present.

- [ ] **Step 3: Implement popup access-token verification**

Use `useGoogleLogin({ scope: 'openid email profile' })` behind the custom generic button. Send the access token to Express. Express must call `OAuth2Client.getTokenInfo(accessToken)`, require the configured client ID as audience, fetch Google's userinfo endpoint, require a verified email, and call `setSession` only when `intent === 'login'`.

- [ ] **Step 4: Apply intent-correct client navigation**

Google registration shows `Google <role> account created. Please log in.` and replaces the route with `/login`. Google login sets the user, shows `Welcome back, <name>.`, and replaces the route with `/`.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run both focused client and server commands from Step 2.

Expected: PASS.

- [ ] **Step 6: Commit both repositories**

```powershell
git add src tests
git commit -m "Fix Google authentication interaction"
```

### Task 3: Dismissible notification menu

**Files:**
- Create: `src/libs/popover.js`
- Modify: `src/components/notifications/NotificationBell.js`
- Test: `tests/notifications.test.js`

- [ ] **Step 1: Write failing dismissal tests**

Test a pure `shouldDismissPopover(container, target)` helper for inside/outside targets and assert the notification component registers pointer, Escape-key, and pathname dismissal behavior.

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- tests/notifications.test.js`

Expected: FAIL because the helper and listeners do not exist.

- [ ] **Step 3: Implement dismissal behavior**

Add a container `ref`; while open, listen for `pointerdown` and `keydown`, closing only for outside pointers or Escape. Close whenever `usePathname()` changes. Remove listeners during cleanup.

- [ ] **Step 4: Run test and verify GREEN**

Run: `npm test -- tests/notifications.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src tests
git commit -m "Close notifications on outside interaction"
```

### Task 4: Full verification and deployment

**Files:**
- No new production files.

- [ ] **Step 1: Run complete client verification**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, lint exits 0, production build succeeds.

- [ ] **Step 2: Run complete server verification**

Run: `npm test && npm run lint`

Expected: all tests pass and lint exits 0.

- [ ] **Step 3: Push committed changes**

Push each repository's `main` branch only after verification succeeds.

- [ ] **Step 4: Deploy production services**

Deploy Render server first, wait for health, then deploy the Vercel client so the browser and server Google token contract switch together.

- [ ] **Step 5: Verify production behavior**

Verify registration redirects to Login, login redirects Home, Dashboard opens for an authenticated session, Pricing is public, checkout gates anonymous users, the Google button remains generic until clicked, and notifications dismiss on outside click.

