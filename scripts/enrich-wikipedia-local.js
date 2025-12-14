#!/usr/bin/env node
/**
 * Local Wikipedia Enrichment Script
 * Runs on your machine, not on Vercel - saves compute resources
 * 
 * Usage: node scripts/enrich-wikipedia-local.js [limit]
 * Example: node scripts/enrich-wikipedia-local.js 50
 */

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !openaiKey) {
  console.error('Missing environment variables. Make sure .env.local has:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  console.error('  OPENAI_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function fetchWikipedia(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'DetroitArchitectureRepository/1.0 (local script)',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);
  const text = await res.text();
  if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
    throw new Error('Wikipedia returned HTML');
  }
  return JSON.parse(text);
}

function generateSearchVariations(name, architect, address) {
  const variations = [];
  const cleanName = name.trim();
  const withoutThe = cleanName.replace(/^The\s+/i, '');
  const withoutBuilding = cleanName.replace(/\s+(Building|Tower|Place|Center|Centre)$/i, '');
  const withoutTheAndBuilding = withoutThe.replace(/\s+(Building|Tower|Place|Center|Centre)$/i, '');

  variations.push(`"${cleanName}" Detroit building`);
  variations.push(`${cleanName} Detroit`);
  variations.push(`"${withoutThe}" Detroit`);
  
  if (!cleanName.toLowerCase().includes('building')) {
    variations.push(`${cleanName} Building Detroit`);
  }
  
  if (withoutBuilding !== cleanName) {
    variations.push(`${withoutBuilding} Detroit`);
  }
  
  if (withoutTheAndBuilding !== cleanName && withoutTheAndBuilding.length > 3) {
    variations.push(`${withoutTheAndBuilding} Detroit Michigan`);
  }
  
  if (architect) {
    const primaryArchitect = architect.split(',')[0].split('&')[0].trim();
    variations.push(`${primaryArchitect} Detroit building`);
  }
  
  variations.push(`${withoutThe}`);
  variations.push(`${cleanName} Michigan`);
  
  return [...new Set(variations)];
}

