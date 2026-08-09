import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  viewAllLink?: string
}

export function SectionHeader({ title, subtitle, viewAllLink }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
