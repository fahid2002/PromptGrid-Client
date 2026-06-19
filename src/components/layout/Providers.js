'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/libs/auth-context.js';

export default function Providers({ children }) {
  const content = <AuthProvider>{children}<ToastContainer position="bottom-right" theme="colored" /></AuthProvider>;
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>{content}</GoogleOAuthProvider> : content;
}
