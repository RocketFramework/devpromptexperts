
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type UserOnboardingSessions = Database['public']['Tables']['user_onboarding_sessions']['Row']
export type UserOnboardingSessionsInsert = Database['public']['Tables']['user_onboarding_sessions']['Insert']
export type UserOnboardingSessionsUpdate = Database['public']['Tables']['user_onboarding_sessions']['Update']

export class UserOnboardingSessionsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('user_onboarding_sessions')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('user_onboarding_sessions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('user_onboarding_sessions')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: UserOnboardingSessionsInsert) {
    const { data: result, error } = await supabase
      .from('user_onboarding_sessions')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: UserOnboardingSessionsUpdate) {
    const { data: result, error } = await supabase
      .from('user_onboarding_sessions')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: UserOnboardingSessionsInsert) {
    const { data: result, error } = await supabase
      .from('user_onboarding_sessions')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('user_onboarding_sessions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


