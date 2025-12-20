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
    // 1. Update the response status
    const { data: response, error: responseError } = await supabase
      .from('project_responses')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (responseError) throw responseError

    // 2. If accepted, also update the project request status
    if (status === 'accepted') {
      const { error: requestError } = await supabase
        .from('project_requests')
        .update({ status: 'accepted' })
        .eq('id', response.project_request_id)
      
      if (requestError) {
        console.error('Error updating project request status:', requestError)
        // We don't throw here to avoid failing the response update, 
        // but in a real app we might want a transaction.
      }
    }

    return response
  }

  static async recordView(id: string, currentStatus: string) {
    const updateData: any = { viewed_at: new Date().toISOString() };
    
    // Only update status to 'viewed' if it's currently 'submitted'
    if (currentStatus === 'submitted') {
      updateData.status = 'viewed';
    }

    const { data, error } = await supabase
      .from('project_responses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateFeedback(id: string, rating: number, feedback: string, status: string) {
    const { data, error } = await supabase
      .from('project_responses')
      .update({ 
        client_rating: rating,
        client_feedback: feedback,
        status: status,
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
