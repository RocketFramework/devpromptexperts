
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type CommissionInvoicePayouts = Database['public']['Tables']['commission_invoice_payouts']['Row']
export type CommissionInvoicePayoutsInsert = Database['public']['Tables']['commission_invoice_payouts']['Insert']
export type CommissionInvoicePayoutsUpdate = Database['public']['Tables']['commission_invoice_payouts']['Update']

export class CommissionInvoicePayoutsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('commission_invoice_payouts')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('commission_invoice_payouts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('commission_invoice_payouts')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: CommissionInvoicePayoutsInsert) {
    const { data: result, error } = await supabase
      .from('commission_invoice_payouts')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: CommissionInvoicePayoutsUpdate) {
    const { data: result, error } = await supabase
      .from('commission_invoice_payouts')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: CommissionInvoicePayoutsInsert) {
    const { data: result, error } = await supabase
      .from('commission_invoice_payouts')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('commission_invoice_payouts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


