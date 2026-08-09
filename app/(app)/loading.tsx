export default function Loading() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-secondary mb-2" />
      <div className="h-4 w-72 rounded-lg bg-secondary mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="aspect-[16/9] sm:aspect-[2/1] rounded-2xl bg-secondary" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 rounded-2xl bg-secondary" />
            <div className="h-20 rounded-2xl bg-secondary" />
            <div className="h-20 rounded-2xl bg-secondary" />
          </div>
        </div>
        <div className="h-80 rounded-2xl bg-secondary" />
      </div>
    </div>
  )
}
