import Link from 'next/link'
import type { CommunityActivity } from '@/lib/types'

function targetHref(activity: CommunityActivity): string | null {
  switch (activity.target.type) {
    case 'venue':
      return `/venue/${activity.target.id}`
    case 'match':
      return `/match/${activity.target.id}`
    default:
      return null
  }
}

export function ActivityRow({ activity }: { activity: CommunityActivity }) {
  const href = targetHref(activity)

  const content = (
    <div className="flex items-center gap-3 py-2.5">
      <img src={activity.user.avatar} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground truncate">
          <span className="font-semibold">{activity.user.name}</span>{' '}
          <span className="text-muted-foreground">{activity.action}</span>
        </p>
      </div>
      <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block hover:bg-secondary/40 -mx-2 px-2 rounded-lg transition-colors">
        {content}
      </Link>
    )
  }

  return content
}
