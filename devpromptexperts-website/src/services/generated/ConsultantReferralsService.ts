
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultantReferrals = Database['public']['Tables']['consultant_referrals']['Row']
export type ConsultantReferralsInsert = Database['public']['Tables']['consultant_referrals']['Insert']
export type ConsultantReferralsUpdate = Database['public']['Tables']['consultant_referrals']['Update']

export class ConsultantReferralsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultant_referrals')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultant_referrals')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultantReferralsInsert) {
    const { data: result, error } = await supabase
      .from('consultant_referrals')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantReferralsUpdate) {
    const { data: result, error } = await supabase
      .from('consultant_referrals')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantReferralsInsert) {
    const { data: result, error } = await supabase
      .from('consultant_referrals')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultant_referrals')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


