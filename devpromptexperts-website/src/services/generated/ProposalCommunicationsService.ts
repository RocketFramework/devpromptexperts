
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProposalCommunications = Database['public']['Tables']['proposal_communications']['Row']
export type ProposalCommunicationsInsert = Database['public']['Tables']['proposal_communications']['Insert']
export type ProposalCommunicationsUpdate = Database['public']['Tables']['proposal_communications']['Update']

export class ProposalCommunicationsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('proposal_communications')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('proposal_communications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('proposal_communications')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProposalCommunicationsInsert) {
    const { data: result, error } = await supabase
      .from('proposal_communications')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProposalCommunicationsUpdate) {
    const { data: result, error } = await supabase
      .from('proposal_communications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProposalCommunicationsInsert) {
    const { data: result, error } = await supabase
      .from('proposal_communications')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('proposal_communications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
  // Get communications with sender details
  static async findByResponseIdWithSender(responseId: string) {
    const { data, error } = await supabase
      .from('proposal_communications')
      .select(`
        *,
        sender:users!sender_id (*)
      `)
      .eq('project_response_id', responseId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async findAllWithSender() {
    const { data, error } = await supabase
      .from('proposal_communications')
      .select(`
        *,
        sender:users!sender_id (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
  
}



// Communication with sender details
export type ProposalCommunicationsWithSender = ProposalCommunications & {
  sender?: Database['public']['Tables']['users']['Row'] | null
}
