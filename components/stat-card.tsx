import { ReactNode } from 'react'

interface StatCardProps {
  icon?: ReactNode
  label: string
  value: string | number
  /**
   * 'default' — icon chip + uppercase label + large number (original style).
   * 'minimal' — plain label above a bold number, no icon. Matches the Home mock.
   */
  variant?: 'default' | 'minimal'
}

export function StatCard({ icon, label, value, variant = 'default' }: StatCardProps) {
  if (variant === 'minimal') {
    return (
      <div className="rounded-2xl bg-card p-4 sm:p-5 border border-border">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl sm:text-3xl font-semibold text-foreground">{value}</p>
      </div>
    )
  }

  return (
    <div className="group rounded-2xl bg-card p-6 border border-border hover:border-accent/50 transition-all hover:bg-secondary/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
          {icon}
        </div>
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-4xl font-bold text-foreground">{value}</p>
    </div>
  )
}
