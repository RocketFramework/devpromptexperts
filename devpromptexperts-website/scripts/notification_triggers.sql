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
