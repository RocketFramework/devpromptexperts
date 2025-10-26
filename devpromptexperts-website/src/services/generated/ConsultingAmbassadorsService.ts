
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultingAmbassadors = Database['public']['Tables']['consulting_ambassadors']['Row']
export type ConsultingAmbassadorsInsert = Database['public']['Tables']['consulting_ambassadors']['Insert']
export type ConsultingAmbassadorsUpdate = Database['public']['Tables']['consulting_ambassadors']['Update']

export class ConsultingAmbassadorsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consulting_ambassadors')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consulting_ambassadors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultingAmbassadorsInsert) {
    const { data: result, error } = await supabase
      .from('consulting_ambassadors')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultingAmbassadorsUpdate) {
    const { data: result, error } = await supabase
      .from('consulting_ambassadors')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultingAmbassadorsInsert) {
    const { data: result, error } = await supabase
      .from('consulting_ambassadors')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consulting_ambassadors')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


