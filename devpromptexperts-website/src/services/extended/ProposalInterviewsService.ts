import { supabase } from '@/lib/supabase'

export interface CreateInterviewParams {
  project_response_id: string
  organizer_id: string
  attendee_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  meeting_url?: string
  meeting_platform?: string
  meeting_id?: string
  meeting_password?: string
}

export class ProposalInterviewsService {
  static async getInterviews(responseId: string) {
    const { data, error } = await supabase
      .from('proposal_interviews')
      .select(`
        *,
        organizer:organizer_id (
          full_name,
          profile_image_url
        ),
        attendee:attendee_id (
          full_name,
          profile_image_url
        )
      `)
      .eq('project_response_id', responseId)
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  }

  static async createInterview(params: CreateInterviewParams) {
    const { data, error } = await supabase
      .from('proposal_interviews')
      .insert(params)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('proposal_interviews')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
