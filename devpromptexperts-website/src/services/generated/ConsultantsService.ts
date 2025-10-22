
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Consultants = Database['public']['Tables']['consultants']['Row']
export type ConsultantsInsert = Database['public']['Tables']['consultants']['Insert']
export type ConsultantsUpdate = Database['public']['Tables']['consultants']['Update']

export class ConsultantsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultantsInsert) {
    const { data: result, error } = await supabase
      .from('consultants')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantsUpdate) {
    const { data: result, error } = await supabase
      .from('consultants')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantsInsert) {
    const { data: result, error } = await supabase
      .from('consultants')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultants')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
