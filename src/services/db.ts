import { createClient } from '@/utils/supabase/client'
import { School, Event, Parent, Child, Booking, Organization, OrganizationAdmin, Review } from '@/types'

const isSupabaseConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Initial mock schools for children profiles (separate from event hosting)
const SEED_SCHOOLS: School[] = [
  {
    id: 'school-greenwood-elem',
    name: 'Greenwood Elementary School',
    address: '123 Pine St, Seattle, WA',
    contact_email: 'info@greenwood.edu',
    created_at: new Date().toISOString()
  },
  {
    id: 'school-riverside-acad',
    name: 'Riverside Academy',
    address: '456 River Rd, Portland, OR',
    contact_email: 'contact@riverside.edu',
    created_at: new Date().toISOString()
  }
]

// Mock organizations for event hosting
const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-youth-soccer',
    name: 'Metropolitan Youth Sports Club',
    type: 'club',
    logo_url: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320746?w=100&auto=format&fit=crop&q=60',
    contact_email: 'coach@metroyouth.org',
    address: '789 Stadium Way, Seattle, WA',
    verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'org-dance-academy',
    name: 'Rhythm Dance Academy',
    type: 'independent',
    logo_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=100&auto=format&fit=crop&q=60',
    contact_email: 'hello@rhythmdance.com',
    address: 'Studio 5, Creative Arts Center',
    verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'org-swimming-club',
    name: 'Blue Wave Aquatics',
    type: 'club',
    logo_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=100&auto=format&fit=crop&q=60',
    contact_email: 'info@bluewave.org',
    address: 'Community Pool, Northgate',
    verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'org-martial-arts',
    name: 'Dragon Dojo',
    type: 'independent',
    logo_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=100&auto=format&fit=crop&q=60',
    contact_email: 'sensei@dragondojo.com',
    address: 'Downtown Fitness Center',
    verified: true,
    created_at: new Date().toISOString()
  }
]

export const SEED_EVENTS: Event[] = [
  {
    id: 'evt-1',
    organizer_id: 'org-youth-soccer',
    title: 'Kids Soccer Camp',
    description: 'Friendly introductory soccer session covering dribbling, passing, and basic team play. All experience levels welcome.',
    category: 'Football',
    age_bracket: 'early_years',
    event_date: '2026-08-20',
    event_time: '09:00:00',
    location: 'Greenwood Playing Field',
    price: 15.00,
    seats_total: 20,
    seats_available: 18,
    image_url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString(),
    status: 'approved',
    is_sponsored: true,
    sponsor_tier: 'featured',
    listing_type: 'event',
    is_online: false
  },
  {
    id: 'evt-2',
    organizer_id: 'org-dance-academy',
    title: 'Beginner Hip Hop Dance Course',
    description: 'A high-energy dance class for kids to learn basic hip hop routines and improve coordination.',
    category: 'Dance',
    age_bracket: 'kids',
    event_date: '2026-08-22',
    event_time: '14:00:00',
    location: 'Rhythm Studio',
    price: 20.00,
    seats_total: 15,
    seats_available: 12,
    image_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString(),
    status: 'approved',
    listing_type: 'course',
    session_count: 8,
    session_frequency: 'Weekly',
    course_duration_weeks: 8,
    curriculum_outline: '1. Introduction & Basic Rhythm\n2. Isolation Exercises\n3. Footwork Drills\n4. Choreography Session A\n5. Choreography Session B\n6. Expression & Staging\n7. Dress Rehearsal\n8. Final Showcase for Parents'
  },
  {
    id: 'evt-3',
    organizer_id: 'org-swimming-club',
    title: 'Weekend Swim Lessons',
    description: 'Build water confidence and learn stroke techniques with certified instructors.',
    category: 'Swimming',
    age_bracket: 'early_years',
    event_date: '2026-08-25',
    event_time: '11:00:00',
    location: 'Northgate Pool',
    price: 25.00,
    seats_total: 12,
    seats_available: 5,
    image_url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString(),
    status: 'approved',
    is_sponsored: true,
    sponsor_tier: 'premium',
    listing_type: 'event',
    is_online: false
  },
  {
    id: 'evt-4',
    organizer_id: 'org-martial-arts',
    title: 'Kidspire Karate Championship',
    description: 'A friendly introductory tournament for kids to showcase their skills, focus, and form in a safe, guided environment. All participants receive badges!',
    category: 'Martial Arts',
    age_bracket: 'kids',
    event_date: '2026-08-26',
    event_time: '16:00:00',
    location: 'Dragon Dojo Main Hall',
    price: 18.00,
    seats_total: 25,
    seats_available: 20,
    image_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString(),
    status: 'approved',
    listing_type: 'competition',
    registration_deadline: '2026-08-24T23:59:00Z',
    prize_details: 'Trophy for 1st Place, Medals for top 3, certificates for all participants',
    eligibility_rules: 'Yellow belt and above, age 6-12 only'
  },
  {
    id: 'evt-5',
    organizer_id: 'org-youth-soccer',
    title: 'Introduction to STEM & Robotics Webinar',
    description: 'An interactive online webinar explaining basic coding, electronics, and robotics concepts for kids and parents. Zoom login details will be shared on booking.',
    category: 'STEM & Tech',
    age_bracket: 'kids',
    event_date: '2026-08-28',
    event_time: '10:00:00',
    location: 'Online (Zoom Meeting)',
    price: 0.00,
    seats_total: 100,
    seats_available: 95,
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    created_at: new Date().toISOString(),
    status: 'approved',
    listing_type: 'webinar',
    is_online: true,
    join_link: 'https://zoom.us/j/9876543210'
  }
]

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    event_id: 'evt-1',
    parent_id: 'parent-1',
    rating: 5,
    comment: 'Great coaches and active exercises! The kids soccer camp really helped build confidence and team playing skills.',
    created_at: new Date().toISOString(),
    parent: { name: 'Sarah Jenkins' },
    event: { title: 'Kids Soccer Camp' }
  },
  {
    id: 'rev-2',
    event_id: 'evt-2',
    parent_id: 'parent-2',
    rating: 5,
    comment: 'My daughter loved the hip hop routines. The instructor was so patient and full of energy!',
    created_at: new Date().toISOString(),
    parent: { name: 'David Miller' },
    event: { title: 'Beginner Hip Hop Dance' }
  },
  {
    id: 'rev-3',
    event_id: 'evt-4',
    parent_id: 'parent-3',
    rating: 4,
    comment: 'Good introduction to martial arts. The dojo is clean and the sensei is very professional.',
    created_at: new Date().toISOString(),
    parent: { name: 'Emily Watson' },
    event: { title: 'Intro to Karate' }
  }
]

