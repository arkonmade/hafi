import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PanelProps {
  /** Optional heading rendered above the panel content. */
  title?: string
  /** Optional supporting copy under the title. */
  subtitle?: string
  /** Optional element rendered in the header, to the left of the title (e.g. an avatar cluster). */
  leading?: ReactNode
  /** Optional "View all" style link rendered at the top-right of the header. */
  viewAllHref?: string
  viewAllLabel?: string
  /** Removes the default padding, useful when the content manages its own spacing (e.g. an edge-to-edge list). */
  noPadding?: boolean
  className?: string
  children: ReactNode
}

/**
 * The bordered "panel" container used throughout the redesigned product —
 * Friends Activity, the home venue grid, the matches panel, facilities, etc.
 * Centralizing it here means every panel shares the same radius, border,
 * and header rhythm, so future sections (notifications, community feed,
 * ticketing) automatically look consistent.
 */
export function Panel({
  title,
  subtitle,
  leading,
  viewAllHref,
  viewAllLabel = 'View all',
  noPadding = false,
  className,
  children,
}: PanelProps) {
  const hasHeader = title || subtitle || leading

  return (
    <div className={cn('rounded-2xl border border-border bg-card', className)}>
      {hasHeader && (
        <div className={cn('flex items-start justify-between gap-4', noPadding ? 'p-5 pb-0' : 'p-5 pb-4')}>
          <div className="flex items-center gap-3 min-w-0">
            {leading}
            <div className="min-w-0">
              {title && <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>}
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:gap-1.5 transition-all flex-shrink-0 pt-0.5"
            >
              {viewAllLabel} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}
      <div className={noPadding ? '' : hasHeader ? 'px-5 pb-5' : 'p-5'}>{children}</div>
    </div>
  )
}
