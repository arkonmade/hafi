'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function NewsFilters({ categories }: { categories: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const category = searchParams.get('category') ?? ''

  function setCategory(value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <section className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !category ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(category === cat ? null : cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === cat ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          {cat}
        </button>
      ))}
    </section>
  )
}
