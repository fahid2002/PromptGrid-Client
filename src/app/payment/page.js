import { Suspense } from 'react';
import PaymentPage from '@/components/payment/PaymentPage.js';

export default function Page() {
  return (
    // Suspense is used because PaymentPage uses useSearchParams
    <Suspense>
      <PaymentPage />
    </Suspense>
  );
}