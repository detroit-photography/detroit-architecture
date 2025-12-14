import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function fetchWikipedia(url: string) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'DetroitArchitectureRepository/1.0 (https://www.detroitphotography.com; contact@detroitphotography.com)',
      'Accept': 'application/json',
    },
  })
  
  if (!res.ok) {
    throw new Error(`Wikipedia API error: ${res.status}`)
  }
  
  const text = await res.text()
  if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
    throw new Error('Wikipedia returned HTML')
  }
  
  return JSON.parse(text)
}

// Generate smart search variations from building name
function generateSearchVariations(name: string, architect?: string | null, address?: string | null): string[] {
  const variations: string[] = []
  const cleanName = name.trim()
  
  // Extract key parts of the name
  const withoutThe = cleanName.replace(/^The\s+/i, '')
  const withoutBuilding = cleanName.replace(/\s+(Building|Tower|Place|Center|Centre)$/i, '')
  const withoutTheAndBuilding = withoutThe.replace(/\s+(Building|Tower|Place|Center|Centre)$/i, '')
  
  // Extract street number from address (e.g., "1001 Woodward" -> "1001 Woodward")
  const streetMatch = address?.match(/^(\d+\s+\w+)/)?.[1]
  
  // Primary variations - most likely to match
  variations.push(`"${cleanName}" Detroit building`)
  variations.push(`${cleanName} Detroit`)
  variations.push(`"${withoutThe}" Detroit`)
  
  // Try with building suffix
  if (!cleanName.toLowerCase().includes('building')) {
    variations.push(`${cleanName} Building Detroit`)
  }
  
  // Try without building suffix
  if (withoutBuilding !== cleanName) {
    variations.push(`${withoutBuilding} Detroit`)
    variations.push(`"${withoutBuilding}" Detroit architecture`)
  }
  
  // Try core name only with Detroit context
  if (withoutTheAndBuilding !== cleanName && withoutTheAndBuilding.length > 3) {
    variations.push(`${withoutTheAndBuilding} Detroit Michigan`)
    variations.push(`${withoutTheAndBuilding} building Detroit`)
  }
  
  // If we have an architect, try architect + building type searches
  if (architect) {
    const primaryArchitect = architect.split(',')[0].split('&')[0].trim()
    variations.push(`${primaryArchitect} Detroit building`)
    variations.push(`${primaryArchitect} ${withoutTheAndBuilding}`)
  }
  
  // Try with street address
  if (streetMatch) {
    variations.push(`${streetMatch} Detroit building`)
  }
  
  // Try opensearch-style partial matches
  variations.push(`${withoutThe}`)
  variations.push(`${cleanName} Michigan`)
  
  // Remove duplicates while preserving order
  return [...new Set(variations)]
}

