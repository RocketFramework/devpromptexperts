import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row']
export type ProjectMilestoneInsert = Database['public']['Tables']['project_milestones']['Insert']
export type ProjectMilestoneUpdate = Database['public']['Tables']['project_milestones']['Update']

export class ExtendedProjectMilestonesService {
  static async findByProjectId(project_id: string): Promise<ProjectMilestone[]> {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', project_id)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async create(milestone: ProjectMilestoneInsert): Promise<ProjectMilestone> {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert(milestone)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async update(id: string, updates: ProjectMilestoneUpdate): Promise<ProjectMilestone> {
    const { data, error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
