import { supabase } from '@/lib/supabase'
import { ProjectResponseWithDetails } from '@/types/extended'

export class ExtendedProjectResponsesService {
  static async findByIdWithDetails(id: string): Promise<ProjectResponseWithDetails | null> {
    const { data, error } = await supabase
      .from('project_responses')
      .select(`
        *,
        consultants (
          *,
          users (
            *
          )
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as ProjectResponseWithDetails
  }

  static async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('project_responses')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateFeedback(id: string, rating: number, feedback: string) {
    const { data, error } = await supabase
      .from('project_responses')
      .update({ 
        client_rating: rating,
        client_feedback: feedback 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async scheduleInterview(id: string, date: string, message: string) {
    // In a real app, this would likely create a record in an 'interviews' table
    // and send an email/notification. For now, we'll update the status
    // and potentially store the interview details in a metadata field or similar if available,
    // but based on current requirements, updating status is the primary action.
    
    // We update the status to 'interview_requested'
    const { data, error } = await supabase
      .from('project_responses')
      .update({ 
        status: 'interview_requested'
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
