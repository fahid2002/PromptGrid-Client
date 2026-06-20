'use client';

/* eslint-disable @next/next/no-img-element -- profile URLs are user-provided at runtime */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { useAuth } from '@/libs/auth-context.js';
import { initials, isChartData } from '@/libs/utils.js';
import { AnalyticsChart, Stats } from './primitives.js';

export function DashboardHome({ data }) {
  // Use summary first, then stats, otherwise use the full data object
  const values = data.summary || data.stats || data;

  return (
    <>
      {/* Dashboard statistics cards */}
      <Stats items={Object.entries(values)} />

      {/* Show analytics chart if prompt data exists */}
      {isChartData(data.prompts) ? (
        <AnalyticsChart data={data.prompts} />
      ) : (
        <div className="soft-card mt-6 rounded-3xl p-5">
          <h2 className="font-display text-2xl font-black">
            Account
          </h2>

          <p className="mt-2 muted">
            All values shown above come from current MongoDB records.
          </p>
        </div>
      )}
    </>
  );
}

export function CreatorAnalytics({ data }) {
  return (
    <>
      {/* Creator summary statistics */}
      <Stats items={Object.entries(data.summary || {})} />

      {/* Creator prompt performance chart */}
      <AnalyticsChart data={data.prompts || []} />
    </>
  );
}

export function Profile() {
  // Get logged-in user information
  const { user } = useAuth();

  // Stores dashboard data for profile statistics
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    // Fetch dashboard data for showing total prompts
    api('/dashboard')
      .then(setDashboard)
      .catch((error) => toast.error(error.message));
  }, []);

  return (
    <div className="hard-card rounded-[2rem] p-6">
      <h2 className="font-display text-3xl font-black">
        Profile
      </h2>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        {/* User profile image or initials */}
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-2xl font-black text-white">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials(user.name)
          )}
        </div>

        {/* User account information */}
        <div className="grid gap-2">
          <p>
            <b>Name:</b> {user.name}
          </p>

          <p>
            <b>Email:</b> {user.email}
          </p>

          <p>
            <b>Account Role:</b> {user.role}
          </p>

          <p>
            <b>Total Prompts:</b> {dashboard?.stats?.prompts ?? '—'}
          </p>

          <p>
            <b>Subscription:</b> {user.subscription}
          </p>
        </div>
      </div>

      {/* Show upgrade button only for free users */}
      {user.subscription === 'free' ? (
        <Link
          href="/payment"
          className="btn-lime mt-6 inline-block rounded-2xl px-5 py-3 font-black"
        >
          Upgrade to Premium
        </Link>
      ) : null}
    </div>
  );
}
