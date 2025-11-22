
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type AuthAudit = Database['public']['Tables']['auth_audit']['Row']
export type AuthAuditInsert = Database['public']['Tables']['auth_audit']['Insert']
export type AuthAuditUpdate = Database['public']['Tables']['auth_audit']['Update']

export class AuthAuditService {
  static async findAll() {
    const { data, error } = await supabase
      .from('auth_audit')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('auth_audit')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('auth_audit')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: AuthAuditInsert) {
    const { data: result, error } = await supabase
      .from('auth_audit')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: AuthAuditUpdate) {
    const { data: result, error } = await supabase
      .from('auth_audit')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: AuthAuditInsert) {
    const { data: result, error } = await supabase
      .from('auth_audit')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('auth_audit')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


