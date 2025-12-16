import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for all operations (bypasses RLS)
const SUPABASE_URL = 'https://qjxuiljsgrmymeayoqzi.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeHVpbGpzZ3JteW1lYXlvcXppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk2Njk2NCwiZXhwIjoyMDgwNTQyOTY0fQ.HUDqDqvEKADQXQTndpQcG-iS_RJok2J8lA1-ZNPts0c'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// GET - Get single NRHP image
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('nrhp_images')
      .select(`
        *,
        building:buildings(id, name),
        nrhp_entry:nrhp_entries(id, ref_number, description, statement_of_significance)
      `)
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching NRHP image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

// PATCH - Update NRHP image metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params
    
    // Get current image for edit history
    const { data: current, error: fetchError } = await supabase
      .from('nrhp_images')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching current image:', fetchError)
    }
    
    // Build edit history entry
    const editEntry = {
      timestamp: new Date().toISOString(),
      editor: body.editor || 'admin',
      changes: Object.keys(body).filter(k => k !== 'editor').map(field => ({
        field,
        old_value: current?.[field],
        new_value: body[field]
      }))
    }
    
    // Update with new edit history
    const updateData = {
      ...body,
      edit_history: [...(current?.edit_history || []), editEntry]
    }
    delete updateData.editor
    
    const { data, error } = await supabase
      .from('nrhp_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating NRHP image:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update image',
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete NRHP image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('nrhp_images')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error deleting NRHP image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

