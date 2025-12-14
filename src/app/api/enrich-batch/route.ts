import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Inline the Wikipedia enrichment logic to avoid HTTP calls
async function fetchWikipedia(url: string) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'DetroitArchitectureRepository/1.0 (https://detroit-architecture.vercel.app)',
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

async function enrichBuilding(buildingName: string, address: string | null, existingData: any) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OpenAI API key not configured')

  const openai = new OpenAI({ apiKey })

  // Search Wikipedia
  const searchQueries = [
    `"${buildingName}"`,
    `${buildingName} Detroit`,
    `${buildingName} Michigan`,
    buildingName,
  ]

  let searchResults: any[] = []
  for (const query of searchQueries) {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json`
      const data = await fetchWikipedia(searchUrl)
      if (data.query?.search?.length > 0) {
        searchResults = data.query.search
        break
      }
    } catch {
      continue
    }
  }

  if (searchResults.length === 0) {
    return { isCorrectArticle: false }
  }

  // Get page content for top results
  const pageIds = searchResults.slice(0, 3).map((r: any) => r.pageid).join('|')
  const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=extracts|revisions&explaintext=true&exsectionformat=plain&rvprop=content&rvslots=main&format=json`
  
  const contentData = await fetchWikipedia(contentUrl)
  const pages = contentData.query?.pages || {}

  // Build context for GPT
  let pagesContext = ''
  for (const [pageId, page] of Object.entries(pages) as any) {
    if (page.extract) {
      pagesContext += `\n\n=== Page: ${page.title} (ID: ${pageId}) ===\n${page.extract.substring(0, 3000)}`
    }
  }

  // Use GPT to analyze
  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You analyze Wikipedia content to extract building information. Return JSON only.`
      },
      {
        role: 'user',
        content: `Find information about "${buildingName}"${address ? ` at ${address}` : ''} in Detroit.

Wikipedia pages:
${pagesContext}

Return JSON:
{
  "isCorrectArticle": boolean,
  "pageId": number or null,
  "confidence": "high"|"medium"|"low",
  "architect": string or null,
  "yearBuilt": string or null,
  "yearDemolished": string or null,
  "architecturalStyle": string or null,
  "buildingType": string or null,
  "status": "extant"|"demolished" or null
}`
      }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  })

  const analysis = JSON.parse(gptResponse.choices[0].message.content || '{}')
  
  if (!analysis.isCorrectArticle || !analysis.pageId) {
    return { isCorrectArticle: false }
  }

  // Get HTML content for the matched page
  const htmlUrl = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${analysis.pageId}&prop=text&format=json`
  const htmlData = await fetchWikipedia(htmlUrl)
  const wikipediaHtml = htmlData.parse?.text?.['*'] || null

  return {
    isCorrectArticle: true,
    wikipediaHtml,
    ...analysis
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Check for limit param
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '100')
  
  // Get all buildings without wikipedia_entry
  const { data: buildings, error } = await supabase
    .from('buildings')
    .select('id, name, address, architect, year_built, architectural_style, building_type, status')
    .is('wikipedia_entry', null)
    .order('name')
    .limit(limit)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  const results: { id: string; name: string; status: 'success' | 'not_found' | 'error'; message?: string }[] = []
  
  for (const building of buildings || []) {
    try {
      console.log(`Enriching: ${building.name}`)
      
      const enrichedData = await enrichBuilding(building.name, building.address, {
        architect: building.architect,
        year_built: building.year_built,
        architectural_style: building.architectural_style,
        building_type: building.building_type,
        status: building.status,
      })
      
      if (!enrichedData.isCorrectArticle) {
        results.push({ id: building.id, name: building.name, status: 'not_found', message: 'No matching Wikipedia article' })
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
          results.push({ id: building.id, name: building.name, status: 'success', message: `Updated with ${Object.keys(updates).length} fields` })
        }
      } else {
        results.push({ id: building.id, name: building.name, status: 'not_found', message: 'No new data to apply' })
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
  
  // Get count of buildings without wikipedia_entry
  const { count, error } = await supabase
    .from('buildings')
    .select('id', { count: 'exact', head: true })
    .is('wikipedia_entry', null)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ 
    buildingsWithoutWikipedia: count,
    message: `${count} buildings need Wikipedia enrichment. POST to this endpoint to start batch enrichment.`
  })
}
