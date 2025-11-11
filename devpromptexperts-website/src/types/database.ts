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
      commission_payouts: {
        Row: {
          consultant_id: string | null
          id: string
          paid_at: string | null
          payout_method: string | null
          period_end: string | null
          period_start: string | null
          status: string | null
          total_commission: number | null
          transaction_id: string | null
        }
        Insert: {
          consultant_id?: string | null
          id?: string
          paid_at?: string | null
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          total_commission?: number | null
          transaction_id?: string | null
        }
        Update: {
          consultant_id?: string | null
          id?: string
          paid_at?: string | null
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          total_commission?: number | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_payouts_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
        ]
      }
      consultant_availability: {
        Row: {
          consultant_id: string | null
          created_at: string | null
          day_of_week: number | null
          id: string
          is_recurring: boolean | null
          time_slots: Json | null
        }
        Insert: {
          consultant_id?: string | null
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_recurring?: boolean | null
          time_slots?: Json | null
        }
        Update: {
          consultant_id?: string | null
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          is_recurring?: boolean | null
          time_slots?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "consultant_availability_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
        ]
      }
      consultant_referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_email: string
          referred_name: string | null
          referrer_id: string | null
          status: string | null
          token: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_email: string
          referred_name?: string | null
          referrer_id?: string | null
          status?: string | null
          token?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_email?: string
          referred_name?: string | null
          referrer_id?: string | null
          status?: string | null
          token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultant_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
        ]
      }
      consultants: {
        Row: {
          advisory_interest: boolean | null
          approval_status: string | null
          assigned_free_consultation_count: number | null
          availability: string | null
          bio_summary: string | null
          certifications: string[] | null
          completed_free_consultation_count: number | null
          direct_access_granted: boolean | null
          equity_interest: boolean | null
          expertise: string[] | null
          featured: boolean | null
          founder_number: number | null
          hourly_rate: number | null
          hours_per_week: number | null
          industries: string[] | null
          linkedinUrl: string | null
          min_project_size: number | null
          notice_period: string | null
          onboarding_completed_at: string | null
          onboarding_tier: string | null
          portfolio_url: string | null
          preferred_engagement_type: string[] | null
          probation_completed: boolean | null
          probation_required: boolean | null
          project_types: string[] | null
          projects_completed: number | null
          publications: string[] | null
          rating: number | null
          referred_by: string | null
          skills: string[] | null
          special_requests: string | null
          stage: string | null
          start_date: string | null
          time_slots: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
          work_experience: number | null
        }
        Insert: {
          advisory_interest?: boolean | null
          approval_status?: string | null
          assigned_free_consultation_count?: number | null
          availability?: string | null
          bio_summary?: string | null
          certifications?: string[] | null
          completed_free_consultation_count?: number | null
          direct_access_granted?: boolean | null
          equity_interest?: boolean | null
          expertise?: string[] | null
          featured?: boolean | null
          founder_number?: number | null
          hourly_rate?: number | null
          hours_per_week?: number | null
          industries?: string[] | null
          linkedinUrl?: string | null
          min_project_size?: number | null
          notice_period?: string | null
          onboarding_completed_at?: string | null
          onboarding_tier?: string | null
          portfolio_url?: string | null
          preferred_engagement_type?: string[] | null
          probation_completed?: boolean | null
          probation_required?: boolean | null
          project_types?: string[] | null
          projects_completed?: number | null
          publications?: string[] | null
          rating?: number | null
          referred_by?: string | null
          skills?: string[] | null
          special_requests?: string | null
          stage?: string | null
          start_date?: string | null
          time_slots?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          work_experience?: number | null
        }
        Update: {
          advisory_interest?: boolean | null
          approval_status?: string | null
          assigned_free_consultation_count?: number | null
          availability?: string | null
          bio_summary?: string | null
          certifications?: string[] | null
          completed_free_consultation_count?: number | null
          direct_access_granted?: boolean | null
          equity_interest?: boolean | null
          expertise?: string[] | null
          featured?: boolean | null
          founder_number?: number | null
          hourly_rate?: number | null
          hours_per_week?: number | null
          industries?: string[] | null
          linkedinUrl?: string | null
          min_project_size?: number | null
          notice_period?: string | null
          onboarding_completed_at?: string | null
          onboarding_tier?: string | null
          portfolio_url?: string | null
          preferred_engagement_type?: string[] | null
          probation_completed?: boolean | null
          probation_required?: boolean | null
          project_types?: string[] | null
          projects_completed?: number | null
          publications?: string[] | null
          rating?: number | null
          referred_by?: string | null
          skills?: string[] | null
          special_requests?: string | null
          stage?: string | null
          start_date?: string | null
          time_slots?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          work_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consultants_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants_with_ob_partners: {
        Row: {
          assigned_by: string | null
          assignment_notes: string | null
          consultant_feedback: string | null
          consultant_id: string
          created_at: string | null
          end_time: string | null
          id: string
          interview_date: string | null
          interview_slot_id: string | null
          interview_status: string | null
          meeting_id: string | null
          meeting_passcode: string | null
          meeting_platform: string | null
          meeting_url: string | null
          ob_partner_id: string
          original_interview_slot_id: string | null
          partner_feedback: string | null
          partnership_status: string
          reschedule_count: number | null
          reschedule_reason: string | null
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          assignment_notes?: string | null
          consultant_feedback?: string | null
          consultant_id: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          interview_date?: string | null
          interview_slot_id?: string | null
          interview_status?: string | null
          meeting_id?: string | null
          meeting_passcode?: string | null
          meeting_platform?: string | null
          meeting_url?: string | null
          ob_partner_id: string
          original_interview_slot_id?: string | null
          partner_feedback?: string | null
          partnership_status?: string
          reschedule_count?: number | null
          reschedule_reason?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          assignment_notes?: string | null
          consultant_feedback?: string | null
          consultant_id?: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          interview_date?: string | null
          interview_slot_id?: string | null
          interview_status?: string | null
          meeting_id?: string | null
          meeting_passcode?: string | null
          meeting_platform?: string | null
          meeting_url?: string | null
          ob_partner_id?: string
          original_interview_slot_id?: string | null
          partner_feedback?: string | null
          partnership_status?: string
          reschedule_count?: number | null
          reschedule_reason?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultants_with_ob_partners_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultants_with_ob_partners_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: true
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultants_with_ob_partners_interview_slot_id_fkey"
            columns: ["interview_slot_id"]
            isOneToOne: false
            referencedRelation: "interview_slots"
            referencedColumns: ["uuid_id"]
          },
          {
            foreignKeyName: "consultants_with_ob_partners_ob_partner_id_fkey"
            columns: ["ob_partner_id"]
            isOneToOne: false
            referencedRelation: "ob_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultants_with_ob_partners_original_interview_slot_id_fkey"
            columns: ["original_interview_slot_id"]
            isOneToOne: false
            referencedRelation: "interview_slots"
            referencedColumns: ["uuid_id"]
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
      interview_slots: {
        Row: {
          created_at: string
          end_time: string | null
          start_time: string | null
          uuid_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          start_time?: string | null
          uuid_id?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          start_time?: string | null
          uuid_id?: string
        }
        Relationships: []
      }
      ob_partners: {
        Row: {
          activated_at: string | null
          average_satisfaction_rating: number | null
          created_at: string
          id: string
          introduction_message: string | null
          is_accepting_new_consultants: boolean | null
          max_concurrent_consultants: number | null
          overall_engagement_score: number | null
          partner_bio: string | null
          partner_status: string
          partner_type: string
          special_notes: string | null
          timezone: string | null
          total_partnerings: number | null
          typical_response_hours: number | null
          unavailable_dates: string[] | null
          updated_at: string
          user_id: string
          working_hours_end: string | null
          working_hours_start: string | null
        }
        Insert: {
          activated_at?: string | null
          average_satisfaction_rating?: number | null
          created_at?: string
          id?: string
          introduction_message?: string | null
          is_accepting_new_consultants?: boolean | null
          max_concurrent_consultants?: number | null
          overall_engagement_score?: number | null
          partner_bio?: string | null
          partner_status?: string
          partner_type?: string
          special_notes?: string | null
          timezone?: string | null
          total_partnerings?: number | null
          typical_response_hours?: number | null
          unavailable_dates?: string[] | null
          updated_at?: string
          user_id: string
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Update: {
          activated_at?: string | null
          average_satisfaction_rating?: number | null
          created_at?: string
          id?: string
          introduction_message?: string | null
          is_accepting_new_consultants?: boolean | null
          max_concurrent_consultants?: number | null
          overall_engagement_score?: number | null
          partner_bio?: string | null
          partner_status?: string
          partner_type?: string
          special_notes?: string | null
          timezone?: string | null
          total_partnerings?: number | null
          typical_response_hours?: number | null
          unavailable_dates?: string[] | null
          updated_at?: string
          user_id?: string
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ob_partner_user_id_fkey"
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
      referral_commissions: {
        Row: {
          commission_amount: number | null
          commission_percentage: number | null
          ended_at: string | null
          id: string
          notes: string | null
          referral_id: string | null
          referred_consultant_id: string | null
          referrer_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_percentage?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          referral_id?: string | null
          referred_consultant_id?: string | null
          referrer_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_percentage?: number | null
          ended_at?: string | null
          id?: string
          notes?: string | null
          referral_id?: string | null
          referred_consultant_id?: string | null
          referrer_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "consultant_referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_commissions_referred_consultant_id_fkey"
            columns: ["referred_consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_commissions_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
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
          phone: string | null
          profile: Json | null
          profile_image_url: string | null
          role: string
          timezone: string | null
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
          phone?: string | null
          profile?: Json | null
          profile_image_url?: string | null
          role: string
          timezone?: string | null
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
          phone?: string | null
          profile?: Json | null
          profile_image_url?: string | null
          role?: string
          timezone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_interview_slots: {
        Args: { target_partner_id: string }
        Returns: {
          day_of_week: string
          end_time: string
          slot_date: string
          slot_id: string
          start_time: string
        }[]
      }
      get_founder_professional_count: { Args: never; Returns: number }
      get_one_slot_per_day: {
        Args: { partner_id: string }
        Returns: {
          day_of_week: string
          end_time: string
          slot_date: string
          slot_id: string
          start_time: string
        }[]
      }
      get_random_available_partner_with_workload: {
        Args: never
        Returns: {
          id: string
        }[]
      }
      insert_partner_only_if_none: {
        Args: {
          assigned_by_param: string
          consultant_id_param: string
          ob_partner_id_param: string
        }
        Returns: {
          id: string
          ob_partner_id: string
        }[]
      }
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