async function searchWikipediaSmarter(
  buildingName: string, 
  architect?: string | null, 
  address?: string | null
): Promise<any[]> {
  const searchVariations = generateSearchVariations(buildingName, architect, address)
  
  // Try each variation
  for (const query of searchVariations) {
    try {
      // Use search API with more results
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&format=json`
      const data = await fetchWikipedia(searchUrl)
      
      if (data.query?.search?.length > 0) {
        // Filter results to those likely about buildings/architecture
        const filtered = data.query.search.filter((r: any) => {
          const snippet = (r.snippet || '').toLowerCase()
          const title = (r.title || '').toLowerCase()
          
          // Prioritize results that mention building-related terms
          const buildingTerms = ['building', 'built', 'architect', 'designed', 'construction', 'structure', 'tower', 'skyscraper', 'historic', 'landmark', 'detroit', 'michigan', 'demolished', 'erected']
          const hasBuildingTerm = buildingTerms.some(term => snippet.includes(term) || title.includes(term))
          
          // Deprioritize results that are clearly not about the building
          const nonBuildingTerms = ['band', 'album', 'song', 'film', 'movie', 'novel', 'book', 'game', 'software', 'tv series']
          const isNotBuilding = nonBuildingTerms.some(term => title.includes(term) || snippet.includes(term))
          
          return hasBuildingTerm && !isNotBuilding
        })
        
        if (filtered.length > 0) {
          return filtered
        }
        
        // If no filtered results, return unfiltered but check if any mention Detroit
        const detroitResults = data.query.search.filter((r: any) => {
          const snippet = (r.snippet || '').toLowerCase()
          return snippet.includes('detroit') || snippet.includes('michigan')
        })
        
        if (detroitResults.length > 0) {
          return detroitResults
        }
      }
    } catch {
      continue
    }
  }
  
  // Last resort: try opensearch API for fuzzy matching
  try {
    const cleanName = buildingName.replace(/^The\s+/i, '').replace(/\s+(Building|Tower)$/i, '')
    const opensearchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanName + ' Detroit')}&limit=5&format=json`
    const data = await fetchWikipedia(opensearchUrl)
    
    if (data[1]?.length > 0) {
      // Convert opensearch results to search format
      return data[1].map((title: string, i: number) => ({
        title,
        snippet: data[2]?.[i] || '',
        pageid: null // We'll need to fetch this
      }))
    }
  } catch {
    // Ignore opensearch errors
  }
  
  return []
}

async function enrichBuilding(
  buildingName: string, 
  address: string | null, 
  architect: string | null,
  existingData: any
) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OpenAI API key not configured')

  const openai = new OpenAI({ apiKey })

  // Use smarter search
  const searchResults = await searchWikipediaSmarter(buildingName, architect, address)

  if (searchResults.length === 0) {
    return { isCorrectArticle: false, reason: 'No search results found' }
  }

  // Get page content for top results (up to 5 for better matching)
  const resultsToCheck = searchResults.slice(0, 5)
  let pagesContext = ''
  const pageData: Record<number, any> = {}

  for (const result of resultsToCheck) {
    try {
      // If we have a title but no pageid (from opensearch), get the pageid first
      let pageId = result.pageid
      if (!pageId && result.title) {
        const idUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(result.title)}&format=json`
        const idData = await fetchWikipedia(idUrl)
        const pages = idData.query?.pages || {}
        pageId = Object.keys(pages).find(id => id !== '-1')
        if (pageId) pageId = parseInt(pageId)
      }
      
      if (!pageId) continue

      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=extracts|categories&explaintext=true&exsectionformat=plain&cllimit=20&format=json`
      const contentData = await fetchWikipedia(contentUrl)
      const page = contentData.query?.pages?.[pageId]
      
      if (page?.extract) {
        const categories = (page.categories || []).map((c: any) => c.title).join(', ')
        pagesContext += `\n\n=== Page: ${page.title} (ID: ${pageId}) ===\nCategories: ${categories}\n\n${page.extract.substring(0, 4000)}`
        pageData[pageId] = page
      }
    } catch {
      continue
    }
  }

  if (!pagesContext) {
    return { isCorrectArticle: false, reason: 'Could not fetch page content' }
  }

  // Use GPT-4o (not mini) for better accuracy
  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert on Detroit architecture and historic buildings. Your job is to match building database entries with their Wikipedia articles. Be smart about name variations - "Guardian Building" and "Union Trust Building" could be the same building (alternate names). Look for matching addresses, architects, or years built to confirm matches.`
      },
      {
        role: 'user',
        content: `Find the Wikipedia article for this Detroit building:

BUILDING DATABASE ENTRY:
- Name: "${buildingName}"
- Address: ${address || 'Unknown'}
- Architect: ${architect || 'Unknown'}
- Year Built: ${existingData?.year_built || 'Unknown'}
- Style: ${existingData?.architectural_style || 'Unknown'}

WIKIPEDIA PAGES TO CHECK:
${pagesContext}

IMPORTANT: Buildings often have multiple names. For example:
- "Guardian Building" is also known as "Union Trust Building"
- "Penobscot Building" might appear as "Penobscot Tower"
- "Book Tower" and "Book Building" are related structures

Return JSON:
{
  "isCorrectArticle": boolean (true if ANY of these Wikipedia pages is about this building),
  "pageId": number (the page ID of the correct article, or null if none match),
  "matchedTitle": string (the Wikipedia title that matched, or null),
  "confidence": "high"|"medium"|"low",
  "matchReason": string (explain why you think it's a match or not),
  "architect": string or null (only if not already in existing data),
  "yearBuilt": string or null,
  "yearDemolished": string or null,
  "architecturalStyle": string or null,
  "buildingType": string or null,
  "status": "extant"|"demolished"|null
}`
      }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  })

  const analysis = JSON.parse(gptResponse.choices[0].message.content || '{}')
  
  if (!analysis.isCorrectArticle || !analysis.pageId) {
    return { isCorrectArticle: false, reason: analysis.matchReason || 'No match found' }
  }

  // Get HTML content for the matched page
  const htmlUrl = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${analysis.pageId}&prop=text&format=json`
  const htmlData = await fetchWikipedia(htmlUrl)
  const wikipediaHtml = htmlData.parse?.text?.['*'] || null

  return {
    isCorrectArticle: true,
    wikipediaHtml,
    matchedTitle: analysis.matchedTitle,
    matchReason: analysis.matchReason,
    ...analysis
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  
  // Get buildings without wikipedia_entry, prioritizing those with more data (more likely to be notable)
  const { data: buildings, error } = await supabase
    .from('buildings')
    .select('id, name, address, architect, year_built, architectural_style, building_type, status')
    .is('wikipedia_entry', null)
    .order('year_built', { ascending: true, nullsFirst: false }) // Older buildings more likely to have Wikipedia
    .limit(limit)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  const results: { id: string; name: string; status: 'success' | 'not_found' | 'error'; message?: string }[] = []
  
  for (const building of buildings || []) {
    try {
      console.log(`Enriching: ${building.name}`)
      
      const enrichedData = await enrichBuilding(
        building.name, 
        building.address, 
        building.architect,
        {
          year_built: building.year_built,
          architectural_style: building.architectural_style,
          building_type: building.building_type,
          status: building.status,
        }
      )
      
      if (!enrichedData.isCorrectArticle) {
        // Mark as searched so we don't keep retrying
        await supabase
          .from('buildings')
          .update({ wikipedia_entry: 'NOT_FOUND' })
          .eq('id', building.id)
        
        results.push({ 
          id: building.id, 
          name: building.name, 
          status: 'not_found', 
          message: enrichedData.reason || 'No matching Wikipedia article' 
        })
        continue
      }
      
      // Build updates object
      const updates: Record<string, any> = {}
      
      if (enrichedData.wikipediaHtml) {
        updates.wikipedia_entry = enrichedData.wikipediaHtml
      }
      if (enrichedData.architect && !building.architect) {
        updates.architect = enrichedData.architect
      }
      if (enrichedData.yearBuilt && !building.year_built) {
        updates.year_built = parseInt(enrichedData.yearBuilt)
      }
      if (enrichedData.architecturalStyle && !building.architectural_style) {
        updates.architectural_style = enrichedData.architecturalStyle
      }
      if (enrichedData.buildingType && !building.building_type) {
        updates.building_type = enrichedData.buildingType
      }
      if (enrichedData.status && !building.status) {
        updates.status = enrichedData.status
      }
      if (enrichedData.yearDemolished) {
        updates.year_demolished = parseInt(enrichedData.yearDemolished)
      }
      
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('buildings')
          .update(updates)
          .eq('id', building.id)
        
        if (updateError) {
          results.push({ id: building.id, name: building.name, status: 'error', message: updateError.message })
        } else {
          results.push({ 
            id: building.id, 
            name: building.name, 
            status: 'success', 
            message: `Matched to "${enrichedData.matchedTitle}" - ${enrichedData.matchReason}. Updated ${Object.keys(updates).length} fields` 
          })
        }
      } else {
        results.push({ id: building.id, name: building.name, status: 'not_found', message: 'No new data to apply' })
      }
      
      // Delay to avoid rate limiting (OpenAI and Wikipedia)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
    } catch (err) {
      results.push({ id: building.id, name: building.name, status: 'error', message: String(err) })
    }
  }
  
  const successCount = results.filter(r => r.status === 'success').length
  const notFoundCount = results.filter(r => r.status === 'not_found').length
  const errorCount = results.filter(r => r.status === 'error').length
  
  return NextResponse.json({
    total: buildings?.length || 0,
    success: successCount,
    notFound: notFoundCount,
    errors: errorCount,
    results
  })
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Get count of buildings without wikipedia_entry (excluding NOT_FOUND)
  const { count: needsEnrichment, error: error1 } = await supabase
    .from('buildings')
    .select('id', { count: 'exact', head: true })
    .is('wikipedia_entry', null)
  
  const { count: notFound, error: error2 } = await supabase
    .from('buildings')
    .select('id', { count: 'exact', head: true })
    .eq('wikipedia_entry', 'NOT_FOUND')
  
  const { count: enriched, error: error3 } = await supabase
    .from('buildings')
    .select('id', { count: 'exact', head: true })
    .not('wikipedia_entry', 'is', null)
    .neq('wikipedia_entry', 'NOT_FOUND')
  
  if (error1 || error2 || error3) {
    return NextResponse.json({ error: (error1 || error2 || error3)?.message }, { status: 500 })
  }
  
  return NextResponse.json({ 
    needsEnrichment,
    notFound,
    enriched,
    message: `${needsEnrichment} buildings need enrichment. ${enriched} have Wikipedia entries. ${notFound} were searched but not found. POST to enrich.`
  })
}
