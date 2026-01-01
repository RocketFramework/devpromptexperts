import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import { ProjectMilestoneStatus } from '@/types/enums'

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

  static async submitMilestone(id: string, proof: string): Promise<ProjectMilestone> {
    return this.update(id, {
      status: ProjectMilestoneStatus.SUBMITTED,
      completion_proof: proof,
      completed_date: new Date().toISOString()
    })
  }

  static async approveMilestone(id: string): Promise<ProjectMilestone> {
    // 1. Get milestone details
    const { data: milestone, error: mError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', id)
      .single()
    
    if (mError) throw mError

    // 2. Get project details for budget/contract value using project_id from milestone
    const { data: project, error: pError } = await supabase
      .from('projects')
      .select('contract_value, consultant_id')
      .eq('id', milestone.project_id)
      .single()

    if (pError) console.error("Error fetching project for payment:", pError)

    // 3. Create payment record if project found
    if (project && project.contract_value) {
        const amount = (project.contract_value * milestone.payment_percentage) / 100
        
        const { error: payError } = await supabase
            .from('project_payments')
            .insert({
                project_id: milestone.project_id,
                consultant_id: project.consultant_id,
                amount: amount,
                payment_type: 'milestone',
                status: 'pending',
                notes: `Payment for milestone: ${milestone.milestone}`,
                created_at: new Date().toISOString()
            })
        
        if (payError) console.error("Error creating payment record:", payError)
    }

    return this.update(id, {
      status: ProjectMilestoneStatus.COMPLETED,
      client_approved: true,
      client_approved_at: new Date().toISOString()
    })
  }

  static async disputeMilestone(id: string): Promise<ProjectMilestone> {
    return this.update(id, {
      status: ProjectMilestoneStatus.DISPUTED,
      client_approved: false
    })
  }
}
