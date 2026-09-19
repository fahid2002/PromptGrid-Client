'use client';

import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronLeft } from 'lucide-react';
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
    visibility: params.get('visibility') || '',
    sort: 'popular',
    page: 1,
    limit: 9,
  });

  // Stores prompt list and filter data from backend
  const [data, setData] = useState(null);

  // Stores API error message
  const [error, setError] = useState('');

  // Controls the mobile-only search and filter panel
  const [filtersOpen, setFiltersOpen] = useState(false);

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

        <div className="hard-card mt-8 rounded-4xl p-4 sm:p-6">
          {/* Search and filter controls */}
          <button
            type="button"
            className="mb-3 flex w-full items-center justify-between rounded-2xl border border-[var(--line)]/25 bg-[var(--card)] px-4 py-3 text-left font-semibold shadow-sm lg:hidden"
            aria-expanded={filtersOpen}
            aria-controls="all-prompts-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <span>Search &amp; filters</span>
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${filtersOpen ? '-rotate-90' : ''}`}
              aria-hidden="true"
            />
          </button>

          <div
            id="all-prompts-filters"
            className={`${filtersOpen ? 'grid' : 'hidden lg:grid'} gap-3 lg:grid-cols-[1.5fr_repeat(4,1fr)]`}
          >
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

            <FilterSelect
              label="All Prompts"
              value={filters.visibility}
              options={[
                { value: 'public', label: 'Free/Public only' },
                { value: 'private', label: 'Premium only' },
              ]}
              onChange={(value) => set('visibility', value)}
            />

            <FilterSelect
              label="Most Popular"
              value={filters.sort}
              options={[
                { value: 'popular', label: 'Most Popular' },
                { value: 'copied', label: 'Most Copied' },
                { value: 'latest', label: 'Latest' },
              ]}
              onChange={(value) => set('sort', value)}
            />

            <button
              type="button"
              className="btn-lime rounded-2xl px-4 py-3 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            >
              Search
            </button>
          </div>

          {/* Error message */}
          {error ? (
            <p className="mt-5 rounded-2xl bg-red-500/10 p-4 text-sm font-black text-red-500">
              {error}
            </p>
          ) : null}

          {/* Result count */}
          <p className="mt-5 text-sm font-black muted">
            Showing {data?.prompts?.length || 0} of {data?.pagination?.total || 0} prompts
          </p>

          {/* Prompt cards */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.prompts
              ?.map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                />
              ))}

            {/* Empty state if no prompt matches the filters */}
            {data && data.prompts.length === 0 ? (
              <p className="soft-card rounded-3xl p-6 muted">
                No prompts match these filters.
              </p>
            ) : null}

            {/* Loading skeleton cards */}
            {!data
              ? Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="skeleton h-77.5 rounded-[1.8rem]"
                  />
                ))
              : null}
          </div>

          {/* Pagination controls */}
          <div className="mt-6 flex items-center justify-between rounded-3xl border border-dashed border-(--line) p-4">
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

function FilterSelect({ label, value, values = [], options, onChange }) {
  const [open, setOpen] = useState(false);
  const items = options || values.map((item) => ({ value: item, label: item }));
  const selected = items.find((item) => item.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        className="input-box flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{selected?.label || label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-40 max-h-60 overflow-y-auto rounded-2xl border border-[var(--line)]/20 bg-[var(--card)] p-1 shadow-2xl"
          role="listbox"
        >
          <button
            type="button"
            className={`w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[var(--lime)]/30 ${!value ? 'bg-[var(--lime)]/20' : ''}`}
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            role="option"
            aria-selected={!value}
          >
            {label}
          </button>

          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[var(--lime)]/30 ${value === item.value ? 'bg-[var(--lime)]/20' : ''}`}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={value === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
