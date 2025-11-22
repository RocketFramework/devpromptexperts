
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

  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
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

  static async findByEmailWithConsultants(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        consultants (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
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


  // One-to-one relationship with clients
  static async findWithClients(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        clients (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithClients(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        clients (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async findAllWithClients() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        clients (*)
      `)
    
    if (error) throw error
    return data
  }


  // One-to-one relationship with sellers
  static async findWithSellers(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        sellers (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithSellers(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        sellers (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  static async findAllWithSellers() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        sellers (*)
      `)
    
    if (error) throw error
    return data
  }

  // Custom join methods for complex queries
  
  // Get user with all role-specific data
  static async findWithAllRoleData(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        consultants (*),
        clients (*),
        sellers (*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithAllRoleData(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        consultants (*),
        clients (*),
        sellers (*)
      `)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  // Get user with specific role data based on their role
  static async findWithRoleSpecificData(id: string) {
    // First get the user to determine their role
    const user = await this.findById(id);
    
    let query = '';
    switch (user.role) {
      case 'consultant':
        query = `*, consultants (*)`;
        break;
      case 'client':
        query = `*, clients (*)`;
        break;
      case 'seller':
        query = `*, sellers (*)`;
        break;
      default:
        query = '*';
    }

    const { data, error } = await supabase
      .from('users')
      .select(query)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async findByEmailWithRoleSpecificData(email: string) {
    // First get the user to determine their role
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    let query = '';
    switch (user.role) {
      case 'consultant':
        query = `*, consultants (*)`;
        break;
      case 'client':
        query = `*, clients (*)`;
        break;
      case 'seller':
        query = `*, sellers (*)`;
        break;
      default:
        query = '*';
    }

    const { data, error } = await supabase
      .from('users')
      .select(query)
      .eq('email', email)
      .single()
    
    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  }
}

export type UsersWithConsultants = Users & {
  consultants: Database['public']['Tables']['consultants']['Row'] | null
}
export type UsersWithClients = Users & {
  clients: Database['public']['Tables']['clients']['Row'] | null
}
export type UsersWithSellers = Users & {
  sellers: Database['public']['Tables']['sellers']['Row'] | null
}

// User with all role data
export type UserWithAllRoleData = Users & {
  consultants?: Database['public']['Tables']['consultants']['Row'] | null
  clients?: Database['public']['Tables']['clients']['Row'] | null
  sellers?: Database['public']['Tables']['sellers']['Row'] | null
  provider_accounts?: Database['public']['Tables']['provider_accounts']['Row'][]
}

// User with role-specific data (only their role's data)
export type UserWithRoleSpecificData = Users & (
  | { role: 'consultant'; consultants: Database['public']['Tables']['consultants']['Row'] | null }
  | { role: 'client'; clients: Database['public']['Tables']['clients']['Row'] | null }
  | { role: 'seller'; sellers: Database['public']['Tables']['sellers']['Row'] | null }
  | { role: string }
)
