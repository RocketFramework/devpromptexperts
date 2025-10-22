import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Clients = Database['public']['Tables']['clients']['Row']
export type ClientsInsert = Database['public']['Tables']['clients']['Insert']
export type ClientsUpdate = Database['public']['Tables']['clients']['Update']

export class ClientsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ClientsInsert) {
    const { data: result, error } = await supabase
      .from('clients')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ClientsUpdate) {
    const { data: result, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ClientsInsert) {
    const { data: result, error } = await supabase
      .from('clients')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
