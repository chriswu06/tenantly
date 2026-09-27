"use client";

// Placeholder. Owner: C.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="p-5">
      <p>Something went wrong.</p>
      <button type="button" onClick={reset} className="text-accent">
        Try again
      </button>
    </main>
  );
}
