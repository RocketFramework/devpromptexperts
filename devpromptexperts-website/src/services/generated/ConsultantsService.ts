
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Consultants = Database['public']['Tables']['consultants']['Row']
export type ConsultantsInsert = Database['public']['Tables']['consultants']['Insert']
export type ConsultantsUpdate = Database['public']['Tables']['consultants']['Update']

export class ConsultantsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ConsultantsInsert) {
    const { data: result, error } = await supabase
      .from('consultants')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantsUpdate) {
    const { data: result, error } = await supabase
      .from('consultants')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantsInsert) {
    const { data: result, error } = await supabase
      .from('consultants')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultants')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  
  // One-to-many relationship with users
  static async findWithUsers(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithUsers(email: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async findAllWithUsers() {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*)
      `)
    
    if (error) throw error
    return data
  }


  // One-to-many relationship with connect_with_ob_partners
  static async findWithConnectWithObPartners(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        connect_with_ob_partners (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithConnectWithObPartners(email: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        connect_with_ob_partners (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async findAllWithConnectWithObPartners() {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        connect_with_ob_partners (*)
      `)
    
    if (error) throw error
    return data
  }


  // One-to-many relationship with connected_ob_partner_meets
  static async findWithConnectedObPartnerMeets(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        connected_ob_partner_meets (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithConnectedObPartnerMeets(email: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        connected_ob_partner_meets (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async findAllWithConnectedObPartnerMeets() {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        connected_ob_partner_meets (*)
      `)
    
    if (error) throw error
    return data
  }

  // Custom join methods for complex queries
  
  // Full consultant profile with users, partners, and partner meets
  static async findFullProfile(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*),
        connect_with_ob_partners (
          *,
          connected_ob_partner_meets (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async findByEmailFullProfile(email: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*),
        connect_with_ob_partners (
          *,
          connected_ob_partner_meets (*)
        )
      `)
      .eq('email', email)
      .single()

    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async findAllFullProfiles() {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*),
        connect_with_ob_partners (
          *,
          connected_ob_partner_meets (*)
        )
      `)

    if (error) throw error
    return data
  }
  
}

export type ConsultantsWithUsers = Consultants & {
  users: Database['public']['Tables']['users']['Row'][]
}
export type ConsultantsWithConnectWithObPartners = Consultants & {
  connect_with_ob_partners: Database['public']['Tables']['connect_with_ob_partners']['Row'][]
}
export type ConsultantsWithConnectedObPartnerMeets = Consultants & {
  connected_ob_partner_meets: Database['public']['Tables']['connected_ob_partner_meets']['Row'][]
}

// Comprehensive consultant profile type
export type ConsultantsFullProfile = Consultants & {
  users?: Database['public']['Tables']['users']['Row'] | null
  connect_with_ob_partners?: (Database['public']['Tables']['connect_with_ob_partners']['Row'] & {
    connected_ob_partner_meets: Database['public']['Tables']['connected_ob_partner_meets']['Row'][]
  })[]
}