// Local storage helpers
const getLocalStorageData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  const item = localStorage.getItem(key)
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue))
    return defaultValue
  }
  try {
    const parsed = JSON.parse(item)
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
      localStorage.setItem(key, JSON.stringify(defaultValue))
      return defaultValue
    }
    return parsed
  } catch {
    return defaultValue
  }
}

const setLocalStorageData = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// Service exports
export const dbService = {
  // --- SCHOOLS (For Children own schools filter only) ---
  async getSchools(): Promise<School[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('schools').select('*').order('name')
      if (!error && data) return data
    }
    return getLocalStorageData<School[]>('kids_event_schools', SEED_SCHOOLS)
  },

  // --- ORGANIZATIONS ---
  async getOrganizations(): Promise<Organization[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('organizations').select('*').order('name')
      if (!error && data) return data
    }
    return getLocalStorageData<Organization[]>('kids_event_organizations', SEED_ORGANIZATIONS)
  },

  async getOrganizationById(id: string): Promise<Organization | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single()
      if (!error && data) return data
    }
    const organizations = await this.getOrganizations()
    return organizations.find(o => o.id === id) || null
  },

  async updateOrganization(id: string, orgData: Partial<Organization>): Promise<Organization> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('organizations').update(orgData).eq('id', id).select().single()
      if (error) throw error
      return data
    }

    const organizations = getLocalStorageData<Organization[]>('kids_event_organizations', SEED_ORGANIZATIONS)
    const idx = organizations.findIndex(o => o.id === id)
    if (idx === -1) throw new Error('Organization not found')
    organizations[idx] = { ...organizations[idx], ...orgData }
    setLocalStorageData('kids_event_organizations', organizations)
    return organizations[idx]
  },

  async createOrganization(orgData: Omit<Organization, 'id' | 'created_at' | 'verified'>): Promise<Organization> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('organizations').insert([{
        ...orgData,
        verified: false
      }]).select().single()
      if (error) throw error
      return data
    }

    const organizations = getLocalStorageData<Organization[]>('kids_event_organizations', SEED_ORGANIZATIONS)
    const newOrg: Organization = {
      ...orgData,
      id: crypto.randomUUID(),
      verified: false,
      created_at: new Date().toISOString()
    }
    organizations.push(newOrg)
    setLocalStorageData('kids_event_organizations', organizations)
    return newOrg
  },

  async getEvents(filters?: {
    category?: string
    ageBracket?: string
    date?: string
    organizerId?: string
    status?: 'pending_review' | 'approved' | 'rejected' | 'all'
    keyword?: string
    listingType?: string
  }): Promise<Event[]> {
    const organizations = await this.getOrganizations()
    let events: Event[] = []

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      let query = supabase.from('events').select('*')
      
      if (filters?.category && filters.category !== 'All') {
        query = query.ilike('category', filters.category)
      }
      if (filters?.organizerId && filters.organizerId !== 'All') {
        query = query.eq('organizer_id', filters.organizerId)
      }
      if (filters?.date) {
        query = query.eq('event_date', filters.date)
      }
      if (filters?.ageBracket && filters.ageBracket !== 'All') {
        query = query.eq('age_bracket', filters.ageBracket)
      }
      if (filters?.status !== 'all') {
        query = query.eq('status', filters?.status || 'approved')
      }
      if (filters?.listingType && filters.listingType !== 'All') {
        query = query.eq('listing_type', filters.listingType.toLowerCase())
      }
      if (filters?.keyword) {
        const kw = `%${filters.keyword}%`
        query = query.or(`title.ilike.${kw},description.ilike.${kw},category.ilike.${kw},location.ilike.${kw}`)
      }
      
      try {
        const { data, error } = await query.order('event_date', { ascending: true })
        if (!error && data && data.length > 0) {
          events = data
        } else {
          events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
        }
      } catch {
        events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
      }
    } else {
      events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    }

    if (!events || events.length === 0) {
      events = SEED_EVENTS
    }

    // Apply memory filtering for fallback/local data
    if (filters?.category && filters.category !== 'All') {
      events = events.filter(e => e.category.toLowerCase() === filters.category!.toLowerCase() || e.category.toLowerCase().replace(/[^a-z0-9]/g, '') === filters.category!.toLowerCase().replace(/[^a-z0-9]/g, ''))
    }
    if (filters?.organizerId && filters.organizerId !== 'All') {
      events = events.filter(e => e.organizer_id === filters.organizerId)
    }
    if (filters?.date) {
      events = events.filter(e => e.event_date === filters.date)
    }
    if (filters?.ageBracket && filters.ageBracket !== 'All') {
      events = events.filter(e => e.age_bracket === filters.ageBracket)
    }
    if (filters?.status !== 'all') {
      const targetStatus = filters?.status || 'approved'
      events = events.filter(e => e.status === targetStatus)
    }
    if (filters?.listingType && filters.listingType !== 'All') {
      events = events.filter(e => (e.listing_type || 'event') === filters.listingType!.toLowerCase())
    }
    if (filters?.keyword) {
      const kw = filters.keyword.toLowerCase()
      events = events.filter(e =>
        e.title.toLowerCase().includes(kw) ||
        (e.description || '').toLowerCase().includes(kw) ||
        e.category.toLowerCase().includes(kw) ||
        (e.location || '').toLowerCase().includes(kw)
      )
    }

    if (!events || events.length === 0) {
      events = SEED_EVENTS.filter(e => e.status === 'approved')
    }

    // Helper to sanitize broken legacy image URLs (e.g. photo-1519315901367-f34f815b6719 which returns 404)
    const sanitizeImageUrl = (url?: string | null) => {
      if (!url || url.includes('photo-1519315901367-f34f815b6719') || url.includes('photo-1560090995-01c3288b99d4')) {
        return 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=60';
      }
      return url;
    };

    // Attach organizer info and sort sponsored events to top
    const mapped = events.map(event => ({
      ...event,
      image_url: sanitizeImageUrl(event.image_url),
      organizer: event.organizer || organizations.find(o => o.id === event.organizer_id) || SEED_ORGANIZATIONS[0]
    }))

    return mapped.sort((a, b) => {
      if (a.is_sponsored && !b.is_sponsored) return -1
      if (!a.is_sponsored && b.is_sponsored) return 1
      return 0
    })
  },

  async getEventById(id: string): Promise<Event | null> {
    const organizations = await this.getOrganizations()
    const sanitizeImageUrl = (url?: string | null) => {
      if (!url || url.includes('photo-1519315901367-f34f815b6719') || url.includes('photo-1560090995-01c3288b99d4')) {
        return 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=60';
      }
      return url;
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
      if (!error && data) {
        return {
          ...data,
          image_url: sanitizeImageUrl(data.image_url),
          organizer: organizations.find(o => o.id === data.organizer_id) || null
        }
      }
    }
    const events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    const event = events.find(e => e.id === id || e.id === `evt-${id}` || e.id.replace('evt-', '') === id) || null
    if (event) {
      return {
        ...event,
        image_url: sanitizeImageUrl(event.image_url),
        organizer: organizations.find(o => o.id === event.organizer_id) || null
      }
    }
    return event
  },

  async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'status' | 'rejection_reason'>): Promise<Event> {
    const newEventData = {
      ...eventData,
      status: 'pending_review' as const,
      rejection_reason: null
    }
    
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('events').insert([newEventData]).select().single()
      if (error) throw error
      return data
    }

    const events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    const newEvent: Event = {
      ...newEventData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    status: 'approved'
    }
    events.push(newEvent)
    setLocalStorageData('kids_event_events', events)
    return newEvent
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('events').update(eventData).eq('id', id).select().single()
      if (error) throw error
      return data
    }

    const events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    const idx = events.findIndex(e => e.id === id)
    if (idx === -1) throw new Error('Event not found')
    
    events[idx] = { ...events[idx], ...eventData }
    setLocalStorageData('kids_event_events', events)
    return events[idx]
  },

  async updateEventStatus(id: string, status: 'approved' | 'rejected' | 'pending_review', reason?: string): Promise<Event> {
    const updateData = { status, rejection_reason: reason || null }
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('events').update(updateData).eq('id', id).select().single()
      if (error) throw error
      return data
    }

    const events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    const idx = events.findIndex(e => e.id === id)
    if (idx === -1) throw new Error('Event not found')
    
    events[idx] = { ...events[idx], ...updateData }
    setLocalStorageData('kids_event_events', events)
    return events[idx]
  },

  async deleteEvent(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      return
    }

    const events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    const updated = events.filter(e => e.id !== id)
    setLocalStorageData('kids_event_events', updated)
  },

  // --- PARENTS ---
  async getParentProfile(authUserId: string): Promise<Parent | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('parents').select('*').eq('auth_user_id', authUserId).maybeSingle()
      if (!error && data) return data
    }
    const parents = getLocalStorageData<Parent[]>('kids_event_parents', [])
    return parents.find(p => p.auth_user_id === authUserId) || null
  },

  async createParentProfile(profile: Omit<Parent, 'id' | 'created_at'>): Promise<Parent> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('parents').insert([profile]).select().single()
      if (error) throw error
      return data
    }

    const parents = getLocalStorageData<Parent[]>('kids_event_parents', [])
    const newParent: Parent = {
      ...profile,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }
    parents.push(newParent)
    setLocalStorageData('kids_event_parents', parents)
    return newParent
  },

  async updateParentProfile(id: string, profileData: Partial<Parent>): Promise<Parent> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('parents').update(profileData).eq('id', id).select().single()
      if (error) throw error
      return data
    }
    const parents = getLocalStorageData<Parent[]>('kids_event_parents', [])
    const idx = parents.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Parent not found')
    parents[idx] = { ...parents[idx], ...profileData }
    setLocalStorageData('kids_event_parents', parents)
    return parents[idx]
  },

  async deleteParentProfile(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase.from('parents').delete().eq('id', id)
      if (error) throw error
      return
    }
    const parents = getLocalStorageData<Parent[]>('kids_event_parents', [])
    const updated = parents.filter(p => p.id !== id)
    setLocalStorageData('kids_event_parents', updated)
  },

  // --- SAVED EVENTS (WISHLIST) ---
  async getSavedEvents(parentId: string): Promise<any[]> {
    const organizations = await this.getOrganizations()
    let savedList: any[] = []

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('saved_events')
        .select('*, event:events(*)')
        .eq('parent_id', parentId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        savedList = data.map((item: any) => ({
          ...item,
          event: item.event ? {
            ...item.event,
            organizer: organizations.find(o => o.id === item.event.organizer_id) || null
          } : null
        }))
      }
    }

    if (!savedList || savedList.length === 0) {
      const allSaved = getLocalStorageData<any[]>('kids_event_saved_events', [])
      savedList = allSaved.filter(s => s.parent_id === parentId)
    }

    return savedList
  },

  async isEventSaved(parentId: string, eventId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('saved_events')
        .select('id')
        .eq('parent_id', parentId)
        .eq('event_id', eventId)
        .maybeSingle()

      if (!error && data) return true
    }

    const allSaved = getLocalStorageData<any[]>('kids_event_saved_events', [])
    return allSaved.some(s => s.parent_id === parentId && s.event_id === eventId)
  },

  async saveEvent(parentId: string, eventId: string): Promise<void> {
    const targetEvent = await this.getEventById(eventId)

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_events')
        .insert([{ parent_id: parentId, event_id: eventId }])

      if (error && error.code !== '23505') {
        console.error('Supabase save event error:', error)
      }
    }

    const allSaved = getLocalStorageData<any[]>('kids_event_saved_events', [])
    if (!allSaved.some(s => s.parent_id === parentId && s.event_id === eventId)) {
      allSaved.push({
        id: crypto.randomUUID(),
        parent_id: parentId,
        event_id: eventId,
        event: targetEvent,
        created_at: new Date().toISOString()
      })
      setLocalStorageData('kids_event_saved_events', allSaved)
    }
  },

  async unsaveEvent(parentId: string, eventId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_events')
        .delete()
        .eq('parent_id', parentId)
        .eq('event_id', eventId)

      if (error) console.error('Supabase unsave event error:', error)
    }

    const allSaved = getLocalStorageData<any[]>('kids_event_saved_events', [])
    const updated = allSaved.filter(s => !(s.parent_id === parentId && s.event_id === eventId))
    setLocalStorageData('kids_event_saved_events', updated)
  },

  // --- ORGANIZATION ADMINS ---
  async getOrganizationAdminProfile(authUserId: string): Promise<OrganizationAdmin | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('organization_admins').select('*').eq('auth_user_id', authUserId).maybeSingle()
      if (!error && data) return data
    }
    const admins = getLocalStorageData<OrganizationAdmin[]>('kids_event_organization_admins', [])
    return admins.find(a => a.auth_user_id === authUserId) || null
  },

  async createOrganizationAdminProfile(profile: Omit<OrganizationAdmin, 'id' | 'created_at'>): Promise<OrganizationAdmin> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('organization_admins').insert([profile]).select().single()
      if (error) throw error
      return data
    }

    const admins = getLocalStorageData<OrganizationAdmin[]>('kids_event_organization_admins', [])
    const newAdmin: OrganizationAdmin = {
      ...profile,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }
    admins.push(newAdmin)
    setLocalStorageData('kids_event_organization_admins', admins)
    return newAdmin
  },

  // --- CHILDREN ---
  async getChildren(parentId: string): Promise<Child[]> {
    const schools = await this.getSchools()
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('children').select('*').eq('parent_id', parentId)
      if (!error && data) {
        return data.map((c: any) => ({
          ...c,
          school: schools.find(s => s.id === c.school_id) || null
        }))
      }
    }
    const children = getLocalStorageData<Child[]>('kids_event_children', [])
    return children
      .filter(c => c.parent_id === parentId)
      .map(c => ({
        ...c,
        school: schools.find(s => s.id === c.school_id) || null
      }))
  },

  async createChild(childData: Omit<Child, 'id' | 'created_at'>): Promise<Child> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('children').insert([childData]).select().single()
      if (error) throw error
      return data
    }

    const children = getLocalStorageData<Child[]>('kids_event_children', [])
    const newChild: Child = {
      ...childData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }
    children.push(newChild)
    setLocalStorageData('kids_event_children', children)
    return newChild
  },

  // --- BOOKINGS ---
  async getBookingsByParent(parentId: string): Promise<Booking[]> {
    const events = await this.getEvents()
    const children = getLocalStorageData<Child[]>('kids_event_children', [])
    
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('bookings').select('*').eq('parent_id', parentId)
      if (!error && data) {
        return data.map((b: any) => ({
          ...b,
          event: events.find(e => e.id === b.event_id),
          child: children.find(c => c.id === b.child_id)
        })).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }
    }

    const bookings = getLocalStorageData<Booking[]>('kids_event_bookings', [])
    return bookings
      .filter(b => b.parent_id === parentId)
      .map(b => ({
        ...b,
        event: events.find(e => e.id === b.event_id),
        child: children.find(c => c.id === b.child_id)
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async getBookingsByOrganization(organizationId: string): Promise<Booking[]> {
    const events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    const orgEventIds = events.filter(e => e.organizer_id === organizationId).map(e => e.id)
    const parents = getLocalStorageData<Parent[]>('kids_event_parents', [])
    const children = getLocalStorageData<Child[]>('kids_event_children', [])

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('bookings').select('*')
      if (!error && data) {
        const filtered = data.filter((b: any) => orgEventIds.includes(b.event_id))
        const bookingList: Booking[] = []
        for (const b of filtered) {
          const { data: c } = await supabase.from('children').select('*').eq('id', b.child_id).single()
          const { data: p } = await supabase.from('parents').select('*').eq('id', b.parent_id).single()
          const { data: ev } = await supabase.from('events').select('*').eq('id', b.event_id).single()
          bookingList.push({
            ...b,
            event: ev || undefined,
            child: c || undefined,
            parent: p || undefined
          })
        }
        return bookingList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }
    }

    const bookings = getLocalStorageData<Booking[]>('kids_event_bookings', [])
    return bookings
      .filter(b => orgEventIds.includes(b.event_id))
      .map(b => ({
        ...b,
        event: events.find(e => e.id === b.event_id),
        child: children.find(c => c.id === b.child_id),
        parent: parents.find(p => p.id === b.parent_id)
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'status' | 'payment_status' | 'booking_reference'>): Promise<Booking> {
    const reference = 'EVT-' + Math.random().toString(36).substring(2, 9).toUpperCase()
    
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      // Check seat availability to prevent overbooking/race conditions
      const { data: event, error: eventErr } = await supabase
        .from('events')
        .select('seats_available')
        .eq('id', bookingData.event_id)
        .single()
      
      if (eventErr || !event) throw new Error('Event not found')
      if (event.seats_available <= 0) {
        throw new Error('Sorry, this event is sold out! Please join the waitlist.')
      }

      // Decrement seats_available
      await supabase
        .from('events')
        .update({ seats_available: Math.max(0, event.seats_available - 1) })
        .eq('id', bookingData.event_id)

      const { data, error } = await supabase.from('bookings').insert([{
        ...bookingData,
        status: 'confirmed',
        payment_status: 'paid',
        booking_reference: reference
      }]).select().single()
      if (error) throw error
      return data
    }

    const bookings = getLocalStorageData<Booking[]>('kids_event_bookings', [])
    const newBooking: Booking = {
      ...bookingData,
      id: crypto.randomUUID(),
      status: 'confirmed',
      payment_status: 'paid',
      booking_reference: reference,
      created_at: new Date().toISOString()
    }

    // Decrement seats available in local storage
    const events = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
    const evtIdx = events.findIndex(e => e.id === bookingData.event_id)
    if (evtIdx !== -1) {
      if (events[evtIdx].seats_available <= 0) {
        throw new Error('No seats available for this event')
      }
      events[evtIdx].seats_available -= 1
      setLocalStorageData('kids_event_events', events)
    }

    bookings.push(newBooking)
    setLocalStorageData('kids_event_bookings', bookings)
    return newBooking
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const events = await this.getEvents()
    const children = getLocalStorageData<Child[]>('kids_event_children', [])
    const parents = getLocalStorageData<Parent[]>('kids_event_parents', [])

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single()
      if (!error && data) {
        const { data: c } = await supabase.from('children').select('*').eq('id', data.child_id).single()
        const { data: p } = await supabase.from('parents').select('*').eq('id', data.parent_id).single()
        const { data: ev } = await supabase.from('events').select('*').eq('id', data.event_id).single()
        const organizations = await this.getOrganizations()
        return {
          ...data,
          event: ev ? {
            ...ev,
            organizer: organizations.find(o => o.id === ev.organizer_id) || null
          } : undefined,
          child: c || undefined,
          parent: p || undefined
        }
      }
    }

    const bookings = getLocalStorageData<Booking[]>('kids_event_bookings', [])
    const booking = bookings.find(b => b.id === id) || null
    if (booking) {
      return {
        ...booking,
        event: events.find(e => e.id === booking.event_id),
        child: children.find(c => c.id === booking.child_id),
        parent: parents.find(p => p.id === booking.parent_id)
      }
    }
    return null
  },

  // --- WAITLIST ---
  async getWaitlistEntries(eventId: string): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('waitlist').select('*, child:children(*), parent:parents(*)').eq('event_id', eventId)
      if (!error && data) return data
    }
    const waitlist = getLocalStorageData<any[]>('kids_event_waitlist', [])
    const children = getLocalStorageData<Child[]>('kids_event_children', [])
    const parents = getLocalStorageData<Parent[]>('kids_event_parents', [])
    return waitlist
      .filter(w => w.event_id === eventId)
      .map(w => ({
        ...w,
        child: children.find(c => c.id === w.child_id),
        parent: parents.find(p => p.id === w.parent_id)
      }))
  },

  async getWaitlistByParent(parentId: string): Promise<any[]> {
    return this.getWaitlistEntriesByParent(parentId)
  },

  async getWaitlistEntriesByParent(parentId: string): Promise<any[]> {
    const events = await this.getEvents()
    const children = getLocalStorageData<Child[]>('kids_event_children', [])

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('waitlist').select('*').eq('parent_id', parentId)
      if (!error && data) {
        return data.map((w: any) => ({
          ...w,
          event: events.find(e => e.id === w.event_id),
          child: children.find(c => c.id === w.child_id)
        })).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }
    }

    const waitlist = getLocalStorageData<any[]>('kids_event_waitlist', [])
    return waitlist
      .filter(w => w.parent_id === parentId)
      .map(w => ({
        ...w,
        event: events.find(e => e.id === w.event_id),
        child: children.find(c => c.id === w.child_id)
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async joinWaitlist(eventId: string, childId: string, parentId: string): Promise<any> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('waitlist').insert([{ event_id: eventId, child_id: childId, parent_id: parentId }]).select().single()
      if (error) throw error
      return data
    }
    const waitlist = getLocalStorageData<any[]>('kids_event_waitlist', [])
    const newEntry = {
      id: crypto.randomUUID(),
      event_id: eventId,
      child_id: childId,
      parent_id: parentId,
      created_at: new Date().toISOString()
    }
    waitlist.push(newEntry)
    setLocalStorageData('kids_event_waitlist', waitlist)
    return newEntry
  },

  async leaveWaitlist(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase.from('waitlist').delete().eq('id', id)
      if (error) throw error
      return
    }
    const waitlist = getLocalStorageData<any[]>('kids_event_waitlist', [])
    const updated = waitlist.filter(w => w.id !== id)
    setLocalStorageData('kids_event_waitlist', updated)
  },

  // --- NOTIFICATIONS ---
  async getNotifications(parentId: string): Promise<any[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('notifications').select('*').eq('parent_id', parentId).order('created_at', { ascending: false })
      if (!error && data) return data
    }
    const notifs = getLocalStorageData<any[]>('kids_event_notifications', [])
    return notifs
      .filter(n => n.parent_id === parentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async createNotification(notification: { parent_id: string, title: string, message: string, type?: string }): Promise<any> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('notifications').insert([{
        parent_id: notification.parent_id,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        read: false
      }]).select().single()
      if (error) throw error
      return data
    }
    const notifs = getLocalStorageData<any[]>('kids_event_notifications', [])
    const newEntry = {
      id: crypto.randomUUID(),
      parent_id: notification.parent_id,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      read: false,
      created_at: new Date().toISOString()
    }
    notifs.push(newEntry)
    setLocalStorageData('kids_event_notifications', notifs)
    return newEntry
  },

  async deleteNotification(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase.from('notifications').delete().eq('id', id)
      if (error) throw error
      return
    }
    const notifs = getLocalStorageData<any[]>('kids_event_notifications', [])
    const updated = notifs.filter(n => n.id !== id)
    setLocalStorageData('kids_event_notifications', updated)
  },

  async markNotificationRead(id: string, read: boolean = true): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase.from('notifications').update({ read }).eq('id', id)
      if (error) throw error
      return
    }
    const notifs = getLocalStorageData<any[]>('kids_event_notifications', [])
    const idx = notifs.findIndex(n => n.id === id)
    if (idx !== -1) {
      notifs[idx].read = read
      setLocalStorageData('kids_event_notifications', notifs)
    }
  },

  // --- BOOKING CANCELLATION & WAITLIST NOTIFY ---
  async cancelBooking(bookingId: string): Promise<void> {
    const events = await this.getEvents()
    const booking = await this.getBookingById(bookingId)
    if (!booking) throw new Error('Booking not found')

    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { error } = await supabase.from('bookings').update({
        status: 'cancelled',
        payment_status: 'refunded'
      }).eq('id', bookingId)
      if (error) throw error

      const { data: eventData } = await supabase.from('events').select('seats_available').eq('id', booking.event_id).single()
      if (eventData) {
        await supabase.from('events').update({ seats_available: eventData.seats_available + 1 }).eq('id', booking.event_id)
      }

      const { data: wl, error: wlError } = await supabase.from('waitlist').select('*').eq('event_id', booking.event_id).order('created_at', { ascending: true })
      if (!wlError && wl && wl.length > 0) {
        const nextInLine = wl[0]
        await supabase.from('notifications').insert([{
          parent_id: nextInLine.parent_id,
          title: 'Waitlist Slot Open! 🌟',
          message: `Good news! A seat has opened up for "${booking.event?.title || 'the event'}". You can now complete your booking.`,
          type: 'success',
          read: false
        }])
        await supabase.from('waitlist').delete().eq('id', nextInLine.id)
      }
      return
    }

    const bookings = getLocalStorageData<Booking[]>('kids_event_bookings', [])
    const idx = bookings.findIndex(b => b.id === bookingId)
    if (idx !== -1) {
      bookings[idx].status = 'cancelled'
      bookings[idx].payment_status = 'refunded'
      setLocalStorageData('kids_event_bookings', bookings)

      const localEvents = getLocalStorageData<Event[]>('kids_event_events', SEED_EVENTS)
      const evIdx = localEvents.findIndex(e => e.id === booking.event_id)
      if (evIdx !== -1) {
        localEvents[evIdx].seats_available += 1
        setLocalStorageData('kids_event_events', localEvents)
      }

      const waitlist = getLocalStorageData<any[]>('kids_event_waitlist', [])
      const eventWl = waitlist.filter(w => w.event_id === booking.event_id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      
      if (eventWl.length > 0) {
        const nextInLine = eventWl[0]
        const notifs = getLocalStorageData<any[]>('kids_event_notifications', [])
        notifs.push({
          id: crypto.randomUUID(),
          parent_id: nextInLine.parent_id,
          title: 'Waitlist Slot Open! 🌟',
          message: `Good news! A seat has opened up for "${booking.event?.title || 'the event'}". You can now complete your booking.`,
          type: 'success',
          read: false,
          created_at: new Date().toISOString()
        })
        setLocalStorageData('kids_event_notifications', notifs)

        const updatedWl = waitlist.filter(w => w.id !== nextInLine.id)
        setLocalStorageData('kids_event_waitlist', updatedWl)
      }
    }
  },

  async getReviews(): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('reviews').select(`
        id, event_id, parent_id, rating, comment, created_at,
        parent:parents(name),
        event:events(title)
      `)
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          event_id: d.event_id,
          parent_id: d.parent_id,
          rating: d.rating,
          comment: d.comment,
          created_at: d.created_at,
          parent: d.parent ? { name: d.parent.name } : null,
          event: d.event ? { title: d.event.title } : null
        })) as Review[]
      }
    }
    return getLocalStorageData<Review[]>('kids_event_reviews', SEED_REVIEWS)
  },

  async getReviewsByEvent(eventId: string): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('reviews').select(`
        id, event_id, parent_id, rating, comment, created_at,
        parent:parents(name)
      `).eq('event_id', eventId).order('created_at', { ascending: false })
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          event_id: d.event_id,
          parent_id: d.parent_id,
          rating: d.rating,
          comment: d.comment,
          created_at: d.created_at,
          parent: d.parent ? { name: d.parent.name } : null,
        })) as Review[]
      }
    }
    const all = getLocalStorageData<Review[]>('kids_event_reviews', SEED_REVIEWS)
    return all.filter(r => r.event_id === eventId)
  },

  async getReviewsByParent(parentId: string): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      const { data, error } = await supabase.from('reviews').select(`
        id, event_id, parent_id, rating, comment, created_at,
        event:events(title)
      `).eq('parent_id', parentId).order('created_at', { ascending: false })
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          event_id: d.event_id,
          parent_id: d.parent_id,
          rating: d.rating,
          comment: d.comment,
          created_at: d.created_at,
          event: d.event ? { title: d.event.title } : null,
        })) as Review[]
      }
    }
    const all = getLocalStorageData<Review[]>('kids_event_reviews', SEED_REVIEWS)
    return all.filter(r => r.parent_id === parentId)
  },

  async createReview(reviewData: { event_id: string; parent_id: string; rating: number; comment: string }): Promise<Review> {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      // Check for existing review (one per parent per event)
      const { data: existing } = await supabase.from('reviews')
        .select('id').eq('event_id', reviewData.event_id).eq('parent_id', reviewData.parent_id).maybeSingle()
      if (existing) throw new Error('You have already submitted a review for this event.')
      const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single()
      if (error) throw error
      return data as Review
    }
    const reviews = getLocalStorageData<Review[]>('kids_event_reviews', SEED_REVIEWS)
    const alreadyReviewed = reviews.find(r => r.event_id === reviewData.event_id && r.parent_id === reviewData.parent_id)
    if (alreadyReviewed) throw new Error('You have already submitted a review for this event.')
    const newReview: Review = {
      id: crypto.randomUUID(),
      ...reviewData,
      created_at: new Date().toISOString(),
    }
    reviews.push(newReview)
    setLocalStorageData('kids_event_reviews', reviews)
    return newReview
  },
}

