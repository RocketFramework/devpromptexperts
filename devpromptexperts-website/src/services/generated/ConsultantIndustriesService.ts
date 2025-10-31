
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultantIndustries = Database['public']['Tables']['consultant_industries']['Row']
export type ConsultantIndustriesInsert = Database['public']['Tables']['consultant_industries']['Insert']
export type ConsultantIndustriesUpdate = Database['public']['Tables']['consultant_industries']['Update']

export class ConsultantIndustriesService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultant_industries')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultant_industries')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultantIndustriesInsert) {
    const { data: result, error } = await supabase
      .from('consultant_industries')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantIndustriesUpdate) {
    const { data: result, error } = await supabase
      .from('consultant_industries')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantIndustriesInsert) {
    const { data: result, error } = await supabase
      .from('consultant_industries')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultant_industries')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


