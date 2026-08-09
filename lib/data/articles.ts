import { ARTICLES } from '@/lib/constants'
import type { Article } from '@/lib/types'

export interface ArticleFilters {
  category?: Article['category']
  sport?: string
}

export async function getArticles(filters: ArticleFilters = {}): Promise<Article[]> {
  return ARTICLES.filter((a) => {
    if (filters.category && a.category !== filters.category) return false
    if (filters.sport && a.sport?.toLowerCase() !== filters.sport.toLowerCase()) return false
    return true
  })
}

export async function getArticleById(id: number): Promise<Article | null> {
  return ARTICLES.find((a) => a.id === id) ?? null
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return ARTICLES.find((a) => a.slug === slug) ?? null
}

export async function getArticleCategories(): Promise<string[]> {
  return Array.from(new Set(ARTICLES.map((a) => a.category)))
}

/** Other articles sharing a category or sport, excluding the article itself. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  return ARTICLES.filter(
    (a) => a.id !== article.id && (a.category === article.category || (a.sport && a.sport === article.sport)),
  ).slice(0, limit)
}
