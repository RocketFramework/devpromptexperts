
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type Users = Database['public']['Tables']['users']['Row']
export type UsersInsert = Database['public']['Tables']['users']['Insert']
export type UsersUpdate = Database['public']['Tables']['users']['Update']

export class UsersService {
  static async findAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: UsersInsert) {
    const { data: result, error } = await supabase
      .from('users')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: UsersUpdate) {
    const { data: result, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: UsersInsert) {
    const { data: result, error } = await supabase
      .from('users')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  
  // One-to-one relationship with consultants
  static async findWithConsultants(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        consultants (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findAllWithConsultants() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        consultants (*)
      `)
    
    if (error) throw error
    return data
  }

  // Custom join methods for complex queries
  
  // Get user with role-specific data
  static async findWithRoleData(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        consultants (*),
        clients (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

export type UsersWithConsultants = Users & {
  consultants: Database['public']['Tables']['consultants']['Row'] | null
}

// User with all role data
export type UserWithRoleData = Users & {
  consultants?: Database['public']['Tables']['consultants']['Row'] | null
  clients?: Database['public']['Tables']['clients']['Row'] | null
  provider_accounts?: Database['public']['Tables']['provider_accounts']['Row'][]
}
