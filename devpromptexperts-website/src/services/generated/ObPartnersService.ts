
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ObPartners = Database['public']['Tables']['ob_partners']['Row']
export type ObPartnersInsert = Database['public']['Tables']['ob_partners']['Insert']
export type ObPartnersUpdate = Database['public']['Tables']['ob_partners']['Update']

export class ObPartnersService {
  static async findAll() {
    const { data, error } = await supabase
      .from('ob_partners')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('ob_partners')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ObPartnersInsert) {
    const { data: result, error } = await supabase
      .from('ob_partners')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ObPartnersUpdate) {
    const { data: result, error } = await supabase
      .from('ob_partners')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ObPartnersInsert) {
    const { data: result, error } = await supabase
      .from('ob_partners')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('ob_partners')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


