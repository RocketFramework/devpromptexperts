import { supabase } from '@/lib/supabase';
import { ProjectMilestoneStatus } from '@/types/enums';
import { Database } from '@/types/database';

export class PaymentBusinessService {
  /**
   * Processes the confirmation of a milestone payment received by the consultant.
   * This updates the payment status, calculates commissions, and records them.
   */
  static async processPaymentConfirmation(milestoneId: string) {
    // 1. Fetch Milestone and Project details
    const { data: milestone, error: mError } = await supabase
      .from('project_milestones')
      .select('*, projects(*)')
      .eq('id', milestoneId)
      .single();

    if (mError || !milestone) throw new Error(mError?.message || 'Milestone not found');
    const project = milestone.projects as any;

    // 2. Fetch or Update existing payment record
    const { data: payments, error: pError } = await supabase
      .from('project_payments')
      .select('*')
      .eq('project_id', milestone.project_id)
      .eq('project_milestone_id', milestoneId)
      .limit(1);

    let payment = payments?.[0];

    if (!payment) {
      // Fallback: Create payment if it doesn't exist (though it should be created on approval)
      const amount = (project.contract_value * milestone.payment_percentage) / 100;
      const { data: newPayment, error: npError } = await supabase
        .from('project_payments')
        .insert({
          project_id: milestone.project_id,
          consultant_id: project.consultant_id,
          project_milestone_id: milestoneId,
          amount: amount,
          payment_type: 'milestone',
          status: 'paid',
          paid_date: new Date().toISOString(),
          notes: `Payment for milestone: ${milestone.milestone}`,
        })
        .select()
        .single();
      
      if (npError) throw npError;
      payment = newPayment;
    } else {
      // Update existing payment to paid
      const { data: updatedPayment, error: uError } = await supabase
        .from('project_payments')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString()
        })
        .eq('id', payment.id)
        .select()
        .single();
      
      if (uError) throw uError;
      payment = updatedPayment;
    }

    // 3. Commission Logic
    const totalAmount = payment.amount;
    const platformBaseRate = 20; // Default platform commission: 20%
    
    // Check for referral relationship for the consultant
    const { data: referral, error: refError } = await supabase
      .from('commission_referral_relationships')
      .select('*')
      .eq('referred_id', project.consultant_id)
      .eq('status', 'active')
      .limit(1)
      .single();

    let platformCutRate = platformBaseRate;
    let referrerCutRate = 0;
    let referrerId = null;
    let referralRelationshipId = null;

    if (referral) {
      referrerCutRate = referral.commission_rate; // e.g., 5
      platformCutRate = platformBaseRate - referrerCutRate; // e.g., 15
      referrerId = referral.referrer_id;
      referralRelationshipId = referral.id;
    }

    // 4. Handle Commission Invoices (Required for calculations)
    // For simplicity, we create one invoice per payment or find an existing draft one for the month.
    // In a real system, this would be batched.
    
    const getOrCreateInvoice = async (userId: string, type: string) => {
      // Look for a draft invoice for this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0,0,0,0);
      
      const { data: invoices } = await supabase
        .from('commission_invoices')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'draft')
        .gte('created_at', startOfMonth.toISOString())
        .limit(1);
      
      if (invoices && invoices.length > 0) return invoices[0].id;

      // Create new draft invoice
      const { data: newInvoice, error: invError } = await supabase
        .from('commission_invoices')
        .insert({
          user_id: userId,
          invoice_number: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: 'draft',
          invoice_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          sub_total: 0,
          total_amount: 0,
          currency: 'USD',
          from_entity_id: 'PLATFORM', // Or platform user ID
          from_entity_type: 'platform',
          to_entity_id: userId,
          to_entity_type: 'consultant',
          invoice_type: type,
        })
        .select()
        .single();
      
      if (invError) throw invError;
      return newInvoice.id;
    };

    // 5. Create Commission Calculations
    
    // Platform Calculation (recorded for platform record)
    const platformInvoiceId = await getOrCreateInvoice('PLATFORM_SYSTEM_USER', 'platform_fee'); // Use a system ID
    await supabase.from('commission_calculations').insert({
      project_id: milestone.project_id,
      project_milestone_id: milestoneId,
      user_id: 'PLATFORM_SYSTEM_USER',
      calculation_base_amount: totalAmount,
      commission_rate: platformCutRate,
      commission_amount: (totalAmount * platformCutRate) / 100,
      commission_type: 'platform_fee',
      commission_invoice_id: platformInvoiceId,
      referral_relationship_id: referralRelationshipId || '00000000-0000-0000-0000-000000000000', // Empty GUID if no referral
      calculated_at: new Date().toISOString()
    });

    // Referrer Calculation (if exists)
    if (referrerId && referralRelationshipId) {
      const referrerInvoiceId = await getOrCreateInvoice(referrerId, 'referral_commission');
      await supabase.from('commission_calculations').insert({
        project_id: milestone.project_id,
        project_milestone_id: milestoneId,
        user_id: referrerId,
        calculation_base_amount: totalAmount,
        commission_rate: referrerCutRate,
        commission_amount: (totalAmount * referrerCutRate) / 100,
        commission_type: 'referral',
        commission_invoice_id: referrerInvoiceId,
        referral_relationship_id: referralRelationshipId,
        calculated_at: new Date().toISOString()
      });
    }

    return { success: true };
  }
}
