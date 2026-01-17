import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectCommunication = Database['public']['Tables']['project_communications']['Row']
export type ProjectCommunicationInsert = Database['public']['Tables']['project_communications']['Insert']

export class ExtendedProjectCommunicationsService {
  static async findByProjectId(project_id: string): Promise<ProjectCommunication[]> {
    const { data, error } = await supabase
      .from('project_communications')
      .select(`
        *,
        sender_id,
        sender_type
      `)
      .eq('project_id', project_id)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async send(message: ProjectCommunicationInsert): Promise<ProjectCommunication> {
    const { data, error } = await supabase
      .from('project_communications')
      .insert(message)
      .select()
      .single()

    if (error) throw error
    return data
  }

  
  static async markAsRead(id: string, read_at: string): Promise<void> {
    const { error } = await supabase
      .from('project_communications')
      .update({ is_read: true, read_at })
      .eq('id', id)

    if (error) throw error
  }
}
