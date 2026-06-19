import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="hard-card rounded-[2rem] p-10">
        {/* 404 label */}
        <p className="section-label">
          404 route
        </p>

        {/* Main 404 title */}
        <h1 className="mt-4 font-display text-7xl font-black">
          404
        </h1>

        {/* Not found message */}
        <p className="mt-4 muted">
          The prompt page you are looking for does not exist.
        </p>

        {/* Link back to homepage */}
        <Link
          href="/"
          className="btn-lime mt-7 inline-block rounded-2xl px-6 py-4"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}