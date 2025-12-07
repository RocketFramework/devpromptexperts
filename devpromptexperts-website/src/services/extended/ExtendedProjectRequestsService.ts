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

  static async findWithResponses(id: string) {
    // First fetch the project to ensure it exists
    const { data: project, error: projectError } = await supabase
      .from('project_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError) throw projectError;
    if (!project) return null;

    // Then fetch responses with consultant details
    const { data: responses, error: responsesError } = await supabase
      .from('project_responses')
      .select(`
        *,
        consultants (
          user_id,
          featured,
          users (
            full_name,
            email,
            profile_image_url
          )
        )
      `)
      .eq('project_request_id', id);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      // Return project without responses if responses fetch fails
      return { ...project, project_responses: [] };
    }

    return { ...project, project_responses: responses || [] };
  }

  static async findAllOpenWithCounts() {
    const { data, error } = await supabase
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Filter for OPEN projects (case-insensitive)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
const openProjects = data?.filter((p: any) => p.status?.toLowerCase() === 'open') || [];
    
    if (openProjects.length === 0) return [];
    
    // Fetch response counts separately to avoid join issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectIds = openProjects.map((p: any) => p.id);
    const { data: responses, error: responsesError } = await supabase
      .from('project_responses')
      .select('project_request_id')
      .in('project_request_id', projectIds);

    if (responsesError) {
      console.error('Error fetching response counts:', responsesError);
      // Return projects with 0 count if responses fail
      return openProjects.map((project: any) => ({ ...project, response_count: 0 }));
    }
    
    // Calculate counts
    const responseCounts: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
responses?.forEach((r: any) => {
      responseCounts[r.project_request_id] = (responseCounts[r.project_request_id] || 0) + 1;
    });
    
    // Merge counts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
return openProjects.map((project: any) => ({
      ...project,
      response_count: responseCounts[project.id] || 0
    }));
  }
}