'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/libs/api.js';
import PromptCard from './PromptCard.js';

// Default data used when API request fails
const emptyData = {
  prompts: [],
  filters: {
    categories: [],
    tools: [],
    difficulties: ['Beginner', 'Intermediate', 'Pro'],
  },
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

export default function AllPromptsClient() {
  // Read search params from URL
  const params = useSearchParams();

  // Stores filter values for the prompt marketplace
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    category: params.get('category') || '',
    tool: '',
    difficulty: '',
    sort: 'popular',
    page: 1,
  });

  // Stores prompt list and filter data from backend
  const [data, setData] = useState(null);

  // Stores API error message
  const [error, setError] = useState('');

  useEffect(() => {
    // Convert filter object into URL query string
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== '')
    );

    // Abort controller prevents old requests from updating state
    const controller = new AbortController();

    api(`/prompts?${query}`, {
      signal: controller.signal,
    })
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setData(emptyData);
          setError(requestError.message);
        }
      });

    return () => controller.abort();
  }, [filters]);

  // Updates filter value and resets page except when changing page itself
  const set = (key, value) => {
    setError('');

    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === 'page' ? value : 1,
    }));
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="section-label">
          Public marketplace route
        </p>

        <h1 className="mt-3 font-display text-4xl font-black sm:text-5xl">
          All Prompts Page
        </h1>

        <div className="hard-card mt-8 rounded-[2rem] p-4 sm:p-6">
          {/* Search and filter controls */}
          <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
            <input
              value={filters.search}
              onChange={(event) => set('search', event.target.value)}
              className="input-box rounded-2xl px-4 py-3"
              placeholder="Search by title, tag or AI tool..."
            />

            <FilterSelect
              label="All Categories"
              value={filters.category}
              values={data?.filters?.categories || []}
              onChange={(value) => set('category', value)}
            />

            <FilterSelect
              label="All Tools"
              value={filters.tool}
              values={data?.filters?.tools || []}
              onChange={(value) => set('tool', value)}
            />

            <FilterSelect
              label="All Difficulty"
              value={filters.difficulty}
              values={data?.filters?.difficulties || []}
              onChange={(value) => set('difficulty', value)}
            />

            <select
              value={filters.sort}
              onChange={(event) => set('sort', event.target.value)}
              className="rounded-2xl px-4 py-3"
            >
              <option value="popular">
                Most Popular
              </option>

              <option value="copied">
                Most Copied
              </option>

              <option value="latest">
                Latest
              </option>
            </select>
          </div>

          {/* Error message */}
          {error ? (
            <p className="mt-5 rounded-2xl bg-red-500/10 p-4 text-sm font-black text-red-500">
              {error}
            </p>
          ) : null}

          {/* Result count */}
          <p className="mt-5 text-sm font-black muted">
            Showing {data?.prompts?.length || 0} of{' '}
            {data?.pagination?.total || 0} approved public prompts
          </p>

          {/* Prompt cards */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.prompts?.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
              />
            ))}

            {/* Empty state if no prompt matches the filters */}
            {data && data.prompts.length === 0 ? (
              <p className="soft-card rounded-3xl p-6 muted">
                No public prompts match these filters.
              </p>
            ) : null}

            {/* Loading skeleton cards */}
            {!data
              ? Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="skeleton h-[310px] rounded-[1.8rem]"
                  />
                ))
              : null}
          </div>

          {/* Pagination controls */}
          <div className="mt-6 flex items-center justify-between rounded-3xl border border-dashed border-[var(--line)] p-4">
            <button
              disabled={filters.page <= 1}
              onClick={() => set('page', filters.page - 1)}
              className="btn-outline rounded-2xl px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            <b>
              Page {data?.pagination?.page || 1} of{' '}
              {data?.pagination?.pages || 1}
            </b>

            <button
              disabled={filters.page >= (data?.pagination?.pages || 1)}
              onClick={() => set('page', filters.page + 1)}
              className="btn-outline rounded-2xl px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ label, value, values, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-2xl px-4 py-3"
    >
      <option value="">
        {label}
      </option>

      {values.map((item) => (
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      ))}
    </select>
  );
}