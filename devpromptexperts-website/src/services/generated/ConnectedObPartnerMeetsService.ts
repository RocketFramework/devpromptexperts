
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConnectedObPartnerMeets = Database['public']['Tables']['connected_ob_partner_meets']['Row']
export type ConnectedObPartnerMeetsInsert = Database['public']['Tables']['connected_ob_partner_meets']['Insert']
export type ConnectedObPartnerMeetsUpdate = Database['public']['Tables']['connected_ob_partner_meets']['Update']

export class ConnectedObPartnerMeetsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('connected_ob_partner_meets')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('connected_ob_partner_meets')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('connected_ob_partner_meets')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ConnectedObPartnerMeetsInsert) {
    const { data: result, error } = await supabase
      .from('connected_ob_partner_meets')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConnectedObPartnerMeetsUpdate) {
    const { data: result, error } = await supabase
      .from('connected_ob_partner_meets')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConnectedObPartnerMeetsInsert) {
    const { data: result, error } = await supabase
      .from('connected_ob_partner_meets')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('connected_ob_partner_meets')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


