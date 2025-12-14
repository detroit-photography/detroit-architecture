import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { buildingId } = await request.json()

    if (!buildingId) {
      return NextResponse.json({ error: 'Building ID is required' }, { status: 400 })
    }

    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''
    if (!GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Google API key not configured' }, { status: 500 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get building data
    const { data: building, error: buildingError } = await supabase
      .from('buildings')
      .select('id, name, lat, lng, address')
      .eq('id', buildingId)
      .single()

    if (buildingError || !building) {
      return NextResponse.json({ error: 'Building not found' }, { status: 404 })
    }

    // Always geocode from address if available (to keep coordinates up to date)
    if (building.address) {
      // Only append Detroit, MI if not already in the address
      const addressLower = building.address.toLowerCase()
      const hasLocation = addressLower.includes('detroit') || addressLower.includes(', mi') || addressLower.includes(' mi ')
      const fullAddress = hasLocation ? building.address : `${building.address}, Detroit, MI`
      
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_API_KEY}`
      const geocodeRes = await fetch(geocodeUrl)
      const geocodeData = await geocodeRes.json()
      
      console.log('Geocode response for', fullAddress, ':', geocodeData.status)
      
      if (geocodeData.status === 'OK' && geocodeData.results?.[0]?.geometry?.location) {
        const { lat, lng } = geocodeData.results[0].geometry.location
        // Update building with new coordinates
        const { error: updateError } = await supabase
          .from('buildings')
          .update({ lat, lng })
          .eq('id', buildingId)
        
        if (updateError) {
          console.error('Failed to update coordinates:', updateError)
          return NextResponse.json({ 
            error: 'Failed to save coordinates to database',
            details: updateError.message 
          }, { status: 500 })
        }
        
        building.lat = lat
        building.lng = lng
      } else if (!building.lat || !building.lng) {
        // Only fail if we don't have existing coordinates
        return NextResponse.json({ 
          error: 'Could not geocode address',
          address: building.address,
          geocodeStatus: geocodeData.status,
          geocodeError: geocodeData.error_message
        }, { status: 400 })
      }
    } else if (!building.lat || !building.lng) {
      return NextResponse.json({ error: 'Building has no coordinates or address' }, { status: 400 })
    }

    // Check if outdoor street view is available
    const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${building.lat},${building.lng}&source=outdoor&key=${GOOGLE_API_KEY}`
    const metaRes = await fetch(metadataUrl)
    const metaData = await metaRes.json()

    if (metaData.status !== 'OK') {
      return NextResponse.json({ 
        error: 'No outdoor Street View available at this location',
        status: metaData.status 
      }, { status: 404 })
    }

    // Fetch the street view image
    const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${building.lat},${building.lng}&fov=90&heading=0&pitch=10&source=outdoor&key=${GOOGLE_API_KEY}`
    const imageRes = await fetch(imageUrl)
    
    if (!imageRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch Street View image' }, { status: 500 })
    }

    const imageBuffer = await imageRes.arrayBuffer()
    const imageData = new Uint8Array(imageBuffer)

    // Delete existing street view photo for this building
    const { data: existingPhotos } = await supabase
      .from('photos')
      .select('id, url')
      .eq('building_id', buildingId)
      .eq('photographer', 'Google Street View')

    if (existingPhotos && existingPhotos.length > 0) {
      for (const photo of existingPhotos) {
        // Delete from storage
        const filePath = photo.url.split('/building-photos/')[1]
        if (filePath) {
          await supabase.storage.from('building-photos').remove([filePath])
        }
        // Delete from database
        await supabase.from('photos').delete().eq('id', photo.id)
      }
    }

    // Upload new street view image
    const fileName = `street-views/${buildingId}.jpg`
    
    const { error: uploadError } = await supabase.storage
      .from('building-photos')
      .upload(fileName, imageData, { 
        contentType: 'image/jpeg',
        upsert: true 
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload Street View image' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('building-photos')
      .getPublicUrl(fileName)

    // Create photo record
    const captureDate = metaData.date || ''
    const { error: insertError } = await supabase
      .from('photos')
      .insert({
        building_id: buildingId,
        url: publicUrl,
        caption: `Street View${captureDate ? ` (${captureDate})` : ''}`,
        photographer: 'Google Street View',
        sort_order: 999,
        is_primary: false,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save Street View record' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      captureDate 
    })

  } catch (error) {
    console.error('Street View API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

