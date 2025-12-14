import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getPostPath } from '@/lib/blog-data'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Detroit Photography',
  description: 'Tips, guides, and insights about professional photography, headshots, and personal branding from Detroit Photography.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  // Group posts by category for the sidebar
  const categories = [...new Set(posts.map(p => p.category))]

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-detroit-gold text-sm font-semibold uppercase tracking-wider mb-4">
            The Journal
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
            Photography Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert tips, behind-the-scenes stories, and professional advice from Detroit's premier photography studio.
          </p>
        </div>
      </header>

      {/* Featured Article - Full Width Hero */}
      {featuredPost && (
        <section className="border-b border-gray-200">
          <Link href={getPostPath(featuredPost)} className="block group">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="aspect-[4/3] lg:aspect-auto relative overflow-hidden bg-gray-100">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                {/* Content */}
                <div className="p-8 lg:p-16 flex flex-col justify-center">
                  <span className="text-detroit-gold text-xs font-semibold uppercase tracking-wider mb-4">
                    Featured · {featuredPost.category}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-4 group-hover:text-detroit-green transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center text-detroit-green font-medium group-hover:text-detroit-gold transition-colors">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16">
          
          {/* Article List - Main Column */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8 pb-4 border-b border-gray-200">
              Latest Articles
            </h2>
            
            <div className="space-y-0 divide-y divide-gray-200">
              {remainingPosts.map((post, index) => (
                <Link 
                  key={post.slug} 
                  href={getPostPath(post)} 
                  className="block group py-8 first:pt-0"
                >
                  <article className="grid md:grid-cols-[200px_1fr] gap-6">
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] md:aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading={index < 6 ? "eager" : "lazy"}
                      />
                      {post.images.length > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {post.images.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-sm mb-2">
                        <span className="text-detroit-gold font-medium">
                          {post.category}
                        </span>
                        <span className="text-gray-300">·</span>
                        <time className="text-gray-500" dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl text-gray-900 mb-2 group-hover:text-detroit-green transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:border-l lg:border-gray-200 lg:pl-12">
            {/* Categories */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
                Topics
              </h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const count = posts.filter(p => p.category === category).length
                  return (
                    <div 
                      key={category}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-700 hover:text-detroit-green cursor-pointer transition-colors">
                        {category}
                      </span>
                      <span className="text-sm text-gray-400">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-detroit-cream p-6 rounded-xl">
              <h3 className="font-display text-lg text-gray-900 mb-3">
                Book Your Session
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Professional headshots starting at $149. Unlimited time at our Bagley Mansion studio.
              </p>
              <Link
                href="/book"
                className="block text-center bg-detroit-green text-white py-3 px-4 text-sm font-medium hover:bg-detroit-gold transition-colors rounded"
              >
                Book Now
              </Link>
            </div>

            {/* About */}
            <div className="mt-12">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                About
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Detroit Photography is Metro Detroit's premier headshot and portrait studio, 
                located in the historic Bagley Mansion. We specialize in professional headshots, 
                personal branding, and commercial photography.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="bg-detroit-green text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Ready to Elevate Your Image?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of professionals who trust Detroit Photography for their headshots and portraits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-detroit-gold hover:text-white transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/headshot-photography-in-detroit"
              className="inline-block border-2 border-white text-white px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-white hover:text-detroit-green transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
