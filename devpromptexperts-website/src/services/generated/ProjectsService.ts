
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Projects = Database['public']['Tables']['projects']['Row']
export type ProjectsInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectsUpdate = Database['public']['Tables']['projects']['Update']

export class ProjectsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProjectsInsert) {
    const { data: result, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProjectsUpdate) {
    const { data: result, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProjectsInsert) {
    const { data: result, error } = await supabase
      .from('projects')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


