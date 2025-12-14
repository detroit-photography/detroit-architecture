import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
}

export async function POST() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // First, ensure the slug column exists (will need to be done manually in Supabase)
  // For now, we'll just generate slugs and return them
  
  const { data: buildings, error } = await supabase
    .from('buildings')
    .select('id, name')
    .order('name')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  const slugMap: Record<string, string> = {}
  const usedSlugs = new Set<string>()
  
  for (const building of buildings || []) {
    let slug = generateSlug(building.name)
    
    // Handle duplicates by adding a suffix
    let finalSlug = slug
    let counter = 2
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${slug}-${counter}`
      counter++
    }
    usedSlugs.add(finalSlug)
    slugMap[building.id] = finalSlug
  }
  
  return NextResponse.json({
    total: Object.keys(slugMap).length,
    slugs: slugMap,
    message: 'Generated slugs. Add a slug column to buildings table and run update to persist.',
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to generate slugs for all buildings.',
  })
}
