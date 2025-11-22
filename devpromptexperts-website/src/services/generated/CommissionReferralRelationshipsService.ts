
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type CommissionReferralRelationships = Database['public']['Tables']['commission_referral_relationships']['Row']
export type CommissionReferralRelationshipsInsert = Database['public']['Tables']['commission_referral_relationships']['Insert']
export type CommissionReferralRelationshipsUpdate = Database['public']['Tables']['commission_referral_relationships']['Update']

export class CommissionReferralRelationshipsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('commission_referral_relationships')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('commission_referral_relationships')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('commission_referral_relationships')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: CommissionReferralRelationshipsInsert) {
    const { data: result, error } = await supabase
      .from('commission_referral_relationships')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: CommissionReferralRelationshipsUpdate) {
    const { data: result, error } = await supabase
      .from('commission_referral_relationships')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: CommissionReferralRelationshipsInsert) {
    const { data: result, error } = await supabase
      .from('commission_referral_relationships')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('commission_referral_relationships')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


