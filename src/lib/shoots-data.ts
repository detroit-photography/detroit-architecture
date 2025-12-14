export interface Shoot {
  slug: string
  title: string
  description: string
  date: string
  location?: string // Links to architecture building slug
  locationName?: string
  tags: string[]
  coverImage: string
  images: {
    src: string
    alt: string
  }[]
}

// Sample shoots data - in production this could come from a CMS or markdown files
export const shoots: Shoot[] = [
  {
    slug: 'executive-portraits-acme-corp',
    title: 'Executive Portraits for Acme Corp',
    description: 'Professional headshots for the executive leadership team at Acme Corporation. Shot at our Bagley Mansion studio with a classic, timeless aesthetic.',
    date: 'December 2024',
    location: 'bagley-mansion', // Links to architecture entry
    locationName: 'Bagley Mansion',
    tags: ['headshots', 'corporate', 'executive'],
    coverImage: '/images/headshots/headshot-3.jpg',
    images: [
      { src: '/images/headshots/headshot-3.jpg', alt: 'Executive portrait' },
      { src: '/images/headshots/headshot-4.jpg', alt: 'Executive portrait' },
      { src: '/images/headshots/headshot-5.jpg', alt: 'Executive portrait' },
      { src: '/images/headshots/headshot-6.jpg', alt: 'Executive portrait' },
    ],
  },
  {
    slug: 'team-photos-detroit-startup',
    title: 'Team Photos for Detroit Startup',
    description: 'Modern, approachable team photos for a growing Detroit tech startup. Individual headshots plus group shots in our historic studio.',
    date: 'November 2024',
    location: 'bagley-mansion',
    locationName: 'Bagley Mansion',
    tags: ['headshots', 'team', 'corporate'],
    coverImage: '/images/headshots/team-photo.jpg',
    images: [
      { src: '/images/headshots/team-photo.jpg', alt: 'Team photo' },
      { src: '/images/headshots/headshot-7.jpg', alt: 'Team member headshot' },
      { src: '/images/headshots/headshot-8.jpg', alt: 'Team member headshot' },
    ],
  },
  {
    slug: 'professional-headshots-october',
    title: 'Professional Headshots - October Collection',
    description: 'A selection of professional headshots from October 2024. Business professionals, entrepreneurs, and creatives.',
    date: 'October 2024',
    location: 'bagley-mansion',
    locationName: 'Bagley Mansion',
    tags: ['headshots', 'professional'],
    coverImage: '/images/headshots/hero-headshot.jpg',
    images: [
      { src: '/images/headshots/hero-headshot.jpg', alt: 'Professional headshot' },
      { src: '/images/headshots/headshot-2.jpg', alt: 'Professional headshot' },
      { src: '/images/headshots/headshot-3.jpg', alt: 'Professional headshot' },
      { src: '/images/headshots/headshot-4.jpg', alt: 'Professional headshot' },
    ],
  },
  {
    slug: 'bagley-mansion-studio-showcase',
    title: 'Bagley Mansion Studio Showcase',
    description: 'Showcasing the beautiful historic spaces available for photography at our Bagley Mansion studio location.',
    date: 'September 2024',
    location: 'bagley-mansion',
    locationName: 'Bagley Mansion',
    tags: ['studio', 'architecture'],
    coverImage: '/images/headshots/bagley-mansion.jpg',
    images: [
      { src: '/images/headshots/bagley-mansion.jpg', alt: 'Bagley Mansion exterior' },
      { src: '/images/headshots/bagley-drone.jpg', alt: 'Aerial view' },
      { src: '/images/headshots/bagley-interior-1.jpg', alt: 'Historic fireplace' },
      { src: '/images/headshots/bagley-interior-3.jpg', alt: 'Bay window' },
      { src: '/images/headshots/bagley-interior-4.jpg', alt: 'Staircase' },
      { src: '/images/headshots/bagley-interior-5.jpg', alt: 'Interior details' },
    ],
  },
]

// Helper function to get shoots by location (for architecture pages)
export function getShootsByLocation(locationSlug: string): Shoot[] {
  return shoots.filter((shoot) => shoot.location === locationSlug)
}

// Helper function to get shoots by tag
export function getShootsByTag(tag: string): Shoot[] {
  return shoots.filter((shoot) => shoot.tags.includes(tag.toLowerCase()))
}

// Helper function to get a single shoot by slug
export function getShootBySlug(slug: string): Shoot | undefined {
  return shoots.find((shoot) => shoot.slug === slug)
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>()
  shoots.forEach((shoot) => shoot.tags.forEach((tag) => tags.add(tag)))
  return Array.from(tags)
}

// Get all unique locations
export function getAllLocations(): { slug: string; name: string }[] {
  const locations = new Map<string, string>()
  shoots.forEach((shoot) => {
    if (shoot.location && shoot.locationName) {
      locations.set(shoot.location, shoot.locationName)
    }
  })
  return Array.from(locations.entries()).map(([slug, name]) => ({ slug, name }))
}
