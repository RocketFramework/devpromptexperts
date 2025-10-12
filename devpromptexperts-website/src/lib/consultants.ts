// src/lib/consultants.ts
import { supabase } from './supabaseClient';
import { Consultant, ConsultantRow, OnboardingStage } from '@/types/consultant';
import { toOnboardingStage } from '@/utils/normalizers';

export async function getConsultants(): Promise<Consultant[]> {
  const { data, error } = await supabase
    .from('consultants')
    .select(`
      *,
      user:users (id, email, full_name, role, profile_image_url, country)
    `);

  if (error) throw error;

  return (data as ConsultantRow[]).map((c) => ({
    id: c.user.id,
    email: c.user.email,
    name: c.user.full_name,
    role: c.user.role,
    image: c.user.profile_image_url,
    country: c.user.country ?? "",
    title: c.title,
    bio_summary: c.bio_summary,
    expertise: c.expertise ?? [],
    availability: c.availability,
    work_experience: c.work_experience,
    skills: c.skills ?? [],
    publications: c.publications ?? [],
    projects_completed: c.projects_completed,
    stage: toOnboardingStage(c.stage),
    rating: c.rating,
    featured: c.featured,
  }));
}


// Update consultant stage
export async function updateConsultantStage(
  user_id: string,
  newStage: string
): Promise<void> {
  const { error } = await supabase
    .from("consultants")
    .update({ stage: newStage })
    .eq("user_id", user_id);

  if (error) throw error;
}