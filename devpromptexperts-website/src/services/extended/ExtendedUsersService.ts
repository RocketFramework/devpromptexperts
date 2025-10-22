// src/services/extended/ExtendedUsersService.ts
import { supabase } from "@/lib/supabase";
import { UsersService } from "../generated/UsersService";
import { UsersInsert, UsersUpdate } from "../generated/UsersService";

export class ExtendedUsersService {
  static async findByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error?.code === 'PGRST116') return null; // Not found
    if (error) throw error;
    return data;
  }

  static async upsertByEmail(email: string, data: Omit<UsersInsert, 'email'>) {
    const existing = await this.findByEmail(email);
    
    if (existing) {
      return UsersService.update(existing.id, data as UsersUpdate);
    } else {
      return UsersService.create({ ...data, email });
    }
  }
}