import { NextResponse } from 'next/server'

// Cache the rating for 24 hours to minimize API calls
let cachedRating: { rating: number; reviewCount: number; placeId?: string; timestamp: number } | null = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Business name for finding Place ID
const BUSINESS_NAME = 'Headshots by Detroit Photography'

async function findPlaceId(apiKey: string): Promise<string | null> {
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(BUSINESS_NAME)}&inputtype=textquery&fields=place_id&key=${apiKey}`
    
    const response = await fetch(searchUrl)
    if (!response.ok) return null
    
    const data = await response.json()
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].place_id
    }
    return null
  } catch {
    return null
  }
}

// Cached reviews
let cachedReviews: { reviews: any[]; timestamp: number } | null = null

export async function POST() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  let placeId = process.env.GOOGLE_PLACE_ID

  // Return cached reviews if still valid (cache for 24 hours)
  if (cachedReviews && Date.now() - cachedReviews.timestamp < CACHE_DURATION) {
    return NextResponse.json({ reviews: cachedReviews.reviews, cached: true })
  }

  if (!apiKey) {
    return NextResponse.json({ reviews: [], error: 'API not configured' })
  }

  try {
    if (!placeId) {
      placeId = await findPlaceId(apiKey)
      if (!placeId) {
        return NextResponse.json({ reviews: [], error: 'Could not find Place ID' })
      }
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
    const response = await fetch(url, { next: { revalidate: 86400 } })
    
    if (!response.ok) {
      return NextResponse.json({ reviews: [], error: 'API request failed' })
    }

    const data = await response.json()
    const reviews = data.result?.reviews || []

    cachedReviews = { reviews, timestamp: Date.now() }

    return NextResponse.json({ reviews })
  } catch (error) {
    return NextResponse.json({ reviews: [], error: 'Failed to fetch reviews' })
  }
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  let placeId = process.env.GOOGLE_PLACE_ID

  // Return cached data if still valid
  if (cachedRating && Date.now() - cachedRating.timestamp < CACHE_DURATION) {
    return NextResponse.json({
      rating: cachedRating.rating,
      reviewCount: cachedRating.reviewCount,
      cached: true,
    })
  }

  // If no API key, return default values
  if (!apiKey) {
    console.warn('Google Places API key not configured')
    return NextResponse.json({
      rating: 5.0,
      reviewCount: 203,
      cached: false,
      error: 'API not configured',
    })
  }

  try {
    // If no Place ID, try to find it by business name
    if (!placeId) {
      placeId = await findPlaceId(apiKey)
      if (!placeId) {
        throw new Error('Could not find Place ID for business')
      }
    }

    // Use legacy Places API for details (more reliable)
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`
    const legacyResponse = await fetch(legacyUrl, {
      next: { revalidate: 86400 },
    })
    
    if (!legacyResponse.ok) {
      throw new Error('Places API request failed')
    }
    
    const legacyData = await legacyResponse.json()
    
    if (legacyData.result) {
      cachedRating = {
        rating: legacyData.result.rating || 5.0,
        reviewCount: legacyData.result.user_ratings_total || 201,
        placeId: placeId,
        timestamp: Date.now(),
      }
      
      return NextResponse.json({
        rating: cachedRating.rating,
        reviewCount: cachedRating.reviewCount,
        cached: false,
      })
    }

    throw new Error('No result from Places API')
  } catch (error) {
    console.error('Error fetching Google rating:', error)
    
    // Return cached data if available, even if expired
    if (cachedRating) {
      return NextResponse.json({
        rating: cachedRating.rating,
        reviewCount: cachedRating.reviewCount,
        cached: true,
        stale: true,
      })
    }
    
    // Return default values as fallback
    return NextResponse.json({
      rating: 5.0,
      reviewCount: 203,
      cached: false,
      error: 'Failed to fetch rating',
    })
  }
}
