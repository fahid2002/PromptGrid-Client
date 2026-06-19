'use client';

export default function ErrorPage({ error, reset }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="hard-card rounded-[2rem] p-10">
        {/* Error page title */}
        <h1 className="font-display text-4xl font-black">
          Something went wrong
        </h1>

        {/* Shows the actual error message */}
        <p className="mt-4 muted">
          {error.message}
        </p>

        {/* Retry button from Next.js error boundary */}
        <button
          onClick={reset}
          className="btn-lime mt-7 rounded-2xl px-6 py-4"
        >
          Try again
        </button>
      </div>
    </div>
  );
}