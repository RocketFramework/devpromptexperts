
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type InterviewSlots = Database['public']['Tables']['interview_slots']['Row']
export type InterviewSlotsInsert = Database['public']['Tables']['interview_slots']['Insert']
export type InterviewSlotsUpdate = Database['public']['Tables']['interview_slots']['Update']

export class InterviewSlotsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('interview_slots')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('interview_slots')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('interview_slots')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: InterviewSlotsInsert) {
    const { data: result, error } = await supabase
      .from('interview_slots')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: InterviewSlotsUpdate) {
    const { data: result, error } = await supabase
      .from('interview_slots')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: InterviewSlotsInsert) {
    const { data: result, error } = await supabase
      .from('interview_slots')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('interview_slots')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