async function searchWikipedia(buildingName, architect, address) {
  const searchVariations = generateSearchVariations(buildingName, architect, address);
  
  for (const query of searchVariations) {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&format=json`;
      const data = await fetchWikipedia(searchUrl);
      
      if (data.query?.search?.length > 0) {
        const filtered = data.query.search.filter(r => {
          const snippet = (r.snippet || '').toLowerCase();
          const title = (r.title || '').toLowerCase();
          const buildingTerms = ['building', 'built', 'architect', 'designed', 'construction', 'tower', 'detroit', 'michigan'];
          const nonBuildingTerms = ['band', 'album', 'song', 'film', 'movie', 'novel', 'game'];
          const hasBuildingTerm = buildingTerms.some(term => snippet.includes(term) || title.includes(term));
          const isNotBuilding = nonBuildingTerms.some(term => title.includes(term));
          return hasBuildingTerm && !isNotBuilding;
        });
        
        if (filtered.length > 0) return filtered;
        
        const detroitResults = data.query.search.filter(r => 
          (r.snippet || '').toLowerCase().includes('detroit')
        );
        if (detroitResults.length > 0) return detroitResults;
      }
    } catch {
      continue;
    }
  }
  return [];
}

async function enrichBuilding(building) {
  const searchResults = await searchWikipedia(building.name, building.architect, building.address);
  
  if (searchResults.length === 0) {
    return { isCorrectArticle: false, reason: 'No search results' };
  }

  // Get content for top results
  const resultsToCheck = searchResults.slice(0, 5);
  let pagesContext = '';
  const pageData = {};

  for (const result of resultsToCheck) {
    try {
      let pageId = result.pageid;
      if (!pageId && result.title) {
        const idUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(result.title)}&format=json`;
        const idData = await fetchWikipedia(idUrl);
        const pages = idData.query?.pages || {};
        pageId = Object.keys(pages).find(id => id !== '-1');
        if (pageId) pageId = parseInt(pageId);
      }
      if (!pageId) continue;

      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=extracts&explaintext=true&exsectionformat=plain&format=json`;
      const contentData = await fetchWikipedia(contentUrl);
      const page = contentData.query?.pages?.[pageId];
      
      if (page?.extract) {
        pagesContext += `\n\n=== Page: ${page.title} (ID: ${pageId}) ===\n${page.extract.substring(0, 4000)}`;
        pageData[pageId] = page;
      }
    } catch {
      continue;
    }
  }

  if (!pagesContext) {
    return { isCorrectArticle: false, reason: 'Could not fetch page content' };
  }

  // Use GPT to analyze
  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Use mini for cost savings in batch
    messages: [
      {
        role: 'system',
        content: 'You match Detroit buildings with their Wikipedia articles. Be smart about name variations.'
      },
      {
        role: 'user',
        content: `Find Wikipedia article for: "${building.name}" at ${building.address || 'Unknown'}, architect: ${building.architect || 'Unknown'}, year: ${building.year_built || 'Unknown'}

WIKIPEDIA PAGES:
${pagesContext}

Return JSON: {"isCorrectArticle": boolean, "pageId": number|null, "matchedTitle": string|null, "confidence": "high"|"medium"|"low", "matchReason": string}`
      }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });

  const analysis = JSON.parse(gptResponse.choices[0].message.content || '{}');
  
  if (!analysis.isCorrectArticle || !analysis.pageId) {
    return { isCorrectArticle: false, reason: analysis.matchReason || 'No match' };
  }

  // Get plain text content
  const textUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${analysis.pageId}&prop=extracts&explaintext=true&exsectionformat=plain&format=json`;
  const textData = await fetchWikipedia(textUrl);
  const page = textData.query?.pages?.[analysis.pageId];
  let wikipediaText = page?.extract || null;
  
  if (wikipediaText) {
    // Clean up - remove references, see also, etc.
    const cleanupPatterns = [
      /\n\s*== See also ==[\s\S]*/i,
      /\n\s*== References ==[\s\S]*/i,
      /\n\s*== External links ==[\s\S]*/i,
      /\n\s*== Notes ==[\s\S]*/i,
    ];
    for (const pattern of cleanupPatterns) {
      wikipediaText = wikipediaText.replace(pattern, '');
    }
    wikipediaText = wikipediaText.trim().substring(0, 15000);
  }

  return {
    isCorrectArticle: true,
    wikipediaText,
    matchedTitle: analysis.matchedTitle,
    matchReason: analysis.matchReason,
  };
}

async function main() {
  const limit = parseInt(process.argv[2]) || 20;
  
  console.log(`\n🏛️  Detroit Architecture Wikipedia Enrichment (Local)\n`);
  console.log(`Fetching up to ${limit} buildings without Wikipedia entries...\n`);

  // Get buildings needing enrichment
  const { data: buildings, error } = await supabase
    .from('buildings')
    .select('id, name, address, architect, year_built, architectural_style')
    .is('wikipedia_entry', null)
    .order('year_built', { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('Database error:', error.message);
    process.exit(1);
  }

  console.log(`Found ${buildings.length} buildings to process.\n`);

  let success = 0, notFound = 0, errors = 0;

  for (let i = 0; i < buildings.length; i++) {
    const building = buildings[i];
    process.stdout.write(`[${i + 1}/${buildings.length}] ${building.name.substring(0, 40).padEnd(40)} `);

    try {
      const result = await enrichBuilding(building);

      if (result.isCorrectArticle && result.wikipediaText) {
        await supabase
          .from('buildings')
          .update({ wikipedia_entry: result.wikipediaText })
          .eq('id', building.id);
        
        console.log(`✓ Matched: ${result.matchedTitle}`);
        success++;
      } else {
        await supabase
          .from('buildings')
          .update({ wikipedia_entry: 'NOT_FOUND' })
          .eq('id', building.id);
        
        console.log(`✗ ${result.reason || 'Not found'}`);
        notFound++;
      }

      // Rate limit - 1 second between requests
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.log(`⚠ Error: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Done! ✓ ${success} matched | ✗ ${notFound} not found | ⚠ ${errors} errors`);
  
  // Show remaining count
  const { count } = await supabase
    .from('buildings')
    .select('id', { count: 'exact', head: true })
    .is('wikipedia_entry', null);
  
  console.log(`\n${count} buildings still need enrichment.`);
}

main().catch(console.error);
