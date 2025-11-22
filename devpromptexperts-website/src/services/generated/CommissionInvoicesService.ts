
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type CommissionInvoices = Database['public']['Tables']['commission_invoices']['Row']
export type CommissionInvoicesInsert = Database['public']['Tables']['commission_invoices']['Insert']
export type CommissionInvoicesUpdate = Database['public']['Tables']['commission_invoices']['Update']

export class CommissionInvoicesService {
  static async findAll() {
    const { data, error } = await supabase
      .from('commission_invoices')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('commission_invoices')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('commission_invoices')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: CommissionInvoicesInsert) {
    const { data: result, error } = await supabase
      .from('commission_invoices')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: CommissionInvoicesUpdate) {
    const { data: result, error } = await supabase
      .from('commission_invoices')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: CommissionInvoicesInsert) {
    const { data: result, error } = await supabase
      .from('commission_invoices')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('commission_invoices')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


