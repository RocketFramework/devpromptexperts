
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultantsWithObPartners = Database['public']['Tables']['consultants_with_ob_partners']['Row']
export type ConsultantsWithObPartnersInsert = Database['public']['Tables']['consultants_with_ob_partners']['Insert']
export type ConsultantsWithObPartnersUpdate = Database['public']['Tables']['consultants_with_ob_partners']['Update']

export class ConsultantsWithObPartnersService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultants_with_ob_partners')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultants_with_ob_partners')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ConsultantsWithObPartnersInsert) {
    const { data: result, error } = await supabase
      .from('consultants_with_ob_partners')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantsWithObPartnersUpdate) {
    const { data: result, error } = await supabase
      .from('consultants_with_ob_partners')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantsWithObPartnersInsert) {
    const { data: result, error } = await supabase
      .from('consultants_with_ob_partners')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultants_with_ob_partners')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


