import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type AppIdea = {
  id: string
  name: string
  description: string
  killer_feature: string
  secondary_features: string[]
  status: 'idea' | 'researching' | 'validated' | 'building' | 'rejected'
  validation_score: number
  market_size: string
  trend_score: number
  ease_score: number
  monetization_score: number
  suggested_pricing: string
  competitor_count: number
  competitors: Competitor[]
  app_store_category: string
  notes: string
  collab: string | null
  created_at: string
  updated_at: string
}

export type Competitor = {
  name: string
  rating: number
  downloads: string
  pricing: string
  revenue_estimate: string
}
