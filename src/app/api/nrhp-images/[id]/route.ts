import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    const { data: current } = await supabase
      .from('nrhp_images')
      .select('*')
      .eq('id', id)
      .single()
    
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
  } catch (error) {
    console.error('Error updating NRHP image:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
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

