export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ambassador_clients: {
        Row: {
          ambassador_id: string
          client_id: string
        }
        Insert: {
          ambassador_id: string
          client_id: string
        }
        Update: {
          ambassador_id?: string
          client_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_clients_ambassador_id_fkey"
            columns: ["ambassador_id"]
            isOneToOne: false
            referencedRelation: "sales_ambassadors"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ambassador_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ambassador_consultants: {
        Row: {
          ambassador_id: string
          consultant_id: string
        }
        Insert: {
          ambassador_id: string
          consultant_id: string
        }
        Update: {
          ambassador_id?: string
          consultant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_consultants_ambassador_id_fkey"
            columns: ["ambassador_id"]
            isOneToOne: false
            referencedRelation: "consulting_ambassadors"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ambassador_consultants_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
        ]
      }
      auth_audit: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          ip: string | null
          notes: string | null
          provider: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip?: string | null
          notes?: string | null
          provider?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          ip?: string | null
          notes?: string | null
          provider?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          user_id: string
        }
        Insert: {
          user_id: string
        }
        Update: {
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          availability: string | null
          bio_summary: string | null
          expertise: string[] | null
          featured: boolean | null
          linkedinUrl: string | null
          projects_completed: number | null
          publications: string[] | null
          rating: number | null
          skills: string[] | null
          stage: string | null
          title: string | null
          user_id: string
          work_experience: number | null
        }
        Insert: {
          availability?: string | null
          bio_summary?: string | null
          expertise?: string[] | null
          featured?: boolean | null
          linkedinUrl?: string | null
          projects_completed?: number | null
          publications?: string[] | null
          rating?: number | null
          skills?: string[] | null
          stage?: string | null
          title?: string | null
          user_id: string
          work_experience?: number | null
        }
        Update: {
          availability?: string | null
          bio_summary?: string | null
          expertise?: string[] | null
          featured?: boolean | null
          linkedinUrl?: string | null
          projects_completed?: number | null
          publications?: string[] | null
          rating?: number | null
          skills?: string[] | null
          stage?: string | null
          title?: string | null
          user_id?: string
          work_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consultants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          client_id: string | null
          consultant_id: string | null
          duration_minutes: number | null
          id: string
          rating: number | null
          review: string | null
          scheduled_at: string | null
          status: string
        }
        Insert: {
          client_id?: string | null
          consultant_id?: string | null
          duration_minutes?: number | null
          id?: string
          rating?: number | null
          review?: string | null
          scheduled_at?: string | null
          status: string
        }
        Update: {
          client_id?: string | null
          consultant_id?: string | null
          duration_minutes?: number | null
          id?: string
          rating?: number | null
          review?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultations_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
        ]
      }
      consulting_ambassadors: {
        Row: {
          commission_rate: number | null
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consulting_ambassadors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          ambassador_id: string | null
          amount: number
          client_id: string | null
          commission: number | null
          consultant_id: string | null
          consultation_id: string | null
          id: string
        }
        Insert: {
          ambassador_id?: string | null
          amount: number
          client_id?: string | null
          commission?: number | null
          consultant_id?: string | null
          consultation_id?: string | null
          id?: string
        }
        Update: {
          ambassador_id?: string | null
          amount?: number
          client_id?: string | null
          commission?: number | null
          consultant_id?: string | null
          consultation_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_accounts: {
        Row: {
          access_token_enc: string | null
          created_at: string | null
          id: string
          provider: string
          provider_account_id: string
          raw_profile: Json | null
          refresh_token_enc: string | null
          scopes: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token_enc?: string | null
          created_at?: string | null
          id?: string
          provider: string
          provider_account_id: string
          raw_profile?: Json | null
          refresh_token_enc?: string | null
          scopes?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token_enc?: string | null
          created_at?: string | null
          id?: string
          provider?: string
          provider_account_id?: string
          raw_profile?: Json | null
          refresh_token_enc?: string | null
          scopes?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_ambassadors: {
        Row: {
          commission_rate: number | null
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_ambassadors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          last_sign_in: string | null
          metadata: Json | null
          profile: Json | null
          profile_image_url: string | null
          role: string
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          last_sign_in?: string | null
          metadata?: Json | null
          profile?: Json | null
          profile_image_url?: string | null
          role: string
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          last_sign_in?: string | null
          metadata?: Json | null
          profile?: Json | null
          profile_image_url?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
