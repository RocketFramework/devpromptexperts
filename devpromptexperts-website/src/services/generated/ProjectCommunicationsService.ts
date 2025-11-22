
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectCommunications = Database['public']['Tables']['project_communications']['Row']
export type ProjectCommunicationsInsert = Database['public']['Tables']['project_communications']['Insert']
export type ProjectCommunicationsUpdate = Database['public']['Tables']['project_communications']['Update']

export class ProjectCommunicationsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('project_communications')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('project_communications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('project_communications')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProjectCommunicationsInsert) {
    const { data: result, error } = await supabase
      .from('project_communications')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProjectCommunicationsUpdate) {
    const { data: result, error } = await supabase
      .from('project_communications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProjectCommunicationsInsert) {
    const { data: result, error } = await supabase
      .from('project_communications')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('project_communications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


