import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm.js';

export default function RegisterPage() {
  return (
    <Suspense>
      <AuthForm mode="register" />
    </Suspense>
  );
}
