'use client';

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

export function ActivityLog({ data, page, setPage }) {
  const entries = data.entries || [];

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        Activity Log
      </h2>

      <p className="mt-2 muted">
        Your activity history is stored for 30 days.
      </p>

      <div className="mt-5 grid gap-3">
        {entries.map((item) => (
          <div
            className="soft-card rounded-3xl p-5"
            key={item._id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">
                  {prettifyAction(item.action)}
                </h3>

                <p className="mt-2 muted">
                  {item.summary}
                </p>

                <p className="mt-3 text-sm muted">
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">
                {item.targetType}
              </span>
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