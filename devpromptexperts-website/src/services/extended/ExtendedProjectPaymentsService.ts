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
}
