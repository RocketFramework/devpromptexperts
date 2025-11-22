
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConnectWithObPartners = Database['public']['Tables']['connect_with_ob_partners']['Row']
export type ConnectWithObPartnersInsert = Database['public']['Tables']['connect_with_ob_partners']['Insert']
export type ConnectWithObPartnersUpdate = Database['public']['Tables']['connect_with_ob_partners']['Update']

export class ConnectWithObPartnersService {
  static async findAll() {
    const { data, error } = await supabase
      .from('connect_with_ob_partners')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('connect_with_ob_partners')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('connect_with_ob_partners')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ConnectWithObPartnersInsert) {
    const { data: result, error } = await supabase
      .from('connect_with_ob_partners')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConnectWithObPartnersUpdate) {
    const { data: result, error } = await supabase
      .from('connect_with_ob_partners')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConnectWithObPartnersInsert) {
    const { data: result, error } = await supabase
      .from('connect_with_ob_partners')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('connect_with_ob_partners')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


