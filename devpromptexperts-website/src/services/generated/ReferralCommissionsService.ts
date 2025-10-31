
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ReferralCommissions = Database['public']['Tables']['referral_commissions']['Row']
export type ReferralCommissionsInsert = Database['public']['Tables']['referral_commissions']['Insert']
export type ReferralCommissionsUpdate = Database['public']['Tables']['referral_commissions']['Update']

export class ReferralCommissionsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('referral_commissions')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('referral_commissions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ReferralCommissionsInsert) {
    const { data: result, error } = await supabase
      .from('referral_commissions')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ReferralCommissionsUpdate) {
    const { data: result, error } = await supabase
      .from('referral_commissions')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ReferralCommissionsInsert) {
    const { data: result, error } = await supabase
      .from('referral_commissions')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('referral_commissions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


