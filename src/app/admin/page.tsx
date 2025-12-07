'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Upload, Save, X, Camera, Edit2, Trash2, Plus, Check, LogOut, GripVertical, Star, ChevronUp, ChevronDown, Building2, Tag, Sparkles, ExternalLink, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Building, Photo } from '@/lib/database.types'

// Tag Input Component
function TagInput({ 
  value, 
  onChange, 
  suggestions, 
  placeholder,
  label 
}: { 
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder: string
  label: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(filter.toLowerCase()) && s !== value
  ).slice(0, 10)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setFilter(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            setFilter(value)
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
        />
        <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                onChange(suggestion)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-detroit-gold/10 text-sm flex items-center gap-2"
            >
              <Tag className="w-3 h-3 text-detroit-gold" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {/* Quick tags below input */}
      {!isOpen && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {suggestions.slice(0, 5).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onChange(tag)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                value === tag 
                  ? 'bg-detroit-gold text-white border-detroit-gold' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-detroit-gold hover:text-detroit-gold'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

type BuildingForm = {
  name: string
  alternate_names: string
  address: string
  architect: string
  year_built: string
  architectural_style: string
  building_type: string
  status: string
  aia_number: string
  ferry_number: string
  aia_text: string
  ferry_text: string
  photographer_notes: string
}

const emptyForm: BuildingForm = {
  name: '',
  alternate_names: '',
  address: '',
  architect: '',
  year_built: '',
  architectural_style: '',
  building_type: '',
  status: 'extant',
  aia_number: '',
  ferry_number: '',
  aia_text: '',
  ferry_text: '',
  photographer_notes: '',
}

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [pendingBuildingId, setPendingBuildingId] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Building editor state
  const [showBuildingModal, setShowBuildingModal] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [buildingForm, setBuildingForm] = useState<BuildingForm>(emptyForm)
  const [activeTab, setActiveTab] = useState<'photos' | 'details' | 'text'>('photos')
  
  // Photo drag state
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  
  // Tags from existing buildings
  const [existingStyles, setExistingStyles] = useState<string[]>([])
  const [existingTypes, setExistingTypes] = useState<string[]>([])
  const [existingArchitects, setExistingArchitects] = useState<string[]>([])

  // Wikipedia enrichment state
  const [showEnrichModal, setShowEnrichModal] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [enrichedData, setEnrichedData] = useState<{
    isCorrectArticle: boolean
    wikipediaUrl: string | null
    wikipediaTitle: string | null
    confidence: 'high' | 'medium' | 'low'
    architect: string | null
    yearBuilt: string | null
    yearDemolished: string | null
    architecturalStyle: string | null
    buildingType: string | null
    address: string | null
    description: string | null
    historicalSignificance: string | null
    notableFeatures: string[] | null
    alternateNames: string[] | null
    status: 'extant' | 'demolished' | null
    fullWikipediaText: string | null
    wikipediaHtml: string | null
  } | null>(null)
  const [enrichError, setEnrichError] = useState<string | null>(null)
  const [manualWikiUrl, setManualWikiUrl] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/admin/login')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Get building ID from URL parameter
  useEffect(() => {
    const buildingId = searchParams.get('building')
    if (buildingId) {
      setPendingBuildingId(buildingId)
    }
  }, [searchParams])

  // Fetch buildings
  useEffect(() => {
    if (!user) return
    fetchBuildings()
  }, [user])

  // Auto-select building from URL parameter once buildings are loaded
  useEffect(() => {
    if (pendingBuildingId && buildings.length > 0) {
      const building = buildings.find(b => b.id === pendingBuildingId)
      if (building) {
        setSelectedBuilding(building)
        setPendingBuildingId(null)
      }
    }
  }, [pendingBuildingId, buildings])

  const fetchBuildings = async () => {
    const { data } = await supabase
      .from('buildings')
      .select('*')
      .order('name')
    
    if (data) {
      setBuildings(data)
      
      // Extract unique tags for autocomplete
      const styleCount: Record<string, number> = {}
      const typeCount: Record<string, number> = {}
      const architectCount: Record<string, number> = {}
      
      data.forEach(b => {
        if (b.architectural_style) {
          styleCount[b.architectural_style] = (styleCount[b.architectural_style] || 0) + 1
        }
        if (b.building_type) {
          typeCount[b.building_type] = (typeCount[b.building_type] || 0) + 1
        }
        if (b.architect) {
          architectCount[b.architect] = (architectCount[b.architect] || 0) + 1
        }
      })
      
      // Sort by frequency (most used first)
      setExistingStyles(Object.entries(styleCount).sort((a, b) => b[1] - a[1]).map(e => e[0]))
      setExistingTypes(Object.entries(typeCount).sort((a, b) => b[1] - a[1]).map(e => e[0]))
      setExistingArchitects(Object.entries(architectCount).sort((a, b) => b[1] - a[1]).map(e => e[0]))
    }
  }

  // Fetch photos when building is selected
  useEffect(() => {
    if (!selectedBuilding) {
      setPhotos([])
      return
    }

    async function fetchPhotos() {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .eq('building_id', selectedBuilding!.id)
        .order('sort_order')
      
      if (data) setPhotos(data)
    }
    fetchPhotos()
  }, [selectedBuilding])

  const filteredBuildings = buildings.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.architect?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Enrich building data from Wikipedia using GPT
  const enrichFromWikipedia = async () => {
    if (!selectedBuilding) return

    setEnriching(true)
    setShowEnrichModal(true)
    setEnrichedData(null)
    setEnrichError(null)
    setShowManualInput(false)
    setManualWikiUrl('')

    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingName: selectedBuilding.name,
          address: selectedBuilding.address,
          existingData: {
            architect: selectedBuilding.architect,
            year_built: selectedBuilding.year_built,
            architectural_style: selectedBuilding.architectural_style,
            building_type: selectedBuilding.building_type,
            status: selectedBuilding.status,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setEnrichError(errorData.error || 'Failed to enrich building data')
        setShowManualInput(true)
        setEnriching(false)
        return
      }

      const data = await response.json()
      setEnrichedData(data)
    } catch (error) {
      console.error('Enrich API error:', error)
      setEnrichError('Error connecting to enrichment service')
      setShowManualInput(true)
    }

    setEnriching(false)
  }

  // Fetch Wikipedia content from a manually entered URL
  const enrichFromManualUrl = async () => {
    if (!selectedBuilding || !manualWikiUrl) return

    setEnriching(true)
    setEnrichError(null)

    try {
      // Extract page title from URL
      const urlMatch = manualWikiUrl.match(/wikipedia\.org\/wiki\/([^#?]+)/)
      if (!urlMatch) {
        setEnrichError('Invalid Wikipedia URL. Please use a URL like: https://en.wikipedia.org/wiki/Page_Name')
        setEnriching(false)
        return
      }

      const pageTitle = decodeURIComponent(urlMatch[1].replace(/_/g, ' '))

      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingName: pageTitle, // Use the Wikipedia page title as the search term
          address: selectedBuilding.address,
          existingData: {
            architect: selectedBuilding.architect,
            year_built: selectedBuilding.year_built,
            architectural_style: selectedBuilding.architectural_style,
            building_type: selectedBuilding.building_type,
            status: selectedBuilding.status,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setEnrichError(errorData.error || 'Failed to fetch Wikipedia content')
        setEnriching(false)
        return
      }

      const data = await response.json()
      setEnrichedData(data)
      setShowManualInput(false)
    } catch (error) {
      console.error('Manual enrich error:', error)
      setEnrichError('Error fetching Wikipedia content')
    }

    setEnriching(false)
  }

  // Apply enriched data to the building
  const applyEnrichedData = async () => {
    if (!selectedBuilding || !enrichedData) return

    setSaving(true)

    // Build update object with enriched fields
    const updates: Record<string, any> = {}
    
    // Save Wikipedia HTML to dedicated field
    if (enrichedData.wikipediaHtml) {
      updates.wikipedia_entry = enrichedData.wikipediaHtml
    }

    // Update fields - overwrite if we have better data from Wikipedia
    if (enrichedData.architect && !selectedBuilding.architect) {
      updates.architect = enrichedData.architect
    }
    // Always update year if we have it from Wikipedia (often more accurate)
    if (enrichedData.yearBuilt) {
      updates.year_built = parseInt(enrichedData.yearBuilt)
    }
    // Always update address if we have it from Wikipedia
    if (enrichedData.address) {
      updates.address = enrichedData.address
    }
    if (enrichedData.architecturalStyle && !selectedBuilding.architectural_style) {
      updates.architectural_style = enrichedData.architecturalStyle
    }
    if (enrichedData.buildingType && !selectedBuilding.building_type) {
      updates.building_type = enrichedData.buildingType
    }
    if (enrichedData.status && !selectedBuilding.status) {
      updates.status = enrichedData.status
    }
    if (enrichedData.alternateNames && enrichedData.alternateNames.length > 0 && 
        (!selectedBuilding.alternate_names || selectedBuilding.alternate_names.length === 0)) {
      updates.alternate_names = enrichedData.alternateNames
    }
    if (enrichedData.yearDemolished) {
      updates.year_demolished = parseInt(enrichedData.yearDemolished)
    }

    if (Object.keys(updates).length === 0) {
      showToast('No new data to apply', 'error')
      setSaving(false)
      setShowEnrichModal(false)
      return
    }

    const { error } = await supabase
      .from('buildings')
      .update(updates)
      .eq('id', selectedBuilding.id)

    if (error) {
      showToast('Error saving enriched data: ' + error.message, 'error')
      console.error('Update error:', error)
    } else {
      // Update local state
      const updatedBuilding = { ...selectedBuilding, ...updates }
      setSelectedBuilding(updatedBuilding as Building)
      setBuildings(buildings.map(b => b.id === selectedBuilding.id ? updatedBuilding as Building : b))
      showToast('Building enriched with Wikipedia data!', 'success')
      setShowEnrichModal(false)
    }

    setSaving(false)
  }

  // Update Street View image for a building
  const updateStreetView = async (buildingId: string) => {
    try {
      const response = await fetch('/api/streetview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildingId })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        showToast('📍 Geocoding & Street View updated!', 'success')
        // Refresh photos to show the new street view
        if (selectedBuilding?.id === buildingId) {
          const { data: photos } = await supabase
            .from('photos')
            .select('*')
            .eq('building_id', buildingId)
            .order('sort_order')
          if (photos) setPhotos(photos)
        }
      } else {
        console.log('Street View update:', data.error)
      }
    } catch (error) {
      console.error('Street View update error:', error)
    }
  }

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (!selectedBuilding || !files.length) return

    setUploading(true)
    const newPhotos: Photo[] = []

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${selectedBuilding.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('building-photos')
        .upload(fileName, file)

      if (uploadError) continue

      const { data: { publicUrl } } = supabase.storage
        .from('building-photos')
        .getPublicUrl(fileName)

      const { data: photoData } = await supabase
        .from('photos')
        .insert({
          building_id: selectedBuilding.id,
          url: publicUrl,
          photographer: 'Andrew Petrov',
          sort_order: photos.length + newPhotos.length,
          is_primary: photos.length === 0 && newPhotos.length === 0,
        })
        .select()
        .single()

      if (photoData) newPhotos.push(photoData)
    }

    setPhotos([...photos, ...newPhotos])
    setUploading(false)
    showToast(`Uploaded ${newPhotos.length} photo(s)`, 'success')
  }

  // Delete photo
  const deletePhoto = async (photo: Photo) => {
    if (!confirm('Delete this photo?')) return

    const filePath = photo.url.split('/building-photos/')[1]
    if (filePath) {
      await supabase.storage.from('building-photos').remove([filePath])
    }

    await supabase.from('photos').delete().eq('id', photo.id)
    
    const updatedPhotos = photos.filter(p => p.id !== photo.id)
    setPhotos(updatedPhotos)
    showToast('Photo deleted', 'success')
  }

  // Set primary photo
  const setPrimaryPhoto = async (photo: Photo) => {
    // Unset all primary
    await supabase
      .from('photos')
      .update({ is_primary: false })
      .eq('building_id', selectedBuilding!.id)

    // Set this one as primary
    await supabase
      .from('photos')
      .update({ is_primary: true })
      .eq('id', photo.id)

    setPhotos(photos.map(p => ({ ...p, is_primary: p.id === photo.id })))
    showToast('Primary photo updated', 'success')
  }

  // Move photo up/down
  const movePhoto = async (photo: Photo, direction: 'up' | 'down') => {
    const currentIndex = photos.findIndex(p => p.id === photo.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= photos.length) return

    const newPhotos = [...photos]
    const [removed] = newPhotos.splice(currentIndex, 1)
    newPhotos.splice(newIndex, 0, removed)

    // Update sort_order in database
    for (let i = 0; i < newPhotos.length; i++) {
      await supabase
        .from('photos')
        .update({ sort_order: i })
        .eq('id', newPhotos[i].id)
    }

    setPhotos(newPhotos)
  }

  // Drag and drop handlers for photo reordering
  const handlePhotoDragStart = (index: number) => {
    setDraggedPhotoIndex(index)
  }

  const handlePhotoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedPhotoIndex !== null && draggedPhotoIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handlePhotoDragLeave = () => {
    setDragOverIndex(null)
  }

  const handlePhotoDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedPhotoIndex === null || draggedPhotoIndex === dropIndex) {
      setDraggedPhotoIndex(null)
      setDragOverIndex(null)
      return
    }

    const newPhotos = [...photos]
    const [removed] = newPhotos.splice(draggedPhotoIndex, 1)
    newPhotos.splice(dropIndex, 0, removed)

    // Update UI immediately
    setPhotos(newPhotos)
    setDraggedPhotoIndex(null)
    setDragOverIndex(null)

    // Update sort_order in database
    for (let i = 0; i < newPhotos.length; i++) {
      await supabase
        .from('photos')
        .update({ sort_order: i })
        .eq('id', newPhotos[i].id)
    }
  }

  const handlePhotoDragEnd = () => {
    setDraggedPhotoIndex(null)
    setDragOverIndex(null)
  }

  // Open building modal for new/edit
  const openBuildingModal = (building?: Building) => {
    if (building) {
      setEditingBuilding(building)
      setBuildingForm({
        name: building.name || '',
        alternate_names: (building.alternate_names || []).join(', '),
        address: building.address || '',
        architect: building.architect || '',
        year_built: building.year_built?.toString() || '',
        architectural_style: building.architectural_style || '',
        building_type: building.building_type || '',
        status: building.status || 'extant',
        aia_number: building.aia_number || '',
        ferry_number: building.ferry_number || '',
        aia_text: building.aia_text || '',
        ferry_text: building.ferry_text || '',
        photographer_notes: building.photographer_notes || '',
      })
    } else {
      setEditingBuilding(null)
      setBuildingForm(emptyForm)
    }
    setShowBuildingModal(true)
  }

  // Save building
  const saveBuilding = async () => {
    if (!buildingForm.name.trim()) {
      showToast('Building name is required', 'error')
      return
    }

    setSaving(true)

    const buildingData = {
      name: buildingForm.name.trim(),
      alternate_names: buildingForm.alternate_names ? buildingForm.alternate_names.split(',').map(s => s.trim()).filter(Boolean) : [],
      address: buildingForm.address.trim() || null,
      architect: buildingForm.architect.trim() || null,
      year_built: buildingForm.year_built ? parseInt(buildingForm.year_built) : null,
      architectural_style: buildingForm.architectural_style.trim() || null,
      building_type: buildingForm.building_type.trim() || null,
      status: buildingForm.status || 'extant',
      aia_number: buildingForm.aia_number.trim() || null,
      ferry_number: buildingForm.ferry_number.trim() || null,
      aia_text: buildingForm.aia_text.trim() || null,
      ferry_text: buildingForm.ferry_text.trim() || null,
      photographer_notes: buildingForm.photographer_notes.trim() || null,
    }

    if (editingBuilding) {
      // Update existing
      const { error } = await supabase
        .from('buildings')
        .update(buildingData)
        .eq('id', editingBuilding.id)

      if (error) {
        showToast('Error updating building', 'error')
      } else {
        showToast('Building updated', 'success')
        fetchBuildings()
        if (selectedBuilding?.id === editingBuilding.id) {
          setSelectedBuilding({ ...selectedBuilding, ...buildingData } as Building)
        }
        // Update Street View in background
        updateStreetView(editingBuilding.id)
      }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('buildings')
        .insert(buildingData)
        .select()
        .single()

      if (error) {
        showToast('Error creating building', 'error')
      } else {
        showToast('Building created', 'success')
        fetchBuildings()
        if (data) setSelectedBuilding(data)
      }
    }

    setSaving(false)
    setShowBuildingModal(false)
  }

  // Delete building
  const deleteBuilding = async () => {
    if (!editingBuilding) return
    if (!confirm(`Delete "${editingBuilding.name}"? This will also delete all photos.`)) return

    // Delete photos from storage
    for (const photo of photos) {
      const filePath = photo.url.split('/building-photos/')[1]
      if (filePath) {
        await supabase.storage.from('building-photos').remove([filePath])
      }
    }

    // Delete photo records
    await supabase.from('photos').delete().eq('building_id', editingBuilding.id)

    // Delete building
    await supabase.from('buildings').delete().eq('id', editingBuilding.id)

    showToast('Building deleted', 'success')
    setShowBuildingModal(false)
    setSelectedBuilding(null)
    fetchBuildings()
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [selectedBuilding, photos])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-detroit-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-detroit-green text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl">Admin Panel</h1>
            <p className="text-gray-300 mt-1">Logged in as {user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => openBuildingModal()}
              className="flex items-center gap-2 bg-detroit-gold text-detroit-green px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Building
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Building List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buildings..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {filteredBuildings.length} buildings
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto">
              {filteredBuildings.map(building => (
                <button
                  key={building.id}
                  onClick={() => setSelectedBuilding(building)}
                  className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                    selectedBuilding?.id === building.id ? 'bg-detroit-gold/10 border-l-4 border-l-detroit-gold' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900 line-clamp-1">{building.name}</div>
                  <div className="text-sm text-gray-500">
                    {building.year_built}
                    {building.building_type && ` • ${building.building_type}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {selectedBuilding ? (
              <div className="space-y-6">
                {/* Building Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-display text-2xl text-detroit-green mb-2">
                        {selectedBuilding.name}
                      </h2>
                      <div className="text-gray-600 text-sm space-y-1">
                        {selectedBuilding.architect && <div>Architect: {selectedBuilding.architect}</div>}
                        {selectedBuilding.year_built && <div>Year: {selectedBuilding.year_built}</div>}
                        {selectedBuilding.address && <div>Address: {selectedBuilding.address}</div>}
                        {selectedBuilding.building_type && <div>Type: {selectedBuilding.building_type}</div>}
                      </div>
                    </div>
                    <button
                      onClick={() => openBuildingModal(selectedBuilding)}
                      className="flex items-center gap-2 bg-detroit-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Building
                    </button>
                    <button
                      onClick={enrichFromWikipedia}
                      disabled={enriching}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {enriching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Enrich from Wikipedia
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="flex border-b">
                    <button
                      onClick={() => setActiveTab('photos')}
                      className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'photos' ? 'bg-detroit-gold/10 text-detroit-green border-b-2 border-detroit-gold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <Camera className="w-4 h-4 inline mr-2" />
                      Photos ({photos.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'details' ? 'bg-detroit-gold/10 text-detroit-green border-b-2 border-detroit-gold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <Building2 className="w-4 h-4 inline mr-2" />
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'text' ? 'bg-detroit-gold/10 text-detroit-green border-b-2 border-detroit-gold' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <Edit2 className="w-4 h-4 inline mr-2" />
                      Text Content
                    </button>
                  </div>

                  <div className="p-6">
                    {/* Photos Tab */}
                    {activeTab === 'photos' && (
                      <div>
                        {/* Drop zone */}
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={() => document.getElementById('file-input')?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-detroit-gold hover:bg-detroit-gold/5 transition-colors"
                        >
                          <input
                            id="file-input"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                            className="hidden"
                          />
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600">
                            {uploading ? 'Uploading...' : 'Drop photos here or click to upload'}
                          </p>
                        </div>

                        {/* Photo list with reorder */}
                        {photos.length > 0 && (
                          <div className="mt-6 space-y-1">
                            <p className="text-sm text-gray-500 mb-2">Drag to reorder or use arrows. Click star to set primary.</p>
                            {photos.map((photo, index) => (
                              <div
                                key={photo.id}
                                draggable
                                onDragStart={() => handlePhotoDragStart(index)}
                                onDragOver={(e) => handlePhotoDragOver(e, index)}
                                onDragLeave={handlePhotoDragLeave}
                                onDrop={(e) => handlePhotoDrop(e, index)}
                                onDragEnd={handlePhotoDragEnd}
                                className={`flex items-center gap-3 rounded-lg p-2 transition-all ${
                                  draggedPhotoIndex === index 
                                    ? 'opacity-50 bg-gray-200' 
                                    : dragOverIndex === index 
                                      ? 'bg-detroit-gold/20 border-2 border-detroit-gold border-dashed' 
                                      : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                                  <GripVertical className="w-5 h-5" />
                                </div>
                                <img
                                  src={photo.url}
                                  alt={`Photo ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg pointer-events-none"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">Photo {index + 1}</div>
                                  {photo.is_primary && (
                                    <span className="text-xs bg-detroit-gold text-white px-2 py-0.5 rounded">Primary</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => movePhoto(photo, 'up')}
                                    disabled={index === 0}
                                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-30"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => movePhoto(photo, 'down')}
                                    disabled={index === photos.length - 1}
                                    className="p-2 hover:bg-gray-200 rounded disabled:opacity-30"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setPrimaryPhoto(photo)}
                                    className={`p-2 rounded ${photo.is_primary ? 'text-detroit-gold' : 'hover:bg-gray-200 text-gray-400'}`}
                                  >
                                    <Star className={`w-4 h-4 ${photo.is_primary ? 'fill-current' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => deletePhoto(photo)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Architect</label>
                            <div className="text-gray-900">{selectedBuilding.architect || '—'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                            <div className="text-gray-900">{selectedBuilding.year_built || '—'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                            <div className="text-gray-900">{selectedBuilding.architectural_style || '—'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <div className="text-gray-900">{selectedBuilding.building_type || '—'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <div className="text-gray-900">{selectedBuilding.status || '—'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="text-gray-900">{selectedBuilding.address || '—'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">AIA Number</label>
                            <div className="text-gray-900">{selectedBuilding.aia_number || '—'}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ferry Number</label>
                            <div className="text-gray-900">{selectedBuilding.ferry_number || '—'}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => openBuildingModal(selectedBuilding)}
                          className="mt-4 bg-detroit-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                        >
                          Edit Details
                        </button>
                      </div>
                    )}

                    {/* Text Content Tab */}
                    {activeTab === 'text' && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">AIA Guide Text</label>
                          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                            {selectedBuilding.aia_text || 'No AIA text available'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ferry Book Text</label>
                          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                            {selectedBuilding.ferry_text || 'No Ferry text available'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Photographer's Notes</label>
                          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                            {selectedBuilding.photographer_notes || 'No notes yet'}
                          </div>
                        </div>
                        <button
                          onClick={() => openBuildingModal(selectedBuilding)}
                          className="bg-detroit-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                        >
                          Edit Text Content
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="font-display text-xl text-gray-600">Select a Building</h3>
                <p className="text-gray-400 mt-2">Choose a building from the list or add a new one</p>
                <button
                  onClick={() => openBuildingModal()}
                  className="mt-6 bg-detroit-gold text-detroit-green px-6 py-2 rounded-lg font-medium hover:bg-opacity-90"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add New Building
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wikipedia Enrichment Modal */}
      {showEnrichModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-purple-600 text-white">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Enrich from Wikipedia (GPT-4)
              </h2>
              <button onClick={() => setShowEnrichModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {enriching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600">Searching Wikipedia and analyzing with GPT-4...</p>
                  <p className="text-gray-400 text-sm mt-2">"{selectedBuilding?.name}"</p>
                </div>
              ) : enrichError ? (
                <div className="text-center py-8">
                  <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
                  <p className="text-red-600 font-medium mb-4">{enrichError}</p>
                  
                  {showManualInput && (
                    <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                      <h4 className="font-medium text-gray-900 mb-3">Enter Wikipedia URL manually</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Paste the Wikipedia URL for this building:
                      </p>
                      <input
                        type="url"
                        value={manualWikiUrl}
                        onChange={(e) => setManualWikiUrl(e.target.value)}
                        placeholder="https://en.wikipedia.org/wiki/..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={enrichFromManualUrl}
                          disabled={!manualWikiUrl || enriching}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {enriching ? 'Fetching...' : 'Fetch from URL'}
                        </button>
                        <button 
                          onClick={enrichFromWikipedia}
                          className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        >
                          Retry Search
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!showManualInput && (
                    <button 
                      onClick={enrichFromWikipedia}
                      className="mt-4 text-purple-600 hover:underline"
                    >
                      Try again
                    </button>
                  )}
                </div>
              ) : enrichedData ? (
                <div className="space-y-6">
                  {/* Article Status */}
                  {!enrichedData.isCorrectArticle ? (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">⚠️ GPT couldn't find a matching Wikipedia article for this building.</p>
                      </div>
                      
                      {/* Manual URL input */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Enter Wikipedia URL manually</h4>
                        <p className="text-sm text-gray-500 mb-3">
                          If you know the correct Wikipedia page, paste the URL here:
                        </p>
                        <input
                          type="url"
                          value={manualWikiUrl}
                          onChange={(e) => setManualWikiUrl(e.target.value)}
                          placeholder="https://en.wikipedia.org/wiki/..."
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                        />
                        <button 
                          onClick={enrichFromManualUrl}
                          disabled={!manualWikiUrl || enriching}
                          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {enriching ? 'Fetching...' : 'Fetch from URL'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-purple-900">{enrichedData.wikipediaTitle}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              enrichedData.confidence === 'high' ? 'bg-green-100 text-green-800' :
                              enrichedData.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {enrichedData.confidence} confidence
                            </span>
                          </div>
                          <a 
                            href={enrichedData.wikipediaUrl || ''} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            View on Wikipedia <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                  )}

                  {enrichedData.isCorrectArticle && (
                    <>
                      {/* Extracted Fields Preview */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 border-b pb-2">Extracted Information</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {enrichedData.architect && (
                            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Architect</label>
                                <p className="font-medium truncate">{enrichedData.architect}</p>
                              </div>
                              {selectedBuilding?.architect ? (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shrink-0">Set</span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded shrink-0">New</span>
                              )}
                            </div>
                          )}

                          {enrichedData.yearBuilt && (
                            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Year Built</label>
                                <p className="font-medium">{enrichedData.yearBuilt}</p>
                              </div>
                              {selectedBuilding?.year_built ? (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shrink-0">Set</span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded shrink-0">New</span>
                              )}
                            </div>
                          )}

                          {enrichedData.architecturalStyle && (
                            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Style</label>
                                <p className="font-medium">{enrichedData.architecturalStyle}</p>
                              </div>
                              {selectedBuilding?.architectural_style ? (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shrink-0">Set</span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded shrink-0">New</span>
                              )}
                            </div>
                          )}

                          {enrichedData.buildingType && (
                            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Building Type</label>
                                <p className="font-medium">{enrichedData.buildingType}</p>
                              </div>
                              {selectedBuilding?.building_type ? (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shrink-0">Set</span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded shrink-0">New</span>
                              )}
                            </div>
                          )}

                          {enrichedData.status && (
                            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                                <p className="font-medium capitalize">{enrichedData.status}</p>
                              </div>
                              {selectedBuilding?.status ? (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded shrink-0">Set</span>
                              ) : (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded shrink-0">New</span>
                              )}
                            </div>
                          )}

                          {enrichedData.yearDemolished && (
                            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider">Year Demolished</label>
                                <p className="font-medium">{enrichedData.yearDemolished}</p>
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded shrink-0">New</span>
                            </div>
                          )}
                        </div>

                        {enrichedData.alternateNames && enrichedData.alternateNames.length > 0 && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase tracking-wider">Alternate Names</label>
                            <p className="font-medium">{enrichedData.alternateNames.join(', ')}</p>
                          </div>
                        )}

                        {enrichedData.description && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase tracking-wider">Description</label>
                            <p className="text-sm text-gray-700 mt-1">{enrichedData.description}</p>
                          </div>
                        )}

                        {enrichedData.historicalSignificance && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase tracking-wider">Historical Significance</label>
                            <p className="text-sm text-gray-700 mt-1">{enrichedData.historicalSignificance}</p>
                          </div>
                        )}

                        {enrichedData.notableFeatures && enrichedData.notableFeatures.length > 0 && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase tracking-wider">Notable Features</label>
                            <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                              {enrichedData.notableFeatures.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Full Wikipedia Text Preview */}
                      {enrichedData.fullWikipediaText && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Full Wikipedia Entry</h4>
                          <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto whitespace-pre-wrap">
                            {enrichedData.fullWikipediaText}
                          </div>
                          <p className="text-xs text-gray-400">This full text will be added to the Photographer's Notes section.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No data available. Try searching again.</p>
                </div>
              )}
            </div>

            {enrichedData && enrichedData.isCorrectArticle && (
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowEnrichModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyEnrichedData}
                  disabled={saving}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Building Modal */}
      {showBuildingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-display text-2xl">
                {editingBuilding ? 'Edit Building' : 'Add New Building'}
              </h2>
              <button onClick={() => setShowBuildingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building Name *</label>
                  <input
                    type="text"
                    value={buildingForm.name}
                    onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., Guardian Building"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Names (comma separated)</label>
                  <input
                    type="text"
                    value={buildingForm.alternate_names}
                    onChange={(e) => setBuildingForm({ ...buildingForm, alternate_names: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., Union Guardian Building, Union Trust Building"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={buildingForm.address}
                    onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., 500 Griswold St, Detroit, MI"
                  />
                </div>

                <div>
                  <TagInput
                    label="Architect"
                    value={buildingForm.architect}
                    onChange={(value) => setBuildingForm({ ...buildingForm, architect: value })}
                    suggestions={existingArchitects}
                    placeholder="e.g., Wirt Rowland"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                  <input
                    type="text"
                    value={buildingForm.year_built}
                    onChange={(e) => setBuildingForm({ ...buildingForm, year_built: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., 1929"
                  />
                </div>

                <div>
                  <TagInput
                    label="Architectural Style"
                    value={buildingForm.architectural_style}
                    onChange={(value) => setBuildingForm({ ...buildingForm, architectural_style: value })}
                    suggestions={existingStyles}
                    placeholder="e.g., Art Deco"
                  />
                </div>

                <div>
                  <TagInput
                    label="Building Type"
                    value={buildingForm.building_type}
                    onChange={(value) => setBuildingForm({ ...buildingForm, building_type: value })}
                    suggestions={existingTypes}
                    placeholder="e.g., office building, church, house"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={buildingForm.status}
                    onChange={(e) => setBuildingForm({ ...buildingForm, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                  >
                    <option value="extant">Extant</option>
                    <option value="demolished">Demolished</option>
                    <option value="altered">Altered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AIA Number</label>
                  <input
                    type="text"
                    value={buildingForm.aia_number}
                    onChange={(e) => setBuildingForm({ ...buildingForm, aia_number: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ferry Number</label>
                  <input
                    type="text"
                    value={buildingForm.ferry_number}
                    onChange={(e) => setBuildingForm({ ...buildingForm, ferry_number: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">AIA Guide Text</label>
                  <textarea
                    value={buildingForm.aia_text}
                    onChange={(e) => setBuildingForm({ ...buildingForm, aia_text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ferry Book Text</label>
                  <textarea
                    value={buildingForm.ferry_text}
                    onChange={(e) => setBuildingForm({ ...buildingForm, ferry_text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photographer's Notes</label>
                  <textarea
                    value={buildingForm.photographer_notes}
                    onChange={(e) => setBuildingForm({ ...buildingForm, photographer_notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none"
                    placeholder="Your personal observations and notes..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              {editingBuilding && (
                <button
                  onClick={deleteBuilding}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Delete Building
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  onClick={() => setShowBuildingModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBuilding}
                  disabled={saving}
                  className="px-6 py-2 bg-detroit-green text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingBuilding ? 'Update Building' : 'Create Building')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
