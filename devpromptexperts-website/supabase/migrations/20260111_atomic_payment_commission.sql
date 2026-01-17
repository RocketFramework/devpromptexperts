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
  v_platform_rate numeric := 0.20;
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
  
  -- Calculation IDs
  v_platform_calculation_id uuid;
  v_referrer_calculation_id uuid;
  
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
  v_platform_commission := v_total_contract_value * v_platform_rate;

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
    v_total_contract_value::integer, 
    v_total_contract_value::integer, 
    'USD',
    v_client_id, 
    v_client_role, 
    v_consultant_id, 
    v_consultant_role, 
    'project',
    'Full Project Settlement: ' || v_project.id
  ) RETURNING id INTO v_project_invoice_id;

  -- 6. Handle Platform Commission (Consultant -> Platform 20%) ----------------
  -- First, create the commission calculation
  INSERT INTO commission_calculations (
    project_id, 
    user_id,
    referral_relationship_id,
    calculation_base_amount, 
    commission_rate, 
    commission_amount, 
    commission_type, 
    calculated_at
  ) VALUES (
    v_project.id, 
    v_sys_revenue_id,
    NULL, -- No referral relationship for platform commission
    v_total_contract_value::integer, 
    v_platform_rate::numeric(5,4), 
    v_platform_commission::integer, 
    'project-to-platform', -- Changed to match constraint
    NOW()
  ) RETURNING id INTO v_platform_calculation_id;

  -- Then create the invoice with reference to the calculation
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
    commission_calculation_id,
    notes
  ) VALUES (
    v_sys_revenue_id,
    'COM-PROJ-' || floor(extract(epoch from now())) || '-' || floor(random() * 1000), 
    'draft', 
    NOW(), 
    NOW() + interval '30 days',
    v_platform_commission::integer, 
    v_platform_commission::integer, 
    'USD',
    v_consultant_id, 
    v_consultant_role, 
    v_sys_revenue_id, 
    'platform', 
    'platform_commission',
    v_platform_calculation_id,
    'Platform Fee for Project Settlement: ' || v_project.id
  ) RETURNING id INTO v_platform_invoice_id;

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

    -- Normalize Referrer Role and determine commission type
    v_referrer_role := CASE 
      WHEN v_referrer_role = 'admin' THEN 'platform' 
      WHEN v_referrer_role = 'seller' THEN 'seller'
      WHEN v_referrer_role = 'consultant' THEN 'consultant'
      ELSE 'client' 
    END;

    -- Determine commission type based on referrer role
    DECLARE
      v_commission_type text;
      v_invoice_type text;
    BEGIN
      v_commission_type := CASE v_referrer_role
        WHEN 'consultant' THEN 'platform-to-consultant'
        WHEN 'seller' THEN 'platform-to-seller'
        WHEN 'client' THEN 'platform-to-client'
        ELSE 'platform-to-consultant' -- default
      END;
      
      v_invoice_type := CASE v_referrer_role
        WHEN 'consultant' THEN 'consultant_commission'
        WHEN 'seller' THEN 'seller_commission'
        WHEN 'client' THEN 'client_commission'
        ELSE 'consultant_commission' -- default
      END;

      -- First, create the referral commission calculation
      INSERT INTO commission_calculations (
        project_id, 
        user_id,
        referral_relationship_id,
        calculation_base_amount, 
        commission_rate, 
        commission_amount, 
        commission_type, 
        calculated_at
      ) VALUES (
        v_project.id, 
        v_referrer_id,
        v_referral.id,
        v_total_contract_value::integer, 
        v_referrer_rate::numeric(5,4), 
        v_referrer_commission::integer, 
        v_commission_type,
        NOW()
      ) RETURNING id INTO v_referrer_calculation_id;

      -- Then create the invoice with reference to the calculation
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
        commission_calculation_id,
        notes
      ) VALUES (
        v_referrer_id,
        'REF-PROJ-' || floor(extract(epoch from now())) || '-' || floor(random() * 1000), 
        'draft', 
        NOW(), 
        NOW() + interval '30 days',
        v_referrer_commission::integer, 
        v_referrer_commission::integer, 
        'USD',
        v_sys_central_id, 
        'platform', 
        v_referrer_id, 
        v_referrer_role, 
        v_invoice_type,
        v_referrer_calculation_id,
        'Referral Reward for Project Settlement: ' || v_project.id
      ) RETURNING id INTO v_referrer_invoice_id;
    END;
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