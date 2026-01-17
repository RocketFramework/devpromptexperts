-- ============================================
-- Notification Database Triggers
-- ============================================
-- These triggers automatically create notifications when certain events occur
-- Run this script in your Supabase SQL Editor

-- ============================================
-- 1. PROPOSAL SUBMISSION TRIGGER
-- ============================================
-- Automatically notify client when a consultant submits a proposal

CREATE OR REPLACE FUNCTION notify_proposal_submitted()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
  v_consultant_name TEXT;
  v_rfp_title TEXT;
  v_client_id TEXT;
BEGIN
  -- Get client user ID, consultant name, and RFP details
  SELECT 
    clients.user_id,
    users.full_name,
    project_requests.title,
    project_requests.client_id
  INTO 
    v_client_user_id,
    v_consultant_name,
    v_rfp_title,
    v_client_id
  FROM project_requests
  INNER JOIN clients ON project_requests.client_id = clients.user_id
  INNER JOIN consultants ON NEW.consultant_id = consultants.user_id
  INNER JOIN users ON consultants.user_id = users.id
  WHERE project_requests.id = NEW.project_request_id;

  -- Create notification for client
  INSERT INTO notifications (user_id, type, title, message, link, metadata)
  VALUES (
    v_client_user_id,
    'project',
    'New Proposal Received',
    v_consultant_name || ' has submitted a proposal for "' || v_rfp_title || '"',
    '/client/' || v_client_id || '/rfp/' || NEW.project_request_id || '/proposal/' || NEW.id,
    json_build_object(
      'proposal_id', NEW.id,
      'consultant_id', NEW.consultant_id,
      'rfp_id', NEW.project_request_id,
      'proposed_budget', NEW.proposed_budget
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_proposal_submitted ON project_responses;

-- Create trigger
CREATE TRIGGER trigger_notify_proposal_submitted
AFTER INSERT ON project_responses
FOR EACH ROW
WHEN (NEW.status != 'draft')
EXECUTE FUNCTION notify_proposal_submitted();

-- ============================================
-- 2. PROJECT COMPLETION TRIGGER
-- ============================================
-- Notify all parties when a project is marked as completed

CREATE OR REPLACE FUNCTION notify_project_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_project_id UUID;
  v_consultant_user_id UUID;
  v_client_user_id UUID;
  v_client_id TEXT;
  v_project_title TEXT;
BEGIN
  -- Only trigger when status changes TO completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Get project details
    SELECT 
      p.id,
      c.user_id,
      cl.user_id,
      pr.client_id,
      pr.title
    INTO 
      v_project_id,
      v_consultant_user_id,
      v_client_user_id,
      v_client_id,
      v_project_title
    FROM projects p
    INNER JOIN consultants c ON p.consultant_id = c.user_id
    LEFT JOIN project_requests pr ON p.project_request_id = pr.id
    LEFT JOIN clients cl ON pr.client_id = cl.user_id
    WHERE p.id = NEW.id;

    -- Notify client
    IF v_client_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link, metadata)
      VALUES (
        v_client_user_id,
        'project',
        'Project Completed',
        '"' || COALESCE(v_project_title, 'Project') || '" has been marked as completed. Please review the consultant''s work.',
        '/client/' || v_client_id || '/rfp/' || NEW.project_request_id,
        json_build_object('project_id', v_project_id, 'consultant_id', NEW.consultant_id)
      );
    END IF;

    -- Notify consultant
    IF v_consultant_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link, metadata)
      VALUES (
        v_consultant_user_id,
        'project',
        '✅ Project Completed',
        '"' || COALESCE(v_project_title, 'Project') || '" has been completed. Awaiting client review.',
        '/consultant/' || v_consultant_user_id || '/dashboard/projects',
        json_build_object('project_id', v_project_id)
      );
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_project_completed ON projects;

-- Create trigger
CREATE TRIGGER trigger_notify_project_completed
AFTER UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION notify_project_completed();

-- ============================================
-- 3. PAYMENT RELEASED TRIGGER
-- ============================================
-- Notify consultant when payment is released

