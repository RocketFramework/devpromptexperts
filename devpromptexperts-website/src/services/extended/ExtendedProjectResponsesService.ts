import { supabase } from '@/lib/supabase'
import { ProjectResponseWithDetails } from '@/types/extended'
import { ProjectStatus } from '@/types'

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
        ),
        project_requests (
          *
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as ProjectResponseWithDetails
  }

  static async updateStatus(id: string, status: string, project_data?: {
    contract_value: number;
    start_date: string;
    estimated_duration: string;
    payment_terms: string;
    total_hours_estimated?: number;
    status: ProjectStatus;
  }) {
    // 1. Update the response status
    const { data: response, error: responseError } = await supabase
      .from('project_responses')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (responseError) throw responseError

    // 2. If accepted, also update the project request status and create project record
    if (status === 'accepted') {
      const { data: projectRequest, error: requestFetchError } = await supabase
        .from('project_requests')
        .update({ status: 'accepted' })
        .eq('id', response.project_request_id)
        .select()
        .single();
      
      if (requestFetchError) {
        console.error('Error updating project request status:', requestFetchError)
      }

      // 3. Create the project record
      if (projectRequest) {
        const insertData = {
          client_id: projectRequest.client_id,
          consultant_id: response.consultant_id,
          contract_value: project_data?.contract_value || response.proposed_budget,
          project_request_id: response.project_request_id,
          project_response_id: response.id,
          start_date: project_data?.start_date || new Date().toISOString().split('T')[0],
          status: project_data?.status || ProjectStatus.ACTIVE,
          payment_terms: project_data?.payment_terms || 'Fixed Price', // Defaulting to something common if not provided
          estimated_duration: project_data?.estimated_duration || response.proposed_timeline,
          total_hours_estimated: project_data?.total_hours_estimated || response.estimated_hours,
        };

        const { error: projectCreateError } = await supabase
          .from('projects')
          .insert(insertData);

        if (projectCreateError) {
          console.error('Error creating project record:', projectCreateError);
          // If it's a constraint error, we might want to throw it to inform the UI
          if (projectCreateError.code === '23514') {
             throw new Error(`Database Constraint Violation: ${projectCreateError.message}. Please check 'Payment Terms' value.`);
          }
          throw projectCreateError;
        }
      }
    }

    return response
  }

  static async recordView(id: string, currentStatus: string) {
    const updateData: { viewed_at: string; status?: string } = { viewed_at: new Date().toISOString() };
    
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
