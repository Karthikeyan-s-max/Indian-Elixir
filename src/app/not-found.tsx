export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="font-display text-6xl font-bold text-forest">404</h1>
      <h2 className="mt-4 font-display text-2xl font-bold text-ink">Page Not Found</h2>
      <p className="mt-2 max-w-md text-ink-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-copper mt-6 !px-6 !py-3">
        Back to Home
      </Link>
    </div>
  );
}
