
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type SalesAmbassadors = Database['public']['Tables']['sales_ambassadors']['Row']
export type SalesAmbassadorsInsert = Database['public']['Tables']['sales_ambassadors']['Insert']
export type SalesAmbassadorsUpdate = Database['public']['Tables']['sales_ambassadors']['Update']

export class SalesAmbassadorsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('sales_ambassadors')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('sales_ambassadors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: SalesAmbassadorsInsert) {
    const { data: result, error } = await supabase
      .from('sales_ambassadors')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: SalesAmbassadorsUpdate) {
    const { data: result, error } = await supabase
      .from('sales_ambassadors')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: SalesAmbassadorsInsert) {
    const { data: result, error } = await supabase
      .from('sales_ambassadors')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('sales_ambassadors')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


