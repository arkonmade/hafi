'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'

interface FollowButtonProps {
  initialFollowers: number
  className?: string
}

export function FollowButton({ initialFollowers, className = '' }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <button
      onClick={() => setIsFollowing((prev) => !prev)}
      className={`inline-flex items-center justify-center gap-2 rounded-lg py-3 px-6 font-semibold transition-colors ${
        isFollowing
          ? 'bg-secondary text-foreground hover:bg-secondary/80'
          : 'bg-accent text-accent-foreground hover:bg-accent/90'
      } ${className}`}
    >
      {isFollowing ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {isFollowing ? 'Following' : 'Follow'}
      <span className={isFollowing ? 'text-muted-foreground' : 'text-accent-foreground/80'}>
        · {(initialFollowers + (isFollowing ? 1 : 0)).toLocaleString()}
      </span>
    </button>
  )
}