CREATE OR REPLACE FUNCTION notify_payment_released()
RETURNS TRIGGER AS $$
DECLARE
  v_consultant_user_id UUID;
  v_project_title TEXT;
BEGIN
  -- Only trigger when status changes TO paid/completed
  IF NEW.status IN ('paid', 'completed') AND (OLD.status IS NULL OR OLD.status NOT IN ('paid', 'completed')) THEN
    
    -- Get consultant and project details
    SELECT 
      c.user_id,
      pr.title
    INTO 
      v_consultant_user_id,
      v_project_title
    FROM project_payments pp
    INNER JOIN consultants c ON pp.consultant_id = c.user_id
    LEFT JOIN projects p ON pp.project_id = p.id
    LEFT JOIN project_requests pr ON p.project_request_id = pr.id
    WHERE pp.id = NEW.id;

    -- Notify consultant
    IF v_consultant_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, link, metadata)
      VALUES (
        v_consultant_user_id,
        'payment',
        '💰 Payment Released',
        'You''ve received a payment of $' || NEW.amount || ' for "' || COALESCE(v_project_title, 'project') || '"',
        '/consultant/' || v_consultant_user_id || '/dashboard/earnings',
        json_build_object(
          'payment_id', NEW.id,
          'amount', NEW.amount,
          'project_id', NEW.project_id
        )
      );
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_payment_released ON project_payments;

-- Create trigger
CREATE TRIGGER trigger_notify_payment_released
AFTER UPDATE ON project_payments
FOR EACH ROW
EXECUTE FUNCTION notify_payment_released();

-- ============================================
-- 4. REVIEW RECEIVED TRIGGER
-- ============================================
-- Notify consultant when they receive a review from a client

CREATE OR REPLACE FUNCTION notify_review_received()
RETURNS TRIGGER AS $$
DECLARE
  v_consultant_user_id UUID;
  v_client_name TEXT;
