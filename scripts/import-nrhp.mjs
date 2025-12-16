#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase credentials
const SUPABASE_URL = 'https://qjxuiljsgrmymeayoqzi.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeHVpbGpzZ3JteW1lYXlvcXppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk2Njk2NCwiZXhwIjoyMDgwNTQyOTY0fQ.HUDqDqvEKADQXQTndpQcG-iS_RJok2J8lA1-ZNPts0c'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const dataDir = path.join(__dirname, '..', 'data', 'nrhp')

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
  
  if (existingEntry) {
    console.log(`⚠️  NRHP entry ${refNumber} already exists. Updating...`)
    const { error: updateError } = await supabase
      .from('nrhp_entries')
      .update({
        building_id: targetBuildingId,
        level_of_significance: extractedData.level_of_significance,
        areas_of_significance: extractedData.areas_of_significance || [],
        period_of_significance: extractedData.period_of_significance,
        description: extractedData.description,
        statement_of_significance: extractedData.statement_of_significance,
        pdf_url: `/data/nrhp/pdfs/${extractedData.source_file}`
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
        description: extractedData.description,
        statement_of_significance: extractedData.statement_of_significance,
        pdf_url: `/data/nrhp/pdfs/${extractedData.source_file}`
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
    
    console.log(`\n📷 Found ${imageFiles.length} images to import`)
    
    // Get or create entry ID
    const { data: entry } = await supabase
      .from('nrhp_entries')
      .select('id')
      .eq('ref_number', refNumber)
      .single()
    
    let imported = 0
    for (const imageFile of imageFiles) {
      // Check if already exists
      const { data: existing } = await supabase
        .from('nrhp_images')
        .select('id')
        .eq('filename', imageFile)
        .single()
      
      if (existing) {
        console.log(`   ⏭️  ${imageFile} already exists`)
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
          source_page: 1,
          copyright_status: 'public_domain_nrhp',
          is_published: false,
          needs_review: true
        })
      
      if (imageError) {
        console.log(`   ❌ Failed to import ${imageFile}: ${imageError.message}`)
      } else {
        console.log(`   ✅ Imported ${imageFile}`)
        imported++
      }
    }
    console.log(`\n📊 Imported ${imported} new images`)
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

