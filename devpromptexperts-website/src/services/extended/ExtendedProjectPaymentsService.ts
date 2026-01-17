import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectPayment = Database['public']['Tables']['project_payments']['Row']

export class ExtendedProjectPaymentsService {
  static async findByProjectId(project_id: string): Promise<ProjectPayment[]> {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async updatePaymentProof(milestoneId: string, transactionId: string, notes: string): Promise<void> {
    // 1. Find the payment record first
    const { data: payments, error: fError } = await supabase
      .from('project_payments')
      .select('id')
      .eq('project_milestone_id', milestoneId)
      .limit(1)
    
    if (fError) throw fError

    if (payments && payments.length > 0) {
      // Update existing
      const { error: uError } = await supabase
        .from('project_payments')
        .update({
          transaction_id: transactionId,
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', payments[0].id)
      
      if (uError) throw uError
    } else {
      // 2. Create if missing
      // Fetch milestone details to get project info
      const { data: milestone, error: mError } = await supabase
        .from('project_milestones')
        .select('*, projects(consultant_id, contract_value)')
        .eq('id', milestoneId)
        .single<Database['public']['Tables']['project_milestones']['Row'] & { 
          projects: { consultant_id: string, contract_value: number } 
        }>();
      
      if (mError || !milestone) throw new Error('Milestone or project not found');
      const project = milestone.projects;
      const amount = (project.contract_value * milestone.payment_percentage) / 100;

      const { error: iError } = await supabase
        .from('project_payments')
        .insert({
          project_id: milestone.project_id,
          consultant_id: project.consultant_id,
          project_milestone_id: milestoneId,
          amount: amount,
          payment_type: 'milestone',
          status: 'pending',
          transaction_id: transactionId,
          notes: notes,
          created_at: new Date().toISOString()
        });
      
      if (iError) throw iError;
    }
  }
}
