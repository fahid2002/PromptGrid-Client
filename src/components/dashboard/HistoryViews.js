'use client';

import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { Empty, Pagination } from './primitives.js';

function formatDate(value) {
  if (!value) return 'Unknown date';

  return new Date(value).toLocaleString();
}

function prettifyAction(value = '') {
  return value
    .split('_')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

function actionBadgeClass(action = '') {
  if (action.includes('copied')) {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200';
  }

  if (action.includes('bookmark')) {
    return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200';
  }

  if (action.includes('reported')) {
    return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200';
  }

  if (action.includes('review')) {
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200';
  }

  if (action.includes('prompt')) {
    return 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-200';
  }

  return 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white';
}

export function NotificationHistory({ data, page, setPage }) {
  const notifications = data.notifications || [];

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        Notification History
      </h2>

      <p className="mt-2 muted">
        Your notifications are stored for 30 days.
      </p>

      <div className="mt-5 grid gap-3">
        {notifications.map((item) => (
          <div
            className="soft-card rounded-3xl p-5"
            key={item._id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">
                  {item.title}
                </h3>

                <p className="mt-2 muted">
                  {item.message}
                </p>

                <p className="mt-3 text-sm muted">
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                  item.readAt
                    ? 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white'
                    : 'bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-200'
                }`}
              >
                {item.readAt ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>
        ))}

        {notifications.length === 0 ? (
          <Empty text="No notification history found." />
        ) : null}
      </div>

      <Pagination
        pagination={data.pagination}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export function ActivityLog({ data, page, setPage, load }) {
  const entries = data.entries || [];

  const removeActivity = async (id) => {
    if (!confirm('Remove this item from your activity log?')) return;

    try {
      await api(`/dashboard/activity/${id}`, {
        method: 'DELETE',
      });

      toast.success('Activity removed');
      await load?.();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        Activity Log
      </h2>

      <p className="mt-2 muted">
        Your activity history is stored for 30 days. You can also remove activity items manually.
      </p>

      <div className="mt-5 grid gap-3">
        {entries.map((item) => (
          <div
            className="soft-card relative rounded-3xl p-5"
            key={item._id}
          >
            <button
              type="button"
              onClick={() => removeActivity(item._id)}
              className="absolute right-4 top-4 rounded-full border border-[var(--line)] px-3 py-1 text-sm font-black transition hover:bg-red-500 hover:text-white"
              title="Remove from activity log"
            >
              ×
            </button>

            <div className="pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black">
                  {item.title || prettifyAction(item.action)}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${actionBadgeClass(
                    item.action
                  )}`}
                >
                  {prettifyAction(item.action)}
                </span>
              </div>

              <p className="mt-2 muted">
                {item.summary}
              </p>

              {item.relatedPrompt ? (
                <p className="mt-2 text-sm muted">
                  Related prompt: {item.relatedPrompt.title}
                </p>
              ) : null}

              <p className="mt-3 text-sm muted">
                {formatDate(item.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {entries.length === 0 ? (
          <Empty text="No activity found yet." />
        ) : null}
      </div>

      <Pagination
        pagination={data.pagination}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}