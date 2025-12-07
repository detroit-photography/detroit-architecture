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
export type BuildingInsert = Database['public']['Tables']['buildings']['Insert']
export type PhotoInsert = Database['public']['Tables']['photos']['Insert']


