'use client';

import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { DataTable, Empty, Pagination } from './primitives.js';

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
  // Handles approval and rejection. Featured status is ranked automatically.
  const moderate = async (id, action) => {
    const feedback =
      action === 'reject'
        ? prompt('Rejection feedback for the creator:')
        : undefined;

    if (action === 'reject' && !feedback) return;

    try {
      await api(`/dashboard/admin/prompts/${id}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({
          action,
          feedback,
        }),
      });

      toast.success('Prompt updated');

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

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        All Prompts
      </h2>

      {/* Prompt moderation list */}
      <div className="mt-5 grid gap-3">
        {data.prompts.map((item) => (
          <div
            className="soft-card rounded-3xl p-4"
            key={item._id}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <b>{item.title}</b>

                <p className="text-sm capitalize muted">
                  {item.creator?.name} · {item.visibility} · {item.status}
                  {item.automaticallyFeatured ? ' · Featured' : ''}
                </p>
              </div>

              {/* Admin prompt action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => moderate(item._id, 'approve')}
                  className="btn-lime rounded-xl px-3 py-2 text-sm font-black"
                >
                  Approve
                </button>

                <button
                  onClick={() => moderate(item._id, 'reject')}
                  className="btn-outline rounded-xl px-3 py-2 text-sm font-black"
                >
                  Reject
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
        ))}

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
    try {
      await api(`/dashboard/admin/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
        }),
      });

      toast.success('Report action saved');

      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-black">
        Reported Prompts
      </h2>

      {/* Reported prompts list */}
      <div className="mt-5 grid gap-4">
        {reports.map((report) => (
          <div
            className="soft-card rounded-3xl p-5"
            key={report._id}
          >
            <b>
              {report.prompt?.title || 'Removed Prompt'}
            </b>

            <p className="mt-2 muted">
              {report.reason} · {report.description || 'No description'} ·{' '}
              {report.status}
            </p>

            {/* Report action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => act(report._id, 'removed')}
                className="btn-outline rounded-xl px-3 py-2 font-black"
              >
                Remove Prompt
              </button>

              <button
                onClick={() => act(report._id, 'warned')}
                className="btn-outline rounded-xl px-3 py-2 font-black"
              >
                Warn Creator
              </button>

              <button
                onClick={() => act(report._id, 'dismissed')}
                className="btn-lime rounded-xl px-3 py-2 font-black"
              >
                Dismiss / Not harmful
              </button>
            </div>
          </div>
        ))}

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
