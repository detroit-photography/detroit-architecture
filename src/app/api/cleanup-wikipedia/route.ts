import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Convert HTML to plain text
function htmlToPlainText(html: string): string {
  if (!html || html === 'NOT_FOUND') return html
  
  // Check if it's already plain text (no HTML tags)
  if (!/<[^>]+>/.test(html)) {
    return html
  }
  
  let text = html
  
  // Remove style and script tags and their content
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  
  // Remove Wikipedia-specific elements
  text = text.replace(/<div[^>]*class="[^"]*mw-[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
  text = text.replace(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
  text = text.replace(/<table[^>]*class="[^"]*navbox[^"]*"[^>]*>[\s\S]*?<\/table>/gi, '')
  text = text.replace(/<div[^>]*class="[^"]*shortdescription[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
  text = text.replace(/<link[^>]*>/gi, '')
  text = text.replace(/<sup[^>]*class="[^"]*reference[^"]*"[^>]*>[\s\S]*?<\/sup>/gi, '')
  
  // Convert headers to plain text with newlines
  text = text.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n\n$1\n')
  
  // Convert paragraphs to text with newlines
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
  
  // Convert list items
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '• $1\n')
  
  // Convert line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n')
  
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '')
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
  
  // Clean up whitespace
  text = text
    .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
    .replace(/[ \t]+/g, ' ')     // Collapse spaces
    .replace(/^\s+|\s+$/gm, '')  // Trim each line
    .trim()
  
  // Remove "See also", "References", etc sections and everything after
  const cleanupPatterns = [
    /\n\s*See also[\s\S]*/i,
    /\n\s*References[\s\S]*/i,
    /\n\s*External links[\s\S]*/i,
    /\n\s*Notes[\s\S]*/i,
    /\n\s*Further reading[\s\S]*/i,
    /\n\s*Bibliography[\s\S]*/i,
  ]
  for (const pattern of cleanupPatterns) {
    text = text.replace(pattern, '')
  }
  
  return text.trim()
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Get count of entries that look like HTML
  const { data: htmlEntries, error } = await supabase
    .from('buildings')
    .select('id, name, wikipedia_entry')
    .not('wikipedia_entry', 'is', null)
    .neq('wikipedia_entry', 'NOT_FOUND')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Count how many have HTML
  const htmlCount = htmlEntries?.filter(b => 
    b.wikipedia_entry && /<[^>]+>/.test(b.wikipedia_entry)
  ).length || 0
  
  const plainCount = (htmlEntries?.length || 0) - htmlCount
  
  return NextResponse.json({
    total: htmlEntries?.length || 0,
    htmlEntries: htmlCount,
    plainTextEntries: plainCount,
    message: `${htmlCount} entries have HTML that needs conversion. POST to convert them to plain text.`
  })
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { searchParams } = new URL(request.url)
  const dryRun = searchParams.get('dryRun') === 'true'
  
  // Get all wikipedia entries that contain HTML
  const { data: buildings, error } = await supabase
    .from('buildings')
    .select('id, name, wikipedia_entry')
    .not('wikipedia_entry', 'is', null)
    .neq('wikipedia_entry', 'NOT_FOUND')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  const results: { id: string; name: string; hadHtml: boolean; newLength?: number; error?: string }[] = []
  let converted = 0
  let skipped = 0
  let errors = 0
  
  for (const building of buildings || []) {
    const hasHtml = building.wikipedia_entry && /<[^>]+>/.test(building.wikipedia_entry)
    
    if (!hasHtml) {
      skipped++
      continue
    }
    
    const plainText = htmlToPlainText(building.wikipedia_entry)
    
    if (dryRun) {
      results.push({
        id: building.id,
        name: building.name,
        hadHtml: true,
        newLength: plainText.length
      })
      converted++
      continue
    }
    
    // Actually update the database
    const { error: updateError } = await supabase
      .from('buildings')
      .update({ wikipedia_entry: plainText })
      .eq('id', building.id)
    
    if (updateError) {
      errors++
      results.push({
        id: building.id,
        name: building.name,
        hadHtml: true,
        error: updateError.message
      })
    } else {
      converted++
      results.push({
        id: building.id,
        name: building.name,
        hadHtml: true,
        newLength: plainText.length
      })
    }
  }
  
  return NextResponse.json({
    dryRun,
    total: buildings?.length || 0,
    converted,
    skipped,
    errors,
    results: results.slice(0, 50), // Only return first 50 for readability
    message: dryRun 
      ? `DRY RUN: Would convert ${converted} entries. Add ?dryRun=false to actually convert.`
      : `Converted ${converted} entries to plain text. ${skipped} already plain text. ${errors} errors.`
  })
}

