'use client';

import {
  useEffect,
  useState,
} from 'react';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { api } from '@/libs/api.js';
import {
  PrivateRoute,
  useAuth,
} from '@/libs/auth-context.js';

export default function Page() {
  return (
    <PrivateRoute>
      <Success />
    </PrivateRoute>
  );
}

function Success() {
  // Read query parameters from Stripe redirect URL
  const params = useSearchParams();

  // Used to redirect user after payment verification
  const router = useRouter();

  // Refresh user data after premium activation
  const { refresh } = useAuth();

  // Stripe Checkout session id from URL
  const id = params.get('session_id');

  // Payment verification message shown to the user
  const [message, setMessage] = useState(
    id ? 'Verifying payment with Stripe…' : 'Missing Checkout session.'
  );

  useEffect(() => {
    // Stop if there is no session id
    if (!id) return;

    // Verify payment session with backend
    api(`/payments/session/${id}`)
      .then(async data => {
        if (data.premium) {
          await refresh();

          setMessage('Payment verified. Premium is active.');

          setTimeout(
            () => router.replace(params.get('return') || '/dashboard/profile'),
            1200
          );
        } else {
          setMessage('Payment is still processing.');
        }
      })
      .catch(e => setMessage(e.message));
  }, [id, params, refresh, router]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="hard-card rounded-[2rem] p-10 text-center">
        <h1 className="font-display text-4xl font-black">
          {message}
        </h1>
      </div>
    </div>
  );
}