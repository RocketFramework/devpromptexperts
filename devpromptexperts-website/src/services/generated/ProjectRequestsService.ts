
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectRequests = Database['public']['Tables']['project_requests']['Row']
export type ProjectRequestsInsert = Database['public']['Tables']['project_requests']['Insert']
export type ProjectRequestsUpdate = Database['public']['Tables']['project_requests']['Update']

export class ProjectRequestsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProjectRequestsInsert) {
    const { data: result, error } = await supabase
      .from('project_requests')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProjectRequestsUpdate) {
    const { data: result, error } = await supabase
      .from('project_requests')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProjectRequestsInsert) {
    const { data: result, error } = await supabase
      .from('project_requests')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('project_requests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


