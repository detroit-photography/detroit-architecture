'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Save, X, Check, ChevronLeft, ChevronRight, 
  Loader2, Eye, EyeOff, Star, AlertCircle,
  Camera, Calendar, MapPin, Building2, FileText,
  RotateCw, RotateCcw
} from 'lucide-react'

type NRHPImage = {
  id: string
  created_at: string
  updated_at: string
  nrhp_entry_id: string | null
  building_id: string | null
  filename: string
  file_path: string
  file_size: number | null
  width: number | null
  height: number | null
  format: string | null
  source_pdf: string
  source_page: number
  extraction_method: string | null
  original_caption: string | null
  cleaned_caption: string | null
  title: string | null
  description: string | null
  photographer: string | null
  photo_date: string | null
  photo_year: number | null
  photo_era: string | null
  view_type: string | null
  view_direction: string | null
  features_shown: string[] | null
  copyright_status: string
  credit_line: string | null
  source_archive: string | null
  archive_reference: string | null
  is_primary: boolean
  is_published: boolean
  display_order: number
  needs_review: boolean
  quality_score: number | null
  processing_notes: string | null
  rotation: number | null  // 0, 90, 180, 270
  building?: { id: string; name: string }
  nrhp_entry?: { id: string; ref_number: string }
}

const VIEW_TYPES = ['exterior', 'interior', 'detail', 'aerial', 'streetscape', 'map', 'floor_plan']
const VIEW_DIRECTIONS = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest']
const PHOTO_ERAS = ['1880s', '1890s', '1900s', '1910s', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s']
const FEATURES = ['facade', 'tower', 'entrance', 'lobby', 'fireplace', 'staircase', 'ceiling', 'windows', 'ornament', 'roof', 'chimney', 'porch', 'balcony']

export default function NRHPImagesAdmin() {
  const [images, setImages] = useState<NRHPImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<NRHPImage | null>(null)
  const [editedImage, setEditedImage] = useState<Partial<NRHPImage>>({})
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<'all' | 'needs_review'>('needs_review')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fetch images
  useEffect(() => {
    fetchImages()
  }, [filter])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (filter === 'needs_review') {
        params.set('needs_review', 'true')
      }
      
      const res = await fetch(`/api/nrhp-images?${params}`)
      const data = await res.json()
      setImages(data.images || [])
      
      if (data.images?.length > 0 && !selectedImage) {
        setSelectedImage(data.images[0])
        setEditedImage(data.images[0])
        setCurrentIndex(0)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    }
    setLoading(false)
  }

  const selectImage = (image: NRHPImage, index: number) => {
    setSelectedImage(image)
    setEditedImage(image)
    setCurrentIndex(index)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(images.length - 1, currentIndex + 1)
    
    if (newIndex !== currentIndex) {
      selectImage(images[newIndex], newIndex)
    }
  }

  const updateField = (field: string, value: any) => {
    setEditedImage(prev => ({ ...prev, [field]: value }))
  }

  const toggleFeature = (feature: string) => {
    const current = editedImage.features_shown || []
    const updated = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature]
    updateField('features_shown', updated)
  }

  const saveChanges = async () => {
    if (!selectedImage) return
    
    setSaving(true)
    try {
      const res = await fetch(`/api/nrhp-images/${selectedImage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedImage)
      })
      
      if (res.ok) {
        const updated = await res.json()
        setImages(prev => prev.map(img => img.id === updated.id ? updated : img))
        setSelectedImage(updated)
        setEditedImage(updated)
      }
    } catch (error) {
      console.error('Error saving:', error)
    }
    setSaving(false)
  }

  const markReviewed = async () => {
    updateField('needs_review', false)
    await saveChanges()
    
    // Move to next image if filtering by needs_review
    if (filter === 'needs_review' && currentIndex < images.length - 1) {
      navigateImage('next')
    }
  }

  const getImageUrl = (image: NRHPImage) => {
    // Images are served via API from /data/nrhp/images/{ref_number}/{filename}
    const refNumber = image.source_pdf.replace('.pdf', '').split('_')[0]
    return `/api/nrhp-images/file/${refNumber}/${image.filename}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-detroit-green" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-detroit-green text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/70 hover:text-white">
              ← Back to Admin
            </Link>
            <h1 className="text-2xl font-display">NRHP Historic Images</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'needs_review')}
              className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
            >
              <option value="needs_review">Needs Review ({images.length})</option>
              <option value="all">All Images</option>
            </select>
            
            <span className="text-white/70">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700">No images to review</h2>
          <p className="text-gray-500 mt-2">
            {filter === 'needs_review' 
              ? 'All images have been reviewed!' 
              : 'No NRHP images found. Run the extraction script first.'}
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Image Preview */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-900">
                {selectedImage && (
                  <Image
                    src={getImageUrl(selectedImage)}
                    alt={selectedImage.title || selectedImage.filename}
                    fill
                    className="object-contain"
                    style={{ transform: `rotate(${editedImage.rotation || 0}deg)` }}
                    unoptimized
                  />
                )}
                
                {/* Navigation arrows */}
                <button
                  onClick={() => navigateImage('prev')}
                  disabled={currentIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 p-2 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  disabled={currentIndex === images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 p-2 rounded-full"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                
                {/* Rotation controls */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  <button
                    onClick={() => updateField('rotation', ((editedImage.rotation || 0) - 90 + 360) % 360)}
                    className="bg-black/50 hover:bg-black/70 p-2 rounded-full"
                    title="Rotate left"
                  >
                    <RotateCcw className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => updateField('rotation', ((editedImage.rotation || 0) + 90) % 360)}
                    className="bg-black/50 hover:bg-black/70 p-2 rounded-full"
                    title="Rotate right"
                  >
                    <RotateCw className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Image info bar */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedImage?.filename}</p>
                    <p className="text-sm text-gray-500">
                      Page {selectedImage?.source_page} • {selectedImage?.width}x{selectedImage?.height} • {selectedImage?.format}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedImage?.needs_review && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                        Needs Review
                      </span>
                    )}
                    {selectedImage?.is_primary && (
                      <Star className="w-5 h-5 text-detroit-gold fill-detroit-gold" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Thumbnail strip */}
              <div className="p-4 border-t overflow-x-auto">
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => selectImage(img, idx)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                        idx === currentIndex ? 'border-detroit-gold' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={getImageUrl(img)}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {img.needs_review && (
                        <div className="absolute inset-0 bg-yellow-500/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Metadata Editor */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-medium">Edit Metadata</h2>
                <div className="flex gap-2">
                  <button
                    onClick={markReviewed}
                    disabled={saving || !editedImage.needs_review}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded text-sm"
                  >
                    <Check className="w-4 h-4" />
                    Mark Reviewed
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 bg-detroit-green hover:bg-detroit-green/90 text-white rounded text-sm"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {/* Building info */}
                {selectedImage?.building && (
                  <div className="flex items-center gap-2 p-3 bg-detroit-cream rounded">
                    <Building2 className="w-5 h-5 text-detroit-green" />
                    <span className="font-medium">{selectedImage.building.name}</span>
                    {selectedImage.nrhp_entry && (
                      <span className="text-sm text-gray-500">
                        (NRHP #{selectedImage.nrhp_entry.ref_number})
                      </span>
                    )}
                  </div>
                )}
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editedImage.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g., South facade of Bagley House"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                  />
                </div>
                
                {/* Original Caption (read-only) */}
                {editedImage.original_caption && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original NRHP Caption
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded text-sm text-gray-600 italic">
                      {editedImage.original_caption}
                    </div>
                  </div>
                )}
                
                {/* Cleaned Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Caption
                  </label>
                  <textarea
                    value={editedImage.cleaned_caption || ''}
                    onChange={(e) => updateField('cleaned_caption', e.target.value)}
                    placeholder="Clean/corrected caption for display"
                    rows={2}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editedImage.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Detailed description of what the photo shows"
                    rows={3}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                  />
                </div>
                
                {/* Date row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo Date</label>
                    <input
                      type="text"
                      value={editedImage.photo_date || ''}
                      onChange={(e) => updateField('photo_date', e.target.value)}
                      placeholder="circa 1889"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={editedImage.photo_year || ''}
                      onChange={(e) => updateField('photo_year', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="1889"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Era</label>
                    <select
                      value={editedImage.photo_era || ''}
                      onChange={(e) => updateField('photo_era', e.target.value || null)}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                    >
                      <option value="">Select era</option>
                      {PHOTO_ERAS.map(era => (
                        <option key={era} value={era}>{era}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Photographer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photographer</label>
                  <input
                    type="text"
                    value={editedImage.photographer || ''}
                    onChange={(e) => updateField('photographer', e.target.value)}
                    placeholder="Name of photographer if known"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                  />
                </div>
                
                {/* View type and direction */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
                    <select
                      value={editedImage.view_type || ''}
                      onChange={(e) => updateField('view_type', e.target.value || null)}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                    >
                      <option value="">Select type</option>
                      {VIEW_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">View Direction</label>
                    <select
                      value={editedImage.view_direction || ''}
                      onChange={(e) => updateField('view_direction', e.target.value || null)}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                    >
                      <option value="">Select direction</option>
                      {VIEW_DIRECTIONS.map(dir => (
                        <option key={dir} value={dir}>{dir}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Features shown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features Shown</label>
                  <div className="flex flex-wrap gap-2">
                    {FEATURES.map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          (editedImage.features_shown || []).includes(feature)
                            ? 'bg-detroit-gold text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Display options */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-3">Display Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={editedImage.is_published}
                        onChange={(e) => updateField('is_published', e.target.checked)}
                        className="w-4 h-4 text-detroit-gold rounded"
                      />
                      <span className="text-sm">Published (visible on site)</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={editedImage.is_primary}
                        onChange={(e) => updateField('is_primary', e.target.checked)}
                        className="w-4 h-4 text-detroit-gold rounded"
                      />
                      <span className="text-sm">Primary image for this building</span>
                    </label>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quality Score</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => updateField('quality_score', score)}
                            className={`p-1 ${
                              (editedImage.quality_score || 0) >= score
                                ? 'text-detroit-gold'
                                : 'text-gray-300'
                            }`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Processing notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Notes</label>
                  <textarea
                    value={editedImage.processing_notes || ''}
                    onChange={(e) => updateField('processing_notes', e.target.value)}
                    placeholder="Notes about image quality, extraction issues, etc."
                    rows={2}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-detroit-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

