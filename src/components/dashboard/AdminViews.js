'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { DataTable, Empty, Pagination } from './primitives.js';
import { PromptForm } from './PromptViews.js';

export function AdminUsers({ users, currentUser, load }) {
  // Updates a user's role from the admin dashboard
  const role = async (id, value) => {
    try {
      await api(`/dashboard/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({
          role: value,
        }),
      });

      toast.success('User role updated');

      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Deletes a user after admin confirmation
  const remove = async (id) => {
    if (!confirm('Delete this user and their marketplace content?')) return;

    try {
      await api(`/dashboard/admin/users/${id}`, {
        method: 'DELETE',
      });

      toast.success('User deleted');

      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        All Users
      </h2>

      {/* Users table */}
      <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--line)]">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr>
              {['User', 'Email', 'Role', 'Action'].map((label) => (
                <th
                  className="p-4 text-xs uppercase muted"
                  key={label}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                className="border-t border-[var(--line)]"
                key={user._id}
              >
                <td className="p-4 font-black">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {/* Admin can change user role */}
                  <select
                    value={user.role}
                    onChange={(event) => role(user._id, event.target.value)}
                    className="rounded-xl px-2 py-1"
                  >
                    <option>user</option>
                    <option>creator</option>
                    <option>admin</option>
                  </select>
                </td>

                <td className="p-4">
                  {/* Admin cannot delete their own account */}
                  <button
                    disabled={user._id === currentUser._id}
                    onClick={() => remove(user._id)}
                    className="font-black underline disabled:opacity-40"
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPrompts({ data, load, page, setPage }) {
  // State for prompt being edited
  const [editing, setEditing] = useState(null);

  // Handles approve, reject, feature and unfeature actions
  const moderate = async (id, action) => {
    const feedback =
      action === 'reject'
        ? prompt('Rejection feedback for the creator:')
        : undefined;

    if (action === 'reject' && !feedback?.trim()) return;

    try {
      await api(`/dashboard/admin/prompts/${id}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({
          action,
          feedback,
        }),
      });

      const successMessage =
        action === 'approve'
          ? 'Prompt approved'
          : action === 'reject'
            ? 'Prompt rejected'
            : action === 'feature'
              ? 'Prompt featured'
              : 'Prompt unfeatured';

      toast.success(successMessage);
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Deletes a prompt permanently after confirmation
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

  // Show edit form if a prompt is being edited
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
        All Prompts
      </h2>

      {/* Prompt moderation list */}
      <div className="mt-5 grid gap-3">
        {data.prompts.map((item) => {
          const isApproved = item.status === 'approved';
          const isRejected = item.status === 'rejected';
          const isPending = item.status === 'pending';
          const isFeatured = Boolean(item.featured);

          return (
            <div
              className="soft-card rounded-3xl p-4"
              key={item._id}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <b>{item.title}</b>

                  <p className="mt-1 text-sm capitalize muted">
                    {item.creator?.name || 'Unknown Creator'} · {item.visibility} ·{' '}
                    {item.status}
                    {isFeatured ? ' · Featured' : ''}
                    {!isFeatured && item.automaticallyFeatured
                      ? ' · Trending'
                      : ''}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                        isApproved
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200'
                          : isRejected
                            ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200'
                      }`}
                    >
                      {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
                    </span>

                    {isFeatured ? (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-purple-700 dark:bg-purple-500/15 dark:text-purple-200">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Admin prompt action buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditing(item)}
                    className="btn-outline rounded-xl px-3 py-2 text-sm font-black"
                  >
                    Edit
                  </button>

                  <button
                    disabled={isApproved}
                    onClick={() => moderate(item._id, 'approve')}
                    className={`rounded-xl px-3 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-70 ${
                      isApproved
                        ? 'border border-green-400/40 bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200'
                        : 'btn-lime'
                    }`}
                  >
                    {isApproved ? 'Approved' : 'Approve'}
                  </button>

                  <button
                    disabled={isRejected}
                    onClick={() => moderate(item._id, 'reject')}
                    className={`rounded-xl px-3 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-70 ${
                      isRejected
                        ? 'border border-red-400/40 bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200'
                        : 'btn-outline'
                    }`}
                  >
                    {isRejected ? 'Rejected' : 'Reject'}
                  </button>

                  <button
                    disabled={!isApproved}
                    onClick={() =>
                      moderate(item._id, isFeatured ? 'unfeature' : 'feature')
                    }
                    className={`rounded-xl px-3 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isFeatured
                        ? 'border border-purple-400/40 bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-200'
                        : 'btn-outline'
                    }`}
                    title={
                      isApproved
                        ? ''
                        : 'Only approved prompts can be featured'
                    }
                  >
                    {isFeatured ? 'Unfeature' : 'Feature'}
                  </button>

                  <button
                    onClick={() => remove(item._id)}
                    className="btn-outline rounded-xl px-3 py-2 text-sm font-black"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state if no prompts are found */}
        {data.prompts.length === 0 ? (
          <Empty text="No prompts found." />
        ) : null}
      </div>

      {/* Pagination for prompt list */}
      <Pagination
        pagination={data.pagination}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export function Payments({ payments }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        All Payments
      </h2>

      {/* Payments table */}
      <DataTable
        rows={payments}
        fields={[
          ['stripeSessionId', 'Transaction'],
          ['email', 'Email'],
          ['amount', 'Amount (cents)'],
          ['currency', 'Currency'],
          ['status', 'Status'],
        ]}
      />
    </div>
  );
}

export function AdminReports({ reports, load }) {
  // Saves the admin action for a reported prompt
  const act = async (id, status) => {
    const confirmMessage =
      status === 'removed'
        ? 'Remove this prompt from the marketplace? The report will stay in the list as removed.'
        : status === 'warned'
          ? 'Warn the creator about this reported prompt?'
          : 'Dismiss this report as not harmful?';

    if (!confirm(confirmMessage)) return;

    try {
      await api(`/dashboard/admin/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
        }),
      });

      const message =
        status === 'removed'
          ? 'Prompt removed'
          : status === 'warned'
            ? 'Creator warned'
            : 'Report dismissed';

      toast.success(message);
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Removes only the report card from the admin report page
  const removeReport = async (id) => {
    if (!confirm('Remove this report from the reported prompts page?')) return;

    try {
      await api(`/dashboard/admin/reports/${id}`, {
        method: 'DELETE',
      });

      toast.success('Report removed from list');
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getPromptInfo = (report) => {
    const snapshot = report.promptSnapshot || {};

    return {
      title:
        snapshot.title ||
        report.prompt?.title ||
        'Unknown Prompt',
      description:
        snapshot.description ||
        report.prompt?.description ||
        'No prompt description available.',
      category:
        snapshot.category ||
        report.prompt?.category ||
        'Unknown category',
      aiTool:
        snapshot.aiTool ||
        report.prompt?.aiTool ||
        'Unknown tool',
      difficulty:
        snapshot.difficulty ||
        report.prompt?.difficulty ||
        'Unknown difficulty',
      visibility:
        snapshot.visibility ||
        report.prompt?.visibility ||
        'Unknown visibility',
    };
  };

  const statusClass = (status) => {
    if (status === 'removed') {
      return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200';
    }

    if (status === 'warned') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200';
    }

    if (status === 'dismissed') {
      return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200';
    }

    return 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white';
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        Reported Prompts
      </h2>

      {/* Reported prompts list */}
      <div className="mt-5 grid gap-4">
        {reports.map((report) => {
          const promptInfo = getPromptInfo(report);
          const isRemoved = report.status === 'removed';
          const isWarned = report.status === 'warned';
          const isDismissed = report.status === 'dismissed';
          const isResolved = isRemoved || isWarned || isDismissed;

          return (
            <div
              className="soft-card relative rounded-3xl p-5"
              key={report._id}
            >
              {/* Cross button: removes only the report from this page */}
              <button
                type="button"
                onClick={() => removeReport(report._id)}
                className="absolute right-4 top-4 rounded-full border border-[var(--line)] px-3 py-1 text-sm font-black transition hover:bg-red-500 hover:text-white"
                title="Remove report from list"
              >
                ×
              </button>

              <div className="pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <b>{promptInfo.title}</b>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${statusClass(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                </div>

                <p className="mt-2 text-sm muted">
                  {promptInfo.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                  <span className="rounded-full border border-[var(--line)] px-3 py-1">
                    {promptInfo.aiTool}
                  </span>

                  <span className="rounded-full border border-[var(--line)] px-3 py-1">
                    {promptInfo.category}
                  </span>

                  <span className="rounded-full border border-[var(--line)] px-3 py-1">
                    {promptInfo.difficulty}
                  </span>

                  <span className="rounded-full border border-[var(--line)] px-3 py-1 capitalize">
                    {promptInfo.visibility}
                  </span>
                </div>

                <p className="mt-4 muted">
                  <span className="font-black text-[var(--text)]">
                    Report reason:
                  </span>{' '}
                  {report.reason}
                </p>

                <p className="mt-1 muted">
                  <span className="font-black text-[var(--text)]">
                    Reporter note:
                  </span>{' '}
                  {report.description || 'No description'}
                </p>

                {report.reporter ? (
                  <p className="mt-1 text-sm muted">
                    Reported by {report.reporter.name} · {report.reporter.email}
                  </p>
                ) : null}
              </div>

              {/* Report action buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  disabled={isResolved}
                  onClick={() => act(report._id, 'removed')}
                  className={`rounded-xl px-3 py-2 font-black disabled:cursor-not-allowed disabled:opacity-70 ${
                    isRemoved
                      ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200'
                      : 'btn-outline'
                  }`}
                >
                  {isRemoved ? 'Removed' : 'Remove Prompt'}
                </button>

                <button
                  disabled={isResolved}
                  onClick={() => act(report._id, 'warned')}
                  className={`rounded-xl px-3 py-2 font-black disabled:cursor-not-allowed disabled:opacity-70 ${
                    isWarned
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200'
                      : 'btn-outline'
                  }`}
                >
                  {isWarned ? 'Warned' : 'Warn Creator'}
                </button>

                <button
                  disabled={isResolved}
                  onClick={() => act(report._id, 'dismissed')}
                  className={`rounded-xl px-3 py-2 font-black disabled:cursor-not-allowed disabled:opacity-70 ${
                    isDismissed
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200'
                      : 'btn-lime'
                  }`}
                >
                  {isDismissed ? 'Dismissed' : 'Dismiss / Not harmful'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state if no reports are submitted */}
        {reports.length === 0 ? (
          <Empty text="No reports submitted." />
        ) : null}
      </div>
    </div>
  );
}

export function AuditHistory({ data, page, setPage }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-black">Moderation History</h2>
      <p className="mt-2 text-sm muted">Permanent administrator record of reports, removals, warnings and moderation actions.</p>
      <div className="mt-5 grid gap-3">
        {data.entries.map((entry) => (
          <div className="soft-card rounded-3xl p-4" key={entry._id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <b className="capitalize">{entry.action.replaceAll('_', ' ')}</b>
              <time className="text-xs muted">{new Date(entry.createdAt).toLocaleString()}</time>
            </div>
            <p className="mt-1 muted">{entry.summary}</p>
            <p className="mt-2 text-xs muted">By {entry.actor?.name || 'System'} · {entry.targetType}</p>
          </div>
        ))}
        {!data.entries.length ? <Empty text="No moderation history yet." /> : null}
      </div>
      <Pagination pagination={data.pagination} page={page} setPage={setPage} />
    </div>
  );
}
