
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Sellers = Database['public']['Tables']['sellers']['Row']
export type SellersInsert = Database['public']['Tables']['sellers']['Insert']
export type SellersUpdate = Database['public']['Tables']['sellers']['Update']

export class SellersService {
  static async findAll() {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: SellersInsert) {
    const { data: result, error } = await supabase
      .from('sellers')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: SellersUpdate) {
    const { data: result, error } = await supabase
      .from('sellers')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: SellersInsert) {
    const { data: result, error } = await supabase
      .from('sellers')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('sellers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  
  // One-to-many relationship with users
  static async findWithUsers(id: string) {
    const { data, error } = await supabase
      .from('sellers')
      .select(`
        *,
        users (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithUsers(email: string) {
    const { data, error } = await supabase
      .from('sellers')
      .select(`
        *,
        users (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async findAllWithUsers() {
    const { data, error } = await supabase
      .from('sellers')
      .select(`
        *,
        users (*)
      `)
    
    if (error) throw error
    return data
  }

  // Custom join methods for complex queries
  
}

export type SellersWithUsers = Sellers & {
  users: Database['public']['Tables']['users']['Row'][]
}
