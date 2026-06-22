'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { useAuth } from '@/libs/auth-context.js';

export default function PaymentPage() {
  return <Plan />;
}

function Plan() {
  // Used to read return path from URL query
  const params = useSearchParams();
  const router = useRouter();

  // Get logged-in user information
  const { user } = useAuth();

  // Starts Stripe checkout process
  const checkout = async () => {
    if (!user) {
      toast.info('Log in to continue to checkout.');
      router.push('/login?next=%2Fpayment');
      return;
    }

    try {
      const { url } = await api('/payments/checkout', {
        method: 'POST',
        body: JSON.stringify({
          returnPath: params.get('return') || '/dashboard/profile',
        }),
      });

      location.assign(url);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <section className="px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        {/* Left side payment information */}
        <div>
          <p className="section-label">
            Stripe payment route
          </p>

          <h1 className="mt-3 font-display text-5xl font-black">
            One-time Premium Access
          </h1>

          <p className="mt-5 leading-7 muted">
            Stripe-hosted Checkout verifies payment before Premium access is
            enabled for {user ? user.email : 'your account'}.
          </p>
        </div>

        {/* Premium plan card */}
        <div className="hard-card rounded-[2rem] p-8">
          <p className="section-label">
            Premium plan
          </p>

          <h2 className="mt-3 font-display text-5xl font-black">
            $5
          </h2>

          <p className="muted">
            One-time payment
          </p>

          {/* Premium benefits */}
          <div className="mt-7 grid gap-3 font-bold muted">
            <p>
              ✓ Unlock all private prompts
            </p>

            <p>
              ✓ Copy premium content
            </p>

            <p>
              ✓ Review premium prompts
            </p>

            <p>
              ✓ Transaction saved securely
            </p>
          </div>

          {/* Checkout button disabled if user already has premium */}
          <button
            disabled={user?.subscription === 'premium'}
            onClick={checkout}
            className="btn-lime mt-7 w-full rounded-2xl px-6 py-4 font-black disabled:opacity-50"
          >
            {user?.subscription === 'premium'
              ? 'Premium already active'
              : 'Continue to Checkout'}
          </button>
        </div>
      </div>
    </section>
  );
}
