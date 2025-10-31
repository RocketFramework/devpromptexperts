
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type CommissionPayouts = Database['public']['Tables']['commission_payouts']['Row']
export type CommissionPayoutsInsert = Database['public']['Tables']['commission_payouts']['Insert']
export type CommissionPayoutsUpdate = Database['public']['Tables']['commission_payouts']['Update']

export class CommissionPayoutsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('commission_payouts')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('commission_payouts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: CommissionPayoutsInsert) {
    const { data: result, error } = await supabase
      .from('commission_payouts')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: CommissionPayoutsUpdate) {
    const { data: result, error } = await supabase
      .from('commission_payouts')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: CommissionPayoutsInsert) {
    const { data: result, error } = await supabase
      .from('commission_payouts')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('commission_payouts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


