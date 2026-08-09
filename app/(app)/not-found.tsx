import Link from 'next/link'
import type { Metadata } from 'next'
import { SearchX } from 'lucide-react'

// Known Next.js App Router limitation: because app/(app)/loading.tsx streams
// a skeleton immediately, the HTTP response has already started as 200
// before notFound() can run — the status can't retroactively become 404
// once streaming begins (see Next.js docs on notFound() + Suspense). The
// documented mitigation is `noindex` here so search engines don't index
// these as real pages despite the 200 status code.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-lg mx-auto text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold text-foreground mb-2">Page not found</h1>
      <p className="text-sm text-muted-foreground mb-6">
        We couldn't find what you're looking for. It may have moved, or the link might be outdated.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          Back to HAFI
        </Link>
        <Link
          href="/watch?venues"
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors"
        >
          Discover venues
        </Link>
      </div>
    </div>
  )
}
