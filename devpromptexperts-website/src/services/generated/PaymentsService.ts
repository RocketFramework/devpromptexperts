
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Payments = Database['public']['Tables']['payments']['Row']
export type PaymentsInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentsUpdate = Database['public']['Tables']['payments']['Update']

export class PaymentsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: PaymentsInsert) {
    const { data: result, error } = await supabase
      .from('payments')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: PaymentsUpdate) {
    const { data: result, error } = await supabase
      .from('payments')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: PaymentsInsert) {
    const { data: result, error } = await supabase
      .from('payments')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


