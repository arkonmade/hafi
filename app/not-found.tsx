import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased font-sans">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <h1 className="text-xl font-semibold mb-2">Page not found</h1>
            <p className="text-sm text-muted-foreground mb-6">This page doesn't exist.</p>
            <Link href="/" className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors">
              Back to HAFI
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
