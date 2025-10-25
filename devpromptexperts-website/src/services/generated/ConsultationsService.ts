
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Consultations = Database['public']['Tables']['consultations']['Row']
export type ConsultationsInsert = Database['public']['Tables']['consultations']['Insert']
export type ConsultationsUpdate = Database['public']['Tables']['consultations']['Update']

export class ConsultationsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultationsInsert) {
    const { data: result, error } = await supabase
      .from('consultations')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultationsUpdate) {
    const { data: result, error } = await supabase
      .from('consultations')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultationsInsert) {
    const { data: result, error } = await supabase
      .from('consultations')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


