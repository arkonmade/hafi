'use client'

import { useState } from 'react'

interface FilterChipsProps {
  items: string[]
  onFilterChange?: (selected: string[]) => void
  multiSelect?: boolean
}

export function FilterChips({ items, onFilterChange, multiSelect = false }: FilterChipsProps) {
  const [selected, setSelected] = useState<string[]>([])

  const handleClick = (item: string) => {
    let newSelected: string[]
    if (multiSelect) {
      newSelected = selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item]
    } else {
      newSelected = selected.includes(item) ? [] : [item]
    }
    setSelected(newSelected)
    onFilterChange?.(newSelected)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => handleClick(item)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected.includes(item)
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