BEGIN
  -- Get consultant and client details
  SELECT 
    c.user_id,
    u.full_name
  INTO 
    v_consultant_user_id,
    v_client_name
  FROM client_reviews cr
  INNER JOIN consultants c ON cr.consultant_id = c.user_id
  LEFT JOIN clients cl ON cr.client_id = cl.id
  LEFT JOIN users u ON cl.user_id = u.id
  WHERE cr.id = NEW.id;

  -- Notify consultant
  IF v_consultant_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    VALUES (
      v_consultant_user_id,
      'project',
      '⭐ New Review Received',
      v_client_name || ' has reviewed your work (' || NEW.overall_rating || ' stars)',
      '/consultant/' || v_consultant_user_id || '/dashboard/reviews',
      json_build_object(
        'review_id', NEW.id,
        'rating', NEW.overall_rating,
        'project_id', NEW.project_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_review_received ON client_reviews;

-- Create trigger
CREATE TRIGGER trigger_notify_review_received
AFTER INSERT ON client_reviews
FOR EACH ROW
EXECUTE FUNCTION notify_review_received();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify triggers are installed

-- List all notification triggers
SELECT 
  trigger_name, 
  event_object_table, 
  action_timing, 
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name LIKE 'trigger_notify%'
ORDER BY event_object_table, trigger_name;

-- Test notification count (should increase as triggers fire)
SELECT COUNT(*) as total_notifications FROM notifications;


-- Trigger for new project request (RFP)
CREATE OR REPLACE FUNCTION notify_rfp_published()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_matching_consultant_ids UUID[];
    v_client_id UUID;
BEGIN
    -- Get matching consultants based on skills and industries
    SELECT ARRAY_AGG(DISTINCT c.user_id)
    INTO v_matching_consultant_ids
    FROM public.consultants c
    WHERE (
        EXISTS (
            SELECT 1 
            FROM unnest(NEW.required_skills) AS skill
            WHERE skill = ANY(c.skills)
        )
        OR EXISTS (
            SELECT 1 
            FROM unnest(NEW.preferred_industries) AS industry
            WHERE industry = ANY(c.industries)
        )
    )
    AND c.approval_status = 'approved';
    
    -- Send notifications to matching consultants
    IF v_matching_consultant_ids IS NOT NULL AND array_length(v_matching_consultant_ids, 1) > 0 THEN
        PERFORM create_bulk_notifications(
            v_matching_consultant_ids,
            'project',
            'New Project Opportunity',
            'A new project "' || NEW.title || '" matches your skills',
            '/projects/rfp/' || NEW.id,
            jsonb_build_object(
                'project_request_id', NEW.id,
                'trigger', 'rfp_published'
            )
        );
    END IF;
    
    -- Notify the client
    PERFORM create_notification(
        NEW.client_id,
        'project',
        'RFP Published',
        'Your project request has been published to matching consultants',
        '/projects/rfp/' || NEW.id
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_rfp_published
AFTER INSERT ON public.project_requests
FOR EACH ROW
WHEN (NEW.published_at IS NOT NULL)
EXECUTE FUNCTION notify_rfp_published();

-- Trigger for new proposal submission
CREATE OR REPLACE FUNCTION notify_proposal_submitted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_id UUID;
    v_project_title TEXT;
BEGIN
    -- Get client ID and project title
    SELECT client_id, title INTO v_client_id, v_project_title
    FROM public.project_requests
    WHERE id = NEW.project_request_id;
    
    -- Notify client
    PERFORM create_notification(
        v_client_id,
        'project',
        'New Proposal Received',
        'You have received a new proposal for "' || v_project_title || '"',
        '/proposals/' || NEW.id,
        jsonb_build_object(
            'project_response_id', NEW.id,
            'project_request_id', NEW.project_request_id
        )
    );
    
    -- Notify consultant
    PERFORM create_notification(
        NEW.consultant_id,
        'project',
        'Proposal Submitted',
        'Your proposal has been submitted successfully',
        '/proposals/' || NEW.id
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_proposal_submitted
AFTER INSERT ON public.project_responses
FOR EACH ROW
EXECUTE FUNCTION notify_proposal_submitted();

-- Trigger for proposal shortlisted
CREATE OR REPLACE FUNCTION notify_proposal_shortlisted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_project_title TEXT;
BEGIN
    IF NEW.shortlisted_at IS NOT NULL AND OLD.shortlisted_at IS NULL THEN
        -- Get project title
        SELECT title INTO v_project_title
        FROM public.project_requests
        WHERE id = NEW.project_request_id;
        
        -- Notify consultant
        PERFORM create_notification(
            NEW.consultant_id,
            'project',
            'Proposal Shortlisted!',
            'Your proposal for "' || v_project_title || '" has been shortlisted',
            '/proposals/' || NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_proposal_shortlisted
AFTER UPDATE OF shortlisted_at ON public.project_responses
FOR EACH ROW
EXECUTE FUNCTION notify_proposal_shortlisted();

-- Trigger for project status changes
CREATE OR REPLACE FUNCTION notify_project_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Notify when project is completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Notify consultant
        PERFORM create_notification(
            NEW.consultant_id,
            'project',
            'Project Completed',
            'Project has been marked as completed',
            '/projects/' || NEW.id
        );
        
        -- Notify client
        PERFORM create_notification(
            NEW.client_id,
            'project',
            'Project Completed',
            'Your project has been marked as completed',
            '/projects/' || NEW.id
        );
        
        -- Notify seller if exists
        PERFORM create_notification(
            s.user_id,
            'project',
            'Project Completed',
            'A project you referred has been completed',
            '/projects/' || NEW.id
        )
        FROM public.sellers s
        JOIN public.seller_clients sc ON s.user_id = sc.seller_id
        WHERE sc.client_id = NEW.client_id;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_project_status_change
AFTER UPDATE OF status ON public.projects
FOR EACH ROW
EXECUTE FUNCTION notify_project_status_change();


-- Trigger for payment status changes
CREATE OR REPLACE FUNCTION notify_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_consultant_id UUID;
    v_client_id UUID;
BEGIN
    -- Get consultant and client IDs
    SELECT p.consultant_id, p.client_id 
    INTO v_consultant_id, v_client_id
    FROM public.projects p
    WHERE p.id = NEW.project_id;
    
    -- Notify when payment is released (status changed to paid)
    IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
        -- Notify consultant
        PERFORM create_notification(
            v_consultant_id,
            'payment',
            'Payment Released',
            'Payment of $' || NEW.amount || ' has been released',
            '/payments/' || NEW.id,
            jsonb_build_object(
                'amount', NEW.amount,
                'payment_type', NEW.payment_type
            )
        );
        
        -- Notify sellers associated with client
        PERFORM create_notification(
            s.user_id,
            'payment',
            'Payment Released',
            'Payment for a project you referred has been released',
            '/payments/' || NEW.id
        )
        FROM public.sellers s
        JOIN public.seller_clients sc ON s.user_id = sc.seller_id
        WHERE sc.client_id = v_client_id;
    END IF;
    
    -- Notify when invoice is generated
    IF NEW.status = 'pending' AND OLD.status IS NULL THEN
        -- Notify client
        PERFORM create_notification(
            v_client_id,
            'payment',
            'Invoice Generated',
            'A new invoice has been generated for your project',
            '/payments/' || NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_payment_status
AFTER INSERT OR UPDATE OF status ON public.project_payments
FOR EACH ROW
EXECUTE FUNCTION notify_payment_status();

-- Trigger for commission calculations
CREATE OR REPLACE FUNCTION notify_commission_calculated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Notify user when commission is calculated
    IF NEW.user_id IS NOT NULL THEN
        PERFORM create_notification(
            NEW.user_id,
            'payment',
            'Commission Calculated',
            'Commission of $' || NEW.commission_amount || ' has been calculated',
            '/commissions/' || NEW.id,
            jsonb_build_object(
                'commission_amount', NEW.commission_amount,
                'commission_rate', NEW.commission_rate,
                'calculation_base', NEW.calculation_base_amount
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_commission_calculated
AFTER INSERT ON public.commission_calculations
FOR EACH ROW
EXECUTE FUNCTION notify_commission_calculated();

-- Trigger for consultant approval
CREATE OR REPLACE FUNCTION notify_consultant_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_ids UUID[];
BEGIN
    -- When consultant is approved
    IF NEW.approval_status = 'approved' AND OLD.approval_status != 'approved' THEN
        -- Notify the consultant
        PERFORM create_notification(
            NEW.user_id,
            'induction',
            'Approved!',
            'Your consultant profile has been approved',
            '/dashboard'
        );
        
        -- Get clients who might be interested (those with matching desired project types)
        SELECT ARRAY_AGG(DISTINCT c.user_id)
        INTO v_client_ids
        FROM public.clients c
        WHERE EXISTS (
            SELECT 1 
            FROM unnest(c.desired_project_types) AS project_type
            WHERE project_type = ANY(NEW.project_types)
        );
        
        -- Notify interested clients
        IF v_client_ids IS NOT NULL AND array_length(v_client_ids, 1) > 0 THEN
            PERFORM create_bulk_notifications(
                v_client_ids,
                'system',
                'New Consultant Available',
                'A new consultant matching your criteria is now available',
                '/consultants/' || NEW.user_id
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_consultant_approved
AFTER UPDATE OF approval_status ON public.consultants
FOR EACH ROW
EXECUTE FUNCTION notify_consultant_approved();

-- Trigger for onboarding completion
CREATE OR REPLACE FUNCTION notify_onboarding_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- When onboarding is marked as completed
    IF NEW.onboarding_completed_at IS NOT NULL AND OLD.onboarding_completed_at IS NULL THEN
        PERFORM create_notification(
            NEW.user_id,
            'induction',
            'Onboarding Complete!',
            'Congratulations! You have completed the onboarding process',
            '/dashboard',
            jsonb_build_object(
                'onboarding_tier', NEW.onboarding_tier,
                'direct_access_granted', NEW.direct_access_granted
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_onboarding_completed
AFTER UPDATE OF onboarding_completed_at ON public.consultants
FOR EACH ROW
EXECUTE FUNCTION notify_onboarding_completed();

-- Trigger for interview scheduling with OB Partners
CREATE OR REPLACE FUNCTION notify_ob_interview_scheduled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_email TEXT;
    v_partner_email TEXT;
    v_user_name TEXT;
    v_partner_name TEXT;
BEGIN
    -- Notify consultant
    SELECT email, full_name INTO v_user_email, v_user_name
    FROM public.users
    WHERE id = NEW.user_id;
    
    -- Notify OB Partner
    SELECT email, full_name INTO v_partner_email, v_partner_name
    FROM public.users u
    JOIN public.ob_partners op ON u.id = op.user_id
    WHERE op.id = NEW.ob_partner_id;
    
    IF v_user_email IS NOT NULL THEN
        PERFORM create_notification(
            NEW.user_id,
            'induction',
            'Interview Scheduled',
            'An interview has been scheduled with your OB Partner ' || v_partner_name,
            '/interviews/' || NEW.id,
            jsonb_build_object(
                'ob_partner_id', NEW.ob_partner_id,
                'partner_name', v_partner_name
            )
        );
    END IF;
    
    IF v_partner_email IS NOT NULL THEN
        PERFORM create_notification(
            (SELECT user_id FROM public.ob_partners WHERE id = NEW.ob_partner_id),
            'induction',
            'New Interview Scheduled',
            'You have a new interview scheduled with ' || v_user_name,
            '/interviews/' || NEW.id,
            jsonb_build_object(
                'consultant_id', NEW.user_id,
                'consultant_name', v_user_name
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_ob_interview_scheduled
AFTER INSERT ON public.connect_with_ob_partners
FOR EACH ROW
EXECUTE FUNCTION notify_ob_interview_scheduled();

-- Trigger for new reviews
CREATE OR REPLACE FUNCTION notify_review_received()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Client review for consultant
    IF TG_TABLE_NAME = 'client_reviews' THEN
        PERFORM create_notification(
            NEW.consultant_id,
            'project',
            'New Review Received',
            'You have received a new review from a client',
            '/reviews/' || NEW.id,
            jsonb_build_object(
                'overall_rating', NEW.overall_rating,
                'project_id', NEW.project_id
            )
        );
    END IF;
    
    -- Consultant review for client
    IF TG_TABLE_NAME = 'consultant_reviews' THEN
        PERFORM create_notification(
            NEW.client_id,
            'project',
            'New Review Received',
            'You have received a new review from a consultant',
            '/reviews/' || NEW.id,
            jsonb_build_object(
                'overall_rating', NEW.overall_rating,
                'project_id', NEW.project_id
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create triggers for both review tables
CREATE TRIGGER trigger_client_review_received
AFTER INSERT ON public.client_reviews
FOR EACH ROW
EXECUTE FUNCTION notify_review_received();

CREATE TRIGGER trigger_consultant_review_received
AFTER INSERT ON public.consultant_reviews
FOR EACH ROW
EXECUTE FUNCTION notify_review_received();

-- Trigger for new messages
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_recipient_id UUID;
    v_sender_name TEXT;
BEGIN
    -- Get sender name
    SELECT full_name INTO v_sender_name
    FROM public.users
    WHERE id = NEW.sender_id;
    
    -- For project communications
    IF TG_TABLE_NAME = 'project_communications' THEN
        -- Determine recipient (opposite party in project)
        SELECT 
            CASE 
                WHEN p.client_id = NEW.sender_id THEN p.consultant_id
                ELSE p.client_id
            END
        INTO v_recipient_id
        FROM public.projects p
        WHERE p.id = NEW.project_id;
        
        IF v_recipient_id IS NOT NULL THEN
            PERFORM create_notification(
                v_recipient_id,
                'message',
                'New Message in Project',
                v_sender_name || ' sent you a message',
                '/messages/project/' || NEW.project_id,
                jsonb_build_object(
                    'project_id', NEW.project_id,
                    'sender_id', NEW.sender_id
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_new_project_message
AFTER INSERT ON public.project_communications
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();

CREATE TRIGGER trigger_new_proposal_message
AFTER INSERT ON public.proposal_communications
FOR EACH ROW
EXECUTE FUNCTION notify_new_message();