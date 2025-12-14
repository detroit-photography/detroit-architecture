'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Upload, Save, X, Camera, Edit2, Trash2, Plus, Check, LogOut, GripVertical, Star, ChevronUp, ChevronDown, Building2, Tag, Sparkles, ExternalLink, Loader2, User, MapPin, Video, Image as ImageIcon, Calendar, Link as LinkIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Building, Photo, Shoot } from '@/lib/database.types'

// Main section tabs
type MainTab = 'architecture' | 'shoots'

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

// Building Selector Component for Shoots
function BuildingSelector({
  value,
  onChange,
  buildings,
}: {
  value: string | null
  onChange: (buildingId: string | null, buildingName: string | null) => void
  buildings: Building[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedBuilding = buildings.find(b => b.id === value)
  const filteredBuildings = buildings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20)

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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <LinkIcon className="w-4 h-4 inline mr-1" />
        Link to Architecture Location
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between hover:border-detroit-gold focus:outline-none focus:ring-2 focus:ring-detroit-gold"
      >
        {selectedBuilding ? (
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-detroit-gold" />
            {selectedBuilding.name}
          </span>
        ) : (
          <span className="text-gray-400">Select a location...</span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buildings..."
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-detroit-gold text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange(null, null)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-500"
            >
              No location
            </button>
            {filteredBuildings.map((building) => (
              <button
                key={building.id}
                type="button"
                onClick={() => {
                  onChange(building.id, building.name)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={`w-full text-left px-4 py-2 hover:bg-detroit-gold/10 text-sm flex items-center gap-2 ${
                  value === building.id ? 'bg-detroit-gold/10' : ''
                }`}
              >
                <Building2 className="w-4 h-4 text-detroit-gold flex-shrink-0" />
                <div className="min-w-0">
                  <div className="truncate font-medium">{building.name}</div>
                  {building.address && (
                    <div className="truncate text-xs text-gray-400">{building.address}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
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

const emptyBuildingForm: BuildingForm = {
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

type ShootForm = {
  title: string
  slug: string
  description: string
  date: string
  building_id: string | null
  location_name: string | null
  tags: string
  cover_image: string
  published: boolean
}

const emptyShootForm: ShootForm = {
  title: '',
  slug: '',
  description: '',
  date: '',
  building_id: null,
  location_name: null,
  tags: '',
  cover_image: '',
  published: true,
}

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Main tab state
  const [mainTab, setMainTab] = useState<MainTab>('architecture')
  
  // Buildings state
  const [buildings, setBuildings] = useState<Building[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [pendingBuildingId, setPendingBuildingId] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [buildingSearchQuery, setBuildingSearchQuery] = useState('')
  
  // Shoots state
  const [shoots, setShoots] = useState<Shoot[]>([])
  const [selectedShoot, setSelectedShoot] = useState<Shoot | null>(null)
  const [shootSearchQuery, setShootSearchQuery] = useState('')
  const [showShootModal, setShowShootModal] = useState(false)
  const [editingShoot, setEditingShoot] = useState<Shoot | null>(null)
  const [shootForm, setShootForm] = useState<ShootForm>(emptyShootForm)
  const [shootImages, setShootImages] = useState<{ src: string; alt: string; caption?: string }[]>([])
  
  // Common state
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Building editor state
  const [showBuildingModal, setShowBuildingModal] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [buildingForm, setBuildingForm] = useState<BuildingForm>(emptyBuildingForm)
  const [activeTab, setActiveTab] = useState<'photos' | 'details' | 'text'>('photos')
  
  // Photo drag state
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  
  // Tags from existing data
  const [existingStyles, setExistingStyles] = useState<string[]>([])
  const [existingTypes, setExistingTypes] = useState<string[]>([])
  const [existingArchitects, setExistingArchitects] = useState<string[]>([])
  const [existingShootTags, setExistingShootTags] = useState<string[]>([])

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
      setMainTab('architecture')
    }
  }, [searchParams])

  // Fetch buildings
  useEffect(() => {
    if (!user) return
    fetchBuildings()
    fetchShoots()
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
      
      setExistingStyles(Object.entries(styleCount).sort((a, b) => b[1] - a[1]).map(e => e[0]))
      setExistingTypes(Object.entries(typeCount).sort((a, b) => b[1] - a[1]).map(e => e[0]))
      setExistingArchitects(Object.entries(architectCount).sort((a, b) => b[1] - a[1]).map(e => e[0]))
    }
  }

  const fetchShoots = async () => {
    const { data } = await supabase
      .from('shoots')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
      setShoots(data)
      
      // Extract unique tags
      const tagCount: Record<string, number> = {}
      data.forEach(s => {
        s.tags?.forEach((tag: string) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      })
      setExistingShootTags(Object.entries(tagCount).sort((a, b) => b[1] - a[1]).map(e => e[0]))
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
    b.name.toLowerCase().includes(buildingSearchQuery.toLowerCase()) ||
    b.architect?.toLowerCase().includes(buildingSearchQuery.toLowerCase()) ||
    b.address?.toLowerCase().includes(buildingSearchQuery.toLowerCase())
  )

  const filteredShoots = shoots.filter(s =>
    s.title.toLowerCase().includes(shootSearchQuery.toLowerCase()) ||
    s.location_name?.toLowerCase().includes(shootSearchQuery.toLowerCase()) ||
    s.tags?.some(t => t.toLowerCase().includes(shootSearchQuery.toLowerCase()))
  )

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // ==================== WIKIPEDIA ENRICHMENT ====================

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

  const enrichFromManualUrl = async () => {
    if (!selectedBuilding || !manualWikiUrl) return

    setEnriching(true)
    setEnrichError(null)

    try {
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
          buildingName: pageTitle,
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

  const applyEnrichedData = async () => {
    if (!selectedBuilding || !enrichedData) return

    setSaving(true)

    const updates: Record<string, any> = {}
    
    if (enrichedData.wikipediaHtml) {
      updates.wikipedia_entry = enrichedData.wikipediaHtml
    }
    if (enrichedData.architect && !selectedBuilding.architect) {
      updates.architect = enrichedData.architect
    }
    if (enrichedData.yearBuilt) {
      updates.year_built = parseInt(enrichedData.yearBuilt)
    }
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
    } else {
      const updatedBuilding = { ...selectedBuilding, ...updates }
      setSelectedBuilding(updatedBuilding as Building)
      setBuildings(buildings.map(b => b.id === selectedBuilding.id ? updatedBuilding as Building : b))
      showToast('Building enriched with Wikipedia data!', 'success')
      setShowEnrichModal(false)
    }

    setSaving(false)
  }

  // ==================== SHOOT MANAGEMENT ====================
  
  const openShootModal = (shoot?: Shoot) => {
    if (shoot) {
      setEditingShoot(shoot)
      setShootForm({
        title: shoot.title,
        slug: shoot.slug,
        description: shoot.description || '',
        date: shoot.date || '',
        building_id: shoot.building_id,
        location_name: shoot.location_name,
        tags: shoot.tags?.join(', ') || '',
        cover_image: shoot.cover_image || '',
        published: shoot.published,
      })
      setShootImages(shoot.images || [])
    } else {
      setEditingShoot(null)
      setShootForm(emptyShootForm)
      setShootImages([])
    }
    setShowShootModal(true)
  }

  const saveShoot = async () => {
    if (!shootForm.title.trim()) {
      showToast('Shoot title is required', 'error')
      return
    }

    setSaving(true)

    const shootData = {
      title: shootForm.title.trim(),
      slug: shootForm.slug || generateSlug(shootForm.title),
      description: shootForm.description.trim() || null,
      date: shootForm.date || null,
      building_id: shootForm.building_id,
      location_name: shootForm.location_name,
      tags: shootForm.tags ? shootForm.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      cover_image: shootForm.cover_image || (shootImages[0]?.src || null),
      images: shootImages,
      published: shootForm.published,
      updated_at: new Date().toISOString(),
    }

    if (editingShoot) {
      const { error } = await supabase
        .from('shoots')
        .update(shootData)
        .eq('id', editingShoot.id)

      if (error) {
        showToast('Error updating shoot: ' + error.message, 'error')
      } else {
        showToast('Shoot updated', 'success')
        fetchShoots()
      }
    } else {
      const { error } = await supabase
        .from('shoots')
        .insert(shootData)
        .select()
        .single()

      if (error) {
        showToast('Error creating shoot: ' + error.message, 'error')
      } else {
        showToast('Shoot created', 'success')
        fetchShoots()
      }
    }

    setSaving(false)
    setShowShootModal(false)
  }

  const deleteShoot = async () => {
    if (!editingShoot) return
    if (!confirm(`Delete "${editingShoot.title}"?`)) return

    const { error } = await supabase
      .from('shoots')
      .delete()
      .eq('id', editingShoot.id)

    if (error) {
      showToast('Error deleting shoot', 'error')
    } else {
      showToast('Shoot deleted', 'success')
      setShowShootModal(false)
      setSelectedShoot(null)
      fetchShoots()
    }
  }

  const addShootImage = () => {
    setShootImages([...shootImages, { src: '', alt: '', caption: '' }])
  }

  const updateShootImage = (index: number, field: 'src' | 'alt' | 'caption', value: string) => {
    const updated = [...shootImages]
    updated[index] = { ...updated[index], [field]: value }
    setShootImages(updated)
  }

  const removeShootImage = (index: number) => {
    setShootImages(shootImages.filter((_, i) => i !== index))
  }

  // ==================== BUILDING MANAGEMENT ====================

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
      setBuildingForm(emptyBuildingForm)
    }
    setShowBuildingModal(true)
  }

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
      }
    } else {
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

  const deleteBuilding = async () => {
    if (!editingBuilding) return
    if (!confirm(`Delete "${editingBuilding.name}"? This will also delete all photos.`)) return

    for (const photo of photos) {
      const filePath = photo.url.split('/building-photos/')[1]
      if (filePath) {
        await supabase.storage.from('building-photos').remove([filePath])
      }
    }

    await supabase.from('photos').delete().eq('building_id', editingBuilding.id)
    await supabase.from('buildings').delete().eq('id', editingBuilding.id)

    showToast('Building deleted', 'success')
    setShowBuildingModal(false)
    setSelectedBuilding(null)
    fetchBuildings()
  }

  // Photo handling
  const handleFileUpload = async (files: FileList, photoType: 'original' | 'historical' | 'portraiture' = 'original') => {
    if (!selectedBuilding || !files.length) return
    setUploading(true)
    
    for (const file of Array.from(files)) {
      try {
        const fileName = `${selectedBuilding.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('building-photos')
          .upload(fileName, file, { contentType: file.type })

        if (uploadError) continue

        const { data: { publicUrl } } = supabase.storage.from('building-photos').getPublicUrl(fileName)

        await supabase.from('photos').insert({
          building_id: selectedBuilding.id,
          url: publicUrl,
          photographer: 'Andrew Petrov',
          sort_order: photos.length,
          is_primary: photos.length === 0,
          photo_type: photoType,
        })
      } catch (err) {
        console.error('Upload error:', err)
      }
    }

    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('building_id', selectedBuilding.id)
      .order('sort_order')
    if (data) setPhotos(data)
    
    setUploading(false)
    showToast('Photos uploaded', 'success')
  }

  const deletePhoto = async (photo: Photo) => {
    if (!confirm('Delete this photo?')) return
    const filePath = photo.url.split('/building-photos/')[1]
    if (filePath) {
      await supabase.storage.from('building-photos').remove([filePath])
    }
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos(photos.filter(p => p.id !== photo.id))
    showToast('Photo deleted', 'success')
  }

  const setPrimaryPhoto = async (photo: Photo) => {
    await supabase.from('photos').update({ is_primary: false }).eq('building_id', selectedBuilding!.id)
    await supabase.from('photos').update({ is_primary: true }).eq('id', photo.id)
    setPhotos(photos.map(p => ({ ...p, is_primary: p.id === photo.id })))
    showToast('Primary photo updated', 'success')
  }

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
      <div className="bg-detroit-green text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display text-2xl">Admin Panel</h1>
              <p className="text-gray-300 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          
          {/* Main Tab Bar */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setMainTab('architecture')}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                mainTab === 'architecture'
                  ? 'bg-white text-detroit-green'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Architecture ({buildings.length})
            </button>
            <button
              onClick={() => setMainTab('shoots')}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                mainTab === 'shoots'
                  ? 'bg-white text-detroit-green'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Camera className="w-5 h-5" />
              Shoots ({shoots.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ==================== ARCHITECTURE TAB ==================== */}
        {mainTab === 'architecture' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Building List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex-1 mr-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={buildingSearchQuery}
                      onChange={(e) => setBuildingSearchQuery(e.target.value)}
                      placeholder="Search buildings..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => openBuildingModal()}
                  className="flex items-center gap-1 bg-detroit-gold text-detroit-green px-3 py-2 rounded-lg font-medium hover:bg-opacity-90 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
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
                    <div className="font-medium text-gray-900 line-clamp-1 flex items-center gap-1.5">
                      {building.featured && <Star className="w-3.5 h-3.5 text-detroit-gold fill-current flex-shrink-0" />}
                      {building.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {building.year_built}
                      {building.building_type && ` • ${building.building_type}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Building Editor */}
            <div className="lg:col-span-2">
              {selectedBuilding ? (
                <div className="space-y-4">
                  {/* Building Header */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={async () => {
                            const newFeatured = !selectedBuilding.featured
                            const { error } = await supabase
                              .from('buildings')
                              .update({ featured: newFeatured })
                              .eq('id', selectedBuilding.id)
                            
                            if (!error) {
                              const updatedBuilding = { ...selectedBuilding, featured: newFeatured }
                              setSelectedBuilding(updatedBuilding)
                              setBuildings(buildings.map(b => b.id === selectedBuilding.id ? updatedBuilding : b))
                              showToast(newFeatured ? 'Building featured!' : 'Building unfeatured', 'success')
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            selectedBuilding.featured 
                              ? 'bg-detroit-gold text-white' 
                              : 'bg-gray-100 text-gray-400 hover:bg-detroit-gold/20 hover:text-detroit-gold'
                          }`}
                          title={selectedBuilding.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <Star className={`w-5 h-5 ${selectedBuilding.featured ? 'fill-current' : ''}`} />
                        </button>
                        <div>
                          <h2 className="font-display text-2xl text-detroit-green mb-1">{selectedBuilding.name}</h2>
                          <div className="text-gray-600 text-sm space-y-0.5">
                            {selectedBuilding.architect && <div>Architect: {selectedBuilding.architect}</div>}
                            {selectedBuilding.year_built && <div>Year: {selectedBuilding.year_built}</div>}
                            {selectedBuilding.address && <div>Address: {selectedBuilding.address}</div>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openBuildingModal(selectedBuilding)}
                          className="flex items-center gap-2 bg-detroit-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={enrichFromWikipedia}
                          disabled={enriching}
                          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                          {enriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          Enrich from Wikipedia
                        </button>
                      </div>
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
                          <div
                            onClick={() => document.getElementById('file-input')?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-detroit-gold transition-colors mb-4"
                          >
                            <input
                              id="file-input"
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                              className="hidden"
                            />
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600 text-sm">{uploading ? 'Uploading...' : 'Drop photos here or click to upload'}</p>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            {photos.filter(p => !p.photo_type || p.photo_type === 'original').map((photo) => (
                              <div key={photo.id} className="relative aspect-square group">
                                <img src={photo.url} alt="" className="w-full h-full object-cover rounded-lg" />
                                {photo.is_primary && (
                                  <div className="absolute top-1 left-1 bg-detroit-gold text-white text-xs px-2 py-0.5 rounded">Primary</div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-lg">
                                  <button onClick={() => setPrimaryPhoto(photo)} className="p-1 bg-white rounded">
                                    <Star className="w-4 h-4 text-detroit-gold" />
                                  </button>
                                  <button onClick={() => deletePhoto(photo)} className="p-1 bg-white rounded">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Historical Photos */}
                          <div className="mt-6 pt-6 border-t">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Camera className="w-4 h-4 text-orange-500" />
                              Historical Photos
                            </h4>
                            <div
                              onClick={() => document.getElementById('historical-input')?.click()}
                              className="border-2 border-dashed border-orange-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 transition-colors"
                            >
                              <input
                                id="historical-input"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'historical')}
                                className="hidden"
                              />
                              <p className="text-gray-600 text-sm">Upload historical photos</p>
                            </div>
                          </div>

                          {/* Portraiture */}
                          <div className="mt-6 pt-6 border-t">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4 text-pink-500" />
                              Portraiture
                            </h4>
                            <div
                              onClick={() => document.getElementById('portraiture-input')?.click()}
                              className="border-2 border-dashed border-pink-300 rounded-xl p-4 text-center cursor-pointer hover:border-pink-500 transition-colors"
                            >
                              <input
                                id="portraiture-input"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'portraiture')}
                                className="hidden"
                              />
                              <p className="text-gray-600 text-sm">Upload portraiture photos</p>
                            </div>
                          </div>
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
                            <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm max-h-48 overflow-y-auto">
                              {selectedBuilding.aia_text || 'No AIA text available'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ferry/Hawkins Book Text</label>
                            <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm max-h-48 overflow-y-auto">
                              {selectedBuilding.ferry_text || 'No Ferry text available'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Photographer's Notes</label>
                            <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm max-h-48 overflow-y-auto">
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
                  <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="font-display text-xl text-gray-600">Select a Building</h3>
                  <p className="text-gray-400 mt-2">Choose a building to edit or add a new one</p>
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
        )}

        {/* ==================== SHOOTS TAB ==================== */}
        {mainTab === 'shoots' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shoots List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex-1 mr-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={shootSearchQuery}
                      onChange={(e) => setShootSearchQuery(e.target.value)}
                      placeholder="Search shoots..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => openShootModal()}
                  className="flex items-center gap-1 bg-detroit-gold text-detroit-green px-3 py-2 rounded-lg font-medium hover:bg-opacity-90 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="h-[600px] overflow-y-auto">
                {filteredShoots.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No shoots yet</p>
                    <button onClick={() => openShootModal()} className="mt-2 text-detroit-gold hover:underline">
                      Create your first shoot
                    </button>
                  </div>
                ) : (
                  filteredShoots.map(shoot => (
                    <button
                      key={shoot.id}
                      onClick={() => { setSelectedShoot(shoot); openShootModal(shoot) }}
                      className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                        selectedShoot?.id === shoot.id ? 'bg-detroit-gold/10 border-l-4 border-l-detroit-gold' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {shoot.cover_image ? (
                          <img src={shoot.cover_image} alt="" className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 line-clamp-1 flex items-center gap-2">
                            {shoot.title}
                            {!shoot.published && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Draft</span>}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {shoot.date && <span>{shoot.date}</span>}
                            {shoot.location_name && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {shoot.location_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Shoot Editor Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="font-display text-xl text-gray-600">Manage Shoots</h3>
                <p className="text-gray-400 mt-2 mb-6">Create and edit photography shoots linked to architecture locations</p>
                <button
                  onClick={() => openShootModal()}
                  className="bg-detroit-gold text-detroit-green px-6 py-2 rounded-lg font-medium hover:bg-opacity-90"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create New Shoot
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== WIKIPEDIA ENRICHMENT MODAL ==================== */}
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
                      <input
                        type="url"
                        value={manualWikiUrl}
                        onChange={(e) => setManualWikiUrl(e.target.value)}
                        placeholder="https://en.wikipedia.org/wiki/..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                      />
                      <div className="flex gap-2">
                        <button onClick={enrichFromManualUrl} disabled={!manualWikiUrl || enriching}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50">
                          {enriching ? 'Fetching...' : 'Fetch from URL'}
                        </button>
                        <button onClick={enrichFromWikipedia} className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                          Retry Search
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : enrichedData ? (
                <div className="space-y-6">
                  {enrichedData.isCorrectArticle ? (
                    <>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-purple-900">{enrichedData.wikipediaTitle}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                enrichedData.confidence === 'high' ? 'bg-green-100 text-green-800' :
                                enrichedData.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>{enrichedData.confidence} confidence</span>
                            </div>
                            <a href={enrichedData.wikipediaUrl || ''} target="_blank" rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-1">
                              View on Wikipedia <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {enrichedData.architect && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase">Architect</label>
                            <p className="font-medium">{enrichedData.architect}</p>
                          </div>
                        )}
                        {enrichedData.yearBuilt && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase">Year Built</label>
                            <p className="font-medium">{enrichedData.yearBuilt}</p>
                          </div>
                        )}
                        {enrichedData.architecturalStyle && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase">Style</label>
                            <p className="font-medium">{enrichedData.architecturalStyle}</p>
                          </div>
                        )}
                        {enrichedData.buildingType && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="text-xs text-gray-500 uppercase">Type</label>
                            <p className="font-medium">{enrichedData.buildingType}</p>
                          </div>
                        )}
                      </div>

                      {enrichedData.description && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <label className="text-xs text-gray-500 uppercase">Description</label>
                          <p className="text-sm text-gray-700 mt-1">{enrichedData.description}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">⚠️ GPT couldn't find a matching Wikipedia article.</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {enrichedData && enrichedData.isCorrectArticle && (
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowEnrichModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                  Cancel
                </button>
                <button onClick={applyEnrichedData} disabled={saving}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SHOOT MODAL ==================== */}
      {showShootModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-detroit-green text-white">
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Camera className="w-6 h-6" />
                {editingShoot ? 'Edit Shoot' : 'Create New Shoot'}
              </h2>
              <button onClick={() => setShowShootModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={shootForm.title}
                      onChange={(e) => setShootForm({ ...shootForm, title: e.target.value, slug: shootForm.slug || generateSlug(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                      placeholder="e.g., Executive Portraits at Bagley Mansion"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input type="text" value={shootForm.slug}
                      onChange={(e) => setShootForm({ ...shootForm, slug: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                      placeholder="executive-portraits-bagley" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="text" value={shootForm.date}
                      onChange={(e) => setShootForm({ ...shootForm, date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                      placeholder="December 2024" />
                  </div>

                  <div className="col-span-2">
                    <BuildingSelector value={shootForm.building_id}
                      onChange={(id, name) => setShootForm({ ...shootForm, building_id: id, location_name: name })}
                      buildings={buildings} />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={shootForm.description}
                      onChange={(e) => setShootForm({ ...shootForm, description: e.target.value })}
                      rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input type="text" value={shootForm.tags}
                      onChange={(e) => setShootForm({ ...shootForm, tags: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                      placeholder="headshots, corporate, executive" />
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="published" checked={shootForm.published}
                        onChange={(e) => setShootForm({ ...shootForm, published: e.target.checked })}
                        className="w-4 h-4" />
                      <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-900">Images ({shootImages.length})</h3>
                    <button type="button" onClick={addShootImage} className="text-sm text-detroit-gold hover:underline">+ Add Image</button>
                  </div>
                  
                  <div className="space-y-3">
                    {shootImages.map((img, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        {img.src && <img src={img.src} alt={img.alt} className="w-16 h-16 object-cover rounded" />}
                        <div className="flex-1 space-y-2">
                          <input type="text" value={img.src}
                            onChange={(e) => updateShootImage(idx, 'src', e.target.value)}
                            className="w-full px-3 py-1 border rounded text-sm" placeholder="Image URL" />
                          <div className="flex gap-2">
                            <input type="text" value={img.alt}
                              onChange={(e) => updateShootImage(idx, 'alt', e.target.value)}
                              className="flex-1 px-3 py-1 border rounded text-sm" placeholder="Alt text" />
                            <input type="text" value={img.caption || ''}
                              onChange={(e) => updateShootImage(idx, 'caption', e.target.value)}
                              className="flex-1 px-3 py-1 border rounded text-sm" placeholder="Caption" />
                          </div>
                        </div>
                        <button type="button" onClick={() => removeShootImage(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              {editingShoot && (
                <button onClick={deleteShoot} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 inline mr-2" />Delete Shoot
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button onClick={() => setShowShootModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                <button onClick={saveShoot} disabled={saving}
                  className="px-6 py-2 bg-detroit-green text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50">
                  {saving ? 'Saving...' : (editingShoot ? 'Update Shoot' : 'Create Shoot')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BUILDING MODAL ==================== */}
      {showBuildingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-display text-2xl">{editingBuilding ? 'Edit Building' : 'Add New Building'}</h2>
              <button onClick={() => setShowBuildingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building Name *</label>
                  <input type="text" value={buildingForm.name}
                    onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., Guardian Building" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Names (comma separated)</label>
                  <input type="text" value={buildingForm.alternate_names}
                    onChange={(e) => setBuildingForm({ ...buildingForm, alternate_names: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., Union Guardian Building, Union Trust Building" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={buildingForm.address}
                    onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., 500 Griswold St, Detroit, MI" />
                </div>

                <TagInput label="Architect" value={buildingForm.architect}
                  onChange={(value) => setBuildingForm({ ...buildingForm, architect: value })}
                  suggestions={existingArchitects} placeholder="e.g., Wirt Rowland" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                  <input type="text" value={buildingForm.year_built}
                    onChange={(e) => setBuildingForm({ ...buildingForm, year_built: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold"
                    placeholder="e.g., 1929" />
                </div>

                <TagInput label="Architectural Style" value={buildingForm.architectural_style}
                  onChange={(value) => setBuildingForm({ ...buildingForm, architectural_style: value })}
                  suggestions={existingStyles} placeholder="e.g., Art Deco" />

                <TagInput label="Building Type" value={buildingForm.building_type}
                  onChange={(value) => setBuildingForm({ ...buildingForm, building_type: value })}
                  suggestions={existingTypes} placeholder="e.g., office building" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={buildingForm.status}
                    onChange={(e) => setBuildingForm({ ...buildingForm, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold">
                    <option value="extant">Extant</option>
                    <option value="demolished">Demolished</option>
                    <option value="altered">Altered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AIA Number</label>
                  <input type="text" value={buildingForm.aia_number}
                    onChange={(e) => setBuildingForm({ ...buildingForm, aia_number: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ferry Number</label>
                  <input type="text" value={buildingForm.ferry_number}
                    onChange={(e) => setBuildingForm({ ...buildingForm, ferry_number: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">AIA Guide Text</label>
                  <textarea value={buildingForm.aia_text}
                    onChange={(e) => setBuildingForm({ ...buildingForm, aia_text: e.target.value })}
                    rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ferry/Hawkins Book Text</label>
                  <textarea value={buildingForm.ferry_text}
                    onChange={(e) => setBuildingForm({ ...buildingForm, ferry_text: e.target.value })}
                    rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photographer's Notes</label>
                  <textarea value={buildingForm.photographer_notes}
                    onChange={(e) => setBuildingForm({ ...buildingForm, photographer_notes: e.target.value })}
                    rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-detroit-gold resize-none"
                    placeholder="Your personal observations and notes..." />
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              {editingBuilding && (
                <button onClick={deleteBuilding} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 inline mr-2" />Delete Building
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button onClick={() => setShowBuildingModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                <button onClick={saveBuilding} disabled={saving}
                  className="px-6 py-2 bg-detroit-green text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50">
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
