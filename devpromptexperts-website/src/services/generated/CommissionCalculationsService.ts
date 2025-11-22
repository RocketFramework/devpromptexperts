
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type CommissionCalculations = Database['public']['Tables']['commission_calculations']['Row']
export type CommissionCalculationsInsert = Database['public']['Tables']['commission_calculations']['Insert']
export type CommissionCalculationsUpdate = Database['public']['Tables']['commission_calculations']['Update']

export class CommissionCalculationsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('commission_calculations')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('commission_calculations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('commission_calculations')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: CommissionCalculationsInsert) {
    const { data: result, error } = await supabase
      .from('commission_calculations')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: CommissionCalculationsUpdate) {
    const { data: result, error } = await supabase
      .from('commission_calculations')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: CommissionCalculationsInsert) {
    const { data: result, error } = await supabase
      .from('commission_calculations')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('commission_calculations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


