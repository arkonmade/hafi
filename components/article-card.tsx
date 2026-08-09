import Link from 'next/link'
import type { Article } from '@/lib/types'

export function ArticleCard({ article, size = 'default' }: { article: Article; size?: 'default' | 'large' }) {
  const isLarge = size === 'large'

  return (
    <Link href={`/news/${article.slug}`} className="block rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-colors">
      <div className={isLarge ? 'aspect-[16/9]' : 'aspect-[4/3]'}>
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
            {article.category}
          </span>
          {article.sport && <span className="text-xs text-muted-foreground">{article.sport}</span>}
        </div>
        <h3 className={`font-semibold text-foreground ${isLarge ? 'text-xl mb-2' : 'text-base mb-1.5'}`}>
          {article.title}
        </h3>
        <p className={`text-muted-foreground ${isLarge ? 'text-sm' : 'text-xs'} line-clamp-2`}>{article.excerpt}</p>
        <p className="text-xs text-muted-foreground mt-3">
          {article.author} · {article.publishedAt}
        </p>
      </div>
    </Link>
  )
}
