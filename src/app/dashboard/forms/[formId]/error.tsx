// error.tsx
("use client");
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-destructive">Something went wrong.</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
