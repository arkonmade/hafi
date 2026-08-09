export function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1">
      <span className="relative inline-block h-2 w-2">
        <span className="absolute h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      </span>
      <span className="text-xs font-bold uppercase text-red-500">Live</span>
    </div>
  )
}
