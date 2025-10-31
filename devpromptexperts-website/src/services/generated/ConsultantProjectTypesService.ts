
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultantProjectTypes = Database['public']['Tables']['consultant_project_types']['Row']
export type ConsultantProjectTypesInsert = Database['public']['Tables']['consultant_project_types']['Insert']
export type ConsultantProjectTypesUpdate = Database['public']['Tables']['consultant_project_types']['Update']

export class ConsultantProjectTypesService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultant_project_types')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultant_project_types')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultantProjectTypesInsert) {
    const { data: result, error } = await supabase
      .from('consultant_project_types')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantProjectTypesUpdate) {
    const { data: result, error } = await supabase
      .from('consultant_project_types')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantProjectTypesInsert) {
    const { data: result, error } = await supabase
      .from('consultant_project_types')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultant_project_types')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


