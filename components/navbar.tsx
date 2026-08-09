'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bell, Share2 } from 'lucide-react'

const navTabs = [
  { href: '/watch?venues', label: 'Discover', matchPrefix: '/watch' },
  { href: '/matches', label: 'Matches', matchPrefix: '/matches' },
  { href: '/news', label: 'News', matchPrefix: '/news' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo & Nav Tabs */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center flex-shrink-0" aria-label="HAFI home">
              <img
                src="/brand/hafi-wordmark-light.png"
                alt="HAFI"
                className="h-7 w-auto"
              />
            </Link>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center gap-8">
              {navTabs.map((tab) => {
                const isActive = pathname.startsWith(tab.matchPrefix)
                return (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-full overflow-hidden h-9 w-9 border border-border hover:border-accent transition-colors"
              aria-label="Profile"
            >
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Profile" className="h-full w-full object-cover" />
            </Link>
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
