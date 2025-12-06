import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectRequests = Database['public']['Tables']['project_requests']['Row']
export type ProjectRequestsInsert = Database['public']['Tables']['project_requests']['Insert']
export type ProjectRequestsUpdate = Database['public']['Tables']['project_requests']['Update']

export class ExtendedProjectRequestsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findByClientId(client_id: string) {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .eq('client_id', client_id)

    
    if (error) throw error
    return data
  }
}