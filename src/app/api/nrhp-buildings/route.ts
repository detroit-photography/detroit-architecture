import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Find buildings with NRHP images
  const { data: images, error } = await supabase
    .from('nrhp_images')
    .select('building_id, id, filename, original_caption, copyright_status, is_published')
    .order('building_id')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Group by building
  const buildingIds = [...new Set(images?.map(i => i.building_id) || [])]
  
  // Get building names
  const { data: buildings } = await supabase
    .from('buildings')
    .select('id, name, slug')
    .in('id', buildingIds)
  
  const buildingMap = new Map(buildings?.map(b => [b.id, b]) || [])
  
  // Group images by building
  const grouped = buildingIds.map(bid => {
    const building = buildingMap.get(bid)
    const buildingImages = images?.filter(i => i.building_id === bid) || []
    return {
      building_id: bid,
      building_name: building?.name || 'Unknown',
      slug: building?.slug,
      image_count: buildingImages.length,
      published_count: buildingImages.filter(i => i.is_published).length,
      images: buildingImages
    }
  })
  
  return NextResponse.json({
    total_buildings: buildingIds.length,
    total_images: images?.length || 0,
    buildings: grouped.sort((a, b) => b.image_count - a.image_count)
  })
}

