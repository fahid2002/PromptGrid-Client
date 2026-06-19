'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { formatNumber } from '@/libs/utils.js';
import { Empty, Modal, Stats } from './primitives.js';

export function OwnerPrompts({ prompts, load }) {
  // Stores the prompt that is currently being edited
  const [editing, setEditing] = useState(null);

  // Stores analytics data for a selected prompt
  const [analytics, setAnalytics] = useState(null);

  // Deletes a prompt after user confirmation
  const remove = async (id) => {
    if (!confirm('Delete this prompt permanently?')) return;

    try {
      await api(`/prompts/${id}`, {
        method: 'DELETE',
      });

      toast.success('Prompt deleted');

      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Loads analytics for a specific prompt
  const showAnalytics = async (id) => {
    try {
      setAnalytics(await api(`/dashboard/prompts/${id}/analytics`));
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Shows update form when a prompt is selected for editing
  if (editing) {
    return (
      <PromptForm
        prompt={editing}
        onCancel={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await load();
        }}
      />
    );
  }

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        My Prompts
      </h2>

      {/* User submitted prompts list */}
      <div className="mt-5 grid gap-4">
        {prompts.map((prompt) => (
          <div
            className="soft-card rounded-3xl p-5"
            key={prompt._id}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-black">
                  {prompt.title}
                </h3>

                <p className="mt-1 text-sm capitalize muted">
                  {prompt.visibility} · {prompt.status} ·{' '}
                  {formatNumber(prompt.copyCount)} copies
                </p>

                {/* Shows admin rejection feedback if available */}
                {prompt.rejectionFeedback ? (
                  <p className="mt-2 text-sm text-red-500">
                    Admin feedback: {prompt.rejectionFeedback}
                  </p>
                ) : null}
              </div>

              {/* Prompt action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setEditing(prompt)}
                  className="btn-outline rounded-xl px-3 py-2 text-sm font-black"
                >
                  Update
                </button>

                <button
                  onClick={() => remove(prompt._id)}
                  className="btn-outline rounded-xl px-3 py-2 text-sm font-black"
                >
                  Delete
                </button>

                <button
                  onClick={() => showAnalytics(prompt._id)}
                  className="btn-lime rounded-xl px-3 py-2 text-sm font-black"
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state if user has no prompts */}
        {prompts.length === 0 ? (
          <Empty text="You have not submitted any prompts." />
        ) : null}
      </div>

      {/* Analytics modal for selected prompt */}
      {analytics ? (
        <Modal
          title={`${analytics.prompt.title} Analytics`}
          onClose={() => setAnalytics(null)}
        >
          <Stats items={Object.entries(analytics.stats)} />
        </Modal>
      ) : null}
    </div>
  );
}

// Empty form structure for creating a new prompt
const emptyPrompt = {
  title: '',
  description: '',
  content: '',
  category: '',
  aiTool: '',
  tags: '',
  difficulty: 'Beginner',
  usageInstructions: '',
  thumbnailURL: '',
  visibility: 'public',
};

export function PromptForm({ prompt, onCancel, onSaved }) {
  // If editing, load prompt data into the form. Otherwise use empty form
  const [form, setForm] = useState(
    prompt ? { ...prompt, tags: prompt.tags.join(', ') } : emptyPrompt
  );

  // Tracks thumbnail upload state
  const [uploading, setUploading] = useState(false);

  // Updates form field value
  const update = (key) => (event) =>
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }));

  // Uploads thumbnail image and stores returned image URL
  const upload = async (file) => {
    const body = new FormData();

    body.append('image', file);

    setUploading(true);

    try {
      const result = await api('/uploads/image', {
        method: 'POST',
        body,
      });

      setForm((current) => ({
        ...current,
        thumbnailURL: result.url,
      }));

      toast.success('Thumbnail uploaded');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Submits new prompt or updates existing prompt
  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      await api(prompt ? `/prompts/${prompt._id}` : '/prompts', {
        method: prompt ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });

      toast.success(
        prompt ? 'Prompt updated and returned to pending review' : 'Prompt submitted as pending'
      );

      if (!prompt) setForm(emptyPrompt);

      await onSaved?.();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h2 className="font-display text-3xl font-black">
          {prompt ? 'Update Prompt' : 'Add Prompt'}
        </h2>

        <p className="mt-2 text-sm muted">
          New and edited prompts remain hidden until an admin approves them.
        </p>
      </div>

      {/* Basic prompt input fields */}
      {[
        ['title', 'Prompt Title'],
        ['category', 'Category'],
        ['aiTool', 'AI Tool'],
        ['tags', 'Tags, comma separated'],
        ['thumbnailURL', 'Thumbnail Image URL'],
      ].map(([key, label]) => (
        <input
          required
          key={key}
          value={form[key]}
          onChange={update(key)}
          className="input-box rounded-2xl px-4 py-3"
          placeholder={label}
        />
      ))}

      {/* Prompt difficulty */}
      <select
        value={form.difficulty}
        onChange={update('difficulty')}
        className="rounded-2xl px-4 py-3"
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Pro</option>
      </select>

      {/* Prompt visibility */}
      <select
        value={form.visibility}
        onChange={update('visibility')}
        className="rounded-2xl px-4 py-3"
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      {/* Long text fields */}
      {[
        ['description', 'Prompt Description'],
        ['content', 'Prompt Content'],
        ['usageInstructions', 'Usage Instructions'],
      ].map(([key, label]) => (
        <textarea
          required
          minLength={10}
          key={key}
          value={form[key]}
          onChange={update(key)}
          className="min-h-28 rounded-2xl p-4 sm:col-span-2"
          placeholder={label}
        />
      ))}

      {/* Thumbnail upload button */}
      <label className="btn-outline cursor-pointer rounded-2xl px-4 py-3 text-center font-black">
        {uploading ? 'Uploading…' : 'Upload Thumbnail'}

        <input
          hidden
          type="file"
          accept="image/*"
          onChange={(event) =>
            event.target.files[0] && upload(event.target.files[0])
          }
        />
      </label>

      {/* Form action buttons */}
      <div className="flex gap-3 sm:col-span-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline rounded-2xl px-5 py-4 font-black"
          >
            Cancel
          </button>
        ) : null}

        <button
          disabled={uploading}
          className="btn-lime flex-1 rounded-2xl px-5 py-4 font-black disabled:opacity-50"
        >
          {prompt ? 'Save Changes' : 'Submit Prompt'}
        </button>
      </div>
    </form>
  );
}

export function SavedPrompts({ bookmarks, load }) {
  // Removes a prompt from saved/bookmarked list
  const remove = async (id) => {
    try {
      await api(`/prompts/${id}/bookmark`, {
        method: 'PUT',
      });

      toast.success('Bookmark removed');

      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        Saved Prompts
      </h2>

      {/* Saved prompt cards */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {bookmarks.map(({ _id, prompt }) =>
          prompt ? (
            <div
              className="soft-card rounded-3xl p-5"
              key={_id}
            >
              <h3 className="font-display text-xl font-black">
                {prompt.title}
              </h3>

              <p className="mt-2 text-sm muted">
                {prompt.category} · {prompt.aiTool}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => remove(prompt._id)}
                  className="btn-outline rounded-2xl px-4 py-2 text-sm font-black"
                >
                  Remove Bookmark
                </button>

                <Link
                  href={`/prompts/${prompt._id}`}
                  className="btn-lime rounded-2xl px-4 py-2 text-sm font-black"
                >
                  View Details
                </Link>
              </div>
            </div>
          ) : null
        )}

        {/* Empty state if no saved prompts */}
        {bookmarks.length === 0 ? (
          <Empty text="No saved prompts." />
        ) : null}
      </div>
    </div>
  );
}

export function MyReviews({ reviews }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        My Reviews
      </h2>

      {/* User submitted reviews */}
      <div className="mt-5 grid gap-3">
        {reviews.map((review) => (
          <div
            className="soft-card rounded-3xl p-4"
            key={review._id}
          >
            <b>
              {review.prompt?.title || 'Deleted Prompt'}
            </b>

            <p className="muted">
              {'★'.repeat(review.rating)} — {review.comment}
            </p>
          </div>
        ))}

        {/* Empty state if no reviews exist */}
        {reviews.length === 0 ? (
          <Empty text="No reviews submitted yet." />
        ) : null}
      </div>
    </div>
  );
}