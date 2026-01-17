import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database";

export interface ReferralData {
  id: string;
  referred_user_id: string;
  referred_user_name: string | null;
  referred_user_email: string | null;
  referred_type: string;
  status: string;
  joined_at: string;
  commission_tier: number;
}

export interface EarningData {
  id: string;
  project_id: string;
  amount: number;
  status: string; // From commission_invoice or calculation status
  date: string;
  source: string; // 'Project X' or 'Referral: User Y'
  type: string;
}

export interface EarningsSummary {
  total_earnings: number;
  pending_payout: number;
  paid_payout: number;
  currency: string;
}

type CalculationWithInvoice = Pick<Database['public']['Tables']['commission_calculations']['Row'], 'commission_amount' | 'commission_invoice_id'> & {
  commission_invoices: Pick<Database['public']['Tables']['commission_invoices']['Row'], 'status' | 'currency'> | null
}

type ReferralWithUser = Pick<Database['public']['Tables']['commission_referral_relationships']['Row'], 'id' | 'referred_id' | 'referred_type' | 'status' | 'created_at' | 'commission_rate'> & {
  users: Pick<Database['public']['Tables']['users']['Row'], 'full_name' | 'email'> | null
}

type EarningWithDetails = Pick<Database['public']['Tables']['commission_calculations']['Row'], 'id' | 'project_id' | 'commission_amount' | 'calculated_at' | 'commission_type'> & {
  projects: { project_request_id: string } | null,
  commission_invoices: { status: string } | null
}

export const ExtendedCommissionService = {
  getSummary: async (userId: string): Promise<EarningsSummary> => {
    const supabase = createClientComponentClient<Database>();
    
    // Fetch all commission calculations for this user
    const { data: calculations, error } = await supabase
      .from("commission_calculations")
      .select(`
        commission_amount,
        commission_invoice_id,
        commission_invoices!inner (
          status,
          currency
        )
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching earnings summary:", error);
      return { total_earnings: 0, pending_payout: 0, paid_payout: 0, currency: 'USD' };
    }

    let total = 0;
    let pending = 0;
    let paid = 0;
    let currency = 'USD';

    calculations?.forEach((calc: CalculationWithInvoice) => {
      const amount = calc.commission_amount || 0;
      const status = calc.commission_invoices?.status || 'draft';
      
      if (calc.commission_invoices?.currency) {
        currency = calc.commission_invoices.currency;
      }

      total += amount;
      if (status === 'paid') {
        paid += amount;
      } else {
        pending += amount;
      }
    });

    return { total_earnings: total, pending_payout: pending, paid_payout: paid, currency };
  },

  getReferrals: async (userId: string): Promise<ReferralData[]> => {
    const supabase = createClientComponentClient<Database>();

    // Fetch referrals where current user is the referrer
    const { data: referrals, error } = await supabase
      .from("commission_referral_relationships")
      .select(`
        id,
        referred_id,
        referred_type,
        status,
        created_at,
        commission_rate,
        users!commission_referral_relationships_referred_id_fkey (
          full_name,
          email
        )
      `)
      .eq("referrer_id", userId);

    if (error) {
      console.error("Error fetching referrals:", error);
      return [];
    }

    return referrals.map((ref: ReferralWithUser) => ({
      id: ref.id,
      referred_user_id: ref.referred_id,
      referred_user_name: ref.users?.full_name || 'Unknown User',
      referred_user_email: ref.users?.email || null,
      referred_type: ref.referred_type,
      status: ref.status,
      joined_at: ref.created_at || "",
      commission_tier: ref.commission_rate
    }));
  },

  getEarningsHistory: async (userId: string): Promise<EarningData[]> => {
    const supabase = createClientComponentClient<Database>();

    const { data: earnings, error } = await supabase
      .from("commission_calculations")
      .select(`
        id,
        project_id,
        commission_amount,
        calculated_at,
        commission_type,
        projects (
           project_request_id
        ),
        commission_invoices (
          status
        )
      `)
      .eq("user_id", userId)
      .order('calculated_at', { ascending: false });

    if (error) {
      console.error("Error fetching earnings history:", error);
      return [];
    }

    return earnings.map((earning: EarningWithDetails) => ({
      id: earning.id,
      project_id: earning.project_id,
      amount: earning.commission_amount,
      status: earning.commission_invoices?.status || 'pending',
      date: earning.calculated_at || "",
      source: earning.projects?.project_request_id 
        ? `Project #${earning.projects.project_request_id.slice(0,8)}` 
        : 'Platform Referral',
      type: earning.commission_type
    }));
  }
};
