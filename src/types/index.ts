export interface School {
  id: string
  name: string
  address: string | null
  contact_email: string | null
  created_at: string
}

export type OrganizationType = 'school' | 'college' | 'club' | 'sports_academy' | 'arts_studio' | 'camp' | 'independent' | 'other'

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  logo_url: string | null
  contact_email: string
  address: string | null
  verified: boolean
  created_at: string
}

export interface Parent {
  id: string
  auth_user_id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

export interface OrganizationAdmin {
  id: string
  auth_user_id: string
  organization_id: string
  name: string
  role: string
  created_at: string
}

export interface SuperAdmin {
  id: string
  auth_user_id: string
  name: string
  created_at: string
}

export interface Child {
  id: string
  parent_id: string
  name: string
  age: number
  school_id: string | null
  emergency_contact: string | null
  created_at: string
  school?: School | null
}

export type AgeBracket = 'early_kids' | 'kids' | 'teens' | 'young_adults'

export interface Event {
  id: string
  organizer_id: string
  title: string
  description: string | null
  category: string
  age_bracket: AgeBracket
  event_date: string
  event_time: string
  location: string
  price: number
  seats_total: number
  seats_available: number
  image_url: string | null
  status: 'pending_review' | 'approved' | 'rejected'
  rejection_reason?: string | null
  is_sponsored?: boolean
  sponsor_tier?: 'featured' | 'premium' | 'standard'
  created_at: string
  organizer?: Organization | null
  school?: School | null
}

export interface Booking {
  id: string
  event_id: string
  child_id: string
  parent_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  booking_reference: string
  created_at: string
  event?: Event
  child?: Child
  parent?: Parent
}

export interface Review {
  id: string
  event_id: string
  parent_id: string
  rating: number
  comment: string
  created_at: string
  parent?: { name: string } | null
  event?: { title: string } | null
}
