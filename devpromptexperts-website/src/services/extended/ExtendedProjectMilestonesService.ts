import { supabaseBrowser } from '@/lib/client-browser'
import { supabase } from '@/lib/supabase'
import { uploadMilestoneProofAction } from '@/app/actions/milestone-actions'
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

  static async startMilestone(id: string): Promise<ProjectMilestone> {
    // 1. Get milestone details to check project_id
    const { data: milestone, error: mError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', id)
      .single()

    if (mError) throw mError

    // 2. Check for any incomplete previous milestones
    const { data: previousMilestones, error: pError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', milestone.project_id)
      .lt('due_date', milestone.due_date)
      .neq('status', ProjectMilestoneStatus.PAYMENT_CONFIRMED)
      .neq('status', ProjectMilestoneStatus.COMPLETED) // Allow completed if payment not confirmed yet? Requirement says "completed milestone... payment initiated... confirm payment". 
      // Actually requirement says: "Client accept it which allow the consultant to start the next milestone."
      // So previous milestone must be accepted (COMPLETED) to start next.
      // Wait, "Consultant - for any completed milestone the status will be "payment initiated" so that consultant has the ability to confirm the payment received button."
      // And "client can accept it which allow the consultant to start the next milestone."
      // This implies: Client Accept -> Status=COMPLETED (Payment Initiated) -> Consultant can Start Next.
      // Payment Confirmation is a separate step that might happen later or in parallel?
      // "It goes on like this until all the milestones are completed"
      // Let's enforce that previous milestones must be strictly COMPLETED or PAYMENT_CONFIRMED.
    
    if (pError) throw pError

    // Filter strictly for incomplete ones effectively.
    // Query above finds any that are NOT confirmed/completed? No, neq doesn't work well multiple times for "neither this nor that" usually needs OR logic or filtering in memory.
    // Let's fetch all previous ordered by date.
    const allPrevious = await this.findByProjectId(milestone.project_id);
    const myIndex = allPrevious.findIndex(m => m.id === id);
    
    if (myIndex > 0) {
        const previous = allPrevious[myIndex - 1];
        if (previous.status !== ProjectMilestoneStatus.COMPLETED && previous.status !== ProjectMilestoneStatus.PAYMENT_CONFIRMED) {
            throw new Error("Cannot start this milestone until the previous milestone is completed and approved.");
        }
    }

    return this.update(id, {
        status: ProjectMilestoneStatus.IN_PROGRESS
    })
  }

  static async confirmPayment(id: string): Promise<ProjectMilestone> {
      return this.update(id, {
          status: ProjectMilestoneStatus.PAYMENT_CONFIRMED
      })
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

  static async uploadProof(milestoneId: string, file: File): Promise<string> {
    // Enterprise Pattern: Delegate to Server Action to handle session and storage securely
    const formData = new FormData()
    formData.append('file', file)
    formData.append('milestoneId', milestoneId)

    const result = await uploadMilestoneProofAction(formData)

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload proof')
    }

    return result.data!.publicUrl
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
