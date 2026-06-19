'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumber } from '@/libs/utils.js';

export function Stats({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Dashboard stat cards */}
      {items.map(([label, value]) => (
        <div
          className="soft-card rounded-3xl p-5"
          key={label}
        >
          <p className="text-xs font-black uppercase muted">
            {label}
          </p>

          <h3 className="mt-2 truncate font-display text-3xl font-black capitalize">
            {typeof value === 'number' ? formatNumber(value) : String(value)}
          </h3>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChart({ data }) {
  return (
    <div className="chart-area mt-6 h-80">
      {/* Responsive chart wrapper */}
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="title" />

          <YAxis />

          <Tooltip />

          {/* Copies bar */}
          <Bar
            dataKey="copies"
            fill="#7c3aed"
          />

          {/* Bookmarks bar */}
          <Bar
            dataKey="bookmarks"
            fill="#d9ff2f"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Empty({ text }) {
  return (
    <p className="soft-card rounded-3xl p-5 muted">
      {text}
    </p>
  );
}

export function Pagination({ pagination, page, setPage }) {
  return (
    <div className="mt-6 flex items-center justify-between rounded-3xl border border-dashed border-[var(--line)] p-4">
      {/* Previous page button */}
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className="btn-outline rounded-xl px-4 py-2 disabled:opacity-40"
      >
        Previous
      </button>

      <b>
        Page {pagination.page} of {pagination.pages}
      </b>

      {/* Next page button */}
      <button
        disabled={page >= pagination.pages}
        onClick={() => setPage(page + 1)}
        className="btn-outline rounded-xl px-4 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="hard-card max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[2rem] p-6">
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-3xl font-black">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="btn-outline rounded-xl px-4 py-2 font-black"
          >
            Close
          </button>
        </div>

        {/* Modal body content */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DataTable({ rows, fields }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--line)]">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr>
            {/* Table headers */}
            {fields.map(([, label]) => (
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
          {/* Table rows */}
          {rows.map((row) => (
            <tr
              className="border-t border-[var(--line)]"
              key={row._id}
            >
              {fields.map(([key]) => (
                <td
                  className="p-4"
                  key={key}
                >
                  {String(row[key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state if there are no rows */}
      {rows.length === 0 ? (
        <Empty text="No records found." />
      ) : null}
    </div>
  );
}