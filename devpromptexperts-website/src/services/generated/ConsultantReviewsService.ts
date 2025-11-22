
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

export type ConsultantReviews = Database['public']['Tables']['consultant_reviews']['Row']
export type ConsultantReviewsInsert = Database['public']['Tables']['consultant_reviews']['Insert']
export type ConsultantReviewsUpdate = Database['public']['Tables']['consultant_reviews']['Update']

export class ConsultantReviewsService {
  static async findAll() {
    const { data, error } = await supabase
      .from('consultant_reviews')
      .select('*')
    
    if (error) throw error
    return data
  }

  static async findById(id: string) {
    const { data, error } = await supabase
      .from('consultant_reviews')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('consultant_reviews')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async create(data: ConsultantReviewsInsert) {
    const { data: result, error } = await supabase
      .from('consultant_reviews')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async update(id: string, data: ConsultantReviewsUpdate) {
    const { data: result, error } = await supabase
      .from('consultant_reviews')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async upsert(data: ConsultantReviewsInsert) {
    const { data: result, error } = await supabase
      .from('consultant_reviews')
      .upsert(data)
      .select()
      .single()
    
    if (error) throw error
    return result
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('consultant_reviews')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  

  // Custom join methods for complex queries
  
}


