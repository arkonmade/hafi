'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

export function CheckInButton({ className = '' }: { className?: string }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  return (
    <button
      onClick={() => setIsCheckedIn((prev) => !prev)}
      className={`inline-flex items-center justify-center gap-2 rounded-lg py-3 px-6 font-semibold transition-colors ${
        isCheckedIn
          ? 'bg-accent/10 text-accent border border-accent'
          : 'bg-secondary text-foreground hover:bg-secondary/80'
      } ${className}`}
    >
      <MapPin className="h-4 w-4" />
      {isCheckedIn ? "You're checked in" : 'Check In'}
    </button>
  )
}
