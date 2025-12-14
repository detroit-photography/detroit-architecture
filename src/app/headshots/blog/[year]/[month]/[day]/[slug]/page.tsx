import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts, getPostPath } from '@/lib/blog-data'
import { HubSpotForm } from '@/components/headshots/HubSpotForm'
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'

interface Props {
  params: { year: string; month: string; day: string; slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => {
    const date = new Date(post.date)
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString(),
      day: date.getDate().toString(),
      slug: post.slug,
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return { title: 'Page Not Found' }
  }

  return {
    title: `${post.title} | Detroit Photography Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : undefined,
    },
  }
}

// Function to intersperse images within content
function createInterspersedContent(content: string, images: string[], title: string): string {
  // Parse content into paragraphs and headings
  const sections = content.split(/(<h[23][^>]*>.*?<\/h[23]>|<p>.*?<\/p>)/g).filter(Boolean)
  
  if (images.length <= 1 || sections.length < 4) {
    return content
  }

  // Calculate where to insert images (skip first image as it's the hero)
  const imagesToInsert = images.slice(1)
  const result: string[] = []
  
  // Determine insertion points - spread images evenly through content
  const insertionInterval = Math.max(3, Math.floor(sections.length / (imagesToInsert.length + 1)))
  let imageIndex = 0
  
  sections.forEach((section, index) => {
    result.push(section)
    
    // Insert image after every N sections (but not after headings)
    if (
      imageIndex < imagesToInsert.length &&
      (index + 1) % insertionInterval === 0 &&
      !section.startsWith('<h')
    ) {
      const isEven = imageIndex % 2 === 0
      const floatClass = isEven ? 'float-right ml-8 mb-6' : 'float-left mr-8 mb-6'
      
      result.push(`
        <figure class="my-8 ${floatClass} w-full md:w-1/2 clear-both">
          <img 
            src="${imagesToInsert[imageIndex]}" 
            alt="${title} - Photo ${imageIndex + 2}"
            class="w-full rounded-lg shadow-lg"
            loading="lazy"
          />
        </figure>
      `)
      imageIndex++
    }
  })
  
  // Add any remaining images at the end as a gallery
  if (imageIndex < imagesToInsert.length) {
    const remaining = imagesToInsert.slice(imageIndex)
    if (remaining.length > 0) {
      result.push('<div class="clear-both"></div>')
      result.push('<div class="grid grid-cols-2 gap-4 my-8">')
      remaining.forEach((img, idx) => {
        result.push(`
          <figure>
            <img 
              src="${img}" 
              alt="${title} - Photo ${imageIndex + idx + 2}"
              class="w-full rounded-lg shadow-lg aspect-square object-cover"
              loading="lazy"
            />
          </figure>
        `)
      })
      result.push('</div>')
    }
  }
  
  return result.join('')
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Verify the date matches
  const postDate = new Date(post.date)
  if (
    postDate.getFullYear().toString() !== params.year ||
    (postDate.getMonth() + 1).toString() !== params.month ||
    postDate.getDate().toString() !== params.day
  ) {
    notFound()
  }

  const readingTime = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)
  const interspersedContent = createInterspersedContent(post.content, post.images, post.title)

  return (
    <article className="min-h-screen bg-white">
      {/* Pillar Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href="/headshots/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-detroit-green transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All Articles
          </Link>

          {/* Category */}
          <div className="mb-4">
            <span className="text-detroit-gold text-sm font-semibold uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt/Lede */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-2">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image - Full Width */}
      <div className="w-full bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <figure className="relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full aspect-[2/1] object-cover"
            />
            {post.images.length > 1 && (
              <figcaption className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {post.images.length} photos in this article
              </figcaption>
            )}
          </figure>
        </div>
      </div>

      {/* Article Body - Pillar Layout - OPTIMIZED FOR READABILITY */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Article Content with excellent readability */}
        <div 
          className="
            prose prose-xl max-w-none
            
            /* Base - larger text, more line height */
            text-[1.25rem]
            leading-[2]
            text-gray-700
            
            /* Headings */
            prose-headings:font-display 
            prose-headings:text-gray-900 
            prose-headings:mt-16
            prose-headings:mb-8
            
            /* H2 - Major sections with visual break */
            prose-h2:text-2xl 
            prose-h2:md:text-3xl 
            prose-h2:border-l-4 
            prose-h2:border-detroit-gold 
            prose-h2:pl-6
            prose-h2:py-4
            prose-h2:bg-gray-50
            prose-h2:rounded-r
            
            /* H3 - Subsections */
            prose-h3:text-xl 
            prose-h3:md:text-2xl
            prose-h3:text-detroit-green
            prose-h3:mt-14
            prose-h3:mb-6
            
            /* Paragraphs - MUCH MORE SPACING */
            [&_p]:text-[1.2rem]
            [&_p]:md:text-[1.3rem]
            [&_p]:leading-[2.1]
            [&_p]:mb-10
            [&_p]:text-gray-700
            
            /* Links */
            prose-a:text-detroit-green 
            prose-a:no-underline 
            prose-a:border-b-2
            prose-a:border-detroit-gold
            hover:prose-a:text-detroit-gold
            prose-a:transition-colors
            
            /* Lists - Card-style items */
            [&_ul]:list-none
            [&_ul]:my-10
            [&_ul]:pl-0
            [&_ul]:space-y-4
            [&_ul_li]:relative
            [&_ul_li]:pl-10
            [&_ul_li]:py-4
            [&_ul_li]:pr-4
            [&_ul_li]:bg-gray-50
            [&_ul_li]:rounded-lg
            [&_ul_li]:text-[1.1rem]
            [&_ul_li]:leading-relaxed
            [&_ul_li:before]:content-['✓']
            [&_ul_li:before]:absolute
            [&_ul_li:before]:left-4
            [&_ul_li:before]:top-4
            [&_ul_li:before]:text-detroit-gold
            [&_ul_li:before]:font-bold
            [&_ul_li:before]:text-lg
            
            /* Ordered lists */
            [&_ol]:my-10
            [&_ol]:pl-0
            [&_ol]:space-y-4
            [&_ol_li]:pl-4
            [&_ol_li]:py-3
            [&_ol_li]:text-[1.1rem]
            [&_ol_li]:leading-relaxed
            
            /* Strong */
            prose-strong:text-gray-900
            prose-strong:font-bold
            
            /* Images within content */
            [&_figure]:my-14
            [&_figure_img]:rounded-xl
            [&_figure_img]:shadow-2xl
            
            /* First paragraph drop cap */
            [&>p:first-of-type]:first-letter:float-left
            [&>p:first-of-type]:first-letter:text-7xl
            [&>p:first-of-type]:first-letter:font-display
            [&>p:first-of-type]:first-letter:text-detroit-green
            [&>p:first-of-type]:first-letter:mr-4
            [&>p:first-of-type]:first-letter:mt-2
            [&>p:first-of-type]:first-letter:leading-none
            
            /* Clear floats after sections */
            [&_h2]:clear-both
            [&_h3]:clear-both
            
            /* Blockquotes */
            [&_blockquote]:border-l-4
            [&_blockquote]:border-detroit-gold
            [&_blockquote]:bg-detroit-cream
            [&_blockquote]:py-6
            [&_blockquote]:px-8
            [&_blockquote]:my-12
            [&_blockquote]:italic
            [&_blockquote]:rounded-r-lg
          "
          dangerouslySetInnerHTML={{ __html: interspersedContent }}
        />
        
        {/* Clear any remaining floats */}
        <div className="clear-both" />

        {/* Divider */}
        <hr className="my-16 border-gray-200" />

        {/* Author Box */}
        <div className="flex items-start gap-6 p-8 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-detroit-green rounded-full flex items-center justify-center text-white text-xl font-display flex-shrink-0">
            AP
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">About the Author</div>
            <div className="font-display text-xl text-gray-900 mb-2">{post.author}</div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Andrew Petrov is a professional photographer and the founder of Detroit Photography, 
              Metro Detroit's premier headshot and portrait studio. With a studio in the historic 
              Bagley Mansion, he specializes in creating timeless, professional imagery for 
              executives, entrepreneurs, and creative professionals.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-12 bg-gradient-to-br from-detroit-green to-detroit-green/90 p-8 md:p-12 rounded-xl text-center text-white">
          <h2 className="font-display text-2xl md:text-3xl mb-4">
            Ready for Professional Headshots?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Book a session at our Bagley Mansion studio. Starting at $149 with unlimited 
            time, wardrobe changes, and hand-painted backdrops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/headshots/book"
              className="inline-block bg-white text-detroit-green px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-detroit-gold hover:text-white transition-colors rounded"
            >
              Book Your Session
            </Link>
            <Link
              href="/headshots/headshot-photography-in-detroit"
              className="inline-block border-2 border-white text-white px-8 py-4 text-sm uppercase tracking-wider font-bold hover:bg-white hover:text-detroit-green transition-colors rounded"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Email Capture */}
        <div className="mt-12 border border-gray-200 p-8 rounded-xl">
          <div className="text-center mb-6">
            <h3 className="font-display text-xl text-gray-900 mb-2">
              Get Our Complete Pricing Guide
            </h3>
            <p className="text-gray-600 text-sm">
              Instant access to our full pricing menu and package options.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <HubSpotForm emailOnly />
          </div>
        </div>
      </div>

      {/* Related Articles - could be added */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-2xl text-center text-gray-900 mb-8">
            More from the Blog
          </h2>
          <div className="flex justify-center">
            <Link
              href="/headshots/blog"
              className="text-detroit-green font-medium hover:text-detroit-gold transition-colors"
            >
              Browse All Articles →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
