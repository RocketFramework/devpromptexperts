
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProjectPayments = Database['public']['Tables']['project_payments']['Row']
export type ProjectPaymentsInsert = Database['public']['Tables']['project_payments']['Insert']
export type ProjectPaymentsUpdate = Database['public']['Tables']['project_payments']['Update']

export class ProjectPaymentsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('project_payments')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ProjectPaymentsInsert) {
    const { data: result, error } = await supabase
      .from('project_payments')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProjectPaymentsUpdate) {
    const { data: result, error } = await supabase
      .from('project_payments')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProjectPaymentsInsert) {
    const { data: result, error } = await supabase
      .from('project_payments')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('project_payments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


