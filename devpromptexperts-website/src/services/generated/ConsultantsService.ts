
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


  // One-to-many relationship with consultants_with_ob_partners
  static async findWithConsultantsWithObPartners(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        consultants_with_ob_partners (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findAllWithConsultantsWithObPartners() {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        consultants_with_ob_partners (*)
      `)
    
    if (error) throw error
    return data
  }

  // Custom join methods for complex queries
  
  // Get consultant with consultants_with_ob_partners details 
  static async findFullProfile(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*),
        consultants_with_ob_partners (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  // Get all consultants with consultants_with_ob_partners details
  static async findAllWithConsultants_with_ob_partners() {
    const { data, error } = await supabase
      .from('consultants')
      .select(`
        *,
        users (*),
        consultants_with_ob_partners (*)
      `)
    
    if (error) throw error
    return data
  }
}

export type ConsultantsWithUsers = Consultants & {
  users: Database['public']['Tables']['users']['Row'][]
}
export type ConsultantsWithConsultantsWithObPartners = Consultants & {
  consultants_with_ob_partners: Database['public']['Tables']['consultants_with_ob_partners']['Row'][]
}

// Comprehensive consultant profile type
export type ConsultantsFullProfile = Consultants & {
  users?: Database['public']['Tables']['users']['Row'] | null
  consultants_with_ob_partners?: Database['public']['Tables']['consultants_with_ob_partners']['Row'] | null
}
