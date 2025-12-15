export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      shoots: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          slug: string
          title: string
          description: string | null
          date: string | null
          building_id: string | null  // Links to buildings table
          location_name: string | null
          tags: string[]
          cover_image: string | null
          images: { src: string; alt: string; caption?: string }[]
          published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          slug: string
          title: string
          description?: string | null
          date?: string | null
          building_id?: string | null
          location_name?: string | null
          tags?: string[]
          cover_image?: string | null
          images?: { src: string; alt: string; caption?: string }[]
          published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          slug?: string
          title?: string
          description?: string | null
          date?: string | null
          building_id?: string | null
          location_name?: string | null
          tags?: string[]
          cover_image?: string | null
          images?: { src: string; alt: string; caption?: string }[]
          published?: boolean
        }
      }
      buildings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          alternate_names: string[] | null
          address: string | null
          city: string
          lat: number | null
          lng: number | null
          architect: string | null
          year_built: number | null
          year_demolished: number | null
          architectural_style: string | null
          building_type: string | null
          aia_number: string | null
          aia_text: string | null
          ferry_number: string | null
          ferry_text: string | null
          photographer_notes: string | null
          wikipedia_entry: string | null
          status: 'extant' | 'demolished' | 'unknown'
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          alternate_names?: string[] | null
          address?: string | null
          city?: string
          lat?: number | null
          lng?: number | null
          architect?: string | null
          year_built?: number | null
          year_demolished?: number | null
          architectural_style?: string | null
          building_type?: string | null
          aia_number?: string | null
          aia_text?: string | null
          ferry_number?: string | null
          ferry_text?: string | null
          photographer_notes?: string | null
          wikipedia_entry?: string | null
          status?: 'extant' | 'demolished' | 'unknown'
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          alternate_names?: string[] | null
          address?: string | null
          city?: string
          lat?: number | null
          lng?: number | null
          architect?: string | null
          year_built?: number | null
          year_demolished?: number | null
          architectural_style?: string | null
          building_type?: string | null
          aia_number?: string | null
          aia_text?: string | null
          ferry_number?: string | null
          ferry_text?: string | null
          photographer_notes?: string | null
          wikipedia_entry?: string | null
          status?: 'extant' | 'demolished' | 'unknown'
          featured?: boolean
        }
      }
      photos: {
        Row: {
          id: string
          created_at: string
          building_id: string
          url: string
          caption: string | null
          photographer: string | null
          year_taken: number | null
          is_primary: boolean
          sort_order: number
          photo_type: 'original' | 'historical' | 'street_view' | 'portraiture'
        }
        Insert: {
          id?: string
          created_at?: string
          building_id: string
          url: string
          caption?: string | null
          photographer?: string | null
          year_taken?: number | null
          is_primary?: boolean
          sort_order?: number
          photo_type?: 'original' | 'historical' | 'street_view' | 'portraiture'
        }
        Update: {
          id?: string
          created_at?: string
          building_id?: string
          url?: string
          caption?: string | null
          photographer?: string | null
          year_taken?: number | null
          is_primary?: boolean
          sort_order?: number
          photo_type?: 'original' | 'historical' | 'street_view' | 'portraiture'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Building = Database['public']['Tables']['buildings']['Row']
export type Photo = Database['public']['Tables']['photos']['Row']
export type Shoot = Database['public']['Tables']['shoots']['Row']
export type BuildingInsert = Database['public']['Tables']['buildings']['Insert']
export type PhotoInsert = Database['public']['Tables']['photos']['Insert']
export type ShootInsert = Database['public']['Tables']['shoots']['Insert']

// BuildingListItem excludes wikipedia_entry for performance (it can be 8MB+)
export type BuildingListItem = Omit<Building, 'wikipedia_entry'> & { wikipedia_entry?: string | null }


