#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase credentials
const SUPABASE_URL = 'https://qjxuiljsgrmymeayoqzi.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeHVpbGpzZ3JteW1lYXlvcXppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk2Njk2NCwiZXhwIjoyMDgwNTQyOTY0fQ.HUDqDqvEKADQXQTndpQcG-iS_RJok2J8lA1-ZNPts0c'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const dataDir = path.join(__dirname, '..', 'data', 'nrhp')
const spreadsheetPath = path.join(__dirname, '..', '..', 'national-registry-historic-places.xlsx')

// Get NARA catalog URL from spreadsheet for a given ref number
function getNaraCatalogUrl(refNumber) {
  try {
    const workbook = XLSX.readFile(spreadsheetPath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(sheet)
    
    // Find matching row by ref number
    for (const row of data) {
      const rowRef = String(row['Ref#'] || '').trim()
      if (rowRef === refNumber) {
        return row['External Link'] || null
      }
    }
    return null
  } catch (e) {
    console.log(`   ⚠️  Could not read spreadsheet: ${e.message}`)
    return null
  }
}

// Construct PDF URL from NARA catalog URL
// URL pattern: https://s3.amazonaws.com/NARAprodstorage/opastorage/live/XX/XXXX/XXXXXXXX/content/electronic-records/rg-079/NPS_MI/REFNUM.pdf
// Where XX = last 2 digits (pos 6-7), XXXX = middle digits (pos 2-5), XXXXXXXX = full catalog ID
// Example: 25340880 -> live/80/3408/25340880
function getPdfUrlFromNara(catalogUrl, refNumber) {
  if (!catalogUrl) return null
  
  try {
    // Extract catalog ID from URL like https://catalog.archives.gov/id/25340880
    const idMatch = catalogUrl.match(/\/id\/(\d+)/)
    if (!idMatch) return null
    
    const naraId = idMatch[1]
    
    // Construct the S3 path from the catalog ID
    // Example: 25340880 -> 80/3408/25340880
    // Pattern: last 2 digits, then middle 4 digits (positions 2-5), then full ID
    const last2 = naraId.slice(-2)  // 80
    const middle4 = naraId.slice(2, 6)  // 3408 (from 25[3408]80)
    
    const pdfUrl = `https://s3.amazonaws.com/NARAprodstorage/opastorage/live/${last2}/${middle4}/${naraId}/content/electronic-records/rg-079/NPS_MI/${refNumber}.pdf`
    
    console.log(`   ✅ Constructed PDF URL: ${pdfUrl}`)
    return pdfUrl
  } catch (e) {
    console.log(`   ⚠️  Could not construct PDF URL: ${e.message}`)
    return null
  }
}

// Common typos and their corrections
const TYPO_CORRECTIONS = {
  // Common OCR errors
  'teh': 'the',
  'hte': 'the',
  'adn': 'and',
  'nad': 'and',
  'taht': 'that',
  'thta': 'that',
  'wiht': 'with',
  'wtih': 'with',
  'buiding': 'building',
  'biulding': 'building',
  'buidling': 'building',
  'architcet': 'architect',
  'architec': 'architect',
  'archiect': 'architect',
  'desgin': 'design',
  'desgined': 'designed',
  'consturction': 'construction',
  'construciton': 'construction',
  'signficance': 'significance',
  'signifcance': 'significance',
  'significane': 'significance',
  'histoic': 'historic',
  'historc': 'historic',
  'hisotric': 'historic',
  'Detriot': 'Detroit',
  'Detoit': 'Detroit',
  'Dertoit': 'Detroit',
  'Michgian': 'Michigan',
  'Michgan': 'Michigan',
  'Michiagn': 'Michigan',
  'cenury': 'century',
  'cnetury': 'century',
  'centuy': 'century',
  'residental': 'residential',
  'residetial': 'residential',
  'commerical': 'commercial',
  'comercial': 'commercial',
  'orignal': 'original',
  'orignial': 'original',
  'origianl': 'original',
  // Spaced letters from bad OCR
  'i n': 'in',
  'o f': 'of',
  't h e': 'the',
  'a n d': 'and',
  'w a s': 'was',
  'f o r': 'for',
  't o': 'to',
  'i s': 'is',
  'i t': 'it',
  'b y': 'by',
  'o n': 'on',
  'a t': 'at',
  'a s': 'as',
}

// Fix typos in text
function fixTypos(text) {
  if (!text) return text
  
  let fixed = text
  let typosFixed = 0
  
  for (const [typo, correction] of Object.entries(TYPO_CORRECTIONS)) {
    // Use word boundaries for whole-word replacements
    const regex = new RegExp(`\\b${typo}\\b`, 'gi')
    const matches = fixed.match(regex)
    if (matches) {
      typosFixed += matches.length
      fixed = fixed.replace(regex, correction)
    }
  }
  
  if (typosFixed > 0) {
    console.log(`   📝 Fixed ${typosFixed} typos`)
  }
  
  return fixed
}

// Clean up NRHP text - remove artifacts and fix formatting
function cleanNrhpText(text) {
  if (!text) return text
  
  // Common NRHP form artifacts to remove
  const artifacts = [
    /NPS Form \d+-\d+.*/gi,
    /OMB No\. \d+-\d+/gi,
    /United States Department of the Interior/gi,
    /National Park Service/gi,
    /National Register of Historic Places/gi,
    /Registration Form/gi,
    /Continuation Sheet/gi,
    /See continuation sheet/gi,
    /Section \d+\s+Page \d+/gi,
    /Section number.*Page.*/gi,
    /\(Expires \d+\/\d+\/\d+\)/gi,
    /For NPS use only/gi,
    /received\s+date entered/gi,
    /CONTINUATION SHEET.*?\n/gi,
    /Statement of Significance\s*\n/gi,
    /Narrative Description\s*\n/gi,
    /8\.\s+Statement of Significance\s*\n/gi,
    /7\.\s+Description\s*\n/gi,
    /\[NR\]/gi,
    /\(NR\)/gi,
  ]
  
  let cleaned = text
  for (const pattern of artifacts) {
    cleaned = cleaned.replace(pattern, '')
  }
  
  // Fix common spacing issues from PDF extraction
  cleaned = cleaned
    .replace(/([a-z])\s+([A-Z])/g, '$1. $2')  // Missing periods
    .replace(/\s{3,}/g, ' ')  // Multiple spaces
    .replace(/\n{3,}/g, '\n\n')  // Multiple newlines
    .replace(/\s+\./g, '.')  // Space before period
    .replace(/\s+,/g, ',')  // Space before comma
    .trim()
  
  // Fix typos
  cleaned = fixTypos(cleaned)
  
  return cleaned
}

async function listAvailable() {
  const pdfDir = path.join(dataDir, 'pdfs')
  const extractedDir = path.join(dataDir, 'extracted')
  const imagesDir = path.join(dataDir, 'images')
  
  const pdfs = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'))
  const extracted = fs.existsSync(extractedDir) 
    ? fs.readdirSync(extractedDir).filter(f => f.endsWith('.json'))
    : []
  const imageFolders = fs.existsSync(imagesDir)
    ? fs.readdirSync(imagesDir).filter(f => fs.statSync(path.join(imagesDir, f)).isDirectory())
    : []
  
  // Get existing entries
  const { data: existingEntries } = await supabase
    .from('nrhp_entries')
    .select('ref_number, building_id, buildings(name)')
  
  const existingRefs = new Set(existingEntries?.map(e => e.ref_number) || [])
  
  console.log('\n📋 Available NRHP PDFs:\n')
  console.log('Ref#        | PDF File                         | Extracted | Images | In DB | Building')
  console.log('-'.repeat(100))
  
  for (const pdf of pdfs) {
    const refNumber = pdf.split('_')[0]
    const hasExtracted = extracted.some(e => e.startsWith(refNumber))
    const hasImages = imageFolders.includes(refNumber)
    const inDatabase = existingRefs.has(refNumber)
    const entry = existingEntries?.find(e => e.ref_number === refNumber)
    
    const status = [
      refNumber.padEnd(12),
      pdf.substring(0, 35).padEnd(35),
      hasExtracted ? '✅' : '❌',
      hasImages ? '✅' : '❌',
      inDatabase ? '✅' : '❌',
      entry?.buildings?.name || '-'
    ].join(' | ')
    
    console.log(status)
  }
  console.log()
}

async function importNrhp(refNumber, buildingName) {
  console.log(`\n🔄 Importing NRHP entry ${refNumber}...`)
  
  const extractedDir = path.join(dataDir, 'extracted')
  const jsonFiles = fs.readdirSync(extractedDir).filter(f => f.startsWith(refNumber) && f.endsWith('.json'))
  
  if (jsonFiles.length === 0) {
    console.error(`❌ No extracted JSON found for ${refNumber}`)
    console.log('   Run the PDF extraction first.')
    return
  }
  
  // Read extracted data
  const jsonPath = path.join(extractedDir, jsonFiles[0])
  const extractedData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(`📖 Read extracted data from ${jsonFiles[0]}`)
  
  // Find or create building
  let targetBuildingId = null
  
  if (buildingName) {
    // Try to find existing building
    const { data: existingBuilding } = await supabase
      .from('buildings')
      .select('id, name')
      .ilike('name', `%${buildingName}%`)
      .limit(5)
    
    if (existingBuilding && existingBuilding.length > 0) {
      console.log(`\n🏢 Found existing buildings matching "${buildingName}":`)
      existingBuilding.forEach((b, i) => console.log(`   ${i + 1}. ${b.name} (${b.id})`))
      targetBuildingId = existingBuilding[0].id
      console.log(`   Using: ${existingBuilding[0].name}`)
    } else {
      console.log(`\n🏗️  Creating new building: ${buildingName}`)
      const { data: newBuilding, error: createError } = await supabase
        .from('buildings')
        .insert({
          name: buildingName,
          city: 'Detroit',
          address: extractedData.address?.replace(/_/g, '').trim() || null,
          status: 'standing'
        })
        .select()
        .single()
      
      if (createError) {
        console.error(`❌ Failed to create building: ${createError.message}`)
        return
      }
      targetBuildingId = newBuilding.id
      console.log(`   Created with ID: ${newBuilding.id}`)
    }
  }
  
  // Check if entry already exists
  const { data: existingEntry } = await supabase
    .from('nrhp_entries')
    .select('id')
    .eq('ref_number', refNumber)
    .single()
  
  // Clean up the text fields
  const cleanedDescription = cleanNrhpText(extractedData.description)
  const cleanedStatement = cleanNrhpText(extractedData.statement_of_significance)
  
  // Get PDF URL from NARA via spreadsheet
  console.log(`\n📄 Looking up PDF URL...`)
  const naraCatalogUrl = getNaraCatalogUrl(refNumber)
  let pdfUrl = null
  if (naraCatalogUrl) {
    pdfUrl = getPdfUrlFromNara(naraCatalogUrl, refNumber)
  }
  if (!pdfUrl) {
    console.log(`   ⚠️  Could not find PDF URL, using local path`)
    pdfUrl = `/data/nrhp/pdfs/${extractedData.source_file}`
  }
  
  if (existingEntry) {
    console.log(`⚠️  NRHP entry ${refNumber} already exists. Updating...`)
    const { error: updateError } = await supabase
      .from('nrhp_entries')
      .update({
        building_id: targetBuildingId,
        level_of_significance: extractedData.level_of_significance,
        areas_of_significance: extractedData.areas_of_significance || [],
        period_of_significance: extractedData.period_of_significance,
        description: cleanedDescription,
        statement_of_significance: cleanedStatement,
        pdf_url: pdfUrl
      })
      .eq('id', existingEntry.id)
    
    if (updateError) {
      console.error(`❌ Failed to update: ${updateError.message}`)
      return
    }
    console.log(`✅ Updated NRHP entry`)
  } else {
    // Create new NRHP entry
    const { data: nrhpEntry, error: nrhpError } = await supabase
      .from('nrhp_entries')
      .insert({
        ref_number: refNumber,
        building_id: targetBuildingId,
        level_of_significance: extractedData.level_of_significance,
        areas_of_significance: extractedData.areas_of_significance || [],
        period_of_significance: extractedData.period_of_significance,
        description: cleanedDescription,
        statement_of_significance: cleanedStatement,
        pdf_url: pdfUrl
      })
      .select()
      .single()
    
    if (nrhpError) {
      console.error(`❌ Failed to create NRHP entry: ${nrhpError.message}`)
      return
    }
    console.log(`✅ Created NRHP entry with ID: ${nrhpEntry.id}`)
  }
  
  // Check for images
  const imagesDir = path.join(dataDir, 'images', refNumber)
  
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(f => 
      f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png')
    )
    
    // Read metadata.json for captions if available
    const metadataPath = path.join(imagesDir, 'metadata.json')
    let imageMetadata = {}
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      if (metadata.images) {
        metadata.images.forEach(img => {
          imageMetadata[img.filename] = img
        })
      }
    }
    
    console.log(`\n📷 Found ${imageFiles.length} images to import (auto-publishing all)`)
    
    // Get or create entry ID
    const { data: entry } = await supabase
      .from('nrhp_entries')
      .select('id')
      .eq('ref_number', refNumber)
      .single()
    
    let imported = 0
    let updated = 0
    for (const imageFile of imageFiles) {
      // Get caption from metadata if available
      const imgMeta = imageMetadata[imageFile] || {}
      const caption = imgMeta.caption || null
      const sourcePage = imgMeta.page || 1
      
      // Check if already exists
      const { data: existing } = await supabase
        .from('nrhp_images')
        .select('id, original_caption')
        .eq('filename', imageFile)
        .single()
      
      if (existing) {
        // Update caption if it changed
        if (caption && caption !== existing.original_caption) {
          const { error: updateError } = await supabase
            .from('nrhp_images')
            .update({ original_caption: caption })
            .eq('id', existing.id)
          
          if (updateError) {
            console.log(`   ❌ Failed to update ${imageFile}: ${updateError.message}`)
          } else {
            console.log(`   🔄 Updated caption for ${imageFile}`)
            updated++
          }
        } else {
          console.log(`   ⏭️  ${imageFile} already exists (caption unchanged)`)
        }
        continue
      }
      
      const { error: imageError } = await supabase
        .from('nrhp_images')
        .insert({
          nrhp_entry_id: entry?.id,
          building_id: targetBuildingId,
          filename: imageFile,
          file_path: `/data/nrhp/images/${refNumber}/${imageFile}`,
          source_pdf: extractedData.source_file,
          source_page: sourcePage,
          original_caption: caption,
          copyright_status: 'public_domain_nrhp',
          is_published: true,  // Auto-publish all images
          needs_review: false  // No review needed
        })
      
      if (imageError) {
        console.log(`   ❌ Failed to import ${imageFile}: ${imageError.message}`)
      } else {
        console.log(`   ✅ Imported ${imageFile}`)
        imported++
      }
    }
    console.log(`\n📊 Imported ${imported} new images, updated ${updated} existing`)
  } else {
    console.log(`\n⚠️  No images folder found at ${imagesDir}`)
    console.log('   You may need to extract images from the PDF first.')
  }
  
  console.log('\n✅ Import complete!')
}

// Main
const args = process.argv.slice(2)

if (args.length === 0 || args[0] === 'list') {
  await listAvailable()
} else if (args[0] === 'import' && args[1]) {
  const refNumber = args[1]
  const buildingName = args.slice(2).join(' ') || null
  await importNrhp(refNumber, buildingName)
} else {
  console.log(`
NRHP Import Tool

Usage:
  node scripts/import-nrhp.mjs list
    - List available PDFs and their status

  node scripts/import-nrhp.mjs import <refNumber> [building name]
    - Import NRHP entry for the given reference number
    - Optionally specify building name to link or create

Examples:
  node scripts/import-nrhp.mjs list
  node scripts/import-nrhp.mjs import 95000531 Architects Building
  node scripts/import-nrhp.mjs import 89001165 Guardian Building
`)
}

