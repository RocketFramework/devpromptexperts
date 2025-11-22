
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type SellerClients = Database['public']['Tables']['seller_clients']['Row']
export type SellerClientsInsert = Database['public']['Tables']['seller_clients']['Insert']
export type SellerClientsUpdate = Database['public']['Tables']['seller_clients']['Update']

export class SellerClientsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('seller_clients')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('seller_clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('seller_clients')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: SellerClientsInsert) {
    const { data: result, error } = await supabase
      .from('seller_clients')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: SellerClientsUpdate) {
    const { data: result, error } = await supabase
      .from('seller_clients')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: SellerClientsInsert) {
    const { data: result, error } = await supabase
      .from('seller_clients')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('seller_clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


