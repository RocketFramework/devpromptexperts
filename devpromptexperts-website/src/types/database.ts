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
      client_reviews: {
        Row: {
          client_id: string
          communication_rating: number | null
          consultant_id: string
          consultant_responded_at: string | null
          consultant_response: string | null
          created_at: string | null
          delivery_rating: number | null
          expertise_rating: number | null
          id: string
          is_public: boolean | null
          overall_rating: number
          project_id: string
          quality_rating: number | null
          review_text: string
          status: string
          title: string | null
          updated_at: string | null
          would_recommend: boolean | null
        }
        Insert: {
          client_id: string
          communication_rating?: number | null
          consultant_id: string
          consultant_responded_at?: string | null
          consultant_response?: string | null
          created_at?: string | null
          delivery_rating?: number | null
          expertise_rating?: number | null
          id?: string
          is_public?: boolean | null
          overall_rating: number
          project_id: string
          quality_rating?: number | null
          review_text: string
          status?: string
          title?: string | null
          updated_at?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          client_id?: string
          communication_rating?: number | null
          consultant_id?: string
          consultant_responded_at?: string | null
          consultant_response?: string | null
          created_at?: string | null
          delivery_rating?: number | null
          expertise_rating?: number | null
          id?: string
          is_public?: boolean | null
          overall_rating?: number
          project_id?: string
          quality_rating?: number | null
          review_text?: string
          status?: string
          title?: string | null
          updated_at?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "client_reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_reviews_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "client_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          avg_consultant_rating: number | null
          client_tier: string | null
          client_type: string | null
          company_name: string
          company_size: string | null
          created_at: string | null
          desired_project_types: string[] | null
          id: string
          industry: string | null
          metadata: Json | null
          preferred_consultant_traits: string[] | null
          project_budget: string | null
          project_summary: string | null
          required_expertise: string[] | null
          stage: string | null
          target_industries: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_consultant_rating?: number | null
          client_tier?: string | null
          client_type?: string | null
          company_name: string
          company_size?: string | null
          created_at?: string | null
          desired_project_types?: string[] | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          preferred_consultant_traits?: string[] | null
          project_budget?: string | null
          project_summary?: string | null
          required_expertise?: string[] | null
          stage?: string | null
          target_industries?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_consultant_rating?: number | null
          client_tier?: string | null
          client_type?: string | null
          company_name?: string
          company_size?: string | null
          created_at?: string | null
          desired_project_types?: string[] | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          preferred_consultant_traits?: string[] | null
          project_budget?: string | null
          project_summary?: string | null
          required_expertise?: string[] | null
          stage?: string | null
          target_industries?: string[] | null
          updated_at?: string | null
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
      commission_calculations: {
        Row: {
          calculated_at: string | null
          calculation_base_amount: number
          commission_amount: number
          commission_invoice_id: string
          commission_rate: number
          commission_type: string
          id: string
          period_end: string | null
          period_start: string | null
          project_id: string
          project_milestone_id: string | null
          referral_relationship_id: string
          user_id: string | null
        }
        Insert: {
          calculated_at?: string | null
          calculation_base_amount: number
          commission_amount: number
          commission_invoice_id: string
          commission_rate: number
          commission_type: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          project_id: string
          project_milestone_id?: string | null
          referral_relationship_id: string
          user_id?: string | null
        }
        Update: {
          calculated_at?: string | null
          calculation_base_amount?: number
          commission_amount?: number
          commission_invoice_id?: string
          commission_rate?: number
          commission_type?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          project_id?: string
          project_milestone_id?: string | null
          referral_relationship_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_calculations_invoice_id_fkey"
            columns: ["commission_invoice_id"]
            isOneToOne: false
            referencedRelation: "commission_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_calculations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_calculations_project_milestone_id_fkey"
            columns: ["project_milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_calculations_referral_relationship_id_fkey"
            columns: ["referral_relationship_id"]
            isOneToOne: false
            referencedRelation: "commission_referral_relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_calculations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_invoice_payouts: {
        Row: {
          commission_invoice_id: string | null
          id: string
          paid_at: string | null
          payout_method: string | null
          period_end: string | null
          period_start: string | null
          status: string | null
          total_commission: number | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          commission_invoice_id?: string | null
          id?: string
          paid_at?: string | null
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          total_commission?: number | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          commission_invoice_id?: string | null
          id?: string
          paid_at?: string | null
          payout_method?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string | null
          total_commission?: number | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_invoice_payouts_commission_invoice_id_fkey"
            columns: ["commission_invoice_id"]
            isOneToOne: false
            referencedRelation: "commission_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_invoice_payouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_invoices: {
        Row: {
          created_at: string | null
          currency: string
          due_date: string
          from_entity_id: string
          from_entity_type: string
          id: string
          invoice_date: string
          invoice_items: Json
          invoice_number: string
          invoice_type: string
          notes: string | null
          paid_at: string | null
          sent_at: string | null
          status: string
          sub_total: number
          tax_amount: number | null
          terms_text: string | null
          time_period_end: string | null
          time_period_start: string | null
          to_entity_id: string
          to_entity_type: string
          total_amount: number
          updated_at: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          due_date: string
          from_entity_id: string
          from_entity_type: string
          id?: string
          invoice_date?: string
          invoice_items?: Json
          invoice_number: string
          invoice_type: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          sub_total: number
          tax_amount?: number | null
          terms_text?: string | null
          time_period_end?: string | null
          time_period_start?: string | null
          to_entity_id: string
          to_entity_type: string
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          due_date?: string
          from_entity_id?: string
          from_entity_type?: string
          id?: string
          invoice_date?: string
          invoice_items?: Json
          invoice_number?: string
          invoice_type?: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          sub_total?: number
          tax_amount?: number | null
          terms_text?: string | null
          time_period_end?: string | null
          time_period_start?: string | null
          to_entity_id?: string
          to_entity_type?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_referral_relationships: {
        Row: {
          calculation_base: string | null
          commission_frequency: string
          commission_rate: number
          created_at: string | null
          ends_at: string | null
          id: string
          referral_code: string | null
          referred_id: string
          referred_type: string
          referrer_id: string
          referrer_type: string
          relationship_type: string
          starts_at: string | null
          status: string
        }
        Insert: {
          calculation_base?: string | null
          commission_frequency: string
          commission_rate: number
          created_at?: string | null
          ends_at?: string | null
          id?: string
          referral_code?: string | null
          referred_id: string
          referred_type: string
          referrer_id: string
          referrer_type: string
          relationship_type: string
          starts_at?: string | null
          status?: string
        }
        Update: {
          calculation_base?: string | null
          commission_frequency?: string
          commission_rate?: number
          created_at?: string | null
          ends_at?: string | null
          id?: string
          referral_code?: string | null
          referred_id?: string
          referred_type?: string
          referrer_id?: string
          referrer_type?: string
          relationship_type?: string
          starts_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_referral_relationships_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_referral_relationships_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_with_ob_partners: {
        Row: {
          assigned_by: string | null
          assignment_notes: string | null
          created_at: string | null
          id: string
          ob_partner_id: string
          original_interview_slot_id: string | null
          partnership_status: string
          updated_at: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          assigned_by?: string | null
          assignment_notes?: string | null
          created_at?: string | null
          id?: string
          ob_partner_id: string
          original_interview_slot_id?: string | null
          partnership_status?: string
          updated_at?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          assigned_by?: string | null
          assignment_notes?: string | null
          created_at?: string | null
          id?: string
          ob_partner_id?: string
          original_interview_slot_id?: string | null
          partnership_status?: string
          updated_at?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_with_ob_partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_with_ob_partners_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_with_ob_partners_ob_partner_id_fkey"
            columns: ["ob_partner_id"]
            isOneToOne: false
            referencedRelation: "ob_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_with_ob_partners_original_interview_slot_id_fkey"
            columns: ["original_interview_slot_id"]
            isOneToOne: false
            referencedRelation: "interview_slots"
            referencedColumns: ["uuid_id"]
          },
        ]
      }
      connected_ob_partner_meets: {
        Row: {
          connect_with_ob_partner_id: string | null
          connected_user_id: string | null
          consultant_feedback: string | null
          created_at: string
          end_time: string | null
          id: number
          interview_date: string | null
          interview_slot_id: string | null
          interview_status: string | null
          meeting_id: string | null
          meeting_passcode: string | null
          meeting_platform: string | null
          meeting_url: string | null
          ob_partner_user_id: string | null
          partner_feedback: string | null
          reschedule_count: number | null
          reschedule_reason: string | null
          start_time: string | null
        }
        Insert: {
          connect_with_ob_partner_id?: string | null
          connected_user_id?: string | null
          consultant_feedback?: string | null
          created_at?: string
          end_time?: string | null
          id?: number
          interview_date?: string | null
          interview_slot_id?: string | null
          interview_status?: string | null
          meeting_id?: string | null
          meeting_passcode?: string | null
          meeting_platform?: string | null
          meeting_url?: string | null
          ob_partner_user_id?: string | null
          partner_feedback?: string | null
          reschedule_count?: number | null
          reschedule_reason?: string | null
          start_time?: string | null
        }
        Update: {
          connect_with_ob_partner_id?: string | null
          connected_user_id?: string | null
          consultant_feedback?: string | null
          created_at?: string
          end_time?: string | null
          id?: number
          interview_date?: string | null
          interview_slot_id?: string | null
          interview_status?: string | null
          meeting_id?: string | null
          meeting_passcode?: string | null
          meeting_platform?: string | null
          meeting_url?: string | null
          ob_partner_user_id?: string | null
          partner_feedback?: string | null
          reschedule_count?: number | null
          reschedule_reason?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connected_ob_partner_meets_connect_with_ob_partner_id_fkey"
            columns: ["connect_with_ob_partner_id"]
            isOneToOne: false
            referencedRelation: "connect_with_ob_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connected_ob_partner_meets_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connected_ob_partner_meets_ob_partner_user_id_fkey"
            columns: ["ob_partner_user_id"]
            isOneToOne: false
            referencedRelation: "ob_partners"
            referencedColumns: ["id"]
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
      consultant_reviews: {
        Row: {
          clarity_rating: number | null
          client_id: string
          collaboration_rating: number | null
          communication_rating: number | null
          consultant_id: string
          created_at: string | null
          id: string
          is_public: boolean | null
          overall_rating: number
          payment_rating: number | null
          project_id: string
          review_text: string
          status: string
          title: string | null
          updated_at: string | null
          would_work_again: boolean | null
        }
        Insert: {
          clarity_rating?: number | null
          client_id: string
          collaboration_rating?: number | null
          communication_rating?: number | null
          consultant_id: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          overall_rating: number
          payment_rating?: number | null
          project_id: string
          review_text: string
          status?: string
          title?: string | null
          updated_at?: string | null
          would_work_again?: boolean | null
        }
        Update: {
          clarity_rating?: number | null
          client_id?: string
          collaboration_rating?: number | null
          communication_rating?: number | null
          consultant_id?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          overall_rating?: number
          payment_rating?: number | null
          project_id?: string
          review_text?: string
          status?: string
          title?: string | null
          updated_at?: string | null
          would_work_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "consultant_reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_reviews_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultant_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
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
      project_communications: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          message_type: string
          milestone_id: string | null
          project_id: string
          read_at: string | null
          sender_id: string
          sender_type: string
          subject: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string
          milestone_id?: string | null
          project_id: string
          read_at?: string | null
          sender_id: string
          sender_type: string
          subject?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string
          milestone_id?: string | null
          project_id?: string
          read_at?: string | null
          sender_id?: string
          sender_type?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_communications_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "project_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          client_approved: boolean | null
          client_approved_at: string | null
          completed_date: string | null
          completion_proof: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          milestone: string
          payment_percentage: number
          project_id: string
          project_payment_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          client_approved?: boolean | null
          client_approved_at?: string | null
          completed_date?: string | null
          completion_proof?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          milestone: string
          payment_percentage: number
          project_id: string
          project_payment_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_approved?: boolean | null
          client_approved_at?: string | null
          completed_date?: string | null
          completion_proof?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          milestone?: string
          payment_percentage?: number
          project_id?: string
          project_payment_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_project_payment_id_fkey"
            columns: ["project_payment_id"]
            isOneToOne: false
            referencedRelation: "project_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      project_payments: {
        Row: {
          amount: number
          consultant_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_type: string
          platform_commission_rate: number | null
          project_id: string
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          consultant_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_type?: string
          platform_commission_rate?: number | null
          project_id: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          consultant_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_type?: string
          platform_commission_rate?: number | null
          project_id?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_payments_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_requests: {
        Row: {
          assigned_at: string | null
          budget_range: string
          client_availability: string | null
          client_id: string
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          location_preference: string | null
          preferred_contact_method: string | null
          preferred_engagement_types: string[] | null
          preferred_industries: string[] | null
          project_summary: string | null
          project_type: string
          published_at: string | null
          required_skills: string[] | null
          shortlisted_responses: number | null
          specific_location: string | null
          status: string
          timeline: string
          title: string
          total_responses: number | null
          type: string
          updated_at: string | null
          urgency_level: string | null
          views_count: number | null
        }
        Insert: {
          assigned_at?: string | null
          budget_range: string
          client_availability?: string | null
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          location_preference?: string | null
          preferred_contact_method?: string | null
          preferred_engagement_types?: string[] | null
          preferred_industries?: string[] | null
          project_summary?: string | null
          project_type: string
          published_at?: string | null
          required_skills?: string[] | null
          shortlisted_responses?: number | null
          specific_location?: string | null
          status?: string
          timeline: string
          title: string
          total_responses?: number | null
          type?: string
          updated_at?: string | null
          urgency_level?: string | null
          views_count?: number | null
        }
        Update: {
          assigned_at?: string | null
          budget_range?: string
          client_availability?: string | null
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          location_preference?: string | null
          preferred_contact_method?: string | null
          preferred_engagement_types?: string[] | null
          preferred_industries?: string[] | null
          project_summary?: string | null
          project_type?: string
          published_at?: string | null
          required_skills?: string[] | null
          shortlisted_responses?: number | null
          specific_location?: string | null
          status?: string
          timeline?: string
          title?: string
          total_responses?: number | null
          type?: string
          updated_at?: string | null
          urgency_level?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      project_responses: {
        Row: {
          attachments: Json | null
          client_feedback: string | null
          client_rating: number | null
          consultant_id: string
          cover_letter: string
          created_at: string | null
          estimated_hours: number | null
          id: string
          project_request_id: string
          proposed_budget: number
          proposed_solution: string | null
          proposed_timeline: string
          responded_at: string | null
          shortlisted_at: string | null
          status: string
          submitted_at: string | null
          updated_at: string | null
          viewed_at: string | null
        }
        Insert: {
          attachments?: Json | null
          client_feedback?: string | null
          client_rating?: number | null
          consultant_id: string
          cover_letter: string
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          project_request_id: string
          proposed_budget: number
          proposed_solution?: string | null
          proposed_timeline: string
          responded_at?: string | null
          shortlisted_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          attachments?: Json | null
          client_feedback?: string | null
          client_rating?: number | null
          consultant_id?: string
          cover_letter?: string
          created_at?: string | null
          estimated_hours?: number | null
          id?: string
          project_request_id?: string
          proposed_budget?: number
          proposed_solution?: string | null
          proposed_timeline?: string
          responded_at?: string | null
          shortlisted_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_responses_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_responses_project_request_id_fkey"
            columns: ["project_request_id"]
            isOneToOne: false
            referencedRelation: "project_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_duration: number | null
          actual_hours: number | null
          client_id: string
          consultant_id: string
          contract_value: number
          created_at: string | null
          end_date: string | null
          estimated_duration: string | null
          id: string
          payment_terms: string
          project_request_id: string
          project_response_id: string
          start_date: string
          status: string
          total_hours_estimated: number | null
          updated_at: string | null
        }
        Insert: {
          actual_duration?: number | null
          actual_hours?: number | null
          client_id: string
          consultant_id: string
          contract_value: number
          created_at?: string | null
          end_date?: string | null
          estimated_duration?: string | null
          id?: string
          payment_terms: string
          project_request_id: string
          project_response_id: string
          start_date: string
          status?: string
          total_hours_estimated?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_duration?: number | null
          actual_hours?: number | null
          client_id?: string
          consultant_id?: string
          contract_value?: number
          created_at?: string | null
          end_date?: string | null
          estimated_duration?: string | null
          id?: string
          payment_terms?: string
          project_request_id?: string
          project_response_id?: string
          start_date?: string
          status?: string
          total_hours_estimated?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "projects_project_request_id_fkey"
            columns: ["project_request_id"]
            isOneToOne: false
            referencedRelation: "project_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_response_id_fkey"
            columns: ["project_response_id"]
            isOneToOne: false
            referencedRelation: "project_responses"
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
      seller_clients: {
        Row: {
          client_id: string
          created_at: string
          id: number
          satiscation_score: number | null
          seller_id: string | null
        }
        Insert: {
          client_id?: string
          created_at?: string
          id?: number
          satiscation_score?: number | null
          seller_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: number
          satiscation_score?: number | null
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "seller_clients_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sellers: {
        Row: {
          agreed_to_terms: boolean | null
          client_type: string | null
          commission_type: string | null
          company_name: string | null
          company_size: string | null
          created_at: string | null
          enhanced_verification_consented: boolean | null
          enhanced_verified: boolean | null
          enterprise_connections: number | null
          estimated_earnings: number | null
          geographic_focus: Json | null
          id: string
          identity_verification_consented: boolean | null
          identity_verified: boolean | null
          industries_focus: Json | null
          is_verified: boolean | null
          linkedin_url: string | null
          onboarding_tier: string | null
          payment_method: string | null
          platform_fee: string | null
          platform_net: string | null
          primary_industry: string | null
          selected_tier: string | null
          seller_type: string | null
          stage: string | null
          target_companies: Json | null
          tax_id: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
          your_commission: string | null
        }
        Insert: {
          agreed_to_terms?: boolean | null
          client_type?: string | null
          commission_type?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          enhanced_verification_consented?: boolean | null
          enhanced_verified?: boolean | null
          enterprise_connections?: number | null
          estimated_earnings?: number | null
          geographic_focus?: Json | null
          id?: string
          identity_verification_consented?: boolean | null
          identity_verified?: boolean | null
          industries_focus?: Json | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          onboarding_tier?: string | null
          payment_method?: string | null
          platform_fee?: string | null
          platform_net?: string | null
          primary_industry?: string | null
          selected_tier?: string | null
          seller_type?: string | null
          stage?: string | null
          target_companies?: Json | null
          tax_id?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          your_commission?: string | null
        }
        Update: {
          agreed_to_terms?: boolean | null
          client_type?: string | null
          commission_type?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          enhanced_verification_consented?: boolean | null
          enhanced_verified?: boolean | null
          enterprise_connections?: number | null
          estimated_earnings?: number | null
          geographic_focus?: Json | null
          id?: string
          identity_verification_consented?: boolean | null
          identity_verified?: boolean | null
          industries_focus?: Json | null
          is_verified?: boolean | null
          linkedin_url?: string | null
          onboarding_tier?: string | null
          payment_method?: string | null
          platform_fee?: string | null
          platform_net?: string | null
          primary_industry?: string | null
          selected_tier?: string | null
          seller_type?: string | null
          stage?: string | null
          target_companies?: Json | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          your_commission?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sellers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding_sessions: {
        Row: {
          completed_steps: string[] | null
          created_at: string | null
          current_step: string
          data: Json | null
          expires_at: string
          id: string
          session_token: string
          status: string
          updated_at: string | null
          user_role: string
        }
        Insert: {
          completed_steps?: string[] | null
          created_at?: string | null
          current_step?: string
          data?: Json | null
          expires_at: string
          id?: string
          session_token: string
          status?: string
          updated_at?: string | null
          user_role: string
        }
        Update: {
          completed_steps?: string[] | null
          created_at?: string | null
          current_step?: string
          data?: Json | null
          expires_at?: string
          id?: string
          session_token?: string
          status?: string
          updated_at?: string | null
          user_role?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          client_ob_commission_rate: number | null
          consultant_ob_commission_rate: number | null
          created_at: string
          id: number
          platform_commission_rate: number | null
          sales_ob_commission_rate: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_ob_commission_rate?: number | null
          consultant_ob_commission_rate?: number | null
          created_at?: string
          id?: number
          platform_commission_rate?: number | null
          sales_ob_commission_rate?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_ob_commission_rate?: number | null
          consultant_ob_commission_rate?: number | null
          created_at?: string
          id?: number
          platform_commission_rate?: number | null
          sales_ob_commission_rate?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
          state: string | null
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
          state?: string | null
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
          state?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      consultant_dashboard_summary: {
        Row: {
          active_projects_count: number | null
          active_projects_next_month: number | null
          active_projects_this_month: number | null
          average_project_contract_value: number | null
          average_project_contract_value_last_month: number | null
          average_project_contract_value_this_month: number | null
          avg_project_duration_days: number | null
          client_commissions: number | null
          client_commissions_count: number | null
          client_commissions_count_last_month: number | null
          client_commissions_count_this_month: number | null
          client_commissions_last_month: number | null
          client_commissions_this_month: number | null
          client_retention_rate_percent: number | null
          clients_team_count: number | null
          clients_team_count_last_month: number | null
          clients_team_count_this_month: number | null
          completed_projects_count: number | null
          completed_projects_count_last_month: number | null
          completed_projects_count_this_month: number | null
          consultant_commissions: number | null
          consultant_commissions_count: number | null
          consultant_commissions_count_last_month: number | null
          consultant_commissions_count_this_month: number | null
          consultant_commissions_last_month: number | null
          consultant_commissions_this_month: number | null
          consultant_id: string | null
          consultants_team_count: number | null
          consultants_team_count_last_month: number | null
          consultants_team_count_this_month: number | null
          direct_earnings: number | null
          direct_earnings_last_month: number | null
          direct_earnings_my_earnings: number | null
          direct_earnings_overdue: number | null
          direct_earnings_overdue_last_month: number | null
          direct_earnings_overdue_this_month: number | null
          direct_earnings_platform_commissions: number | null
          direct_earnings_this_month: number | null
          earnings_consulting_services: number | null
          earnings_ecommerce_retail: number | null
          earnings_education: number | null
          earnings_energy_utilities: number | null
          earnings_financial_services: number | null
          earnings_government: number | null
          earnings_healthcare: number | null
          earnings_manufacturing: number | null
          earnings_media_entertainment: number | null
          earnings_other: number | null
          earnings_startups_vc: number | null
          earnings_technology_saas: number | null
          earnings_telecommunications: number | null
          my_direct_earnings_this_month: number | null
          net_earnings: number | null
          net_earnings_last_month: number | null
          net_earnings_this_month: number | null
          one_time_clients_count: number | null
          pending_projects_count: number | null
          platform_commissions_count: number | null
          platform_commissions_count_last_month: number | null
          platform_commissions_count_this_month: number | null
          platform_commissions_this_month: number | null
          project_success_rate: number | null
          repeating_clients_count: number | null
          responses_submitted_last_month: number | null
          responses_submitted_this_month: number | null
          sales_commissions: number | null
          sales_commissions_count: number | null
          sales_commissions_last_month: number | null
          sales_commissions_this_month: number | null
          sales_team_count: number | null
          sales_team_count_last_month: number | null
          sales_team_count_this_month: number | null
          summary_generated_at: string | null
          total_contract_value: number | null
          total_contract_value_last_month: number | null
          total_contract_value_this_month: number | null
          total_leads_count: number | null
          total_leads_count_last_month: number | null
          total_leads_count_this_month: number | null
          total_projects_count: number | null
          total_projects_count_last_month: number | null
          total_projects_count_this_month: number | null
          total_responses_submitted: number | null
        }
        Relationships: []
      }
      seller_dashboard_summary: {
        Row: {
          active_client_projects_count: number | null
          active_clients_count: number | null
          average_client_satisfaction_score: number | null
          client_projects_earnings: number | null
          client_projects_earnings_last_month: number | null
          client_projects_earnings_overdue: number | null
          client_projects_earnings_this_month: number | null
          clients_team_count: number | null
          completed_client_projects_count: number | null
          consultants_team_count: number | null
          direct_sales_commissions: number | null
          direct_sales_commissions_last_month: number | null
          direct_sales_commissions_this_month: number | null
          net_earnings: number | null
          net_earnings_last_month: number | null
          net_earnings_this_month: number | null
          sales_team_count: number | null
          satisfied_clients_count: number | null
          seller_id: string | null
          summary_generated_at: string | null
          team_consultant_commissions: number | null
          team_consultant_commissions_last_month: number | null
          team_consultant_commissions_this_month: number | null
          team_sales_commissions: number | null
          team_sales_commissions_last_month: number | null
          team_sales_commissions_this_month: number | null
          total_client_projects_count: number | null
          total_clients_count: number | null
          total_clients_count_last_month: number | null
          total_clients_count_this_month: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_or_get_active_partner: {
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
      complete_onboarding: { Args: { p_user_id: string }; Returns: Json }
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
      get_full_user_profile: { Args: { p_user_id: string }; Returns: Json }
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
          partner_id: string
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
      update_client_onboarding_progress: {
        Args: { p_step_data?: Json; p_user_id?: string }
        Returns: {
          client_id: string
          user_id: string
        }[]
      }
      update_onboarding_progress: {
        Args: { p_current_step: string; p_step_data: Json; p_user_id: string }
        Returns: Json
      }
      update_seller_onboarding_progress: {
        Args: { p_seller_id?: string; p_step_data: Json; p_user_id: string }
        Returns: {
          seller_id: string
          user_id: string
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
