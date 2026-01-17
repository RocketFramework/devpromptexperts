-- Create user_settings table for consolidated settings management
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- Notification Preferences (JSONB for flexibility)
    -- keys: 
    -- 'notify_review_received' (boolean)
    -- 'notify_commission_calculated' (boolean)
    -- 'notify_new_message' (boolean)
    -- 'notify_payment_released' (boolean)
    -- 'notify_project_completed' (boolean)
    -- 'notify_proposal_submitted' (boolean)
    -- 'notify_ob_interview_scheduled' (boolean)
    -- 'notify_rfp_published' (boolean)
    -- 'notify_proposal_shortlisted' (boolean)
    notification_preferences JSONB DEFAULT '{}'::jsonb,
    
    -- General Settings
    -- keys: 'theme' (light/dark), 'language', 'currency'
    general_settings JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own settings" 
    ON public.user_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
    ON public.user_settings FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
    ON public.user_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
