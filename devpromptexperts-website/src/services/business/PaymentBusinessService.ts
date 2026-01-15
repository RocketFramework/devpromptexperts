import { supabase } from '@/lib/supabase';
import { ProjectMilestoneStatus } from '@/types/enums';
import { Database } from '@/types/database';

export class PaymentBusinessService {
  /**
   * Processes the confirmation of a milestone payment received by the consultant.
   * This updates the payment status, calculates commissions, and records them.
   */
  /**
   * Processes the confirmation of a milestone payment received by the consultant.
   * This uses an atomic Database RPC to ensure financial integrity.
   */
  static async processPaymentConfirmation(milestoneId: string) {
    try {
      // Call the atomic Stored Procedure
      const { data, error } = await supabase.rpc('confirm_milestone_payment', {
        p_milestone_id: milestoneId
      });

      if (error) {
        console.error('RPC Error processing payment:', error);
        throw new Error(error.message);
      }

      console.log('Payment processed successfully via RPC:', data);
      return { success: true, data };
    } catch (err: any) {
      console.error('Failed to confirm payment:', err);
      throw err;
    }
  }
}
