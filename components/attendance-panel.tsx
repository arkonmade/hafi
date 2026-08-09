'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import { AvatarCluster } from '@/components/avatar-cluster'
import type { CommunityUser } from '@/lib/types'

interface AttendancePanelProps {
  goingCount: number
  friendsGoing: CommunityUser[]
}

export function AttendancePanel({ goingCount, friendsGoing }: AttendancePanelProps) {
  const [isGoing, setIsGoing] = useState(false)

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Who's there</h3>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {friendsGoing.length > 0 && <AvatarCluster avatars={friendsGoing.map((f) => f.avatar)} size="md" />}
          <div>
            <p className="text-sm text-foreground">
              <span className="font-semibold">{goingCount.toLocaleString()}</span> going
            </p>
            {friendsGoing.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {friendsGoing
                  .slice(0, 2)
                  .map((f) => f.name.split(' ')[0])
                  .join(', ')}
                {friendsGoing.length > 2 ? ` +${friendsGoing.length - 2} more` : ''} from your community
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsGoing((prev) => !prev)}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            isGoing
              ? 'bg-accent/10 text-accent border border-accent'
              : 'bg-accent text-accent-foreground hover:bg-accent/90'
          }`}
        >
          {isGoing ? "You're going" : "I'm going"}
        </button>
      </div>
    </div>
  )
}
