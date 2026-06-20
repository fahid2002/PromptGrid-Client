import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm.js';

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
