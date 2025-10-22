
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ProviderAccounts = Database['public']['Tables']['provider_accounts']['Row']
export type ProviderAccountsInsert = Database['public']['Tables']['provider_accounts']['Insert']
export type ProviderAccountsUpdate = Database['public']['Tables']['provider_accounts']['Update']

export class ProviderAccountsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('provider_accounts')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('provider_accounts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async create(data: ProviderAccountsInsert) {
    const { data: result, error } = await supabase
      .from('provider_accounts')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ProviderAccountsUpdate) {
    const { data: result, error } = await supabase
      .from('provider_accounts')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ProviderAccountsInsert) {
    const { data: result, error } = await supabase
      .from('provider_accounts')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('provider_accounts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
