
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultantApplications = Database['public']['Tables']['consultant_applications']['Row']
export type ConsultantApplicationsInsert = Database['public']['Tables']['consultant_applications']['Insert']
export type ConsultantApplicationsUpdate = Database['public']['Tables']['consultant_applications']['Update']

export class ConsultantApplicationsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultant_applications')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultant_applications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultantApplicationsInsert) {
    const { data: result, error } = await supabase
      .from('consultant_applications')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantApplicationsUpdate) {
    const { data: result, error } = await supabase
      .from('consultant_applications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantApplicationsInsert) {
    const { data: result, error } = await supabase
      .from('consultant_applications')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultant_applications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


