import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import { getArticleBySlug, getArticles, getRelatedArticles } from '@/lib/data/articles'
import { ArticleCard } from '@/components/article-card'
import { SITE_URL } from '@/lib/seo'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Story not found — HAFI' }

  return {
    title: `${article.title} | HAFI News`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const related = await getRelatedArticles(article)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: { '@type': 'Person', name: article.author },
    publisher: { '@type': 'Organization', name: 'HAFI' },
    articleSection: article.category,
    url: `${SITE_URL}/news/${article.slug}`,
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'News', item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 2, name: article.title },
    ],
  }

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <Link href="/news" className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all text-sm font-medium">
        <ChevronLeft className="h-4 w-4" />
        Back to News
      </Link>

      <article className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
              {article.category}
            </span>
            {article.sport && <span className="text-xs text-muted-foreground">{article.sport}</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{article.title}</h1>
          <p className="text-sm text-muted-foreground">
            {article.author} · {article.publishedAt}
          </p>
        </div>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-4 text-foreground/90 leading-relaxed">
          {(article.content ?? [article.excerpt]).map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-bold text-foreground">Related Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
