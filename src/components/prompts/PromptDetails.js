'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { PrivateRoute } from '@/libs/auth-context.js';
import { formatNumber, reportReasons } from '@/libs/utils.js';
import { AiToolLogo } from './AiToolLogo.js';

export default function PromptDetails() {
  return (
    <PrivateRoute>
      <Details />
    </PrivateRoute>
  );
}

function Details() {
  // Get prompt id from URL params
  const { id } = useParams();

  // Used to redirect user to payment page
  const router = useRouter();

  // Stores prompt details, reviews and bookmark state
  const [data, setData] = useState(null);

  // Stores review form values
  const [review, setReview] = useState({
    rating: 5,
    comment: '',
  });

  // Controls report modal open/close state
  const [reportOpen, setReportOpen] = useState(false);

  // Reload prompt details after actions like bookmark, copy or review
  const load = async () => {
    try {
      setData(await api(`/prompts/${id}`));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Prevents state update if component unmounts before API finishes
    let active = true;

    api(`/prompts/${id}`)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((error) => {
        if (active) toast.error(error.message);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Loading state
  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="skeleton h-80 rounded-[2rem]" />
      </div>
    );
  }

  const { prompt, reviews, bookmarked } = data;

  // Common function for prompt actions
  const action = async (path, options, success) => {
    try {
      const result = await api(path, options);

      toast.success(result?.message || success);

      await load();

      return result;
    } catch (error) {
      toast.error(error.message);

      return null;
    }
  };

  // Copies prompt content and updates copy count
  const copy = async () => {
    const result = await action(
      `/prompts/${id}/copy`,
      {
        method: 'POST',
      },
      'Prompt copied'
    );

    if (result) {
      await navigator.clipboard.writeText(result.content);

      toast.success('Prompt copied and copy count updated');
    }
  };

  // Submits user review
  const submitReview = async (event) => {
    event.preventDefault();

    const result = await action(
      `/prompts/${id}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(review),
      },
      'Review submitted'
    );

    if (result) {
      setReview({
        rating: 5,
        comment: '',
      });
    }
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="section-label">
          Private prompt details route
        </p>

        <h1 className="mt-3 font-display text-4xl font-black sm:text-5xl">
          Prompt Details Page
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* Main prompt details card */}
          <article className="hard-card rounded-[2rem] p-6">
            <div className="mb-4 flex items-center gap-3"><AiToolLogo tool={prompt.aiTool} size={44} /><b>{prompt.aiTool}</b></div>
            {/* Prompt badges */}
            <div className="flex flex-wrap gap-2">
              <span className="mini-badge">
                {prompt.visibility === 'private'
                  ? 'Private / Premium'
                  : 'Public Prompt'}
              </span>

              <span className="mini-badge">
                {prompt.aiTool}
              </span>

              <span className="mini-badge">
                {prompt.category}
              </span>

              <span className="mini-badge">
                {prompt.difficulty}
              </span>
            </div>

            {/* Prompt title and description */}
            <h2 className="mt-5 font-display text-3xl font-black">
              {prompt.title}
            </h2>

            <p className="mt-3 leading-7 muted">
              {prompt.description}
            </p>

            {/* Prompt content box */}
            <div className="relative mt-5 min-h-44 rounded-3xl border-2 border-[var(--line)] bg-slate-950 p-5 font-mono text-sm leading-7 text-lime-200">
              <div className={prompt.locked ? 'select-none blur-sm opacity-50' : ''}>
                {prompt.content || 'Premium prompt content is protected.'}
              </div>

              {/* Premium locked overlay */}
              {prompt.locked ? (
                <div
                  role="button"
                  onClick={() => router.push(`/payment?return=/prompts/${id}`)}
                  className="absolute inset-0 grid place-items-center rounded-3xl bg-slate-950/80 p-6 text-center text-white cursor-pointer"
                >
                  <div>
                    <h3 className="font-display text-2xl font-black">
                      Premium Prompt Locked
                    </h3>

                    <p className="mt-2 text-slate-300">
                      Subscribe to Premium to unlock full content, copying and
                      reviews.
                    </p>

                    <button className="btn-lime mt-5 rounded-2xl px-5 py-3 font-black">
                      Get subscription to view prompt
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Prompt information */}
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <Info
                label="Creator"
                value={prompt.creator?.name}
              />

              <Info
                label="Copy Count"
                value={formatNumber(prompt.copyCount)}
              />

              <Info
                label="Tags"
                value={prompt.tags.join(', ')}
              />

              <Info
                label="Rating"
                value={`★ ${Number(prompt.averageRating || 0).toFixed(1)} (${prompt.reviewCount || 0})`}
              />
            </div>

            {/* Prompt action buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  action(`/prompts/${id}/bookmark`, {
                    method: 'PUT',
                  })
                }
                className="btn-outline rounded-2xl px-5 py-3 text-sm font-black"
              >
                {bookmarked ? '♥ Saved' : '♡ Bookmark Prompt'}
              </button>

              <button
                disabled={prompt.locked}
                onClick={copy}
                className="btn-lime rounded-2xl px-5 py-3 text-sm font-black disabled:opacity-40"
              >
                Copy Prompt
              </button>

              <button
                disabled={prompt.locked}
                onClick={() => document.getElementById('review-form')?.scrollIntoView()}
                className="btn-outline rounded-2xl px-5 py-3 text-sm font-black disabled:opacity-40"
              >
                Review Prompt
              </button>

              <button
                onClick={() => setReportOpen(true)}
                className="btn-outline rounded-2xl px-5 py-3 text-sm font-black"
              >
                Report Prompt
              </button>
            </div>
          </article>

          {/* Right side instructions and reviews */}
          <aside className="hard-card rounded-[2rem] p-6">
            <h3 className="font-display text-2xl font-black">
              Usage Instructions
            </h3>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 muted">
              {prompt.usageInstructions}
            </p>

            <h3 className="mt-7 font-display text-2xl font-black">
              Reviews
            </h3>

            {/* Review form only appears when prompt is unlocked */}
            {!prompt.locked ? (
              <form
                id="review-form"
                onSubmit={submitReview}
                className="mt-4 grid gap-3"
              >
                <select
                  value={review.rating}
                  onChange={(event) =>
                    setReview({
                      ...review,
                      rating: Number(event.target.value),
                    })
                  }
                  className="rounded-2xl px-4 py-3"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option
                      key={rating}
                      value={rating}
                    >
                      {'★'.repeat(rating)} {rating}
                    </option>
                  ))}
                </select>

                <textarea
                  required
                  minLength={3}
                  value={review.comment}
                  onChange={(event) =>
                    setReview({
                      ...review,
                      comment: event.target.value,
                    })
                  }
                  className="min-h-28 rounded-2xl p-4"
                  placeholder="Write your review"
                />

                <button className="btn-lime rounded-2xl px-5 py-3 font-black">
                  Submit Review
                </button>
              </form>
            ) : null}

            {/* Review list */}
            <div className="mt-4 grid gap-3">
              {reviews.map((item) => (
                <div
                  className="soft-card rounded-3xl p-4"
                  key={item._id}
                >
                  <div className="flex justify-between gap-3">
                    <b>
                      {item.user?.name}
                    </b>

                    <span className="text-yellow-500">
                      {'★'.repeat(item.rating)}
                    </span>
                  </div>

                  <p className="mt-2 muted">
                    {item.comment}
                  </p>

                  <p className="mt-2 text-xs muted">
                    {item.user?.email} ·{' '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {/* Empty review message */}
              {reviews.length === 0 ? (
                <p className="muted">
                  No reviews yet.
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </div>

      {/* Report prompt modal */}
      {reportOpen ? (
        <ReportModal
          promptId={id}
          onClose={() => setReportOpen(false)}
        />
      ) : null}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="soft-card rounded-2xl p-4">
      <b>
        {label}:
      </b>{' '}
      {value || '—'}
    </div>
  );
}

function ReportModal({ promptId, onClose }) {
  // Stores report form data
  const [form, setForm] = useState({
    reason: reportReasons[0],
    description: '',
  });

  // Submits report to admin team
  const submit = async (event) => {
    event.preventDefault();

    try {
      await api(`/prompts/${promptId}/reports`, {
        method: 'POST',
        body: JSON.stringify(form),
      });

      toast.success('Report submitted to the admin team');

      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        onSubmit={submit}
        className="hard-card w-full max-w-lg rounded-[2rem] p-6"
      >
        {/* Report modal header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-black">
              Report Prompt
            </h2>

            <p className="mt-2 text-sm muted">
              Select a reason and add optional details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-outline rounded-xl px-4 py-2 font-black"
          >
            Close
          </button>
        </div>

        {/* Report form */}
        <div className="mt-5 grid gap-4">
          <select
            value={form.reason}
            onChange={(event) =>
              setForm({
                ...form,
                reason: event.target.value,
              })
            }
            className="rounded-2xl px-4 py-4"
          >
            {reportReasons.map((reason) => (
              <option key={reason}>
                {reason}
              </option>
            ))}
          </select>

          <textarea
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
            className="min-h-28 rounded-2xl px-4 py-4"
            placeholder="Optional description"
          />

          <button className="btn-lime rounded-2xl px-5 py-4 font-black">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
