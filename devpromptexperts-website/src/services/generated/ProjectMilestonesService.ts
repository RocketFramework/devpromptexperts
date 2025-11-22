
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectMilestones = Database['public']['Tables']['project_milestones']['Row']
export type ProjectMilestonesInsert = Database['public']['Tables']['project_milestones']['Insert']
export type ProjectMilestonesUpdate = Database['public']['Tables']['project_milestones']['Update']

export class ProjectMilestonesService {
  static async findAll() {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProjectMilestonesInsert) {
    const { data: result, error } = await supabase
      .from('project_milestones')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProjectMilestonesUpdate) {
    const { data: result, error } = await supabase
      .from('project_milestones')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProjectMilestonesInsert) {
    const { data: result, error } = await supabase
      .from('project_milestones')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


