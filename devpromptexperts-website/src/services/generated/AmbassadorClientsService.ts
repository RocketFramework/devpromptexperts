
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type AmbassadorClients = Database['public']['Tables']['ambassador_clients']['Row']
export type AmbassadorClientsInsert = Database['public']['Tables']['ambassador_clients']['Insert']
export type AmbassadorClientsUpdate = Database['public']['Tables']['ambassador_clients']['Update']

export class AmbassadorClientsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('ambassador_clients')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('ambassador_clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: AmbassadorClientsInsert) {
    const { data: result, error } = await supabase
      .from('ambassador_clients')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: AmbassadorClientsUpdate) {
    const { data: result, error } = await supabase
      .from('ambassador_clients')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: AmbassadorClientsInsert) {
    const { data: result, error } = await supabase
      .from('ambassador_clients')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('ambassador_clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


