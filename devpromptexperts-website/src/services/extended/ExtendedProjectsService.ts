import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Project = Database['public']['Tables']['projects']['Row'] & {
  project_requests: {
    title: string;
    project_summary: string | null;
    budget_range: string;
    description: string | null;
  };
  project_responses?: {
    cover_letter: string | null;
    proposed_solution: string | null;
    proposed_budget: number | null;
    proposed_timeline: string | null;
    estimated_hours: number | null;
  };
  consultants?: {
    user_id: string;
    bio_summary: string | null;
    rating: number | null;
    work_experience: number | null;
    expertise: string[] | null;
    users: {
      full_name: string | null;
      profile_image_url: string | null;
    } | null;
  } | null;
  clients?: {
    company_name: string;
    company_size: string | null;
    industry: string | null;
    city: string | null;
    country: string | null;
    users: {
      full_name: string;
      email: string;
      phone: string | null;
      profile_image_url: string | null;
      country: string | null;
      last_sign_in?: string | null;
    } | null;
  } | null;
  _stats?: {
    activeProjects: number;
    activeRFPs: number;
  };
}

export class ExtendedProjectsService {
  static async findByClientId(client_id: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_requests (
          title,
          project_summary,
          budget_range,
          description
        ),
        project_responses (
          cover_letter,
          proposed_solution,
          proposed_budget,
          proposed_timeline,
          estimated_hours
        ),
        consultants (
          user_id,
          bio_summary,
          rating,
          work_experience,
          expertise,
          users (
            full_name,
            profile_image_url
          )
        )
      `)
      .eq('client_id', client_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error
    return data as unknown as Project[]
  }

  static async findById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_requests (
          title,
          project_summary,
          budget_range,
          description
        ),
        project_responses (
          cover_letter,
          proposed_solution,
          proposed_budget,
          proposed_timeline,
          estimated_hours
        ),
        consultants (
          user_id,
          bio_summary,
          rating,
          work_experience,
          expertise,
          users (
            full_name,
            profile_image_url
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as unknown as Project;
  }

  static async findByConsultantId(consultant_id: string, status: string = 'active'): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        clients (
          company_name,
          country: metadata->>'country',
          city: metadata->>'city'
        ),
        project_requests (
          title,
          project_summary,
          budget_range,
          description
        )
      `)
      .eq('consultant_id', consultant_id)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as unknown as Project[];
  }
}
