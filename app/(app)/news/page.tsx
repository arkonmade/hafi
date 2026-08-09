import type { Metadata } from 'next'
import { getArticles, getArticleCategories } from '@/lib/data/articles'
import { SectionHeader } from '@/components/section-header'
import { ArticleCard } from '@/components/article-card'
import { NewsFilters } from '@/components/news-filters'
import type { Article } from '@/lib/types'

export const metadata: Metadata = {
  title: 'News — HAFI',
  description: 'Stories, club news, and community highlights from across Rwandan sport.',
}

interface NewsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams
  const category = typeof params.category === 'string' ? (params.category as Article['category']) : undefined

  const [filtered, categories] = await Promise.all([
    getArticles({ category }),
    getArticleCategories(),
  ])
  const [featured, ...rest] = filtered

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <section>
        <SectionHeader title="News" subtitle="Stories, club news, and community highlights from across Rwandan sport" />
      </section>

      <NewsFilters categories={categories} />

      {filtered.length > 0 ? (
        <section className="space-y-6">
          {featured && (
            <div className="max-w-2xl">
              <ArticleCard article={featured} size="large" />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No stories in this category yet</p>
          <p className="text-muted-foreground">Check back soon, or browse another category</p>
        </div>
      )}
    </div>
  )
}
