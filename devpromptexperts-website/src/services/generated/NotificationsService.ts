
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Notifications = Database['public']['Tables']['notifications']['Row']
export type NotificationsInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationsUpdate = Database['public']['Tables']['notifications']['Update']

export class NotificationsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: NotificationsInsert) {
    const { data: result, error } = await supabase
      .from('notifications')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: NotificationsUpdate) {
    const { data: result, error } = await supabase
      .from('notifications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: NotificationsInsert) {
    const { data: result, error } = await supabase
      .from('notifications')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


