import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// Generate slug from building name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-+/g, '-')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.detroitphotography.com'
  
  // Static pages
  const staticPages = [
    '',
    '/book',
    '/blog',
    '/contact',
    '/headshot-photography-in-detroit',
    '/drone-photography',
    '/event-photography',
    '/branding-photography',
    '/architecture',
    '/architecture/map',
  ]

  // Headshot type pages
  const headshotTypes = [
    'business-headshots-detroit',
    'executive-headshots-detroit',
    'doctor-headshots-detroit',
    'lawyer-headshots-detroit',
    'realtor-headshots-detroit',
    'actor-headshots-in-detroit',
    'dating-headshots-in-detroit',
    'startup-headshots-in-detroit',
    'author-headshots-in-detroit',
    'ceo-headshots-detroit',
    'commercial-headshots-detroit',
    'company-headshots-in-detroit',
    'group-headshots-detroit',
    'office-headshots-detroit',
    'therapist-headshots-detroit',
  ]

  // City pages
  const cities = [
    'birmingham',
    'royal-oak',
    'troy',
    'ann-arbor',
    'southfield',
    'dearborn',
    'bloomfield-hills',
    'grosse-pointe',
    'farmington-hills',
    'novi',
    'plymouth',
    'northville',
    'canton',
  ]

  // Fetch all buildings for architecture section
  const { data: buildings } = await supabase
    .from('buildings')
    .select('name, updated_at')
    .order('name')

  // Fetch blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const sitemap: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Static pages
    ...staticPages.slice(1).map(page => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Headshot types
    ...headshotTypes.map(type => ({
      url: `${baseUrl}/headshot-types/${type}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // City pages
    ...cities.map(city => ({
      url: `${baseUrl}/headshot-photographer-in-${city}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Architecture buildings
    ...(buildings || []).map(building => ({
      url: `${baseUrl}/architecture/building/${generateSlug(building.name)}`,
      lastModified: building.updated_at ? new Date(building.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]

  return sitemap
}
