interface AvatarClusterProps {
  avatars: string[]
  /** Overflow label shown as the last, teal-filled circle, e.g. "+1.2k". */
  extraLabel?: string
  size?: 'sm' | 'md'
}

export function AvatarCluster({ avatars, extraLabel, size = 'sm' }: AvatarClusterProps) {
  const dimension = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'

  return (
    <div className="flex items-center">
      {avatars.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          className={`${dimension} rounded-full object-cover ring-2 ring-card ${i === 0 ? '' : '-ml-2.5'}`}
        />
      ))}
      {extraLabel && (
        <div
          className={`${dimension} ${
            avatars.length > 0 ? '-ml-2.5' : ''
          } flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold ring-2 ring-card`}
        >
          {extraLabel}
        </div>
      )}
    </div>
  )
}
