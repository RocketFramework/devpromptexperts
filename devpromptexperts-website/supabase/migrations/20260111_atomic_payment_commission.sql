-- Migration: Setup System User and Atomic Payment Function
-- Description: Ensures system sentinel users exist and creates an atomic function for processing financial transactions.

-- 1. Ensure System Users exist
DO $$
DECLARE
    v_sys_revenue_id UUID := '00000000-0000-0000-0000-000000000000'; -- Platform Revenue Account
    v_sys_central_id UUID := '11111111-1111-1111-1111-111111111111'; -- Marketplace Central/Escrow
BEGIN
    -- Ensure Revenue Account User
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = v_sys_revenue_id) THEN
        INSERT INTO public.users (id, email, full_name, role, created_at)
        VALUES (v_sys_revenue_id, 'revenue@devpromptexperts.com', 'DevPromptExperts Revenue', 'admin', NOW())
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Ensure Marketplace Central User
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = v_sys_central_id) THEN
        INSERT INTO public.users (id, email, full_name, role, created_at)
        VALUES (v_sys_central_id, 'system@devpromptexperts.com', 'Marketplace Central', 'admin', NOW())
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- 2. Create the Atomic Payment Function
CREATE OR REPLACE FUNCTION confirm_milestone_payment(
  p_milestone_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_milestone record;
  v_project record;
  v_payment_record record;
  v_referral record;
  v_pending_count int;
  
  -- Participant IDs
  v_client_id uuid;
  v_consultant_id uuid;
  v_referrer_id uuid;
  
  -- Roles (for entity type)
  v_client_role text;
  v_consultant_role text;
  v_referrer_role text;

  -- Financial variables
  v_total_contract_value numeric;
  v_platform_rate numeric := 20.0;
  v_platform_commission numeric;
  v_referrer_rate numeric := 0;
  v_referrer_commission numeric;
  
  -- System User IDs
  v_sys_revenue_id uuid := '00000000-0000-0000-0000-000000000000'; -- Platform Revenue Account
  v_sys_central_id uuid := '11111111-1111-1111-1111-111111111111'; -- Marketplace Central/Escrow
  
  -- Invoice IDs
  v_project_invoice_id uuid;
  v_platform_invoice_id uuid;
  v_referrer_invoice_id uuid;
  
BEGIN
  -- 1. Fetch Milestone and Project Details -------------------------------------
  SELECT * INTO v_milestone 
  FROM project_milestones 
  WHERE id = p_milestone_id;
  
  IF v_milestone IS NULL THEN
    RAISE EXCEPTION 'Milestone not found';
  END IF;

  SELECT * INTO v_project 
  FROM projects 
  WHERE id = v_milestone.project_id;
  
  v_client_id := v_project.client_id;
  v_consultant_id := v_project.consultant_id;
  v_total_contract_value := v_project.contract_value;

  -- 2. Update Milestone and Payment Status (Immediate) -------------------------
  
  -- Update milestone status
  UPDATE project_milestones 
  SET status = 'payment-confirmed', 
      completed_date = NOW() 
  WHERE id = p_milestone_id;

  -- Update or Create Payment Record for this specific milestone
  SELECT * INTO v_payment_record 
  FROM project_payments 
  WHERE project_milestone_id = p_milestone_id 
  LIMIT 1;

  IF v_payment_record IS NULL THEN
    INSERT INTO project_payments (
      project_id,
      consultant_id,
      project_milestone_id,
      amount,
      payment_type,
      status,
      paid_date,
      platform_commission_rate,
      notes
    ) VALUES (
      v_project.id,
      v_consultant_id,
      p_milestone_id,
      (v_total_contract_value * v_milestone.payment_percentage) / 100,
      'milestone',
      'completed',
      NOW(),
      v_platform_rate,
      'Payment for milestone: ' || v_milestone.milestone
    );
  ELSE
    UPDATE project_payments
    SET status = 'completed', 
        paid_date = NOW(),
        platform_commission_rate = v_platform_rate
    WHERE id = v_payment_record.id;
  END IF;

  -- 3. Check if Project is Fully Complete --------------------------------------
  SELECT count(*) INTO v_pending_count
  FROM project_milestones
  WHERE project_id = v_project.id
    AND status != 'payment-confirmed'
    AND status != 'cancelled';

  IF v_pending_count > 0 THEN
    RETURN json_build_object(
      'success', true, 
      'message', 'Milestone confirmed. Commission will be calculated upon project completion.',
      'pending_milestones', v_pending_count
    );
  END IF;

  -- 4. START FINAL PROJECT SETTLEMENT ------------------------------------------
  -- If we've reached here, all milestones are 'payment-confirmed'
  
  -- Prevent double settlement
  IF v_project.status = 'completed' THEN
    RETURN json_build_object('success', true, 'message', 'Project already settled.');
  END IF;

  -- Fetch Roles
  SELECT role INTO v_client_role FROM users WHERE id = v_client_id;
  SELECT role INTO v_consultant_role FROM users WHERE id = v_consultant_id;

  -- Calculate Total Amounts
  v_platform_commission := (v_total_contract_value * v_platform_rate) / 100;

  -- Normalize Roles for Entity Types (to satisfy invoices_entity_type_check)
  v_client_role := CASE 
    WHEN v_client_role = 'admin' THEN 'platform' 
    WHEN v_client_role = 'seller' THEN 'seller'
    WHEN v_client_role = 'consultant' THEN 'consultant'
    ELSE 'client' 
  END;
  
  v_consultant_role := CASE 
    WHEN v_consultant_role = 'admin' THEN 'platform'
    WHEN v_consultant_role = 'client' THEN 'client'
    WHEN v_consultant_role = 'seller' THEN 'seller'
    ELSE 'consultant' 
  END;

  -- 5. Generate Final Project Invoice: Client -> Consultant (100% Value) ------
  INSERT INTO commission_invoices (
    user_id, 
    invoice_number, 
    status, 
    invoice_date, 
    due_date, 
    sub_total, 
    total_amount, 
    currency, 
    from_entity_id, 
    from_entity_type, 
    to_entity_id, 
    to_entity_type, 
    invoice_type,
    notes
  ) VALUES (
    v_consultant_id,
    'INV-PROJ-' || floor(extract(epoch from now())) || '-' || floor(random() * 1000), 
    'paid', 
    NOW(), 
    NOW(),
    v_total_contract_value, 
    v_total_contract_value, 
    'USD',
    v_client_id, 
    v_client_role, 
    v_consultant_id, 
    v_consultant_role, 
    'project',
    'Full Project Settlement: ' || v_project.id
  ) RETURNING id INTO v_project_invoice_id;

  -- 6. Handle Platform Commission (Consultant -> Platform 20%) ----------------
  INSERT INTO commission_invoices (
    user_id, 
    invoice_number, 
    status, 
    invoice_date, 
    due_date, 
    sub_total, 
    total_amount, 
    currency, 
    from_entity_id, 
    from_entity_type, 
    to_entity_id, 
    to_entity_type, 
    invoice_type,
    notes
  ) VALUES (
    v_sys_revenue_id,
    'COM-PROJ-' || floor(extract(epoch from now())) || '-' || floor(random() * 1000), 
    'draft', 
    NOW(), 
    NOW() + interval '30 days',
    v_platform_commission, 
    v_platform_commission, 
    'USD',
    v_consultant_id, 
    v_consultant_role, 
    v_sys_revenue_id, 
    'platform', 
    'platform_commission',
    'Platform Fee for Project Settlement: ' || v_project.id
  ) RETURNING id INTO v_platform_invoice_id;

  -- Record Platform Commission Calculation
  INSERT INTO commission_calculations (
    project_id, 
    user_id, 
    calculation_base_amount, 
    commission_rate, 
    commission_amount, 
    commission_type, 
    commission_invoice_id, 
    calculated_at
  ) VALUES (
    v_project.id, 
    v_sys_revenue_id,
    v_total_contract_value, 
    v_platform_rate, 
    v_platform_commission,
    'platform_commission', 
    v_platform_invoice_id, 
    NOW()
  );

  -- 7. Handle Referral Commission (Platform -> Referrer) -----------------------
  SELECT * INTO v_referral
  FROM commission_referral_relationships
  WHERE referred_id = v_consultant_id
    AND status = 'active'
  LIMIT 1;

  IF v_referral IS NOT NULL THEN
    v_referrer_id := v_referral.referrer_id;
    v_referrer_rate := v_referral.commission_rate;
    v_referrer_commission := (v_total_contract_value * v_referrer_rate) / 100;
    
    SELECT role INTO v_referrer_role FROM users WHERE id = v_referrer_id;

    -- Normalize Referrer Role
    v_referrer_role := CASE 
      WHEN v_referrer_role = 'admin' THEN 'platform' 
      WHEN v_referrer_role = 'seller' THEN 'seller'
      WHEN v_referrer_role = 'consultant' THEN 'consultant'
      ELSE 'client' 
    END;

    -- Generate Invoice: Platform -> Referrer
    INSERT INTO commission_invoices (
      user_id, 
      invoice_number, 
      status, 
      invoice_date, 
      due_date, 
      sub_total, 
      total_amount, 
      currency, 
      from_entity_id, 
      from_entity_type, 
      to_entity_id, 
      to_entity_type, 
      invoice_type,
      notes
    ) VALUES (
      v_referrer_id,
      'REF-PROJ-' || floor(extract(epoch from now())) || '-' || floor(random() * 1000), 
      'draft', 
      NOW(), 
      NOW() + interval '30 days',
      v_referrer_commission, 
      v_referrer_commission, 
      'USD',
      v_sys_central_id, 
      'platform', 
      v_referrer_id, 
      v_referrer_role, 
      v_referrer_role || '_commission',
      'Referral Reward for Project Settlement: ' || v_project.id
    ) RETURNING id INTO v_referrer_invoice_id;

    -- Record Referral Calculation
    INSERT INTO commission_calculations (
      project_id, 
      user_id, 
      calculation_base_amount, 
      commission_rate, 
      commission_amount, 
      commission_type, 
      commission_invoice_id, 
      referral_relationship_id, 
      calculated_at
    ) VALUES (
      v_project.id, 
      v_referrer_id,
      v_total_contract_value, 
      v_referrer_rate, 
      v_referrer_commission,
      'referral', 
      v_referrer_invoice_id, 
      v_referral.id, 
      NOW()
    );
  END IF;

  -- 8. Finalize Project Status -------------------------------------------------
  UPDATE projects SET status = 'completed' WHERE id = v_project.id;

  RETURN json_build_object(
    'success', true, 
    'message', 'Project fully completed and settled.',
    'project_invoice_id', v_project_invoice_id,
    'platform_invoice_id', v_platform_invoice_id,
    'total_contract_value', v_total_contract_value
  );
END;
$$;


