import { supabase } from '@/lib/supabase'
import { mockArticles } from '@/data/mockArticles'
import type { Article } from '@/types/domain'

interface ArticleRow {
  id: string
  title: string
  excerpt: string | null
  image_url: string | null
  category: string | null
  read_time: string | null
  published_at: string
  trending: boolean
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function mapRow(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? '',
    image: row.image_url ?? '/images/blog-placeholder.svg',
    category: row.category ?? '',
    readTime: row.read_time ?? '',
    date: formatDate(row.published_at),
    trending: row.trending,
  }
}

// Falls back to bundled demo articles whenever the live `blog_articles`
// table has no rows yet, so Blog & Resources keeps showing full content for
// client demos until real articles are published.
export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('blog_articles')
    .select('id, title, excerpt, image_url, category, read_time, published_at, trending')
    .order('published_at', { ascending: false })

  if (error || !data || data.length === 0) {
    return mockArticles
  }

  return (data as ArticleRow[]).map(mapRow)
}
