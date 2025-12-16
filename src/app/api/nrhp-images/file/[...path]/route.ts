import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

// Serve NRHP images from /data/nrhp/images/
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    
    // Security: only allow access to images folder and prevent directory traversal
    if (imagePath.includes('..')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }
    
    // Construct full path
    const fullPath = path.join(process.cwd(), 'data', 'nrhp', 'images', imagePath)
    
    // Check if file exists
    try {
      await stat(fullPath)
    } catch {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    
    // Read file
    const fileBuffer = await readFile(fullPath)
    
    // Determine content type
    const ext = path.extname(imagePath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.tiff': 'image/tiff',
      '.tif': 'image/tiff',
    }
    const contentType = contentTypes[ext] || 'application/octet-stream'
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 })
  }
}

