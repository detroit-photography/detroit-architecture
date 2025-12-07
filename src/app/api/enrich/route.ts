import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

async function fetchJson(url: string) {
  const res = await fetch(url)
  const text = await res.text()
  
  // Check if response is HTML (error page)
  if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
    throw new Error('Wikipedia returned HTML instead of JSON')
  }
  
  return JSON.parse(text)
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey })

    const { buildingName, address, existingData } = await request.json()

    if (!buildingName) {
      return NextResponse.json({ error: 'Building name is required' }, { status: 400 })
    }

    // Step 1: Search Wikipedia for the building with multiple query variations
    const searchQueries = [
      `"${buildingName}"`, // Exact match first
      `${buildingName} Detroit`,
      `${buildingName} Michigan`,
      `${buildingName} building`,
      buildingName, // Just the name
    ]

    let searchResults: any[] = []
    
    for (const query of searchQueries) {
      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=5`
        const searchData = await fetchJson(searchUrl)
        
        if (searchData.query?.search?.length) {
          searchResults = searchData.query.search
          break
        }
      } catch (e) {
        console.error('Search error for query:', query, e)
        continue
      }
    }
    
    if (searchResults.length === 0) {
      return NextResponse.json({ error: 'No Wikipedia articles found' }, { status: 404 })
    }

    // Get the top 3 results to let GPT pick the best one
    const topResults = searchResults.slice(0, 3)
    const articlesContent: string[] = []
    const fullArticles: Record<string, { text: string; html: string }> = {}

    for (const result of topResults) {
      try {
        // Get plain text version for GPT analysis
        const textUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(result.title)}&prop=extracts&explaintext=true&format=json&origin=*`
        const textData = await fetchJson(textUrl)
        
        // Get HTML version for display
        const htmlUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(result.title)}&prop=extracts&format=json&origin=*`
        const htmlData = await fetchJson(htmlUrl)
        
        const textPages = textData.query?.pages
        const htmlPages = htmlData.query?.pages
        const textPage = textPages ? Object.values(textPages)[0] as any : null
        const htmlPage = htmlPages ? Object.values(htmlPages)[0] as any : null
        
        if (textPage && !textPage.missing && textPage.extract) {
          const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`
          articlesContent.push(`### ${result.title}\nURL: ${wikiUrl}\n\n${textPage.extract.substring(0, 4000)}`)
          fullArticles[wikiUrl] = {
            text: textPage.extract,
            html: htmlPage?.extract || textPage.extract
          }
        }
      } catch (e) {
        console.error('Error fetching article:', result.title, e)
        continue
      }
    }

    if (articlesContent.length === 0) {
      return NextResponse.json({ error: 'Could not fetch Wikipedia content' }, { status: 404 })
    }

    // Step 2: Use GPT to extract structured data
    const prompt = `You are an expert on Detroit architecture. I need to enrich a database entry for a building.

BUILDING TO RESEARCH:
Name: ${buildingName}
Address: ${address || 'Unknown'}

EXISTING DATA (don't repeat if already filled):
${existingData ? JSON.stringify(existingData, null, 2) : 'None'}

WIKIPEDIA ARTICLES FOUND:
${articlesContent.join('\n\n---\n\n')}

TASK:
1. Determine which Wikipedia article (if any) is about this specific building
2. Extract accurate information ONLY if you're confident it's correct
3. If the Wikipedia articles aren't about this building, say so

Return a JSON object with these fields (use null for fields you can't determine with confidence):
{
  "isCorrectArticle": boolean, // true if you found the right Wikipedia article
  "wikipediaUrl": string | null, // URL of the correct article
  "wikipediaTitle": string | null, // Title of the correct article
  "confidence": "high" | "medium" | "low", // How confident you are this is the right building
  "architect": string | null, // Architect name(s)
  "yearBuilt": string | null, // Year completed (just the year, e.g., "1929")
  "yearDemolished": string | null, // Year demolished if applicable
  "architecturalStyle": string | null, // e.g., "Art Deco", "Gothic Revival"
  "buildingType": string | null, // e.g., "office building", "church", "house"
  "address": string | null, // Full street address (e.g., "500 Griswold St, Detroit, MI")
  "description": string | null, // A 2-3 sentence description suitable for a building database
  "historicalSignificance": string | null, // Why this building matters historically
  "notableFeatures": string[] | null, // Array of notable architectural features
  "alternateNames": string[] | null, // Other names the building has been known by
  "status": "extant" | "demolished" | null // Current status
}

IMPORTANT: Only return the JSON object, no other text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an architectural historian specializing in Detroit buildings. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    // Parse the JSON response
    let enrichedData
    try {
      // Remove markdown code blocks if present
      const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim()
      enrichedData = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse GPT response:', responseText)
      return NextResponse.json({ error: 'Failed to parse AI response', raw: responseText }, { status: 500 })
    }

    // Add full Wikipedia text (both plain and HTML) if we found the right article
    if (enrichedData.wikipediaUrl && fullArticles[enrichedData.wikipediaUrl]) {
      enrichedData.fullWikipediaText = fullArticles[enrichedData.wikipediaUrl].text
      enrichedData.wikipediaHtml = fullArticles[enrichedData.wikipediaUrl].html
    }

    return NextResponse.json(enrichedData)

  } catch (error) {
    console.error('Enrich API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

