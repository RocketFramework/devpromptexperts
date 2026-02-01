import { supabase } from '@/lib/supabase'
import { uploadMilestoneProofAction } from '@/app/actions/milestone-actions'
import { Database } from '@/types/database'
import { ProjectMilestoneStatus, ProjectStatus } from '@/types/enums'

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

  static async syncProjectStatus(project_id: string) {
    // 1. Get all milestones for the project
    const { data: milestones, error } = await supabase
        .from('project_milestones')
        .select('status')
        .eq('project_id', project_id);

    if (error) {
        console.error("Error syncing project status:", error);
        return;
    }

    // 2. Determine correct project status
    // If there ARE milestones, and ALL are COMPLETED or PAYMENT_CONFIRMED -> Completed
    // Otherwise -> Active
    let newStatus = ProjectStatus.ACTIVE;
    
    if (milestones && milestones.length > 0) {
        const allComplete = milestones.every(m => 
            m.status === ProjectMilestoneStatus.COMPLETED || 
            m.status === ProjectMilestoneStatus.PAYMENT_CONFIRMED
        );
        
        if (allComplete) {
            newStatus = ProjectStatus.COMPLETED;
        }
    }

    // 3. Update Project
    await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project_id);
  }

  static async startMilestone(id: string, bypassDependencies: boolean = false): Promise<ProjectMilestone> {
    // 1. Get milestone details to check project_id
    const { data: milestone, error: mError } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', id)
      .single()

    if (mError) throw mError

    // 2. Enterprise Logic: Date-Based Dependency Gate
    // This allows "Parallel Execution" for milestones on the same timeline (same date),
    // but enforces "Sequential Execution" for phases (different dates).
    if (!bypassDependencies) {
        const { data: allMilestones, error: listError } = await supabase
            .from('project_milestones')
            .select('*')
            .eq('project_id', milestone.project_id)
            .lt('due_date', milestone.due_date) // Only look at *earlier* milestones

        if (listError) throw listError

        // Check if ANY earlier milestone is incomplete
        const incompletePrevious = allMilestones.filter(m => 
            m.status !== ProjectMilestoneStatus.COMPLETED && 
            m.status !== ProjectMilestoneStatus.PAYMENT_CONFIRMED
        )

        if (incompletePrevious.length > 0) {
            // Find the earliest incomplete one for a helpful error message
            const earliest = incompletePrevious.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0]
            throw new Error(`Cannot start this phase yet. Previous milestone "${earliest.milestone}" (Due: ${new Date(earliest.due_date).toLocaleDateString()}) is still incomplete.`)
        }
    }

    const updated = await this.update(id, {
        status: ProjectMilestoneStatus.IN_PROGRESS
    });
    
    // Sync project status after start (likely keeps it Active)
    await this.syncProjectStatus(milestone.project_id);
    return updated;
  }

  static async confirmPayment(id: string): Promise<ProjectMilestone> {
    // 1. Process Financials (Atomic Payment + Commission)
    // We import dynamically to avoid circular dependencies if any, though ideally structure should prevent this.
    const { PaymentBusinessService } = await import('@/services/business/PaymentBusinessService')
    
    // This calls the RPC. If it fails (e.g. network, DB constraint), it throws.
    // We do NOT catch here, letting it propagate so the UI knows it failed.
    await PaymentBusinessService.processPaymentConfirmation(id)

    // 2. Update Milestone Status to reflect completion of this phase
    const updated = await this.update(id, {
        status: ProjectMilestoneStatus.PAYMENT_CONFIRMED
    });

    // Sync project status (checking if this was the last one)
    await this.syncProjectStatus(updated.project_id);
    return updated;
  }

  static async create(milestone: ProjectMilestoneInsert): Promise<ProjectMilestone> {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert(milestone)
      .select()
      .single()

    if (error) throw error
    
    // Sync project status (adding a new milestone usually makes it Active)
    await this.syncProjectStatus(milestone.project_id);
    
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
    
    // Sync project status
    // Note: We do this after update to reflect the new state
    await this.syncProjectStatus(data.project_id);
    
    return data
  }

  static async delete(id: string): Promise<void> {
    // Get project_id before deleting
    const { data: milestone } = await supabase
        .from('project_milestones')
        .select('project_id')
        .eq('id', id)
        .single();

    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    if (milestone) {
        await this.syncProjectStatus(milestone.project_id);
    }
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
