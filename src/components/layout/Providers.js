'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/libs/auth-context.js';
import { isGoogleConfigured } from '@/libs/registration.js';

export default function Providers({ children }) {
  // Wraps the whole app with authentication context and toast notifications
  const content = (
    <AuthProvider>
      {children}

      <ToastContainer
        position="bottom-right"
        theme="colored"
      />
    </AuthProvider>
  );

  // Google OAuth provider is added only if Google Client ID exists
  return isGoogleConfigured(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) ? (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {content}
    </GoogleOAuthProvider>
  ) : (
    content
  );
}
