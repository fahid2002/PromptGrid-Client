'use client';

import Link from 'next/link';
import {
  Bookmark,
  LockKeyhole,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { useAuth } from '@/libs/auth-context.js';
import { formatNumber } from '@/libs/utils.js';

export default function PromptCard({ prompt }) {
  // Get logged-in user from auth context
  const { user } = useAuth();

  // Used to redirect user to login page if not logged in
  const router = useRouter();

  // Tracks bookmark button state on this card
  const [saved, setSaved] = useState(false);

  // Handles save/bookmark action
  const bookmark = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/prompts/${prompt._id}`)}`);
      return;
    }

    try {
      const result = await api(`/prompts/${prompt._id}/bookmark`, {
        method: 'PUT',
      });

      setSaved(result.bookmarked);

      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <article className="hard-card group flex min-h-[310px] flex-col rounded-[1.8rem] p-6 transition hover:-translate-y-1">
      {/* Top icon and save button */}
      <div className="mb-6 flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-[var(--line)] bg-[var(--lime)] text-slate-950">
          {prompt.visibility === 'private' ? (
            <LockKeyhole />
          ) : (
            <Sparkles />
          )}
        </span>

        <button
          onClick={bookmark}
          className="badge"
        >
          <Bookmark
            size={14}
            fill={saved ? 'currentColor' : 'none'}
          />{' '}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Prompt title */}
      <h3 className="font-display text-2xl font-black">
        {prompt.title}
      </h3>

      {/* Prompt short description */}
      <p className="mt-3 flex-1 text-sm leading-7 muted">
        {prompt.description}
      </p>

      {/* Prompt tags/details */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="mini-badge">
          {prompt.aiTool}
        </span>

        <span className="mini-badge">
          {prompt.category}
        </span>

        <span className="mini-badge">
          {prompt.difficulty}
        </span>

        {prompt.visibility === 'private' ? (
          <span className="mini-badge">
            Premium
          </span>
        ) : null}
      </div>

      {/* Creator, rating and copy count */}
      <div className="mt-6 flex items-center justify-between gap-3 text-xs font-black muted">
        <span>
          By {prompt.creator?.name || 'Creator'}
        </span>

        <span>
          ★ {Number(prompt.averageRating || 0).toFixed(1)} ·{' '}
          {formatNumber(prompt.copyCount)} copies
        </span>
      </div>

      {/* Details page link */}
      <Link
        href={`/prompts/${prompt._id}`}
        className="btn-outline mt-5 rounded-2xl px-5 py-3 text-center text-sm font-black"
      >
        View Details
      </Link>
    </article>
  );
}