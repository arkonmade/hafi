import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export function SimplePage({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all text-sm font-medium mb-6">
        <ChevronLeft className="h-4 w-4" />
        Back to HAFI
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      <div className="mt-8 space-y-5 text-sm sm:text-base text-muted-foreground leading-relaxed [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-accent [&_a]:hover:underline">
        {children}
      </div>
    </div>
  )
}
