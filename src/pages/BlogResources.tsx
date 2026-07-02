import { useEffect, useState } from 'react'
import {
  BookOpen,
  Clock,
  TrendingUp,
  ChevronRight,
  Star,
  ArrowRight,
  FileText,
  Video,
  Podcast,
  Download,
  ExternalLink,
  Calendar,
  User,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { getArticles } from '@/lib/data/articles'
import type { Article } from '@/types/domain'

const categories = [
  { id: 'all', label: 'All Resources', count: 48 },
  { id: 'guides', label: 'Guides & How-Tos', count: 16 },
  { id: 'market', label: 'Market Insights', count: 12 },
  { id: 'stories', label: 'Worker Stories', count: 10 },
  { id: 'policy', label: 'Policy Updates', count: 6 },
  { id: 'training', label: 'Training Tips', count: 4 },
]

const featuredArticle = {
  title: 'The Complete Guide to Ethical Workforce Migration in 2025',
  excerpt:
    'Everything you need to know about navigating the global job market ethically. From choosing the right recruitment agency to understanding your rights abroad, this comprehensive guide covers it all.',
  image: '/images/blog-departure.jpg',
  category: 'Guides & How-Tos',
  readTime: '12 min read',
  date: 'June 10, 2025',
  author: 'Dr. Sarah Chen',
  authorRole: 'Migration Policy Expert',
  featured: true,
}


const resourceTypes = [
  { icon: FileText, label: 'E-Books', count: 12 },
  { icon: Video, label: 'Video Guides', count: 24 },
  { icon: Podcast, label: 'Podcasts', count: 8 },
  { icon: Download, label: 'Templates', count: 16 },
]

export default function BlogResources() {
  const [articles, setArticles] = useState<Article[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const { ref: featuredRef, isVisible: featuredVisible } = useScrollAnimation()

  useEffect(() => {
    getArticles().then(setArticles)
  }, [])

  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter(
          a =>
            a.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') ===
            activeCategory
        )

  return (
    <div className="pt-[60px] min-h-screen">
      {/* Header */}
      <section className="relative py-16 lg:py-20 bg-muted/40 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              Knowledge Hub
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Blog & <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base">
              Expert insights, worker stories, market analysis, and practical guides
              to help you navigate ethical workforce mobility successfully.
            </p>
          </div>

          {/* Resource Types */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {resourceTypes.map(type => (
              <div
                key={type.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-brand-gold/20 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                  <type.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <div className="text-sm font-medium text-card-foreground">
                    {type.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {type.count} resources
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                    : 'bg-muted/50 text-muted-foreground border border-border hover:border-border'
                }`}
              >
                {cat.label}
                <span
                  className={`text-[10px] ${
                    activeCategory === cat.id
                      ? 'text-brand-gold/60'
                      : 'text-muted-foreground'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Featured Article */}
        <section ref={featuredRef} className="mb-14">
          <div
            className="relative rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer"
            style={{
              opacity: featuredVisible ? 1 : 0,
              transform: featuredVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease',
            }}
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/90 hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-[10px] font-medium text-brand-gold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-brand-gold" />
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-6 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-[11px] text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-md bg-brand-gold/10 text-brand-gold">
                    {featuredArticle.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredArticle.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {featuredArticle.date}
                  </span>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4 group-hover:text-brand-gold transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-teal" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-card-foreground">
                        {featuredArticle.author}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {featuredArticle.authorRole}
                      </div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-brand-gold font-medium group-hover:gap-2 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="group rounded-2xl bg-card border border-border hover:border-brand-gold/20 overflow-hidden transition-all duration-500 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white">
                    {article.category}
                  </span>
                  {article.trending && (
                    <span className="px-2 py-0.5 rounded-md bg-brand-gold/20 backdrop-blur-sm text-[10px] text-brand-gold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-card-foreground mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-[11px] text-brand-gold font-medium">
                    Read More
                    <ChevronRight className="w-3 h-3" />
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-muted-foreground/80 transition-colors" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <BookOpen className="w-10 h-10 text-brand-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Stay Informed
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Get the latest articles, market insights, and policy updates delivered
              to your inbox every week.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-gold/50 transition-all"
              />
              <button className="px-5 py-3 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all flex items-center gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
