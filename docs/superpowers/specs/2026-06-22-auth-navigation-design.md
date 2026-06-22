# PromptGrid Authentication and Navigation Design

## Goals

- Redirect successful email registration to `/login` after showing a success toast.
- Redirect successful email or Google login to `/` after showing a success toast.
- Let authenticated users open Dashboard without being sent back to Login.
- Make Pricing public while requiring authentication only when checkout begins.
- Render a generic `Continue with Google` control; show account information only after it is clicked.
- Close the notification menu on outside click, Escape, notification selection, or navigation.

## Session and routing design

The Express server remains the source of truth for authentication. It issues HTTP-only access and refresh cookies, and every private API continues to enforce authentication server-side.

Dashboard access will use the existing `AuthProvider` and `/auth/me` check instead of rejecting the page solely from Next.js proxy middleware. This avoids false Login redirects when the browser session is valid but the proxy cannot observe the cookie reliably. `PrivateRoute` will display its loading state while `/auth/me` is pending, render authenticated content when a user is returned, and redirect only after the session check has completed unsuccessfully.

Pricing content will be public. Its checkout action will redirect an unauthenticated visitor to `/login?next=/payment`; authenticated visitors can start Stripe Checkout normally.

## Authentication flows

### Email registration

1. Submit registration.
2. Server creates the account without logging it in.
3. Client displays a role-specific success toast.
4. Client replaces the current route with `/login`.

### Email login

1. Submit credentials and selected role.
2. Server sets session cookies and returns the user.
3. Client updates `AuthProvider`, displays a personalized success toast, refreshes routing state, and replaces the route with `/`.

### Google registration and login

The page initially renders a custom generic button containing the Google mark and `Continue with Google`. Clicking it opens the Google account chooser. Registration creates the selected User or Creator account, shows a success toast, clears local authenticated state if necessary, and redirects to Login. Login sets the returned user, shows a success toast, and redirects Home.

Google registration and login continue using the server's verified Google ID-token endpoint. Admin Google authentication remains disabled.

## Notification behavior

The bell owns a container reference. While open, document-level pointer and keyboard listeners close it when a pointer event occurs outside the container or Escape is pressed. Route changes also close it. Events inside the menu do not trigger outside-close behavior.

## Error handling

- Failed registration or login remains on the form and displays the server's meaningful error toast.
- Failed Google authentication displays the configured Google error toast.
- Failed notification requests keep the menu usable and display an error toast where appropriate.
- Checkout API errors remain visible through a toast.

## Tests

- Redirect policy helpers cover registration, login, and safe `next` paths.
- Route tests confirm Dashboard is not rejected by cookie-only proxy logic and Pricing is public.
- Google button tests confirm the initial control is generic and account UI starts only after interaction.
- Notification tests cover outside-click, Escape, and route-change close behavior.
- Existing client tests, lint, and production build must pass before deployment.

