import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Strip any embedded newlines from env vars
const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/[\n\r]/g, ''),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/[\n\r]/g, '')
)

// NRHP Image type
export type NRHPImage = {
  id: string
  created_at: string
  updated_at: string
  nrhp_entry_id: string | null
  building_id: string | null
  filename: string
  file_path: string
  file_size: number | null
  width: number | null
  height: number | null
  format: string | null
  source_pdf: string
  source_page: number
  extraction_method: string | null
  original_caption: string | null
  cleaned_caption: string | null
  title: string | null
  description: string | null
  photographer: string | null
  photo_date: string | null
  photo_year: number | null
  photo_era: string | null
  view_type: string | null
  view_direction: string | null
  features_shown: string[] | null
  copyright_status: string
  credit_line: string | null
  source_archive: string | null
  archive_reference: string | null
  is_primary: boolean
  is_published: boolean
  display_order: number
  needs_review: boolean
  quality_score: number | null
  processing_notes: string | null
  // Related data
  building?: {
    id: string
    name: string
  }
  nrhp_entry?: {
    id: string
    ref_number: string
  }
}

// GET - List NRHP images with filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const buildingId = searchParams.get('building_id')
  const nrhpEntryId = searchParams.get('nrhp_entry_id')
  const needsReview = searchParams.get('needs_review')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  
  try {
    let query = supabase
      .from('nrhp_images')
      .select(`
        *,
        building:buildings(id, name),
        nrhp_entry:nrhp_entries(id, ref_number)
      `)
      .is('deleted_at', null)
      .order('source_page', { ascending: true })
      .range(offset, offset + limit - 1)
    
    if (buildingId) {
      query = query.eq('building_id', buildingId)
    }
    
    if (nrhpEntryId) {
      query = query.eq('nrhp_entry_id', nrhpEntryId)
    }
    
    if (needsReview === 'true') {
      query = query.eq('needs_review', true)
    }
    
    const { data, error, count } = await query
    
    if (error) throw error
    
    return NextResponse.json({
      images: data,
      count: count,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching NRHP images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

// POST - Create new NRHP image entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('nrhp_images')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating NRHP image:', error)
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    )
  }
}

