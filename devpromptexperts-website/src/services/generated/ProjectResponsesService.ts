
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectResponses = Database['public']['Tables']['project_responses']['Row']
export type ProjectResponsesInsert = Database['public']['Tables']['project_responses']['Insert']
export type ProjectResponsesUpdate = Database['public']['Tables']['project_responses']['Update']

export class ProjectResponsesService {
  static async findAll() {
    const { data, error } = await supabase
      .from('project_responses')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('project_responses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('project_responses')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProjectResponsesInsert) {
    const { data: result, error } = await supabase
      .from('project_responses')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProjectResponsesUpdate) {
    const { data: result, error } = await supabase
      .from('project_responses')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProjectResponsesInsert) {
    const { data: result, error } = await supabase
      .from('project_responses')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('project_responses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


