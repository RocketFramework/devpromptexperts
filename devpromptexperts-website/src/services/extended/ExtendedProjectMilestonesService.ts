import { supabase } from '@/lib/supabase'
import { uploadMilestoneProofAction } from '@/app/actions/milestone-actions'
import { Database } from '@/types/database'
import { ProjectMilestoneStatus } from '@/types/enums'

export type ProjectMilestone = Database['public']['Tables']['project_milestones']['Row'] & {
  project_payments?: {
    transaction_id: string | null;
    notes: string | null;
    status: string | null;
  }[]
}
export type ProjectMilestoneInsert = Database['public']['Tables']['project_milestones']['Insert']
export type ProjectMilestoneUpdate = Database['public']['Tables']['project_milestones']['Update']

export class ExtendedProjectMilestonesService {
  static async findByProjectId(project_id: string): Promise<ProjectMilestone[]> {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*, project_payments!project_payments_project_milestone_id_fkey(transaction_id, notes, status)')
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
    // 1. Process Financials (Atomic Payment + Commission)
    // We import dynamically to avoid circular dependencies if any, though ideally structure should prevent this.
    const { PaymentBusinessService } = await import('@/services/business/PaymentBusinessService')
    
    // This calls the RPC. If it fails (e.g. network, DB constraint), it throws.
    // We do NOT catch here, letting it propagate so the UI knows it failed.
    await PaymentBusinessService.processPaymentConfirmation(id)

    // 2. Update Milestone Status to reflect completion of this phase
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
