
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type AmbassadorConsultants = Database['public']['Tables']['ambassador_consultants']['Row']
export type AmbassadorConsultantsInsert = Database['public']['Tables']['ambassador_consultants']['Insert']
export type AmbassadorConsultantsUpdate = Database['public']['Tables']['ambassador_consultants']['Update']

export class AmbassadorConsultantsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('ambassador_consultants')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('ambassador_consultants')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: AmbassadorConsultantsInsert) {
    const { data: result, error } = await supabase
      .from('ambassador_consultants')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: AmbassadorConsultantsUpdate) {
    const { data: result, error } = await supabase
      .from('ambassador_consultants')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: AmbassadorConsultantsInsert) {
    const { data: result, error } = await supabase
      .from('ambassador_consultants')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('ambassador_consultants')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


