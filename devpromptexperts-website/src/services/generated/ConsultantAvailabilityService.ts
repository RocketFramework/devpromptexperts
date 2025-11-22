
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultantAvailability = Database['public']['Tables']['consultant_availability']['Row']
export type ConsultantAvailabilityInsert = Database['public']['Tables']['consultant_availability']['Insert']
export type ConsultantAvailabilityUpdate = Database['public']['Tables']['consultant_availability']['Update']

export class ConsultantAvailabilityService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultant_availability')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultant_availability')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('consultant_availability')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ConsultantAvailabilityInsert) {
    const { data: result, error } = await supabase
      .from('consultant_availability')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantAvailabilityUpdate) {
    const { data: result, error } = await supabase
      .from('consultant_availability')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantAvailabilityInsert) {
    const { data: result, error } = await supabase
      .from('consultant_availability')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultant_availability')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


