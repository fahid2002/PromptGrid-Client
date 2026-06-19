import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm.js';

export default function Page() {
  return (
    // Suspense is used because AuthForm uses useSearchParams
    <Suspense>
      <AuthForm mode="register" />
    </Suspense>
  );
}