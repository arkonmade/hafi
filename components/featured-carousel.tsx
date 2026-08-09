'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Venue } from '@/lib/types'

interface FeaturedCarouselProps {
  venues: Venue[]
  /** Autoplay interval in ms. Set to 0 to disable. */
  interval?: number
}

/**
 * The Home hero carousel. Deliberately minimal — no LIVE badge, no CTA
 * copy — just image, name, location, and how many people are there right
 * now, because "who's there" is one of the four questions HAFI exists to
 * answer at a glance.
 */
export function FeaturedCarousel({ venues, interval = 6000 }: FeaturedCarouselProps) {
  const [active, setActive] = useState(0)
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!interval || venues.length <= 1 || isHovering) return
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % venues.length)
    }, interval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [interval, venues.length, isHovering])

  if (venues.length === 0) return null

  const venue = venues[active]

  return (
    <div
      className="group relative aspect-[16/9] sm:aspect-[2/1] w-full overflow-hidden rounded-2xl cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => router.push(`/venue/${venue.id}`)}
      role="link"
      tabIndex={0}
      aria-label={`View ${venue.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') router.push(`/venue/${venue.id}`)
      }}
    >
      {venues.map((v, i) => (
        <img
          key={v.id}
          src={v.image}
          alt={v.name}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-white">{venue.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-white/75">
          <span>{venue.district ?? venue.city}</span>
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span>{venue.currentFans} here now</span>
        </div>

        {/* Dot pagination */}
        {venues.length > 1 && (
          <div className="mt-4 flex items-center gap-1.5">
            {venues.map((v, i) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setActive(i)
                }}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
