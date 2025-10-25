
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultingAmbassodors = Database['public']['Tables']['consulting_ambassadors']['Row']
export type ConsultingAmbassodorsInsert = Database['public']['Tables']['consulting_ambassadors']['Insert']
export type ConsultingAmbassodorsUpdate = Database['public']['Tables']['consulting_ambassadors']['Update']

export class ConsultingAmbassodorsService {
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

  static async create(data: ConsultingAmbassodorsInsert) {
    const { data: result, error } = await supabase
      .from('consulting_ambassadors')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultingAmbassodorsUpdate) {
    const { data: result, error } = await supabase
      .from('consulting_ambassadors')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultingAmbassodorsInsert) {
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


