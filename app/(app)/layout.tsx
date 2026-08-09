import { Navbar } from '@/components/navbar'
import { BottomNav } from '@/components/bottom-nav'
import { Footer } from '@/components/footer'

/**
 * Shared shell for every primary HAFI screen.
 *
 * IA decision (see implementation notes): a single top nav (desktop) +
 * bottom nav (mobile) replaces the old persistent left sidebar, so this
 * is the one place the app chrome is assembled. Individual pages only
 * render their own content and are responsible for their own max-width
 * container, matching how `app/(app)/home.tsx` already works.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Reserve space so content isn't hidden behind the fixed mobile bottom nav */}
      <div className="h-20 md:h-0" />
      <BottomNav />
    </div>
  )
}
