
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProposalInterviews = Database['public']['Tables']['proposal_interviews']['Row']
export type ProposalInterviewsInsert = Database['public']['Tables']['proposal_interviews']['Insert']
export type ProposalInterviewsUpdate = Database['public']['Tables']['proposal_interviews']['Update']

export class ProposalInterviewsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('proposal_interviews')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('proposal_interviews')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('proposal_interviews')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProposalInterviewsInsert) {
    const { data: result, error } = await supabase
      .from('proposal_interviews')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProposalInterviewsUpdate) {
    const { data: result, error } = await supabase
      .from('proposal_interviews')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProposalInterviewsInsert) {
    const { data: result, error } = await supabase
      .from('proposal_interviews')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('proposal_interviews')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


